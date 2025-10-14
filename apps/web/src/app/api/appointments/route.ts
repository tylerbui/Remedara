import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for appointment booking
const createAppointmentSchema = z.object({
  providerId: z.string().uuid().optional(), // Optional for provider-initiated requests
  patientId: z.string().uuid().optional(), // Patient ID for provider-initiated requests
  dateTime: z.string().datetime().optional(), // For legacy support
  date: z.string().optional(), // New format: separate date and time
  time: z.string().optional(), // New format: HH:MM
  appointmentType: z.string().min(1, 'Appointment type is required').optional(),
  location: z.string().optional(),
  duration: z.number().min(15).max(120).default(30), // Duration in minutes
  notes: z.string().optional(),
  isUrgent: z.boolean().optional(),
  status: z.string().optional(), // For provider-initiated requests
  patientInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    dateOfBirth: z.string().optional(),
    reason: z.string().min(1, 'Reason for visit is required'),
    notes: z.string().optional()
  }).optional(),
  reason: z.string().optional(), // Optional for new format
})

// GET /api/appointments - Get appointments (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause based on user role and query params
    const whereClause: any = {}

    if (session.user.role === 'PROVIDER') {
      const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id }
      })
      if (!provider) {
        return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
      }
      whereClause.providerId = provider.id
    } else if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })
      if (!patient) {
        return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
      }
      whereClause.patientId = patient.id
    }

    // Apply additional filters
    if (providerId) whereClause.providerId = providerId
    if (patientId) whereClause.patientId = patientId
    if (status) whereClause.status = status
    if (startDate) {
      whereClause.dateTime = { gte: new Date(startDate) }
    }
    if (endDate) {
      whereClause.dateTime = { 
        ...whereClause.dateTime, 
        lte: new Date(endDate) 
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        dateTime: 'asc'
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    // Handle provider-initiated appointment requests
    if (session.user.role === 'PROVIDER') {
      return handleProviderInitiatedRequest(session, validatedData)
    }
    
    // Handle patient-initiated appointment bookings (existing logic)
    return handlePatientInitiatedBooking(session, validatedData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle provider-initiated appointment requests
async function handleProviderInitiatedRequest(session: any, validatedData: any) {
  // Get provider profile
  const provider = await prisma.provider.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!provider) {
    return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
  }

  // Validate required fields for provider requests
  if (!validatedData.patientId || !validatedData.date || !validatedData.time || !validatedData.appointmentType) {
    return NextResponse.json({ 
      error: 'Patient ID, date, time, and appointment type are required' 
    }, { status: 400 })
  }

  // Combine date and time
  const appointmentDateTime = new Date(`${validatedData.date}T${validatedData.time}:00`)
  
  // Create appointment with PENDING_APPROVAL status
  const appointment = await prisma.appointment.create({
    data: {
      patientId: validatedData.patientId,
      providerId: provider.id,
      dateTime: appointmentDateTime,
      reason: validatedData.appointmentType,
      notes: validatedData.notes || null,
      status: 'PENDING_APPROVAL', // Patient needs to approve
      duration: validatedData.duration,
      location: validatedData.location || 'Main Office',
      isUrgent: validatedData.isUrgent || false
    },
    include: {
      provider: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      },
      patient: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  // TODO: Send notification to patient
  // TODO: Create message in patient's message system

  return NextResponse.json({ 
    appointment,
    message: 'Appointment request sent to patient for approval' 
  }, { status: 201 })
}

// Handle patient-initiated appointment bookings (existing logic)
async function handlePatientInitiatedBooking(session: any, validatedData: any) {
  // Legacy support - convert new format to old format if needed
  let appointmentDateTime: Date
  
  if (validatedData.dateTime) {
    appointmentDateTime = new Date(validatedData.dateTime)
  } else if (validatedData.date && validatedData.time) {
    appointmentDateTime = new Date(`${validatedData.date}T${validatedData.time}:00`)
  } else {
    return NextResponse.json({ 
      error: 'Either dateTime or date+time is required' 
    }, { status: 400 })
  }

  if (!validatedData.providerId) {
    return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
  }

  // Check if provider exists and is active
  const provider = await prisma.provider.findUnique({
    where: { 
      id: validatedData.providerId,
      isActive: true 
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!provider) {
    return NextResponse.json({ error: 'Provider not found or inactive' }, { status: 404 })
  }

    // Check if the requested time slot is available
    const appointmentDateTime = new Date(validatedData.dateTime)
    const endDateTime = new Date(appointmentDateTime.getTime() + validatedData.duration * 60000)

    // Check for conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        providerId: validatedData.providerId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN']
        },
        OR: [
          // Check for overlapping appointments using dateTime and duration
          {
            dateTime: {
              gte: appointmentDateTime,
              lt: endDateTime
            }
          }
        ]
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json({ 
        error: 'Time slot is no longer available' 
      }, { status: 409 })
    }

    // Check provider availability for the requested time
    const dayOfWeek = appointmentDateTime.getDay()
    const timeStr = appointmentDateTime.toTimeString().substring(0, 5) // HH:MM format
    const dateStr = appointmentDateTime.toISOString().split('T')[0]

    const availability = await prisma.availability.findFirst({
      where: {
        providerId: validatedData.providerId,
        isActive: true,
        OR: [
          // Specific date availability
          {
            specificDate: new Date(dateStr),
            startTime: { lte: timeStr },
            endTime: { gt: timeStr }
          },
          // Recurring weekly availability
          {
            specificDate: null,
            dayOfWeek: dayOfWeek,
            startTime: { lte: timeStr },
            endTime: { gt: timeStr }
          }
        ]
      }
    })

    if (!availability) {
      return NextResponse.json({ 
        error: 'Provider is not available at the requested time' 
      }, { status: 400 })
    }

    let patientId = validatedData.patientId

    // If no patient ID provided, this is a guest booking
    if (!patientId && validatedData.patientInfo) {
      // For guest bookings, we could either:
      // 1. Create a temporary patient record
      // 2. Store the info in the appointment directly
      // Let's create a patient record for simplicity
      
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.patientInfo.email }
      })

      if (existingUser && existingUser.role === 'PATIENT') {
        const existingPatient = await prisma.patient.findUnique({
          where: { userId: existingUser.id }
        })
        if (existingPatient) {
          patientId = existingPatient.id
        }
      }

      if (!patientId) {
        // Create new user and patient for guest booking
        const newUser = await prisma.user.create({
          data: {
            name: `${validatedData.patientInfo.firstName} ${validatedData.patientInfo.lastName}`,
            email: validatedData.patientInfo.email,
            role: 'PATIENT',
            emailVerified: null // Guest users are not verified initially
          }
        })

        const newPatient = await prisma.patient.create({
          data: {
            userId: newUser.id,
            firstName: validatedData.patientInfo.firstName,
            lastName: validatedData.patientInfo.lastName,
            phone: validatedData.patientInfo.phone,
            email: validatedData.patientInfo.email,
            dateOfBirth: validatedData.patientInfo.dateOfBirth ? new Date(validatedData.patientInfo.dateOfBirth) : null
          }
        })

        patientId = newPatient.id
      }
    }

    if (!patientId && session?.user?.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })
      if (patient) {
        patientId = patient.id
      }
    }

    if (!patientId) {
      return NextResponse.json({ 
        error: 'Patient information is required' 
      }, { status: 400 })
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        providerId: validatedData.providerId,
        dateTime: appointmentDateTime,
        reason: validatedData.reason,
        notes: validatedData.notes,
        status: 'SCHEDULED',
        duration: validatedData.duration
      },
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // TODO: Send confirmation email to patient and provider
    // TODO: Add appointment to calendar systems if integrated

    return NextResponse.json({ 
      appointment,
      message: 'Appointment booked successfully' 
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
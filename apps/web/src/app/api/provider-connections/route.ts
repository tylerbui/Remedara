import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/provider-connections - Get connection requests for patient or connected providers for patient
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'all'
    
    if (session.user.role === 'PATIENT') {
      // Get patient's connection requests
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient) {
        return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
      }

      // For now, we'll determine connections based on appointments
      // In a more complex system, you'd have a dedicated ProviderConnection table
      const providersWithAppointments = await prisma.provider.findMany({
        where: {
          appointments: {
            some: {
              patientId: patient.id
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          appointments: {
            where: {
              patientId: patient.id
            },
            select: {
              id: true,
              status: true,
              dateTime: true
            },
            orderBy: {
              dateTime: 'desc'
            }
          }
        }
      })

      // Transform to connection format
      const connections = providersWithAppointments.map(provider => ({
        id: provider.id,
        providerId: provider.id,
        providerName: provider.user.name || `Dr. ${provider.firstName} ${provider.lastName}`,
        providerEmail: provider.user.email,
        specialization: provider.specialization,
        status: 'approved', // Since they have appointments
        requestDate: provider.appointments[0]?.dateTime.toISOString(),
        totalAppointments: provider.appointments.length,
        lastAppointment: provider.appointments[0]?.dateTime.toISOString()
      }))

      return NextResponse.json({ connections })
    } else {
      return NextResponse.json({ error: 'Only patients can view connection requests' }, { status: 403 })
    }
  } catch (error) {
    console.error('Error fetching provider connections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/provider-connections - Create a new connection request (from provider to patient)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Only providers can create connection requests' }, { status: 403 })
    }

    const { patientId, message } = await request.json()

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id }
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // For now, we'll create a placeholder appointment as the "connection request"
    // In a real system, you'd have a dedicated ProviderConnection table
    const connectionRequest = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        providerId: provider.id,
        dateTime: new Date(), // Placeholder - could be future date for actual appointment
        reason: 'Provider Connection Request',
        notes: message || 'Provider has requested to connect with you',
        status: 'SCHEDULED', // This could be a custom status like 'PENDING_CONNECTION'
        duration: 0 // 0 duration indicates this is not a real appointment
      }
    })

    return NextResponse.json({ 
      message: 'Connection request sent',
      requestId: connectionRequest.id
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating provider connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
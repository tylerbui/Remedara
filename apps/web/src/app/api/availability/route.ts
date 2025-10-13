import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for availability
const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  specificDate: z.string().optional(),
  isActive: z.boolean().default(true)
})

const updateAvailabilitySchema = createAvailabilitySchema.extend({
  id: z.string()
})

// GET /api/availability - Get provider availability
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')

    // If user is a provider, only show their own availability
    // If admin/front-desk, can view any provider's availability
    let whereClause: any = {}
    
    if (session.user.role === 'PROVIDER') {
      const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id }
      })
      
      if (!provider) {
        return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
      }
      
      whereClause.providerId = provider.id
    } else if (providerId) {
      whereClause.providerId = providerId
    }

    const availabilities = await prisma.availability.findMany({
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
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json({ availabilities })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/availability - Create new availability
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers and admins can create availability
    if (!['PROVIDER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createAvailabilitySchema.parse(body)

    // Get provider ID
    let providerId: string
    if (session.user.role === 'PROVIDER') {
      const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id }
      })
      
      if (!provider) {
        return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
      }
      
      providerId = provider.id
    } else {
      // Admin can specify provider ID
      providerId = body.providerId
      if (!providerId) {
        return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
      }
    }

    // Validate time logic
    const startTime = validatedData.startTime
    const endTime = validatedData.endTime
    
    if (startTime >= endTime) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
    }

    // Check for conflicts with existing availability
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        providerId,
        dayOfWeek: validatedData.dayOfWeek,
        specificDate: validatedData.specificDate ? new Date(validatedData.specificDate) : null,
        OR: [
          // New slot starts during existing slot
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          // New slot ends during existing slot
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          // New slot encompasses existing slot
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    })

    if (existingAvailability) {
      return NextResponse.json({ 
        error: 'Availability conflict detected with existing schedule' 
      }, { status: 409 })
    }

    // Create availability
    const availability = await prisma.availability.create({
      data: {
        providerId,
        dayOfWeek: validatedData.dayOfWeek,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        specificDate: validatedData.specificDate ? new Date(validatedData.specificDate) : null,
        isActive: validatedData.isActive
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
        }
      }
    })

    return NextResponse.json({ availability }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/availability - Update availability
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['PROVIDER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateAvailabilitySchema.parse(body)

    // Check if availability exists and user has permission
    const existingAvailability = await prisma.availability.findUnique({
      where: { id: validatedData.id },
      include: {
        provider: {
          include: {
            user: true
          }
        }
      }
    })

    if (!existingAvailability) {
      return NextResponse.json({ error: 'Availability not found' }, { status: 404 })
    }

    // Providers can only edit their own availability
    if (session.user.role === 'PROVIDER' && existingAvailability.provider.userId !== session.user.id) {
      return NextResponse.json({ error: 'Cannot edit another provider\'s availability' }, { status: 403 })
    }

    // Validate time logic
    if (validatedData.startTime >= validatedData.endTime) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
    }

    // Update availability
    const updatedAvailability = await prisma.availability.update({
      where: { id: validatedData.id },
      data: {
        dayOfWeek: validatedData.dayOfWeek,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        specificDate: validatedData.specificDate ? new Date(validatedData.specificDate) : null,
        isActive: validatedData.isActive
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
        }
      }
    })

    return NextResponse.json({ availability: updatedAvailability })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error updating availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
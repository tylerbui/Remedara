import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// DELETE /api/availability/[id] - Delete availability
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['PROVIDER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const availabilityId = params.id

    // Check if availability exists and user has permission
    const existingAvailability = await prisma.availability.findUnique({
      where: { id: availabilityId },
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

    // Providers can only delete their own availability
    if (session.user.role === 'PROVIDER' && existingAvailability.provider.userId !== session.user.id) {
      return NextResponse.json({ error: 'Cannot delete another provider\'s availability' }, { status: 403 })
    }

    // Check for existing appointments during this availability period
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        providerId: existingAvailability.providerId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN']
        },
        // For weekly availability, check appointments that fall within the time range
        ...(existingAvailability.specificDate 
          ? {
              dateTime: {
                gte: new Date(existingAvailability.specificDate.toDateString()),
                lt: new Date(new Date(existingAvailability.specificDate).setDate(existingAvailability.specificDate.getDate() + 1))
              }
            }
          : {
              // For recurring availability, we'll need to check appointments on the specific day of week
              // This is a simplified check - in production you might want more sophisticated logic
            }
        )
      }
    })

    if (conflictingAppointments.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete availability with existing appointments',
        conflictingAppointments: conflictingAppointments.length
      }, { status: 409 })
    }

    // Delete availability
    await prisma.availability.delete({
      where: { id: availabilityId }
    })

    return NextResponse.json({ message: 'Availability deleted successfully' })
  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
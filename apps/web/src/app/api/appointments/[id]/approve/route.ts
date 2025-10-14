import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// PUT /api/appointments/[id]/approve - Approve or reject appointment request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json() // 'approve' or 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        provider: {
          include: {
            user: true
          }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Verify the user is the patient for this appointment
    if (session.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })
      
      if (!patient || appointment.patientId !== patient.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'Only patients can approve appointments' }, { status: 403 })
    }

    // Check if appointment is in the correct status
    if (appointment.status !== 'PENDING_APPROVAL') {
      return NextResponse.json({ 
        error: 'Appointment is not pending approval' 
      }, { status: 400 })
    }

    // Update appointment status
    const newStatus = action === 'approve' ? 'SCHEDULED' : 'CANCELLED'
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { 
        status: newStatus,
        updatedAt: new Date()
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
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

    // TODO: Send notification to provider about approval/rejection
    // TODO: Add to calendar if approved

    return NextResponse.json({ 
      appointment: updatedAppointment,
      message: action === 'approve' 
        ? 'Appointment approved successfully' 
        : 'Appointment request declined'
    })

  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
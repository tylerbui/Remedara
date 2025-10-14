import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/providers/[id]/slots - Get available appointment slots for a provider
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = params.id
    const { searchParams } = new URL(request.url)
    
    // Get date range from query params (default to next 30 days)
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0]
    const endDate = searchParams.get('endDate') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Verify provider exists and is active
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId,
        isActive: true
      }
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    // Get provider availability
    const availabilities = await prisma.availability.findMany({
      where: {
        providerId,
        isActive: true
      }
    })

    // Get existing appointments to exclude booked slots
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        providerId,
        dateTime: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000) // Add 1 day to include end date
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN']
        }
      }
    })

    // Generate available slots
    const availableSlots = generateAvailableSlots(
      availabilities,
      existingAppointments,
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json({
      slots: availableSlots,
      count: availableSlots.length,
      provider: {
        id: provider.id,
        name: `${provider.firstName} ${provider.lastName}`.trim() || 'Provider'
      }
    })
  } catch (error) {
    console.error('Error fetching provider slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateAvailableSlots(
  availabilities: any[],
  existingAppointments: any[],
  startDate: Date,
  endDate: Date
) {
  const slots: any[] = []
  const slotDurationMinutes = 30 // 30-minute appointment slots
  
  // Create a set of booked times for quick lookup
  const bookedTimes = new Set(
    existingAppointments.map(apt => apt.dateTime.toISOString())
  )

  // Iterate through each day in the range
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    const dateStr = currentDate.toISOString().split('T')[0]

    // Check for specific date availability first
    const specificDateAvailability = availabilities.find(avail => 
      avail.specificDate && 
      avail.specificDate.toISOString().split('T')[0] === dateStr
    )

    // Then check for recurring weekly availability
    const recurringAvailability = availabilities.filter(avail => 
      !avail.specificDate && avail.dayOfWeek === dayOfWeek
    )

    // Use specific date availability if exists, otherwise use recurring
    const dayAvailabilities = specificDateAvailability 
      ? [specificDateAvailability] 
      : recurringAvailability

    // Generate slots for each availability period
    dayAvailabilities.forEach(availability => {
      if (!availability.isActive) return

      const [startHour, startMin] = availability.startTime.split(':').map(Number)
      const [endHour, endMin] = availability.endTime.split(':').map(Number)

      const slotStart = new Date(currentDate)
      slotStart.setHours(startHour, startMin, 0, 0)

      const slotEnd = new Date(currentDate)
      slotEnd.setHours(endHour, endMin, 0, 0)

      // Generate 30-minute slots
      const currentSlot = new Date(slotStart)
      while (currentSlot < slotEnd) {
        const slotDateTime = new Date(currentSlot)
        
        // Skip if slot is in the past
        if (slotDateTime <= new Date()) {
          currentSlot.setMinutes(currentSlot.getMinutes() + slotDurationMinutes)
          continue
        }

        // Skip if slot is already booked
        if (bookedTimes.has(slotDateTime.toISOString())) {
          currentSlot.setMinutes(currentSlot.getMinutes() + slotDurationMinutes)
          continue
        }

        // Create slot object
        slots.push({
          id: `${availability.id}-${slotDateTime.toISOString()}`,
          date: dateStr,
          time: slotDateTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          datetime: slotDateTime.toISOString(),
          providerId: availability.providerId
        })

        currentSlot.setMinutes(currentSlot.getMinutes() + slotDurationMinutes)
      }
    })

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Sort slots by datetime
  slots.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

  return slots
}
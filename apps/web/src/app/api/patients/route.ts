import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/patients - Get patients (for providers to connect with)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers should be able to fetch patients for connection
    if (session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const connected = searchParams.get('connected') // 'true', 'false', or null (all)
    
    // Get current provider
    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id }
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
    }

    // Build where clause for patient search
    let whereClause: any = {}

    // Add search filter
    if (search && search.trim()) {
      whereClause.OR = [
        {
          firstName: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    // Get patients with user information and appointment counts
    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        appointments: {
          where: {
            providerId: provider.id
          },
          select: {
            id: true,
            status: true,
            dateTime: true
          }
        },
        _count: {
          select: {
            appointments: {
              where: {
                providerId: provider.id
              }
            }
          }
        }
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })

    // Transform data to match frontend expectations
    const transformedPatients = patients.map(patient => {
      const hasAppointments = patient._count.appointments > 0
      const upcomingAppointments = patient.appointments.filter(
        apt => apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED'
      ).length
      const completedAppointments = patient.appointments.filter(
        apt => apt.status === 'COMPLETED'
      ).length
      const lastVisit = patient.appointments
        .filter(apt => apt.status === 'COMPLETED')
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0]

      return {
        id: patient.id,
        name: patient.user.name || `${patient.firstName} ${patient.lastName}`,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email || patient.user.email,
        phone: patient.phone || patient.user.phone,
        dateOfBirth: patient.dateOfBirth?.toISOString().split('T')[0],
        lastVisit: lastVisit?.dateTime.toISOString().split('T')[0],
        isConnected: hasAppointments, // Consider connected if they have any appointments with this provider
        connectionStatus: hasAppointments ? 'connected' : 'not_connected',
        appointments: {
          upcoming: upcomingAppointments,
          completed: completedAppointments
        }
      }
    })

    // Filter by connection status if specified
    let filteredPatients = transformedPatients
    if (connected === 'true') {
      filteredPatients = transformedPatients.filter(p => p.isConnected)
    } else if (connected === 'false') {
      filteredPatients = transformedPatients.filter(p => !p.isConnected)
    }

    return NextResponse.json({ 
      patients: filteredPatients,
      total: filteredPatients.length
    })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
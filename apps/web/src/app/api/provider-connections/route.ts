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

      // Get actual provider connections using the ProviderConnection model
      const connections = await prisma.providerConnection.findMany({
        where: {
          patientId: patient.id,
          ...(status === 'pending' ? { status: 'PENDING' } : 
             status === 'approved' ? { status: 'APPROVED' } : {})
        },
        include: {
          provider: {
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
          }
        },
        orderBy: {
          requestedAt: 'desc'
        }
      })

      // Transform to frontend format
      const transformedConnections = connections.map(connection => ({
        id: connection.id,
        providerId: connection.providerId,
        providerName: connection.provider.user.name || `${connection.provider.title || 'Dr.'} ${connection.provider.firstName} ${connection.provider.lastName}`,
        providerEmail: connection.provider.user.email,
        specialization: connection.provider.specialization,
        status: connection.status.toLowerCase(),
        initiatedBy: connection.initiatedBy,
        requestDate: connection.requestedAt.toISOString(),
        responseDate: connection.respondedAt?.toISOString(),
        requestMessage: connection.requestMessage,
        responseMessage: connection.responseMessage,
        totalAppointments: connection.provider.appointments.length,
        lastAppointment: connection.provider.appointments[0]?.dateTime.toISOString()
      }))

      return NextResponse.json({ connections: transformedConnections })
    } else if (session.user.role === 'PROVIDER') {
      // Get provider's connection requests (both incoming and existing)
      const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id }
      })

      if (!provider) {
        return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
      }

      // Get all connections for this provider
      const connections = await prisma.providerConnection.findMany({
        where: {
          providerId: provider.id,
          ...(status === 'pending' ? { status: 'PENDING' } : 
             status === 'approved' ? { status: 'APPROVED' } : {})
        },
        include: {
          patient: {
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
                  providerId: provider.id
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
          }
        },
        orderBy: {
          requestedAt: 'desc'
        }
      })

      // Transform to frontend format for provider view
      const transformedConnections = connections.map(connection => ({
        id: connection.id,
        patientId: connection.patientId,
        patientName: connection.patient.user.name || `${connection.patient.firstName} ${connection.patient.lastName}`,
        patientEmail: connection.patient.user.email || connection.patient.email,
        patientPhone: connection.patient.phone,
        status: connection.status.toLowerCase(),
        initiatedBy: connection.initiatedBy,
        requestDate: connection.requestedAt.toISOString(),
        responseDate: connection.respondedAt?.toISOString(),
        requestMessage: connection.requestMessage,
        responseMessage: connection.responseMessage,
        totalAppointments: connection.patient.appointments.length,
        lastAppointment: connection.patient.appointments[0]?.dateTime.toISOString()
      }))

      return NextResponse.json({ connections: transformedConnections })
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 })
    }
  } catch (error) {
    console.error('Error fetching provider connections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/provider-connections - Create a new connection request (from provider to patient OR patient to provider)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { patientId, providerId, message, initiatedBy } = await request.json()

    // Determine the connection details based on who is making the request
    let actualPatientId: string
    let actualProviderId: string
    let actualInitiatedBy: string
    
    if (session.user.role === 'PROVIDER') {
      // Provider requesting to connect with a patient
      if (!patientId) {
        return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
      }
      
      const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id }
      })
      
      if (!provider) {
        return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
      }
      
      actualPatientId = patientId
      actualProviderId = provider.id
      actualInitiatedBy = 'PROVIDER'
    } else if (session.user.role === 'PATIENT') {
      // Patient requesting to connect with a provider
      if (!providerId) {
        return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
      }
      
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })
      
      if (!patient) {
        return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
      }
      
      actualPatientId = patient.id
      actualProviderId = providerId
      actualInitiatedBy = 'PATIENT'
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 })
    }

    // Check if connection already exists
    const existingConnection = await prisma.providerConnection.findUnique({
      where: {
        patientId_providerId: {
          patientId: actualPatientId,
          providerId: actualProviderId
        }
      }
    })

    if (existingConnection) {
      if (existingConnection.status === 'PENDING') {
        return NextResponse.json({ error: 'Connection request already pending' }, { status: 400 })
      } else if (existingConnection.status === 'APPROVED') {
        return NextResponse.json({ error: 'Already connected to this provider' }, { status: 400 })
      }
    }

    // Create the connection request
    const connectionRequest = await prisma.providerConnection.create({
      data: {
        patientId: actualPatientId,
        providerId: actualProviderId,
        status: 'PENDING',
        initiatedBy: actualInitiatedBy as any,
        requestMessage: message || undefined
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

    return NextResponse.json({ 
      message: 'Connection request sent successfully',
      connection: connectionRequest
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating provider connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/provider-connections - Approve or reject a connection request
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { connectionId, action, responseMessage } = await request.json()

    if (!connectionId || !action) {
      return NextResponse.json({ error: 'Connection ID and action are required' }, { status: 400 })
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 })
    }

    // Find the connection request
    const connection = await prisma.providerConnection.findUnique({
      where: { id: connectionId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true
              }
            }
          }
        },
        provider: {
          include: {
            user: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    if (!connection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }

    // Check if the current user has permission to respond to this request
    const canRespond = 
      (session.user.role === 'PATIENT' && connection.patient.user.id === session.user.id) ||
      (session.user.role === 'PROVIDER' && connection.provider.user.id === session.user.id)

    if (!canRespond) {
      return NextResponse.json({ error: 'You do not have permission to respond to this connection request' }, { status: 403 })
    }

    // Check if request is still pending
    if (connection.status !== 'PENDING') {
      return NextResponse.json({ error: 'Connection request has already been responded to' }, { status: 400 })
    }

    // Update the connection status
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const updatedConnection = await prisma.providerConnection.update({
      where: { id: connectionId },
      data: {
        status: newStatus,
        respondedAt: new Date(),
        responseMessage: responseMessage || undefined
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

    return NextResponse.json({ 
      message: `Connection request ${action}d successfully`,
      connection: updatedConnection
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating provider connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

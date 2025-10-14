import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/providers - Get all active providers for patient booking
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get current patient if the user is a patient
    let currentPatient = null
    if (session?.user?.role === 'PATIENT') {
      currentPatient = await prisma.patient.findUnique({
        where: { userId: session.user.id }
      })
    }
    
    const providers = await prisma.provider.findMany({
      where: {
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        providerConnections: currentPatient ? {
          where: {
            patientId: currentPatient.id
          }
        } : undefined
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })

    // Transform data for the frontend
    const transformedProviders = providers.map((provider: any) => {
      const connection = provider.providerConnections?.[0]
      let connectionStatus = 'not_connected'
      
      if (connection) {
        if (connection.status === 'APPROVED') {
          connectionStatus = 'connected'
        } else if (connection.status === 'PENDING') {
          connectionStatus = 'pending'
        }
      }
      
      return {
        id: provider.id,
        firstName: provider.firstName,
        lastName: provider.lastName,
        title: provider.title,
        specialization: provider.specialization,
        phone: provider.phone,
        email: provider.email,
        isActive: provider.isActive,
        user: provider.user,
        connectionStatus,
        // Optional fields that might be added later
        rating: provider.rating,
        location: provider.location,
        bio: provider.bio
      }
    })

    return NextResponse.json({ 
      providers: transformedProviders,
      count: transformedProviders.length
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
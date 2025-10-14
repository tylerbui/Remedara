import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/providers - Get all active providers for patient booking
export async function GET(request: NextRequest) {
  try {
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
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Transform data for the frontend
    const transformedProviders = providers.map((provider: any) => ({
      id: provider.id,
      user: provider.user,
      specialization: provider.specialization || 'General Practice',
      location: provider.location || 'Main Office',
      rating: provider.rating,
      image: provider.image,
      bio: provider.bio
    }))

    return NextResponse.json({ 
      providers: transformedProviders,
      count: transformedProviders.length
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
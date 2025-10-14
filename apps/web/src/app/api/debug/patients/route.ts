import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug endpoint to check what patients exist in the database
export async function GET(request: NextRequest) {
  try {
    // Get all patients with their user information
    const patients = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true
          }
        }
      }
    })

    // Also get all users with PATIENT role
    const patientUsers = await prisma.user.findMany({
      where: {
        role: 'PATIENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            dateOfBirth: true
          }
        }
      }
    })

    return NextResponse.json({ 
      patients: patients,
      patientUsers: patientUsers,
      totalPatients: patients.length,
      totalPatientUsers: patientUsers.length
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
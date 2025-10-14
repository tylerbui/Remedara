import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/records - Get patient medical records
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only patients should access their own records
    if (session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get patient profile
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Fetch all medical records in parallel
    const [labResults, imagingResults, vaccinations] = await Promise.all([
      // Lab Results
      prisma.labResult.findMany({
        where: { patientId: patient.id },
        orderBy: { resultDate: 'desc' }
      }),

      // Imaging Results  
      prisma.imagingResult.findMany({
        where: { patientId: patient.id },
        orderBy: { studyDate: 'desc' }
      }),

      // Vaccinations
      prisma.vaccination.findMany({
        where: { patientId: patient.id },
        orderBy: { administrationDate: 'desc' }
      })
    ])

    // TODO: Add allergies query when table is implemented
    const allergies: any[] = []

    // Transform patient profile data
    const userProfile = {
      id: patient.id,
      name: patient.user.name,
      email: patient.user.email,
      phone: patient.user.phone || patient.phone,
      dateOfBirth: patient.dateOfBirth?.toISOString(),
      address: patient.address,
      city: patient.city,
      state: patient.state,
      zipCode: patient.zipCode,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      medicalHistory: patient.medicalHistory
    }

    // Transform lab results
    const transformedLabResults = labResults.map(result => ({
      id: result.id,
      testName: result.testName,
      testCode: result.testCode,
      result: result.result,
      referenceRange: result.referenceRange,
      unit: result.unit,
      status: result.status,
      resultDate: result.resultDate.toISOString(),
      labFacility: result.labFacility,
      flagged: result.flagged,
      providerNotes: result.providerNotes
    }))

    // Transform imaging results
    const transformedImagingResults = imagingResults.map(result => ({
      id: result.id,
      studyType: result.studyType,
      studyDate: result.studyDate.toISOString(),
      facility: result.facility,
      radiologist: result.radiologist,
      findings: result.findings,
      impression: result.impression,
      bodyPart: result.bodyPart,
      urgency: result.urgency,
      dicomUrl: result.dicomUrl,
      reportPdfUrl: result.reportPdfUrl
    }))

    // Transform vaccinations
    const transformedVaccinations = vaccinations.map(vaccine => ({
      id: vaccine.id,
      vaccineName: vaccine.vaccineName,
      vaccineCode: vaccine.vaccineCode,
      administrationDate: vaccine.administrationDate.toISOString(),
      manufacturer: vaccine.manufacturer,
      lotNumber: vaccine.lotNumber,
      administeredBy: vaccine.administeringProvider,
      facility: vaccine.facility,
      nextDueDate: vaccine.nextDueDate?.toISOString(),
      isOverdue: vaccine.isOverdue,
      reminderSent: vaccine.reminderSent,
      dose: vaccine.dose,
      site: vaccine.site,
      route: vaccine.route
    }))

    return NextResponse.json({
      userProfile,
      labResults: transformedLabResults,
      imagingResults: transformedImagingResults,
      vaccinations: transformedVaccinations,
      allergies: [] // Placeholder - implement based on your schema
    })

  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/records - Add new medical record (for providers/admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers and admins can add records
    if (!['PROVIDER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { type, patientId, data } = body

    let result
    
    switch (type) {
      case 'lab-result':
        result = await prisma.labResult.create({
          data: {
            patientId,
            testName: data.testName,
            testCode: data.testCode,
            result: data.result,
            referenceRange: data.referenceRange,
            unit: data.unit,
            status: data.status || 'COMPLETED',
            resultDate: new Date(data.resultDate),
            labFacility: data.labFacility,
            flagged: data.flagged || false,
            providerNotes: data.providerNotes,
            externalId: data.externalId,
            uploadedBy: session.user.id
          }
        })
        break

      case 'imaging-result':
        result = await prisma.imagingResult.create({
          data: {
            patientId,
            studyType: data.studyType,
            studyDate: new Date(data.studyDate),
            facility: data.facility,
            radiologist: data.radiologist,
            findings: data.findings,
            impression: data.impression,
            bodyPart: data.bodyPart || '',
            urgency: data.urgency || 'ROUTINE',
            dicomUrl: data.dicomUrl,
            reportPdfUrl: data.reportPdfUrl,
            externalId: data.externalId,
            uploadedBy: session.user.id
          }
        })
        break

      case 'vaccination':
        result = await prisma.vaccination.create({
          data: {
            patientId,
            vaccineName: data.vaccineName,
            vaccineCode: data.vaccineCode,
            administrationDate: new Date(data.administrationDate),
            manufacturer: data.manufacturer,
            lotNumber: data.lotNumber,
            administeringProvider: data.administeredBy,
            facility: data.facility,
            nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
            expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
            dose: data.dose,
            site: data.site,
            route: data.route,
            isOverdue: false,
            reminderSent: false
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid record type' }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Medical record added successfully',
      record: result 
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding medical record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
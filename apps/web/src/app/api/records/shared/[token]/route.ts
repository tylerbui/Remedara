import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/records/shared/[token] - Access shared medical records
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    // Find the share record by access token
    const shareRecord = await prisma.recordShare.findFirst({
      where: { 
        accessToken: token 
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            id: true
          }
        }
      }
    })

    if (!shareRecord) {
      return NextResponse.json({ error: 'Invalid or expired access link' }, { status: 404 })
    }

    // Check if the share is still valid
    const now = new Date()
    if (shareRecord.status !== 'ACTIVE' || (shareRecord.expiryDate && shareRecord.expiryDate < now)) {
      // Update status if expired
      if (shareRecord.status === 'ACTIVE' && shareRecord.expiryDate && shareRecord.expiryDate < now) {
        await prisma.recordShare.update({
          where: { id: shareRecord.id },
          data: { status: 'EXPIRED' }
        })
      }
      return NextResponse.json({ error: 'This access link has expired or been revoked' }, { status: 403 })
    }

    // Increment access count
    await prisma.recordShare.update({
      where: { id: shareRecord.id },
      data: { 
        accessCount: { increment: 1 },
        lastAccessed: now
      }
    })

    // Fetch medical data based on shared record types
    const medicalData: any = {}
    const patientId = shareRecord.patient.id

    // Fetch lab results if requested
    if (shareRecord.recordTypes.includes('lab-results')) {
      medicalData.labResults = await prisma.labResult.findMany({
        where: { patientId },
        orderBy: { resultDate: 'desc' },
        take: 20 // Limit to recent results
      })
    }

    // Fetch imaging results if requested
    if (shareRecord.recordTypes.includes('imaging')) {
      medicalData.imagingResults = await prisma.imagingResult.findMany({
        where: { patientId },
        orderBy: { studyDate: 'desc' },
        take: 20
      })
    }

    // Fetch vaccinations if requested
    if (shareRecord.recordTypes.includes('vaccines')) {
      medicalData.vaccinations = await prisma.vaccination.findMany({
        where: { patientId },
        orderBy: { administrationDate: 'desc' },
        take: 50
      })
    }

    // Fetch allergies if requested
    if (shareRecord.recordTypes.includes('allergies')) {
      medicalData.allergies = await prisma.allergy.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' }
      })
    }

    // Format the response data
    const recordData = {
      id: shareRecord.id,
      patientName: `${shareRecord.patient.firstName} ${shareRecord.patient.lastName}`,
      patientEmail: shareRecord.patient.email,
      recordTypes: shareRecord.recordTypes,
      shareDate: shareRecord.createdAt.toISOString(),
      expiryDate: shareRecord.expiryDate?.toISOString(),
      message: shareRecord.message,
      allowDownload: shareRecord.allowDownload,
      recipientName: shareRecord.recipientName,
      status: shareRecord.status,
      medicalData
    }

    return NextResponse.json({
      success: true,
      recordData
    })

  } catch (error: any) {
    console.error('Error accessing shared record:', error)
    return NextResponse.json({ 
      error: 'Failed to access shared records' 
    }, { status: 500 })
  }
}

// POST /api/records/shared/[token]/download - Download shared records as PDF
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    // Find the share record by access token
    const shareRecord = await prisma.recordShare.findFirst({
      where: { 
        accessToken: token 
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            id: true
          }
        }
      }
    })

    if (!shareRecord) {
      return NextResponse.json({ error: 'Invalid or expired access link' }, { status: 404 })
    }

    // Check if download is allowed
    if (!shareRecord.allowDownload) {
      return NextResponse.json({ error: 'Download is not permitted for this share' }, { status: 403 })
    }

    // Check if the share is still valid
    const now = new Date()
    if (shareRecord.status !== 'ACTIVE' || (shareRecord.expiryDate && shareRecord.expiryDate < now)) {
      return NextResponse.json({ error: 'This access link has expired or been revoked' }, { status: 403 })
    }

    // For now, return a simple response - in a real implementation, you would generate a PDF
    // This would typically use a library like Puppeteer, jsPDF, or PDFKit
    const pdfContent = generateSimplePDF(shareRecord, shareRecord.patient)

    // Update download count
    await prisma.recordShare.update({
      where: { id: shareRecord.id },
      data: { 
        downloadCount: { increment: 1 },
        lastDownloaded: now
      }
    })

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/plain', // Changed to text/plain for the placeholder
        'Content-Disposition': `attachment; filename="${shareRecord.patient.firstName}_${shareRecord.patient.lastName}_Medical_Records.txt"`
      }
    })

  } catch (error: any) {
    console.error('Error downloading shared record:', error)
    return NextResponse.json({ 
      error: 'Failed to download shared records' 
    }, { status: 500 })
  }
}

// Helper function to generate a simple PDF (placeholder)
function generateSimplePDF(shareRecord: any, patient: any): string {
  // This is a placeholder - in a real implementation, you would use a proper PDF generation library
  const pdfContent = `
Medical Records for ${patient.firstName} ${patient.lastName}

Shared on: ${shareRecord.createdAt.toDateString()}
Shared with: ${shareRecord.recipientName}
Record Types: ${shareRecord.recordTypes.join(', ')}

${shareRecord.message ? `Message: ${shareRecord.message}` : ''}

This is a placeholder PDF. In a real implementation, you would use a proper PDF generation library
to create a comprehensive medical records document with all the shared data.

Generated by Remedara - Secure Medical Record Sharing
  `
  
  // Return string for now (in real implementation, this would be actual PDF binary data)
  return pdfContent
}

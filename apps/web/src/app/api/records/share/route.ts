import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

// Initialize Resend conditionally
let resend: Resend | null = null
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

// Schema for sharing records
const shareRecordsSchema = z.object({
  recipientEmail: z.string().email('Invalid email address'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recordTypes: z.array(z.string()).min(1, 'At least one record type must be selected'),
  message: z.string().optional(),
  expiryDays: z.number().int().min(1).max(365),
  allowDownload: z.boolean().default(false)
})

// POST /api/records/share - Share records with healthcare provider
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id

    const body = await req.json()
    const validatedData = shareRecordsSchema.parse(body)

    // Get patient profile
    const patient = await prisma.patient.findUnique({
      where: { userId }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Calculate expiry date
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + validatedData.expiryDays)

    // Generate secure access token
    const accessToken = generateAccessToken()

    // Create share record
    const shareRecord = await prisma.recordShare.create({
      data: {
        patientId: patient.id,
        recipientEmail: validatedData.recipientEmail,
        recipientName: validatedData.recipientName,
        recordTypes: validatedData.recordTypes,
        message: validatedData.message,
        expiryDate,
        allowDownload: validatedData.allowDownload,
        accessToken,
        status: 'ACTIVE'
      }
    })

    // Send email notification to healthcare provider
    try {
      if (resend) {
        await sendShareNotification({
          recipientEmail: validatedData.recipientEmail,
          recipientName: validatedData.recipientName,
          patientName: `${patient.firstName} ${patient.lastName}`,
          message: validatedData.message,
          accessToken,
          expiryDate,
          recordTypes: validatedData.recordTypes
        })
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      shareId: shareRecord.id,
      message: 'Records shared successfully'
    })

  } catch (error: any) {
    console.error('Error sharing records:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Failed to share records' 
    }, { status: 500 })
  }
}

// GET /api/records/share - Get shared records for current patient
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id

    // Get patient profile
    const patient = await prisma.patient.findUnique({
      where: { userId }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Fetch shared records
    const sharedRecords = await prisma.recordShare.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' }
    })

    // Update expired records
    const now = new Date()
    const expiredRecords = sharedRecords.filter(
      record => record.status === 'ACTIVE' && record.expiryDate && record.expiryDate < now
    )

    if (expiredRecords.length > 0) {
      await prisma.recordShare.updateMany({
        where: {
          id: { in: expiredRecords.map(r => r.id) },
          status: 'ACTIVE'
        },
        data: { status: 'EXPIRED' }
      })
    }

    // Fetch updated records
    const updatedSharedRecords = await prisma.recordShare.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      sharedRecords: updatedSharedRecords.map(record => ({
        id: record.id,
        sharedWith: record.recipientEmail,
        sharedWithName: record.recipientName,
        recordTypes: record.recordTypes,
        shareDate: record.createdAt.toISOString(),
        expiryDate: record.expiryDate?.toISOString(),
        accessCount: record.accessCount,
        status: record.status,
        message: record.message,
        allowDownload: record.allowDownload
      }))
    })

  } catch (error: any) {
    console.error('Error fetching shared records:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch shared records' 
    }, { status: 500 })
  }
}

// DELETE /api/records/share/[shareId] - Revoke access to shared records
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id

    const url = new URL(req.url)
    const shareId = url.pathname.split('/').pop()

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 })
    }

    // Get patient profile
    const patient = await prisma.patient.findUnique({
      where: { userId }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Find and update the share record
    const shareRecord = await prisma.recordShare.findFirst({
      where: { 
        id: shareId,
        patientId: patient.id
      }
    })

    if (!shareRecord) {
      return NextResponse.json({ error: 'Share record not found' }, { status: 404 })
    }

    if (shareRecord.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Share record is not active' }, { status: 400 })
    }

    // Revoke access
    await prisma.recordShare.update({
      where: { id: shareId },
      data: { 
        status: 'REVOKED',
        revokedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Access revoked successfully'
    })

  } catch (error: any) {
    console.error('Error revoking access:', error)
    return NextResponse.json({ 
      error: 'Failed to revoke access' 
    }, { status: 500 })
  }
}

// Helper functions
function generateAccessToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

async function sendShareNotification({
  recipientEmail,
  recipientName,
  patientName,
  message,
  accessToken,
  expiryDate,
  recordTypes
}: {
  recipientEmail: string
  recipientName: string
  patientName: string
  message?: string
  accessToken: string
  expiryDate: Date
  recordTypes: string[]
}) {
  const accessUrl = `${process.env.NEXT_PUBLIC_APP_URL}/records/shared/${accessToken}`
  
  const recordTypesText = recordTypes
    .map(type => type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))
    .join(', ')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Medical Records Shared</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${recipientName},</h2>
            
            <p><strong>${patientName}</strong> has securely shared their medical records with you through Remedara.</p>
            
            <h3>Shared Records:</h3>
            <p><strong>${recordTypesText}</strong></p>
            
            ${message ? `
              <h3>Message from Patient:</h3>
              <p><em>"${message}"</em></p>
            ` : ''}
            
            <div class="warning">
              <strong>Important:</strong> This link will expire on <strong>${expiryDate.toLocaleDateString()}</strong>
            </div>
            
            <p>Click the button below to securely access the shared medical records:</p>
            
            <a href="${accessUrl}" class="button">Access Medical Records</a>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${accessUrl}">${accessUrl}</a></p>
          </div>
          
          <div class="footer">
            <p>This is a secure medical record sharing notification from Remedara.</p>
            <p>If you received this email in error, please ignore it.</p>
          </div>
        </div>
      </body>
    </html>
  `

  await resend!.emails.send({
    from: 'Remedara <noreply@remedara.com>',
    to: [recipientEmail],
    subject: `Medical Records Shared by ${patientName}`,
    html: emailHtml
  })
}
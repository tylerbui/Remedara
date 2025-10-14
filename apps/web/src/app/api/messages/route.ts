import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import nodemailer from 'nodemailer'

// For demonstration purposes, we'll use nodemailer to send emails
// In production, you'd want to use a proper email service like SendGrid, AWS SES, etc.
// and possibly store messages in a database for the provider portal

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only patients can send messages
    if (session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can send messages' }, { status: 403 })
    }

    const { providerId, subject, content } = await request.json()

    if (!providerId || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock provider data - in production, fetch from database
    const providers = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Primary Care',
        email: 'sarah.johnson@remedara.com'
      },
      {
        id: '2',
        name: 'Dr. Robert Chen',
        specialty: 'Cardiology',
        email: 'robert.chen@remedara.com'
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        specialty: 'Dermatology',
        email: 'emily.davis@remedara.com'
      }
    ]

    const provider = providers.find(p => p.id === providerId)
    
    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    // In a production environment, you would:
    // 1. Store the message in a database
    // 2. Send email notification to the provider
    // 3. Create audit logs
    // 4. Implement proper HIPAA-compliant messaging

    // For now, we'll simulate the email sending
    try {
      // Create a transporter (this would use your actual email service in production)
      const transporter = nodemailer.createTransporter({
        // This is just a mock configuration - replace with real SMTP settings
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      // Email content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0 0 10px 0;">New Message from Patient</h2>
            <p style="color: #6b7280; margin: 0;">Remedara Patient Portal</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #111827; margin: 0 0 15px 0;">Message Details</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">From:</strong> ${session.user.name} (${session.user.email})
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Subject:</strong> ${subject}
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #374151;">Message:</strong>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #2563eb;">
                ${content.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="padding: 15px; background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; margin-top: 20px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>🔒 HIPAA Notice:</strong> This message contains confidential patient health information. Please handle according to HIPAA guidelines and your organization's privacy policies.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>This message was sent through the Remedara Patient Portal.</p>
            <p>Please do not reply directly to this email. Use the provider portal to respond.</p>
          </div>
        </div>
      `

      // In production, you'd actually send the email here
      // For development, we'll just log it
      console.log('📧 Message would be sent to:', provider.email)
      console.log('📧 Subject:', `Patient Message: ${subject}`)
      console.log('📧 From:', session.user.name, session.user.email)
      
      // Simulate email sending (comment out for actual email sending)
      /* 
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@remedara.com',
        to: provider.email,
        subject: `Patient Message: ${subject}`,
        html: emailContent,
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'Normal'
        }
      })
      */

      // In production, you would also store this message in a database
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Mock database storage (replace with actual database operations)
      const messageRecord = {
        id: messageId,
        patientId: session.user.id,
        patientName: session.user.name,
        patientEmail: session.user.email,
        providerId: providerId,
        providerName: provider.name,
        providerEmail: provider.email,
        subject: subject,
        content: content,
        sentAt: new Date().toISOString(),
        status: 'sent',
        isRead: false,
        replies: []
      }

      console.log('💾 Message record (would be stored in database):', messageRecord)

      return NextResponse.json({
        success: true,
        id: messageId,
        message: 'Message sent successfully',
        sentAt: messageRecord.sentAt,
        status: 'sent'
      })

    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the API call if email fails - in production you'd want better error handling
      return NextResponse.json({
        success: true,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Message queued for delivery',
        sentAt: new Date().toISOString(),
        status: 'queued'
      })
    }

  } catch (error) {
    console.error('Error in messages API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only patients can view their messages
    if (session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can view messages' }, { status: 403 })
    }

    // In production, fetch messages from database
    // For now, return mock data
    const mockMessages = [
      {
        id: '1',
        subject: 'Question about test results',
        content: 'Hi Dr. Johnson, I have a question about my recent lab results...',
        providerId: '1',
        providerName: 'Dr. Sarah Johnson',
        sentAt: '2024-01-20T10:30:00Z',
        status: 'read'
      },
      {
        id: '2',
        subject: 'Appointment follow-up',
        content: 'Thank you for the appointment yesterday. I wanted to ask about...',
        providerId: '2',
        providerName: 'Dr. Robert Chen',
        sentAt: '2024-01-18T14:15:00Z',
        status: 'replied'
      }
    ]

    return NextResponse.json({
      messages: mockMessages
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
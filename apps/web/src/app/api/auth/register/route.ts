import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Base schema for common fields (without refine)
const baseUserFields = {
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional()
}

// Patient-specific schema
const patientRegistrationSchema = z.object({
  ...baseUserFields,
  role: z.literal('PATIENT'),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Provider-specific schema  
const providerRegistrationSchema = z.object({
  ...baseUserFields,
  role: z.literal('PROVIDER'),
  title: z.string().min(1, 'Title is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  npi: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Union type for registration
const registrationSchema = z.union([
  patientRegistrationSchema,
  providerRegistrationSchema
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = registrationSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user and role-specific profile in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create base user
      const user = await tx.user.create({
        data: {
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          email: validatedData.email,
          password: hashedPassword,
          role: validatedData.role,
          phone: validatedData.phone
        }
      })

      if (validatedData.role === 'PATIENT') {
        const patientData = validatedData as z.infer<typeof patientRegistrationSchema>
        
        // Create patient profile
        const patient = await tx.patient.create({
          data: {
            userId: user.id,
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            email: patientData.email,
            phone: patientData.phone,
            dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null,
            address: patientData.address,
            city: patientData.city,
            state: patientData.state,
            zipCode: patientData.zipCode,
            emergencyContact: patientData.emergencyContact,
            emergencyPhone: patientData.emergencyPhone
          }
        })

        return { user, profile: patient, role: 'PATIENT' }
      } else {
        const providerData = validatedData as z.infer<typeof providerRegistrationSchema>
        
        // Create provider profile (inactive until verified)
        const provider = await tx.provider.create({
          data: {
            userId: user.id,
            firstName: providerData.firstName,
            lastName: providerData.lastName,
            title: providerData.title,
            specialization: providerData.specialization,
            licenseNumber: providerData.licenseNumber,
            npi: providerData.npi,
            phone: providerData.phone,
            email: providerData.email,
            isActive: false // Providers start inactive until verified
          }
        })

        return { user, profile: provider, role: 'PROVIDER' }
      }
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = result.user

    // TODO: Send welcome/verification emails
    // TODO: For providers, add to verification queue
    
    const response = {
      message: validatedData.role === 'PROVIDER' 
        ? 'Provider registration submitted for verification' 
        : 'Patient account created successfully',
      user: userWithoutPassword,
      profile: result.profile,
      requiresVerification: validatedData.role === 'PROVIDER'
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid registration data', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    // Handle Prisma unique constraint violations
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

// GET method for checking email availability (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    return NextResponse.json({ 
      available: !existingUser,
      message: existingUser ? 'Email is already registered' : 'Email is available'
    })

  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
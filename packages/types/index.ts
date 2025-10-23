// Define types without Prisma dependency for mobile compatibility
export type Role = 'PATIENT' | 'PROVIDER' | 'ADMIN';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type IntakeFormStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type ProviderConnectionStatus = 'PENDING' | 'CONNECTED' | 'REJECTED';
export type ConnectionInitiator = 'PATIENT' | 'PROVIDER';

// Auth types for mobile
export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: Role
  image?: string | null
}

export interface MobileSession {
  user: AuthUser
  accessToken: string
  refreshToken?: string
  expires: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Mobile-specific types
export interface MobileAppointment {
  id: string
  patientName: string
  providerName: string
  datetime: string
  status: AppointmentStatus
  type?: string
  notes?: string
}

export interface MobileNotification {
  id: string
  title: string
  message: string
  type: 'appointment' | 'reminder' | 'update' | 'alert'
  timestamp: string
  read: boolean
}

// Form validation schemas (using Zod)
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['PATIENT', 'PROVIDER']).default('PATIENT'),
})

export type LoginFormData = z.infer<typeof LoginSchema>
export type RegisterFormData = z.infer<typeof RegisterSchema>
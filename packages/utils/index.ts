import { clsx, type ClassValue } from 'clsx'
import { format, parseISO, isValid } from 'date-fns'

// Utility function for combining class names (like your web app)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Date formatting utilities
export const formatters = {
  date: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'Invalid date'
  },
  
  time: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, 'h:mm a') : 'Invalid time'
  },
  
  datetime: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy h:mm a') : 'Invalid date'
  },
  
  dateInput: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, 'yyyy-MM-dd') : ''
  }
}

// API helpers
export const apiHelpers = {
  buildUrl: (baseUrl: string, path: string, params?: Record<string, string>) => {
    const url = new URL(path, baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    return url.toString()
  },
  
  handleApiError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  }
}

// Validation helpers
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  },
  
  isNotEmpty: (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim() !== ''
  }
}

// Storage helpers for mobile
export const storage = {
  keys: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    SETTINGS: 'app_settings'
  }
}

// Constants
export const APP_CONSTANTS = {
  API_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  ROLES: {
    PATIENT: 'PATIENT',
    PROVIDER: 'PROVIDER',
    FRONT_DESK: 'FRONT_DESK',
    ADMIN: 'ADMIN'
  } as const,
  
  APPOINTMENT_STATUS: {
    SCHEDULED: 'SCHEDULED',
    CONFIRMED: 'CONFIRMED',
    CHECKED_IN: 'CHECKED_IN',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
    PENDING_APPROVAL: 'PENDING_APPROVAL'
  } as const
}
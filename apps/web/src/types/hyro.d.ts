// TypeScript declarations for Hyro AI Chat
declare global {
  interface Window {
    hyro: {
      init: (config: HyroConfig) => void
      open: () => void
      close: () => void
      isReady: () => boolean
      on: (event: string, callback: (data: any) => void) => void
      setUserData: (userData: HyroUserData) => void
    }
    gtag?: (command: string, action: string, parameters?: any) => void
  }
}

interface HyroConfig {
  widgetId: string
  theme?: {
    primaryColor?: string
    fontFamily?: string
    borderRadius?: string
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  }
  metadata?: {
    industry?: string
    company?: string
    supportType?: string
    userType?: 'patient' | 'provider' | 'admin'
  }
  customization?: {
    welcomeMessage?: string
    placeholder?: string
    title?: string
    subtitle?: string
  }
}

interface HyroUserData {
  userId?: string
  name?: string
  email?: string
  userType?: 'patient' | 'provider' | 'admin'
  metadata?: Record<string, any>
}

export {}
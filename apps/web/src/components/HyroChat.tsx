'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface HyroChatProps {
  userType?: 'patient' | 'provider' | 'admin'
  customMetadata?: Record<string, any>
}

export function HyroChat({ userType, customMetadata }: HyroChatProps) {
  const { data: session } = useSession()

  useEffect(() => {
    // Only initialize if Hyro is enabled
    if (process.env.NEXT_PUBLIC_HYRO_ENABLED !== 'true') return

    // Load Hyro script if not already loaded
    if (typeof window !== 'undefined' && !window.hyro) {
      const script = document.createElement('script')
      script.src = 'https://widget.hyro.ai/widget.js'
      script.async = true
      script.onload = () => {
        initializeHyro()
      }
      document.head.appendChild(script)
    } else if (window.hyro) {
      // If already loaded, just initialize
      initializeHyro()
    }
  }, [session, userType])

  const initializeHyro = () => {
    if (!window.hyro) return

    // Determine user type from session or prop
    const resolvedUserType = userType || (session?.user?.role?.toLowerCase() as 'patient' | 'provider' | 'admin') || 'patient'

    // Configure Hyro
    window.hyro.init({
      widgetId: process.env.NEXT_PUBLIC_HYRO_WIDGET_ID || 'remedara-widget',
      theme: {
        primaryColor: resolvedUserType === 'patient' ? '#3b82f6' : resolvedUserType === 'provider' ? '#10b981' : '#6366f1',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        borderRadius: '12px',
        position: 'bottom-right'
      },
      metadata: {
        industry: 'healthcare',
        company: 'Remedara',
        supportType: 'patient-care',
        userType: resolvedUserType,
        ...customMetadata
      },
      customization: {
        title: 'Remedara Support',
        subtitle: 'AI-powered healthcare assistance',
        welcomeMessage: getWelcomeMessage(resolvedUserType),
        placeholder: 'Ask me anything about Remedara...'
      }
    })

    // Set user data if available
    if (session?.user) {
      window.hyro.setUserData({
        userId: session.user.id,
        name: session.user.name || undefined,
        email: session.user.email || undefined,
        userType: resolvedUserType,
        metadata: {
          sessionId: Date.now().toString(),
          loginTime: new Date().toISOString(),
          ...customMetadata
        }
      })
    }

    // Set up event listeners for analytics
    window.hyro.on('chatOpened', (data) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'hyro_chat_opened', {
          event_category: 'support',
          event_label: resolvedUserType,
          custom_parameters: data
        })
      }
    })

    window.hyro.on('messagesSent', (data) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'hyro_message_sent', {
          event_category: 'support',
          event_label: resolvedUserType,
          value: data.messageCount || 1
        })
      }
    })
  }

  const getWelcomeMessage = (userType: string): string => {
    switch (userType) {
      case 'patient':
        return "Hi! I'm here to help with your healthcare questions, appointment scheduling, and navigating Remedara. How can I assist you today?"
      case 'provider':
        return "Hello! I can help you with practice management, patient scheduling, system features, and technical support. What do you need help with?"
      case 'admin':
        return "Welcome! I'm here to assist with system administration, user management, billing, and advanced features. How can I help?"
      default:
        return "Hello! Welcome to Remedara. I'm here to help with any questions about our healthcare platform. How can I assist you?"
    }
  }

  // This component doesn't render anything visible - it just initializes Hyro
  return null
}

// Helper function to open Hyro chat programmatically
export const openHyroChat = () => {
  if (typeof window !== 'undefined' && window.hyro) {
    window.hyro.open()
  }
}

// Helper function to check if Hyro is ready
export const isHyroReady = (): boolean => {
  return typeof window !== 'undefined' && window.hyro && window.hyro.isReady()
}
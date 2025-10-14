/**
 * Get the base URL dynamically based on environment
 * Works for both client and server side
 */
export function getBaseUrl(): string {
  // Client side - use window.location
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server side - check various environment variables
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // Fallback for local development
  const port = process.env.PORT || 3000
  return `http://localhost:${port}`
}

/**
 * Get the current host and port from the request (server-side only)
 */
export function getBaseUrlFromRequest(req?: Request | { headers: any }): string {
  if (!req) {
    return getBaseUrl()
  }
  
  const protocol = req.headers?.['x-forwarded-proto'] || 'http'
  const host = req.headers?.host || req.headers?.['x-forwarded-host']
  
  if (host) {
    return `${protocol}://${host}`
  }
  
  return getBaseUrl()
}
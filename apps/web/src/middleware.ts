import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Get the token to check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/provider/login',
    '/provider/register',
    '/forgot-password',
    '/provider/forgot-password',
    '/api/auth',
  ]

  const isPublicPath = publicPaths.some(
    publicPath => path === publicPath || path.startsWith(`${publicPath}/`)
  )

  // Provider-specific paths
  const isProviderPath =
    path.startsWith('/provider') &&
    !path.startsWith('/provider/login') &&
    !path.startsWith('/provider/register')

  // Patient-specific paths
  const isPatientPath = path.startsWith('/patient')

  // If trying to access protected route without authentication
  if (!isPublicPath && !token) {
    // Redirect to appropriate login page
    if (isProviderPath) {
      return NextResponse.redirect(new URL('/provider/login', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated, check role-based access
  if (token) {
    const userRole = token.role as string

    // Redirect authenticated users away from login pages
    if (path === '/login' || path === '/provider/login') {
      if (userRole === 'PROVIDER' || userRole === 'ADMIN' || userRole === 'FRONT_DESK') {
        return NextResponse.redirect(new URL('/provider/dashboard', request.url))
      }
      if (userRole === 'PATIENT') {
        return NextResponse.redirect(new URL('/patient/dashboard', request.url))
      }
    }

    // Provider routes - only for PROVIDER, ADMIN, FRONT_DESK
    if (isProviderPath) {
      if (userRole !== 'PROVIDER' && userRole !== 'ADMIN' && userRole !== 'FRONT_DESK') {
        return NextResponse.redirect(new URL('/patient/dashboard', request.url))
      }
    }

    // Patient routes - only for PATIENT
    if (isPatientPath) {
      if (userRole !== 'PATIENT') {
        return NextResponse.redirect(new URL('/provider/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}

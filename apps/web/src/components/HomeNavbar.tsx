'use client'

import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LayoutDashboard, User, Stethoscope } from 'lucide-react'

export function HomeNavbar() {
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Remedara
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Support Link - Always visible */}
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="text-gray-700 hover:bg-gray-100 px-6 py-3 text-base font-medium"
            >
              <Link href="/support">Support</Link>
            </Button>
            
            {status === 'loading' ? (
              <div className="flex space-x-4">
                <div className="w-24 h-12 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-24 h-12 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-base text-gray-600">
                  Welcome, {session.user.name || session.user.email}
                </span>
                
                {/* Dashboard Links based on user role */}
                {session.user.role === 'PATIENT' && (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      size="lg"
                      className="text-blue-700 hover:bg-blue-50 px-6 py-3 text-base font-medium"
                    >
                      <Link href="/patient/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      size="lg"
                      className="text-gray-600 hover:bg-gray-50 px-6 py-3 text-base font-medium"
                    >
                      <Link href="/records">
                        <User className="h-4 w-4 mr-2" />
                        Records
                      </Link>
                    </Button>
                  </>
                )}
                
                {session.user.role === 'PROVIDER' && (
                  <Button
                    variant="ghost"
                    asChild
                    size="lg"
                    className="text-green-700 hover:bg-green-50 px-6 py-3 text-base font-medium"
                  >
                    <Link href="/provider">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                
                {(session.user.role === 'ADMIN' || session.user.role === 'FRONT_DESK') && (
                  <Button
                    variant="ghost"
                    asChild
                    size="lg"
                    className="text-purple-700 hover:bg-purple-50 px-6 py-3 text-base font-medium"
                  >
                    <Link href="/provider">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSignOut}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 text-base"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  asChild
                  size="lg"
                  className="text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 px-8 py-3 text-lg font-medium"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
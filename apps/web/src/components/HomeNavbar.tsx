'use client'

import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function HomeNavbar() {
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Remedara
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="flex space-x-4">
                <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user.name || session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  asChild
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800"
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
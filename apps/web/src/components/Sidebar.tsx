'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Calendar,
  MapPin,
  FileText,
  Pill,
  MessageSquare,
  User,
  Stethoscope,
  Users,
  Settings,
  Home,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

interface SidebarItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

interface SidebarProps {
  userType: 'patient' | 'provider'
}

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const patientItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/patient/dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      label: 'Appointments',
      href: '/patient/appointments',
      icon: Calendar,
      description: 'View and manage your appointments'
    },
    {
      label: 'Doctors & Locations',
      href: '/patient/providers',
      icon: MapPin,
      description: 'Find doctors and clinic locations'
    },
    {
      label: 'Records',
      href: '/patient/records',
      icon: FileText,
      description: 'Medical records and documents'
    },
    {
      label: 'Pharmacy',
      href: '/patient/pharmacy',
      icon: Pill,
      description: 'Prescriptions and medications'
    },
    {
      label: 'Messages',
      href: '/patient/messages',
      icon: MessageSquare,
      description: 'Secure messaging with providers'
    }
  ]

  const providerItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/provider/dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      label: 'Schedule',
      href: '/provider/schedule',
      icon: Calendar,
      description: 'Manage your appointments and availability'
    },
    {
      label: 'Patients',
      href: '/provider/patients',
      icon: Users,
      description: 'View and manage patient information'
    },
    {
      label: 'Records',
      href: '/provider/records',
      icon: FileText,
      description: 'Patient records and documents'
    },
    {
      label: 'Messages',
      href: '/provider/messages',
      icon: MessageSquare,
      description: 'Secure messaging with patients'
    },
    {
      label: 'Settings',
      href: '/provider/settings',
      icon: Settings,
      description: 'Practice settings and preferences'
    }
  ]

  const items = userType === 'patient' ? patientItems : providerItems
  const userIcon = userType === 'patient' ? User : Stethoscope
  const userColor = userType === 'patient' ? 'blue' : 'green'

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Remedara</h1>
        </Link>
        
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            userType === 'patient' ? 'bg-blue-100' : 'bg-green-100'
          )}>
            {React.createElement(userIcon, {
              className: cn(
                "h-6 w-6",
                userType === 'patient' ? 'text-blue-600' : 'text-green-600'
              )
            })}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-gray-900 truncate">
              {session?.user.name || session?.user.email}
            </p>
            <p className={cn(
              "text-sm capitalize",
              userType === 'patient' ? 'text-blue-600' : 'text-green-600'
            )}>
              {userType}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start space-x-3 px-4 py-3 rounded-lg text-left transition-colors group",
                isActive 
                  ? userType === 'patient'
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-green-50 border border-green-200'
                  : 'hover:bg-gray-50 border border-transparent'
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                isActive 
                  ? userType === 'patient' 
                    ? 'text-blue-600' 
                    : 'text-green-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              )} />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-base font-medium",
                  isActive 
                    ? userType === 'patient' 
                      ? 'text-blue-600' 
                      : 'text-green-600'
                    : 'text-gray-900'
                )}>
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
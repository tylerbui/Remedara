import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar'

export default async function ProviderDashboard() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is a provider
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'PROVIDER') {
    redirect('/') // Redirect to appropriate dashboard based on role
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AvailabilityCalendar />
      </main>
    </div>
  )
}

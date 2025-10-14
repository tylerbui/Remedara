'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sidebar } from '@/components/Sidebar'
import { 
  Calendar,
  MapPin,
  FileText,
  Pill,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Bell,
  Plus,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function PatientDashboard() {
  const { data: session } = useSession()

  // Mock data - in real app this would come from your backend
  const upcomingAppointments = [
    {
      id: 1,
      provider: "Dr. Sarah Johnson",
      specialty: "Primary Care",
      date: "Tomorrow",
      time: "10:30 AM",
      location: "Downtown Medical Center",
      type: "Annual Checkup"
    },
    {
      id: 2,
      provider: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "Friday, Oct 18",
      time: "2:15 PM",
      location: "Westside Clinic",
      type: "Follow-up"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "appointment",
      title: "Appointment scheduled",
      description: "Annual checkup with Dr. Sarah Johnson",
      time: "2 hours ago",
      icon: Calendar,
      color: "blue"
    },
    {
      id: 2,
      type: "message",
      title: "New message from Dr. Chen",
      description: "Follow-up instructions for your recent visit",
      time: "1 day ago",
      icon: MessageSquare,
      color: "green"
    },
    {
      id: 3,
      type: "prescription",
      title: "Prescription ready",
      description: "Medication ready for pickup at CVS Pharmacy",
      time: "2 days ago",
      icon: Pill,
      color: "purple"
    }
  ]

  const quickActions = [
    {
      label: "Schedule Appointment",
      description: "Book a new appointment",
      href: "/patient/appointments",
      icon: Calendar,
      color: "blue"
    },
    {
      label: "Find Doctors",
      description: "Search providers and locations",
      href: "/patient/providers",
      icon: MapPin,
      color: "green"
    },
    {
      label: "View Records",
      description: "Access your medical records",
      href: "/patient/records",
      icon: FileText,
      color: "purple"
    },
    {
      label: "Messages",
      description: "Chat with your care team",
      href: "/patient/messages",
      icon: MessageSquare,
      color: "orange"
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Sidebar userType="patient" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {session?.user.name?.split(' ')[0] || 'Patient'}!
                </h1>
                <p className="text-xl text-gray-600">
                  Here's what's happening with your health today
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="lg" className="px-6 py-3">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-blue-600">2</p>
                    <p className="text-base text-blue-600">Upcoming Appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-green-600">3</p>
                    <p className="text-base text-green-600">Unread Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Pill className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-purple-600">1</p>
                    <p className="text-base text-purple-600">Prescription Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-base text-orange-600">Documents Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Appointments */}
            <Card className="border-gray-200">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Upcoming Appointments</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-1">
                      Your scheduled visits
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/patient/appointments">
                      View All
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.provider}
                        </h3>
                        <Badge variant="secondary" className="text-sm">
                          {appointment.type}
                        </Badge>
                      </div>
                      <p className="text-base text-gray-600 mb-1">{appointment.specialty}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.date} at {appointment.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg">
                  <Link href="/patient/appointments">
                    <Plus className="h-5 w-5 mr-2" />
                    Schedule New Appointment
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-gray-200">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Recent Activity</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-1">
                      Latest updates and notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.color === 'blue' ? 'bg-blue-100' :
                        activity.color === 'green' ? 'bg-green-100' :
                        activity.color === 'purple' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        <activity.icon className={`h-5 w-5 ${
                          activity.color === 'blue' ? 'text-blue-600' :
                          activity.color === 'green' ? 'text-green-600' :
                          activity.color === 'purple' ? 'text-purple-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-base text-gray-600 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    {index < recentActivity.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-gray-200">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Common tasks and frequently used features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group"
                  >
                    <Card className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          action.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                          action.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                          action.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                          action.color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-200' :
                          'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <action.icon className={`h-8 w-8 ${
                            action.color === 'blue' ? 'text-blue-600' :
                            action.color === 'green' ? 'text-green-600' :
                            action.color === 'purple' ? 'text-purple-600' :
                            action.color === 'orange' ? 'text-orange-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {action.label}
                        </h3>
                        <p className="text-base text-gray-600">
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
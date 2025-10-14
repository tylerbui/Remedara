'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  FileText, 
  User, 
  AlertTriangle, 
  Clock, 
  Activity,
  Heart,
  Pill,
  TestTube,
  Syringe,
  CheckCircle,
  LayoutDashboard,
  Bell,
  Plus,
  Eye,
  Stethoscope,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

type DashboardSection = 'overview' | 'appointments' | 'records' | 'prescriptions' | 'results'

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  
  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    // Only patients should access this dashboard
    if (session.user.role !== 'PATIENT') {
      redirect('/provider') // Redirect providers/admins to their dashboard
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) return null

  // Mock data - replace with API calls
  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-25',
      time: '10:00 AM',
      provider: 'Dr. Sarah Johnson',
      type: 'Annual Physical',
      location: 'Main Clinic'
    },
    {
      id: '2',
      date: '2024-02-15',
      time: '2:30 PM',
      provider: 'Dr. Robert Chen',
      type: 'Cardiology Follow-up',
      location: 'Cardiology Center'
    }
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'lab_result',
      title: 'Lab Results Available',
      description: 'Complete Blood Count results are ready',
      date: '2024-01-15',
      status: 'new'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescription Refill',
      description: 'Metformin refill processed',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Appointment Confirmed',
      description: 'Annual Physical with Dr. Johnson',
      date: '2024-01-10',
      status: 'confirmed'
    }
  ]

  const healthAlerts = [
    {
      id: '1',
      type: 'overdue',
      title: 'Flu Vaccination Overdue',
      description: 'Your annual flu shot is past due',
      priority: 'high'
    },
    {
      id: '2',
      type: 'form',
      title: 'Insurance Form Pending',
      description: 'Please complete your insurance verification',
      priority: 'medium'
    }
  ]

  const quickStats = {
    appointments: 2,
    prescriptions: 3,
    labResults: 5,
    documents: 8
  }

  // Sidebar navigation items
  const sidebarNavigation = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, description: 'Health overview' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, description: 'Schedule & history' },
    { id: 'records', label: 'Medical Records', icon: FileText, description: 'Health records' },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, description: 'Medications' },
    { id: 'results', label: 'Test Results', icon: TestTube, description: 'Lab & imaging' }
  ] as const

  // Render different sections based on active selection
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'appointments':
        return renderAppointments()
      case 'records':
        return renderRecords()
      case 'prescriptions':
        return renderPrescriptions()
      case 'results':
        return renderResults()
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Health Overview</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/book">
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span>Health Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
                alert.priority === 'medium' ? 'border-l-orange-500 bg-orange-50' : 
                'border-l-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  </div>
                  <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                    {alert.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.appointments}</div>
            <p className="text-xs text-muted-foreground">Next: Jan 25</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.prescriptions}</div>
            <p className="text-xs text-muted-foreground">1 refill needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
            <TestTube className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.labResults}</div>
            <p className="text-xs text-muted-foreground">1 new result</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.documents}</div>
            <p className="text-xs text-muted-foreground">All up to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{appointment.type}</h3>
                  <p className="text-sm text-gray-600">{appointment.provider}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/book">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'lab_result' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'prescription' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'lab_result' ? <TestTube className="h-4 w-4" /> :
                   activity.type === 'prescription' ? <Pill className="h-4 w-4" /> :
                   <Calendar className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <Badge variant={activity.status === 'new' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/records">
                <FileText className="h-4 w-4 mr-2" />
                View All Records
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
      <Card>
        <CardHeader>
          <CardTitle>This section will show appointment management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Appointment scheduling and history will be displayed here.</p>
          <Button asChild className="mt-4">
            <Link href="/book">Book New Appointment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderRecords = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
      <Card>
        <CardHeader>
          <CardTitle>Access Your Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p>View your complete medical history, lab results, and documents.</p>
          <Button asChild className="mt-4">
            <Link href="/records">View Full Records</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your prescriptions and medication history.</p>
          <Button asChild className="mt-4">
            <Link href="/records">View Prescriptions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderResults = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
      <Card>
        <CardHeader>
          <CardTitle>Lab & Imaging Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>View your latest test results and medical imaging.</p>
          <Button asChild className="mt-4">
            <Link href="/records">View All Results</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {session.user.name?.split(' ')[0]}
            </p>
          </div>
          
          <nav className="mt-6">
            {sidebarNavigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as DashboardSection)}
                  className={`w-full flex items-start space-x-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
  )
}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
              <TestTube className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.labResults}</div>
              <p className="text-xs text-muted-foreground">1 new result</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.documents}</div>
              <p className="text-xs text-muted-foreground">All up to date</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/book">
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{appointment.type}</h3>
                    <p className="text-sm text-gray-600">{appointment.provider}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/book">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'lab_result' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'prescription' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'lab_result' ? <TestTube className="h-4 w-4" /> :
                     activity.type === 'prescription' ? <Pill className="h-4 w-4" /> :
                     <Calendar className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={activity.status === 'new' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/records">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Records
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Link href="/records" className="block">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Medical Records</h3>
                    <p className="text-sm text-gray-600">View your complete health history</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Link href="/book" className="block">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Book Appointment</h3>
                    <p className="text-sm text-gray-600">Schedule with your providers</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Pill className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Prescriptions</h3>
                  <p className="text-sm text-gray-600">Manage your medications</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Link href="/support" className="block">
                  <div className="text-center">
                    <User className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Support</h3>
                    <p className="text-sm text-gray-600">Get help and contact us</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
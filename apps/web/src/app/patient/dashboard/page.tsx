'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
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
  BarChart3,
  MessageSquare,
  History,
  ClipboardList,
  Building2,
  LogOut,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'
import { MessageProvider } from '@/components/MessageProvider'
import AppointmentNotifications from '@/components/AppointmentNotifications'
import ProviderConnectionRequests from '@/components/ProviderConnectionRequests'

type DashboardSection = 'overview' | 'appointments' | 'records' | 'prescriptions' | 'results' | 'messages' | 'visits' | 'past-prescriptions' | 'providers'

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2D4A3E' }}></div>
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
    { id: 'visits', label: 'Past Visits', icon: History, description: 'Visit history & notes' },
    { id: 'records', label: 'Medical Records', icon: FileText, description: 'Health records' },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, description: 'Medications' },
    { id: 'past-prescriptions', label: 'Past Prescriptions', icon: ClipboardList, description: 'Prescription history' },
    { id: 'results', label: 'Test Results', icon: TestTube, description: 'Lab & imaging' },
    { id: 'messages', label: 'Message Provider', icon: MessageSquare, description: 'Contact your providers' },
    { id: 'providers', label: 'Linked Providers', icon: Building2, description: 'Manage provider connections' }
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
      case 'messages':
        return renderMessages()
      case 'visits':
        return renderVisits()
      case 'past-prescriptions':
        return renderPastPrescriptions()
      case 'providers':
        return renderProviders()
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Health Overview</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="lg" asChild className="px-6 py-3">
            <Link href="/book">
              <Plus className="h-5 w-5 mr-3" />
              Book Appointment
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="px-6 py-3">
            <Link href="/patient/connect-provider">
              <UserPlus className="h-5 w-5 mr-3" />
              Connect Provider
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Appointment Notifications */}
      <AppointmentNotifications />
      
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
                    <h3 className="font-semibold" style={{ color: '#2D4A3E' }}>{alert.title}</h3>
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
            <Calendar className="h-4 w-4" style={{ color: '#5A7965' }} />
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
            <TestTube className="h-4 w-4" style={{ color: '#6B8E7D' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.labResults}</div>
            <p className="text-xs text-muted-foreground">1 new result</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4" style={{ color: '#B8956A' }} />
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
                <div className="p-2 rounded-full" style={{
                  backgroundColor: activity.type === 'lab_result' ? '#E8EBE4' :
                                 activity.type === 'prescription' ? '#E8EBE4' : '#E8EBE4',
                  color: activity.type === 'lab_result' ? '#6B8E7D' :
                        activity.type === 'prescription' ? '#4A7C59' : '#5A7965'
                }}>
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
      <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Appointments</h2>
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
      <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Medical Records</h2>
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
      <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Prescriptions</h2>
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
      <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Test Results</h2>
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

  const renderMessages = () => (
    <MessageProvider />
  )

  const renderVisits = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Past Visits</h2>
        <Button asChild>
          <Link href="/patient/visits">
            <Eye className="h-4 w-4 mr-2" />
            View All Visits
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Visit History</CardTitle>
          <CardDescription>
            View your complete medical visit history with detailed summaries and provider notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Access detailed information about your past appointments including visit summaries, 
            provider notes, and treatment plans.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Visit dates and times</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>Doctor information and specialties</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>Visit summaries and provider notes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPastPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Past Prescriptions</h2>
        <Button asChild>
          <Link href="/patient/prescriptions">
            <Eye className="h-4 w-4 mr-2" />
            View All Prescriptions
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
          <CardDescription>
            View your complete prescription history with detailed medication information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Access detailed information about your past and current medications including 
            dosages, instructions, and provider notes.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Pill className="h-4 w-4 mr-2" />
              <span>Medication names and dosages</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>Prescribing doctor information</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Prescription dates and refill information</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProviders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#2D4A3E' }}>Healthcare Providers</h2>
        <Button asChild>
          <Link href="/patient/link-provider">
            <Plus className="h-4 w-4 mr-2" />
            Link External Provider
          </Link>
        </Button>
      </div>
      
      {/* Provider Connection Requests and Connected Providers */}
      <ProviderConnectionRequests />
      
      {/* External FHIR Provider Connections */}
      <Card>
        <CardHeader>
          <CardTitle>External Provider Systems</CardTitle>
          <CardDescription>
            Connect to external healthcare systems to import your medical data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Link to external systems like Epic, Cerner, and other FHIR-compliant platforms to 
            import your existing medical history.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="h-4 w-4 mr-2" />
              <span>Epic MyChart, Cerner PowerChart, and more</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Secure OAuth 2.0 authentication</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Activity className="h-4 w-4 mr-2" />
              <span>Automatic data synchronization</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold" style={{ color: '#2D4A3E' }}>Patient Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {session.user.name?.split(' ')[0]}
            </p>
          </div>
          
          <nav className="mt-6 flex-1 flex flex-col">
            <div className="flex-1">
              {sidebarNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as DashboardSection)}
                    className="w-full flex items-start space-x-3 px-6 py-4 text-left transition-colors"
                    style={{
                      backgroundColor: activeSection === item.id ? '#E8EBE4' : 'transparent',
                      borderRight: activeSection === item.id ? '2px solid #5A7965' : 'none',
                      color: activeSection === item.id ? '#2D4A3E' : '#5A6B5F'
                    }}
                  >
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Sign Out Button */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-red-500 mt-1">End your session</div>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
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
  Clock, 
  Activity,
  Pill,
  TestTube,
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
  Users,
  CalendarCheck,
  UserCheck,
  Settings,
  TrendingUp,
  AlertTriangle,
  Phone,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar'
import { MessageProvider } from '@/components/MessageProvider'
import AppointmentSchedulingModal from '@/components/AppointmentSchedulingModal'
import ProviderPatientRequests from '@/components/ProviderPatientRequests'

type DashboardSection = 'overview' | 'appointments' | 'patients' | 'availability' | 'prescriptions' | 'messages' | 'analytics' | 'settings'

export default function ProviderDashboard() {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false)
  
  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    // Only providers should access this dashboard
    if (session.user.role !== 'PROVIDER') {
      redirect('/patient/dashboard') // Redirect patients to their dashboard
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

  const handleOpenSchedulingModal = () => {
    setIsSchedulingModalOpen(true)
  }

  const handleCloseSchedulingModal = () => {
    setIsSchedulingModalOpen(false)
  }

  const handleAppointmentScheduled = () => {
    // Refresh appointments data if needed
    // Could add state management here
  }

  // Mock data - replace with API calls
  const todayAppointments = [
    {
      id: '1',
      time: '9:00 AM',
      patient: 'Sarah Johnson',
      type: 'Annual Physical',
      status: 'confirmed',
      duration: '30 min'
    },
    {
      id: '2',
      time: '10:30 AM',
      patient: 'Robert Chen',
      type: 'Follow-up',
      status: 'checked-in',
      duration: '15 min'
    },
    {
      id: '3',
      time: '2:00 PM',
      patient: 'Maria Garcia',
      type: 'Consultation',
      status: 'pending',
      duration: '45 min'
    }
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'appointment',
      title: 'Appointment Completed',
      description: 'Follow-up with John Smith',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescription Issued',
      description: 'Lisinopril for Maria Garcia',
      date: '2024-01-15',
      status: 'active'
    },
    {
      id: '3',
      type: 'lab_order',
      title: 'Lab Order Created',
      description: 'Blood work for Sarah Johnson',
      date: '2024-01-14',
      status: 'pending'
    }
  ]

  const alerts = [
    {
      id: '1',
      type: 'urgent',
      title: 'Lab Results Ready',
      description: 'Critical values for patient Robert Chen',
      priority: 'high'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Patient Rescheduled',
      description: 'Maria Garcia moved to tomorrow 10 AM',
      priority: 'medium'
    }
  ]

  const quickStats = {
    todayAppointments: 8,
    activePrescriptions: 24,
    pendingLabResults: 5,
    totalPatients: 156
  }

  // Sidebar navigation items
  const sidebarNavigation = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, description: 'Practice overview' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, description: 'Schedule management' },
    { id: 'patients', label: 'Patients', icon: Users, description: 'Patient records' },
    { id: 'availability', label: 'Availability', icon: Clock, description: 'Schedule & time slots' },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, description: 'Medication management' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'Patient communications' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Practice insights' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Practice preferences' }
  ] as const

  // Render different sections based on active selection
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'appointments':
        return renderAppointments()
      case 'patients':
        return renderPatients()
      case 'availability':
        return renderAvailability()
      case 'prescriptions':
        return renderPrescriptions()
      case 'messages':
        return renderMessages()
      case 'analytics':
        return renderAnalytics()
      case 'settings':
        return renderSettings()
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Practice Overview</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/provider/connect-patient">
              <UserCheck className="h-4 w-4 mr-2" />
              Connect Patient
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/book">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span>Priority Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
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

      {/* Patient Connection Requests */}
      <ProviderPatientRequests />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">3 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.activePrescriptions}</div>
            <p className="text-xs text-muted-foreground">2 expiring soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Lab Results</CardTitle>
            <TestTube className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.pendingLabResults}</div>
            <p className="text-xs text-muted-foreground">1 urgent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">5 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarCheck className="h-5 w-5" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{appointment.type}</h3>
                  <p className="text-sm text-gray-600">{appointment.patient}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.time} • {appointment.duration}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      appointment.status === 'confirmed' ? 'default' : 
                      appointment.status === 'checked-in' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {appointment.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View Full Schedule
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
                  activity.type === 'lab_order' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'prescription' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'lab_order' ? <TestTube className="h-4 w-4" /> :
                   activity.type === 'prescription' ? <Pill className="h-4 w-4" /> :
                   <Calendar className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <History className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
        <Button onClick={handleOpenSchedulingModal}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
          <CardDescription>View and manage your appointment schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Comprehensive appointment scheduling, patient check-ins, and appointment history will be displayed here.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Daily, weekly, and monthly schedule views</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <UserCheck className="h-4 w-4 mr-2" />
              <span>Patient check-in and status management</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Appointment duration and buffer time settings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/provider/connect-patient">
              <UserCheck className="h-4 w-4 mr-2" />
              Connect Patient
            </Link>
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>Manage patient information and medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Access and manage patient records, medical history, and care plans.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>Patient demographics and contact information</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>Medical history and care plans</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Stethoscope className="h-4 w-4 mr-2" />
              <span>Visit notes and treatment summaries</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAvailability = () => (
    <AvailabilityCalendar />
  )

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Medication Management</CardTitle>
          <CardDescription>Create and manage patient prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Electronic prescribing, medication history, and drug interaction checking.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Pill className="h-4 w-4 mr-2" />
              <span>Electronic prescription creation and sending</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>Drug interaction and allergy checking</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <History className="h-4 w-4 mr-2" />
              <span>Prescription history and refill management</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMessages = () => (
    <MessageProvider />
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Practice Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track appointment volume, patient satisfaction, and revenue trends.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Clinical Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Analyze treatment outcomes and patient demographics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Practice Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Update your professional profile and credentials.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Configure alerts and communication preferences.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Manage EMR and third-party integrations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Update practice details and operating hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">Provider Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, Dr. {session.user.name?.split(' ')[0]}
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
            </div>
            
            {/* Sign Out Button */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
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
      
      {/* Appointment Scheduling Modal */}
      <AppointmentSchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={handleCloseSchedulingModal}
        onScheduled={handleAppointmentScheduled}
      />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Users, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Clock,
  CheckCircle,
  UserPlus,
  Eye,
  MessageSquare,
  Stethoscope,
  ArrowLeft,
  AlertCircle,
  Shield,
  Activity,
  Heart,
  Pill,
  TrendingUp,
  BarChart3,
  LineChart,
  Zap,
  Droplets,
  Thermometer
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Patient {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth: string
  lastVisit?: string
  isConnected: boolean
  connectionStatus: 'connected' | 'pending' | 'not_connected'
  medicalRecords?: {
    conditions: string[]
    allergies: string[]
    medications: string[]
  }
  appointments?: {
    upcoming: number
    completed: number
  }
  healthMetrics?: {
    vitals: {
      bloodPressure: { systolic: number; diastolic: number; date: string }[]
      heartRate: { value: number; date: string }[]
      temperature: { value: number; date: string }[]
      weight: { value: number; date: string }[]
      glucose: { value: number; date: string }[]
    }
    labResults: {
      cholesterol: { total: number; hdl: number; ldl: number; date: string }[]
      hemoglobin: { value: number; date: string }[]
      creatinine: { value: number; date: string }[]
    }
  }
}

export default function ConnectPatientPage() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    if (session.user.role !== 'PROVIDER') {
      redirect('/patient/dashboard')
    }
  }, [session, status])

  // Mock patient data - replace with API call
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        dateOfBirth: '1985-03-15',
        lastVisit: '2024-01-10',
        isConnected: true,
        connectionStatus: 'connected',
        medicalRecords: {
          conditions: ['Hypertension', 'Type 2 Diabetes'],
          allergies: ['Penicillin'],
          medications: ['Metformin', 'Lisinopril']
        },
        appointments: {
          upcoming: 1,
          completed: 5
        },
        healthMetrics: {
          vitals: {
            bloodPressure: [
              { systolic: 140, diastolic: 90, date: '2024-01-15' },
              { systolic: 135, diastolic: 88, date: '2024-01-10' },
              { systolic: 138, diastolic: 92, date: '2024-01-05' },
              { systolic: 142, diastolic: 89, date: '2023-12-28' }
            ],
            heartRate: [
              { value: 78, date: '2024-01-15' },
              { value: 82, date: '2024-01-10' },
              { value: 75, date: '2024-01-05' },
              { value: 80, date: '2023-12-28' }
            ],
            temperature: [
              { value: 98.6, date: '2024-01-15' },
              { value: 98.4, date: '2024-01-10' },
              { value: 98.7, date: '2024-01-05' }
            ],
            weight: [
              { value: 165, date: '2024-01-15' },
              { value: 167, date: '2024-01-10' },
              { value: 168, date: '2024-01-05' },
              { value: 170, date: '2023-12-28' }
            ],
            glucose: [
              { value: 145, date: '2024-01-15' },
              { value: 138, date: '2024-01-10' },
              { value: 142, date: '2024-01-05' },
              { value: 150, date: '2023-12-28' }
            ]
          },
          labResults: {
            cholesterol: [
              { total: 220, hdl: 45, ldl: 150, date: '2024-01-15' },
              { total: 215, hdl: 48, ldl: 145, date: '2023-10-15' }
            ],
            hemoglobin: [
              { value: 13.5, date: '2024-01-15' },
              { value: 13.2, date: '2023-10-15' }
            ],
            creatinine: [
              { value: 1.1, date: '2024-01-15' },
              { value: 1.0, date: '2023-10-15' }
            ]
          }
        }
      },
      {
        id: '2',
        name: 'Robert Chen',
        email: 'robert.chen@email.com',
        phone: '(555) 987-6543',
        dateOfBirth: '1978-08-22',
        lastVisit: '2023-12-18',
        isConnected: false,
        connectionStatus: 'pending',
        appointments: {
          upcoming: 0,
          completed: 2
        }
      },
      {
        id: '3',
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '(555) 456-7890',
        dateOfBirth: '1992-11-03',
        isConnected: false,
        connectionStatus: 'not_connected',
        appointments: {
          upcoming: 1,
          completed: 0
        }
      },
      {
        id: '4',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 321-0987',
        dateOfBirth: '1965-06-14',
        lastVisit: '2024-01-05',
        isConnected: true,
        connectionStatus: 'connected',
        medicalRecords: {
          conditions: ['Arthritis'],
          allergies: ['Latex'],
          medications: ['Ibuprofen']
        },
        appointments: {
          upcoming: 0,
          completed: 8
        },
        healthMetrics: {
          vitals: {
            bloodPressure: [
              { systolic: 125, diastolic: 80, date: '2024-01-05' },
              { systolic: 128, diastolic: 82, date: '2023-12-15' },
              { systolic: 130, diastolic: 85, date: '2023-11-20' }
            ],
            heartRate: [
              { value: 68, date: '2024-01-05' },
              { value: 72, date: '2023-12-15' },
              { value: 70, date: '2023-11-20' }
            ],
            temperature: [
              { value: 98.2, date: '2024-01-05' },
              { value: 98.6, date: '2023-12-15' }
            ],
            weight: [
              { value: 180, date: '2024-01-05' },
              { value: 182, date: '2023-12-15' },
              { value: 185, date: '2023-11-20' }
            ],
            glucose: [
              { value: 95, date: '2024-01-05' },
              { value: 92, date: '2023-12-15' },
              { value: 98, date: '2023-11-20' }
            ]
          },
          labResults: {
            cholesterol: [
              { total: 190, hdl: 55, ldl: 120, date: '2024-01-05' },
              { total: 185, hdl: 58, ldl: 115, date: '2023-07-10' }
            ],
            hemoglobin: [
              { value: 14.2, date: '2024-01-05' },
              { value: 14.0, date: '2023-07-10' }
            ],
            creatinine: [
              { value: 0.9, date: '2024-01-05' },
              { value: 0.8, date: '2023-07-10' }
            ]
          }
        }
      }
    ]
    setPatients(mockPatients)
    setFilteredPatients(mockPatients)
  }, [])

  // Filter patients based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone?.includes(searchQuery)
      )
      setFilteredPatients(filtered)
    }
  }, [searchQuery, patients])

  const handleConnectPatient = async (patientId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, connectionStatus: 'pending' as const }
          : patient
      ))
      
      toast.success('Connection request sent to patient')
    } catch (error) {
      toast.error('Failed to send connection request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/provider/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Connect with Patients</h1>
                <p className="text-sm text-gray-600">Search and connect with patients to access their medical information</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Dr. {session.user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPatient ? (
          <>
            {/* Search Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Patients</span>
                </CardTitle>
                <CardDescription>
                  Find patients by name, email, or phone number to establish secure connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Patients</Label>
                    <Input
                      id="search"
                      type="text"
                      placeholder="Enter patient name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connected Patients</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patients.filter(p => p.connectionStatus === 'connected').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active connections</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patients.filter(p => p.connectionStatus === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <p className="text-xs text-muted-foreground">In your network</p>
                </CardContent>
              </Card>
            </div>

            {/* Patients List */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Directory</CardTitle>
                <CardDescription>
                  {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {patient.email}
                              </span>
                              {patient.phone && (
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {patient.phone}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                              {patient.lastVisit && (
                                <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={
                            patient.connectionStatus === 'connected' ? 'default' : 
                            patient.connectionStatus === 'pending' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {patient.connectionStatus === 'connected' ? 'Connected' :
                           patient.connectionStatus === 'pending' ? 'Pending' : 
                           'Not Connected'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {patient.connectionStatus === 'not_connected' && (
                            <Button 
                              size="sm"
                              onClick={() => handleConnectPatient(patient.id)}
                              disabled={isLoading}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Connect
                            </Button>
                          )}
                          {patient.connectionStatus === 'connected' && (
                            <Button size="sm" variant="secondary">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                      <p className="text-gray-600">
                        {searchQuery ? 'Try adjusting your search criteria' : 'No patients in your network yet'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Selected Patient Detail View */
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedPatient(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient List
            </Button>

            {/* Patient Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h1>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {selectedPatient.email}
                        </span>
                        {selectedPatient.phone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {selectedPatient.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Born: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={selectedPatient.connectionStatus === 'connected' ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {selectedPatient.connectionStatus === 'connected' ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
                      ) : selectedPatient.connectionStatus === 'pending' ? (
                        <><Clock className="h-3 w-3 mr-1" /> Pending</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1" /> Not Connected</>
                      )}
                    </Badge>
                    {selectedPatient.connectionStatus === 'connected' && (
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Patient
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Upcoming</span>
                      <span className="font-semibold">{selectedPatient.appointments?.upcoming || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-semibold">{selectedPatient.appointments?.completed || 0}</span>
                    </div>
                    {selectedPatient.lastVisit && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">Last Visit</p>
                        <p className="font-medium">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5" />
                    <span>Medical Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPatient.connectionStatus === 'connected' && selectedPatient.medicalRecords ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          Conditions
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.medicalRecords.conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                          Allergies
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.medicalRecords.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Pill className="h-4 w-4 mr-1 text-green-500" />
                          Medications
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.medicalRecords.medications.map((medication, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {selectedPatient.connectionStatus === 'pending' 
                          ? 'Medical information will be available once connection is approved'
                          : 'Connect with this patient to view medical information'
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Health Charts Section - Only for Connected Patients */}
            {selectedPatient.connectionStatus === 'connected' && selectedPatient.healthMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Health Charts & Trends</span>
                  </CardTitle>
                  <CardDescription>
                    Visual representation of patient health metrics and trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Vital Signs Charts */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-blue-500" />
                        Vital Signs
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Blood Pressure Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-red-500" />
                              Blood Pressure Trend
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-32 flex items-end space-x-2">
                              {selectedPatient.healthMetrics.vitals.bloodPressure.map((reading, index) => {
                                const maxSystolic = Math.max(...selectedPatient.healthMetrics!.vitals.bloodPressure.map(r => r.systolic))
                                const systolicHeight = (reading.systolic / maxSystolic) * 100
                                const diastolicHeight = (reading.diastolic / maxSystolic) * 100
                                return (
                                  <div key={index} className="flex-1 flex flex-col items-center">
                                    <div className="w-full flex flex-col items-center space-y-1">
                                      <div 
                                        className="w-3 bg-red-500 rounded-t" 
                                        style={{ height: `${systolicHeight}%` }}
                                        title={`Systolic: ${reading.systolic}`}
                                      />
                                      <div 
                                        className="w-3 bg-orange-400 rounded-b" 
                                        style={{ height: `${diastolicHeight}%` }}
                                        title={`Diastolic: ${reading.diastolic}`}
                                      />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs font-medium text-center">
                                      {reading.systolic}/{reading.diastolic}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex items-center justify-center mt-2 space-x-4 text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded mr-1"></div>
                                <span>Systolic</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded mr-1"></div>
                                <span>Diastolic</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Heart Rate Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <Zap className="h-4 w-4 mr-1 text-blue-500" />
                              Heart Rate (BPM)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-32 flex items-end space-x-3">
                              {selectedPatient.healthMetrics.vitals.heartRate.map((reading, index) => {
                                const maxRate = Math.max(...selectedPatient.healthMetrics!.vitals.heartRate.map(r => r.value))
                                const height = (reading.value / maxRate) * 100
                                return (
                                  <div key={index} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className="w-4 bg-blue-500 rounded-t" 
                                      style={{ height: `${height}%` }}
                                      title={`${reading.value} BPM`}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs font-medium">{reading.value}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Weight Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                              Weight Trend (lbs)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-32 flex items-end space-x-3">
                              {selectedPatient.healthMetrics.vitals.weight.map((reading, index) => {
                                const maxWeight = Math.max(...selectedPatient.healthMetrics!.vitals.weight.map(r => r.value))
                                const minWeight = Math.min(...selectedPatient.healthMetrics!.vitals.weight.map(r => r.value))
                                const height = ((reading.value - minWeight) / (maxWeight - minWeight)) * 100 || 50
                                return (
                                  <div key={index} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className="w-4 bg-green-500 rounded-t" 
                                      style={{ height: `${height}%` }}
                                      title={`${reading.value} lbs`}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs font-medium">{reading.value}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Blood Glucose Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <Droplets className="h-4 w-4 mr-1 text-purple-500" />
                              Blood Glucose (mg/dL)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-32 flex items-end space-x-3">
                              {selectedPatient.healthMetrics.vitals.glucose.map((reading, index) => {
                                const maxGlucose = Math.max(...selectedPatient.healthMetrics!.vitals.glucose.map(r => r.value))
                                const height = (reading.value / maxGlucose) * 100
                                const isHigh = reading.value > 140
                                return (
                                  <div key={index} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className={`w-4 rounded-t ${isHigh ? 'bg-red-500' : 'bg-purple-500'}`}
                                      style={{ height: `${height}%` }}
                                      title={`${reading.value} mg/dL`}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className={`text-xs font-medium ${isHigh ? 'text-red-600' : ''}`}>
                                      {reading.value}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="mt-2 text-xs text-gray-600 text-center">
                              Target: &lt;140 mg/dL
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Lab Results Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                        Laboratory Results
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Cholesterol Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Cholesterol Panel</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedPatient.healthMetrics.labResults.cholesterol.map((result, index) => (
                              <div key={index} className="mb-4 last:mb-0">
                                <div className="text-xs text-gray-500 mb-2">
                                  {new Date(result.date).toLocaleDateString()}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total</span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 h-2 bg-gray-200 rounded">
                                        <div 
                                          className={`h-2 rounded ${result.total > 200 ? 'bg-red-500' : result.total > 180 ? 'bg-orange-500' : 'bg-green-500'}`}
                                          style={{ width: `${Math.min((result.total / 300) * 100, 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium w-8">{result.total}</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">HDL</span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 h-2 bg-gray-200 rounded">
                                        <div 
                                          className={`h-2 rounded ${result.hdl < 40 ? 'bg-red-500' : result.hdl > 60 ? 'bg-green-500' : 'bg-orange-500'}`}
                                          style={{ width: `${(result.hdl / 100) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium w-8">{result.hdl}</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">LDL</span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 h-2 bg-gray-200 rounded">
                                        <div 
                                          className={`h-2 rounded ${result.ldl > 130 ? 'bg-red-500' : result.ldl > 100 ? 'bg-orange-500' : 'bg-green-500'}`}
                                          style={{ width: `${Math.min((result.ldl / 200) * 100, 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium w-8">{result.ldl}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Hemoglobin Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Hemoglobin Levels</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-32 flex items-end space-x-4">
                              {selectedPatient.healthMetrics.labResults.hemoglobin.map((result, index) => {
                                const maxHgb = Math.max(...selectedPatient.healthMetrics!.labResults.hemoglobin.map(r => r.value))
                                const height = (result.value / maxHgb) * 100
                                const isLow = result.value < 12
                                return (
                                  <div key={index} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className={`w-6 rounded-t ${isLow ? 'bg-red-500' : 'bg-indigo-500'}`}
                                      style={{ height: `${height}%` }}
                                      title={`${result.value} g/dL`}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(result.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    <div className={`text-xs font-medium ${isLow ? 'text-red-600' : ''}`}>
                                      {result.value}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="mt-2 text-xs text-gray-600 text-center">
                              Normal: 12-15 g/dL
                            </div>
                          </CardContent>
                        </Card>

                        {/* Creatinine Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Creatinine Levels</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-32 flex items-end space-x-4">
                              {selectedPatient.healthMetrics.labResults.creatinine.map((result, index) => {
                                const maxCreat = Math.max(...selectedPatient.healthMetrics!.labResults.creatinine.map(r => r.value))
                                const height = (result.value / maxCreat) * 100
                                const isHigh = result.value > 1.2
                                return (
                                  <div key={index} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className={`w-6 rounded-t ${isHigh ? 'bg-red-500' : 'bg-teal-500'}`}
                                      style={{ height: `${height}%` }}
                                      title={`${result.value} mg/dL`}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(result.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    <div className={`text-xs font-medium ${isHigh ? 'text-red-600' : ''}`}>
                                      {result.value}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="mt-2 text-xs text-gray-600 text-center">
                              Normal: 0.6-1.2 mg/dL
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Health Summary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <LineChart className="h-5 w-5 mr-2 text-emerald-500" />
                        Health Trends Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-blue-800 font-medium">Blood Pressure Status</p>
                                <p className="text-xs text-blue-600">
                                  {selectedPatient.healthMetrics.vitals.bloodPressure[0]?.systolic > 140 || 
                                   selectedPatient.healthMetrics.vitals.bloodPressure[0]?.diastolic > 90 
                                    ? 'Above target range' : 'Within normal range'}
                                </p>
                              </div>
                              <div className={`p-2 rounded-full ${
                                selectedPatient.healthMetrics.vitals.bloodPressure[0]?.systolic > 140 || 
                                selectedPatient.healthMetrics.vitals.bloodPressure[0]?.diastolic > 90
                                  ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                              }`}>
                                <Heart className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-green-800 font-medium">Weight Trend</p>
                                <p className="text-xs text-green-600">
                                  {selectedPatient.healthMetrics.vitals.weight[0]?.value < 
                                   selectedPatient.healthMetrics.vitals.weight[1]?.value 
                                    ? 'Decreasing trend' : 'Stable/Increasing'}
                                </p>
                              </div>
                              <div className="p-2 rounded-full bg-green-100 text-green-600">
                                <TrendingUp className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Connection Actions */}
            {selectedPatient.connectionStatus !== 'connected' && (
              <Card>
                <CardHeader>
                  <CardTitle>Connection Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPatient.connectionStatus === 'not_connected' ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Connect with Patient</h3>
                        <p className="text-sm text-gray-600">
                          Send a connection request to access this patient's medical information
                        </p>
                      </div>
                      <Button onClick={() => handleConnectPatient(selectedPatient.id)} disabled={isLoading}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Send Connection Request
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <h3 className="font-medium">Connection Pending</h3>
                      <p className="text-sm text-gray-600">
                        Waiting for patient approval. They will receive a notification to accept your connection request.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
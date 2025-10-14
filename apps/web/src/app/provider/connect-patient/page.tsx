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
  Pill
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
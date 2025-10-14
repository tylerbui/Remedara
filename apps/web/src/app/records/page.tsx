'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  FileText,
  TestTube,
  Syringe,
  AlertTriangle,
  Shield,
  Activity,
  Eye,
  EyeOff,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Download,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Heart,
  Brain,
  Microscope
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PDFExport } from '@/components/PDFExport'
import { RecordSharing } from '@/components/RecordSharing'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalHistory?: string
}

interface LabResult {
  id: string
  testName: string
  testCode?: string
  result: string
  referenceRange?: string
  unit?: string
  status: 'COMPLETED' | 'PENDING' | 'ABNORMAL'
  resultDate: string
  labFacility: string
  flagged: boolean
  providerNotes?: string
}

interface ImagingResult {
  id: string
  studyType: string
  studyDate: string
  facility: string
  radiologist?: string
  findings: string
  impression: string
  status: 'COMPLETED' | 'PENDING' | 'PRELIMINARY'
  urgency: 'ROUTINE' | 'URGENT' | 'STAT'
}

interface Vaccination {
  id: string
  vaccineName: string
  vaccineCode?: string
  administrationDate: string
  doseNumber?: number
  totalDoses?: number
  manufacturer?: string
  lotNumber?: string
  administeredBy?: string
  nextDueDate?: string
  status: 'COMPLETED' | 'OVERDUE' | 'UPCOMING'
  sideEffects?: string
}

interface Allergy {
  id: string
  allergen: string
  allergenType: 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL' | 'OTHER'
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
  reaction: string
  onsetDate?: string
  notes?: string
  status: 'ACTIVE' | 'RESOLVED' | 'UNCONFIRMED'
}

type RecordSection = 'overview' | 'lab-imaging' | 'vaccines' | 'allergies' | 'immunizations' | 'test-results'

export default function RecordsPage() {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState<RecordSection>('overview')
  const [showMedicalInfo, setShowMedicalInfo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data - replace with API calls
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [labResults, setLabResults] = useState<LabResult[]>([])
  const [imagingResults, setImagingResults] = useState<ImagingResult[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])

  const fetchMedicalRecords = useCallback(async () => {
    setIsLoading(true)
    try {
      // Try to fetch from API, fallback to mock data
      /* 
      const response = await fetch('/api/records')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.userProfile)
        setLabResults(data.labResults)
        setImagingResults(data.imagingResults)
        setVaccinations(data.vaccinations)
        setAllergies(data.allergies || [])
        return
      }
      */
      
      // Mock data for now
      setUserProfile({
        id: '1',
        name: session?.user?.name || 'John Doe',
        email: session?.user?.email || 'john@example.com',
        phone: '(555) 123-4567',
        dateOfBirth: '1990-05-15',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        emergencyContact: 'Jane Doe',
        emergencyPhone: '(555) 987-6543',
        medicalHistory: 'Hypertension, Type 2 Diabetes'
      })

      setLabResults([
        {
          id: '1',
          testName: 'Complete Blood Count (CBC)',
          testCode: 'CBC',
          result: 'Normal',
          referenceRange: '4.5-11.0 x10³/µL',
          unit: 'x10³/µL',
          status: 'COMPLETED',
          resultDate: '2024-01-15',
          labFacility: 'LabCorp',
          flagged: false,
          providerNotes: 'All values within normal limits'
        },
        {
          id: '2',
          testName: 'Hemoglobin A1C',
          testCode: 'HbA1c',
          result: '7.2%',
          referenceRange: '<7.0%',
          unit: '%',
          status: 'ABNORMAL',
          resultDate: '2024-01-15',
          labFacility: 'LabCorp',
          flagged: true,
          providerNotes: 'Slightly elevated - discuss medication adjustment'
        }
      ])

      setImagingResults([
        {
          id: '1',
          studyType: 'Chest X-Ray',
          studyDate: '2024-01-10',
          facility: 'Regional Imaging Center',
          radiologist: 'Dr. Smith',
          findings: 'Clear lung fields, no acute abnormalities',
          impression: 'Normal chest X-ray',
          status: 'COMPLETED',
          urgency: 'ROUTINE'
        }
      ])

      setVaccinations([
        {
          id: '1',
          vaccineName: 'COVID-19 mRNA Vaccine',
          vaccineCode: 'COVID19',
          administrationDate: '2023-09-15',
          doseNumber: 3,
          totalDoses: 3,
          manufacturer: 'Pfizer-BioNTech',
          administeredBy: 'CVS Pharmacy',
          nextDueDate: '2024-09-15',
          status: 'COMPLETED',
          sideEffects: 'Mild soreness at injection site'
        },
        {
          id: '2',
          vaccineName: 'Influenza Vaccine',
          vaccineCode: 'FLU',
          administrationDate: '2023-10-01',
          doseNumber: 1,
          totalDoses: 1,
          manufacturer: 'Sanofi',
          administeredBy: 'Primary Care Clinic',
          nextDueDate: '2024-10-01',
          status: 'OVERDUE'
        }
      ])

      setAllergies([
        {
          id: '1',
          allergen: 'Penicillin',
          allergenType: 'MEDICATION',
          severity: 'SEVERE',
          reaction: 'Anaphylaxis, difficulty breathing',
          onsetDate: '2010-03-15',
          notes: 'Avoid all penicillin-based antibiotics',
          status: 'ACTIVE'
        },
        {
          id: '2',
          allergen: 'Peanuts',
          allergenType: 'FOOD',
          severity: 'MODERATE',
          reaction: 'Hives, stomach upset',
          onsetDate: '2005-08-20',
          notes: 'Can tolerate trace amounts',
          status: 'ACTIVE'
        }
      ])

    } catch (error) {
      console.error('Error fetching medical records:', error)
      toast.error('Failed to load medical records')
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.name, session?.user?.email])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    // Only patients should access records
    if (session.user.role !== 'PATIENT') {
      redirect('/login')
    }

    fetchMedicalRecords()
  }, [session, status, fetchMedicalRecords])

  const sidebarNavigation = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'lab-imaging', label: 'Lab & Imaging', icon: TestTube },
    { id: 'vaccines', label: 'Vaccines', icon: Syringe },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'immunizations', label: 'Immunizations', icon: Shield },
    { id: 'test-results', label: 'Test Results', icon: Activity }
  ] as const

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LIFE_THREATENING': return 'bg-red-100 text-red-800 border-red-200'
      case 'SEVERE': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'MILD': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ABNORMAL': return 'bg-red-100 text-red-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'UPCOMING': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderUserInfoCard = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{userProfile?.name}</CardTitle>
              <CardDescription>{userProfile?.email}</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMedicalInfo(!showMedicalInfo)}
          >
            {showMedicalInfo ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showMedicalInfo ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </CardHeader>
      
      {showMedicalInfo && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{userProfile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Born: {userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{userProfile?.address ? `${userProfile.address}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}` : 'Not provided'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Emergency Contact:</span>
                <div className="text-gray-600 ml-4">
                  {userProfile?.emergencyContact || 'Not provided'}
                  {userProfile?.emergencyPhone && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{userProfile.emergencyPhone}</span>
                    </div>
                  )}
                </div>
              </div>
              {userProfile?.medicalHistory && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Medical History:</span>
                  <div className="text-gray-600 ml-4 mt-1">
                    {userProfile.medicalHistory}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medical Records Overview</h2>
        {userProfile && (
          <PDFExport
            userProfile={userProfile}
            labResults={labResults}
            imagingResults={imagingResults}
            vaccinations={vaccinations}
            allergies={allergies}
            selectedSections={['all']}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labResults.length}</div>
            <p className="text-xs text-muted-foreground">
              {labResults.filter(r => r.flagged).length} flagged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vaccinations.length}</div>
            <p className="text-xs text-muted-foreground">
              {vaccinations.filter(v => v.status === 'OVERDUE').length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Allergies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allergies.filter(a => a.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">
              {allergies.filter(a => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING').length} severe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imaging Studies</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imagingResults.length}</div>
            <p className="text-xs text-muted-foreground">
              Last: {imagingResults[0] ? new Date(imagingResults[0].studyDate).toLocaleDateString() : 'None'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Lab Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Recent Lab Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {labResults.slice(0, 3).map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{result.testName}</p>
                  <p className="text-sm text-gray-600">{new Date(result.resultDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                  {result.flagged && (
                    <AlertCircle className="h-4 w-4 text-orange-500 ml-2 inline" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Allergies</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allergies.filter(a => a.status === 'ACTIVE').map((allergy) => (
              <div key={allergy.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{allergy.allergen}</p>
                  <p className="text-sm text-gray-600">{allergy.allergenType}</p>
                </div>
                <Badge className={getSeverityColor(allergy.severity)}>
                  {allergy.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Record Sharing */}
      <Card>
        <CardContent className="pt-6">
          <RecordSharing 
            userProfile={{
              id: userProfile?.id || '',
              name: userProfile?.name || '',
              email: userProfile?.email || ''
            }}
            availableRecordTypes={[
              { id: 'lab-results', label: 'Lab Results', count: labResults.length },
              { id: 'imaging', label: 'Imaging Results', count: imagingResults.length },
              { id: 'vaccines', label: 'Vaccinations', count: vaccinations.length },
              { id: 'allergies', label: 'Allergies', count: allergies.length }
            ]}
            onShare={async (shareData) => {
              const response = await fetch('/api/records/share', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(shareData)
              })
              
              if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to share records')
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )

  const renderLabImaging = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lab & Imaging Results</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ABNORMAL">Abnormal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lab Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Microscope className="h-5 w-5" />
            <span>Laboratory Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {labResults.map((result) => (
            <div key={result.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{result.testName}</h3>
                  <p className="text-sm text-gray-600">
                    {result.labFacility} • {new Date(result.resultDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                  {result.flagged && (
                    <Badge variant="destructive">Flagged</Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Result:</span>
                  <p className="text-gray-900">{result.result} {result.unit}</p>
                </div>
                {result.referenceRange && (
                  <div>
                    <span className="font-medium">Reference Range:</span>
                    <p className="text-gray-600">{result.referenceRange}</p>
                  </div>
                )}
                {result.providerNotes && (
                  <div>
                    <span className="font-medium">Provider Notes:</span>
                    <p className="text-gray-600">{result.providerNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Imaging Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Imaging Studies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imagingResults.map((result) => (
            <div key={result.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{result.studyType}</h3>
                  <p className="text-sm text-gray-600">
                    {result.facility} • {new Date(result.studyDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                  <Badge variant="outline">
                    {result.urgency}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                {result.radiologist && (
                  <div>
                    <span className="font-medium">Radiologist:</span>
                    <p className="text-gray-900">{result.radiologist}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Findings:</span>
                  <p className="text-gray-900 mt-1">{result.findings}</p>
                </div>
                <div>
                  <span className="font-medium">Impression:</span>
                  <p className="text-gray-900 mt-1">{result.impression}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderVaccines = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vaccination Records</h2>
        {userProfile && (
          <PDFExport
            userProfile={userProfile}
            labResults={labResults}
            imagingResults={imagingResults}
            vaccinations={vaccinations}
            allergies={allergies}
            selectedSections={['vaccines']}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vaccinations.map((vaccine) => (
          <Card key={vaccine.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    vaccine.status === 'COMPLETED' ? 'bg-green-500' :
                    vaccine.status === 'OVERDUE' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <h3 className="font-semibold">{vaccine.vaccineName}</h3>
                    <p className="text-sm text-gray-600">
                      {vaccine.administeredBy} • {new Date(vaccine.administrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(vaccine.status)}>
                  {vaccine.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Dose:</span>
                  <p>{vaccine.doseNumber} of {vaccine.totalDoses}</p>
                </div>
                <div>
                  <span className="font-medium">Manufacturer:</span>
                  <p>{vaccine.manufacturer}</p>
                </div>
                {vaccine.nextDueDate && (
                  <div>
                    <span className="font-medium">Next Due:</span>
                    <p className={new Date(vaccine.nextDueDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                      {new Date(vaccine.nextDueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {vaccine.sideEffects && (
                <div className="mt-4 pt-4 border-t">
                  <span className="font-medium text-sm">Side Effects:</span>
                  <p className="text-sm text-gray-600 mt-1">{vaccine.sideEffects}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAllergies = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Allergies & Sensitivities</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {allergies.map((allergy) => (
          <Card key={allergy.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    allergy.severity === 'LIFE_THREATENING' ? 'text-red-600' :
                    allergy.severity === 'SEVERE' ? 'text-orange-500' :
                    allergy.severity === 'MODERATE' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-lg">{allergy.allergen}</h3>
                    <p className="text-sm text-gray-600">{allergy.allergenType.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(allergy.severity)}>
                    {allergy.severity.replace('_', ' ')}
                  </Badge>
                  <Badge variant={allergy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {allergy.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-medium text-sm">Reaction:</span>
                  <p className="text-gray-900 mt-1">{allergy.reaction}</p>
                </div>
                
                {allergy.onsetDate && (
                  <div>
                    <span className="font-medium text-sm">Onset Date:</span>
                    <p className="text-gray-600">{new Date(allergy.onsetDate).toLocaleDateString()}</p>
                  </div>
                )}

                {allergy.notes && (
                  <div>
                    <span className="font-medium text-sm">Notes:</span>
                    <p className="text-gray-600 mt-1">{allergy.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'lab-imaging':
        return renderLabImaging()
      case 'vaccines':
        return renderVaccines()
      case 'allergies':
        return renderAllergies()
      case 'immunizations':
        return renderVaccines() // Same as vaccines for now
      case 'test-results':
        return renderLabImaging() // Same as lab results for now
      default:
        return renderOverview()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-sm text-gray-600 mt-1">Your health information</p>
          </div>
          
          <nav className="mt-6">
            {sidebarNavigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as RecordSection)}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* User Info Card */}
          {userProfile && renderUserInfoCard()}
          
          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
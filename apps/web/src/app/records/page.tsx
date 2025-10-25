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
  Microscope,
  Pill,
  FileStack,
  FolderOpen,
  ClipboardCheck,
  BarChart3,
  Stethoscope,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PDFExport } from '@/components/PDFExport'
import { RecordSharing } from '@/components/RecordSharing'
import EnhancedLabResult from '@/components/EnhancedLabResult'
import Link from 'next/link'

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

interface Prescription {
  id: string
  medicationName: string
  genericName?: string
  dosage: string
  frequency: string
  route: 'ORAL' | 'INJECTION' | 'TOPICAL' | 'INHALATION' | 'OTHER'
  prescribedDate: string
  startDate: string
  endDate?: string
  prescriber: string
  pharmacy?: string
  refillsRemaining: number
  totalRefills: number
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED' | 'PENDING'
  instructions?: string
  sideEffects?: string
  cost?: string
}

interface VitalSigns {
  id: string
  date: string
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  temperature?: number
  weight?: number
  height?: number
  bmi?: number
  oxygenSaturation?: number
  recordedBy?: string
}

interface MedicalForm {
  id: string
  formName: string
  formType: 'INTAKE' | 'CONSENT' | 'INSURANCE' | 'HIPAA' | 'REFERRAL' | 'OTHER'
  completedDate?: string
  dueDate?: string
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE'
  description?: string
  requiredBy?: string
}

interface MedicalDocument {
  id: string
  documentName: string
  documentType: 'REPORT' | 'REFERRAL' | 'INSURANCE' | 'IMAGE' | 'LAB' | 'CORRESPONDENCE' | 'OTHER'
  uploadDate: string
  fileSize?: string
  provider?: string
  description?: string
  tags?: string[]
  url?: string
}

type RecordSection = 'patient-details' | 'allergies' | 'lab-imaging' | 'immunizations' | 'prescriptions' | 'health-summary' | 'forms' | 'documents'

export default function RecordsPage() {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState<RecordSection>('patient-details')
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
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([])
  const [medicalForms, setMedicalForms] = useState<MedicalForm[]>([])
  const [medicalDocuments, setMedicalDocuments] = useState<MedicalDocument[]>([])

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

      setPrescriptions([
        {
          id: '1',
          medicationName: 'Metformin',
          genericName: 'Metformin HCl',
          dosage: '500mg',
          frequency: 'Twice daily',
          route: 'ORAL',
          prescribedDate: '2024-01-10',
          startDate: '2024-01-12',
          prescriber: 'Dr. Sarah Johnson',
          pharmacy: 'CVS Pharmacy',
          refillsRemaining: 3,
          totalRefills: 5,
          status: 'ACTIVE',
          instructions: 'Take with meals to reduce stomach upset',
          cost: '$15.99'
        },
        {
          id: '2',
          medicationName: 'Lisinopril',
          genericName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          route: 'ORAL',
          prescribedDate: '2024-01-10',
          startDate: '2024-01-12',
          prescriber: 'Dr. Sarah Johnson',
          pharmacy: 'CVS Pharmacy',
          refillsRemaining: 2,
          totalRefills: 6,
          status: 'ACTIVE',
          instructions: 'Take in the morning',
          cost: '$8.50'
        },
        {
          id: '3',
          medicationName: 'Amoxicillin',
          genericName: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          route: 'ORAL',
          prescribedDate: '2023-12-15',
          startDate: '2023-12-16',
          endDate: '2023-12-26',
          prescriber: 'Dr. Michael Brown',
          pharmacy: 'Walgreens',
          refillsRemaining: 0,
          totalRefills: 0,
          status: 'COMPLETED',
          instructions: 'Complete full course even if feeling better'
        }
      ])

      setVitalSigns([
        {
          id: '1',
          date: '2024-01-15',
          bloodPressureSystolic: 128,
          bloodPressureDiastolic: 82,
          heartRate: 72,
          temperature: 98.6,
          weight: 175,
          height: 70,
          bmi: 25.1,
          oxygenSaturation: 98,
          recordedBy: 'Nurse Jennifer'
        },
        {
          id: '2',
          date: '2023-12-10',
          bloodPressureSystolic: 132,
          bloodPressureDiastolic: 86,
          heartRate: 68,
          temperature: 98.4,
          weight: 178,
          height: 70,
          bmi: 25.5,
          oxygenSaturation: 99,
          recordedBy: 'Nurse Michael'
        }
      ])

      setMedicalForms([
        {
          id: '1',
          formName: 'Annual Physical Intake Form',
          formType: 'INTAKE',
          completedDate: '2024-01-10',
          status: 'COMPLETED',
          description: 'Comprehensive health questionnaire for annual checkup',
          requiredBy: 'Dr. Sarah Johnson'
        },
        {
          id: '2',
          formName: 'HIPAA Authorization',
          formType: 'HIPAA',
          completedDate: '2024-01-10',
          status: 'COMPLETED',
          description: 'Authorization for release of health information'
        },
        {
          id: '3',
          formName: 'Insurance Verification Form',
          formType: 'INSURANCE',
          dueDate: '2024-02-15',
          status: 'PENDING',
          description: 'Annual insurance information update required'
        }
      ])

      setMedicalDocuments([
        {
          id: '1',
          documentName: 'Cardiology Consultation Report',
          documentType: 'REPORT',
          uploadDate: '2024-01-12',
          fileSize: '2.5 MB',
          provider: 'Dr. Robert Chen, Cardiologist',
          description: 'Heart health assessment and recommendations',
          tags: ['cardiology', 'consultation', 'heart']
        },
        {
          id: '2',
          documentName: 'Chest X-Ray Images',
          documentType: 'IMAGE',
          uploadDate: '2024-01-10',
          fileSize: '8.3 MB',
          provider: 'Regional Imaging Center',
          description: 'Digital chest X-ray images',
          tags: ['imaging', 'chest', 'x-ray']
        },
        {
          id: '3',
          documentName: 'Insurance Card Copy',
          documentType: 'INSURANCE',
          uploadDate: '2024-01-05',
          fileSize: '156 KB',
          description: 'Front and back of insurance card',
          tags: ['insurance', 'coverage']
        },
        {
          id: '4',
          documentName: 'Referral to Endocrinologist',
          documentType: 'REFERRAL',
          uploadDate: '2024-01-08',
          fileSize: '89 KB',
          provider: 'Dr. Sarah Johnson',
          description: 'Referral for diabetes management consultation',
          tags: ['referral', 'endocrinology', 'diabetes']
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
    { id: 'patient-details', label: 'Patient Details', icon: User, description: 'Medical records overview' },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle, description: 'Allergen information' },
    { id: 'lab-imaging', label: 'Lab/Imaging Results', icon: TestTube, description: 'Test and scan results' },
    { id: 'immunizations', label: 'Immunizations', icon: Syringe, description: 'Vaccine records' },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, description: 'Medication history' },
    { id: 'health-summary', label: 'Health Summary', icon: BarChart3, description: 'Health trends & metrics' },
    { id: 'forms', label: 'Forms', icon: ClipboardCheck, description: 'Medical forms & intake' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, description: 'Medical documents' }
  ] as const

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LIFE_THREATENING': return 'bg-red-100 text-red-800 border-red-200'
      case 'SEVERE': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'MILD': return 'bg-[#E8EBE4] text-[#2D4A3E] border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-[#E8EBE4] text-[#2D4A3E]'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ABNORMAL': return 'bg-red-100 text-red-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'UPCOMING': return 'bg-[#E8EBE4] text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderUserInfoCard = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#E8EBE4] rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-[#5A7965]" />
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

  const renderPatientDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patient Details & Medical Records</h2>
        <div className="flex items-center space-x-2">
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
      
      {/* Comprehensive Health Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Health Profile Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Current Health Status */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Current Health Status</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Pressure:</span>
                  <span className="font-medium">
                    {vitalSigns[0] ? `${vitalSigns[0].bloodPressureSystolic}/${vitalSigns[0].bloodPressureDiastolic}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heart Rate:</span>
                  <span className="font-medium">
                    {vitalSigns[0] ? `${vitalSigns[0].heartRate} bpm` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BMI:</span>
                  <span className="font-medium">
                    {vitalSigns[0] ? vitalSigns[0].bmi : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Visit:</span>
                  <span className="font-medium">
                    {vitalSigns[0] ? new Date(vitalSigns[0].date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>Active Conditions</span>
              </h4>
              <div className="space-y-2">
                {userProfile?.medicalHistory ? (
                  userProfile.medicalHistory.split(', ').map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-sm">{condition}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No active conditions recorded</p>
                )}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Pill className="h-4 w-4 text-blue-500" />
                <span>Current Medications</span>
              </h4>
              <div className="space-y-2">
                {prescriptions
                  .filter(p => p.status === 'ACTIVE')
                  .slice(0, 3)
                  .map((prescription) => (
                    <div key={prescription.id} className="text-sm">
                      <div className="font-medium">{prescription.medicationName}</div>
                      <div className="text-gray-600">{prescription.dosage} - {prescription.frequency}</div>
                    </div>
                  ))
                }
                {prescriptions.filter(p => p.status === 'ACTIVE').length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{prescriptions.filter(p => p.status === 'ACTIVE').length - 3} more medications
                  </p>
                )}
                {prescriptions.filter(p => p.status === 'ACTIVE').length === 0 && (
                  <p className="text-sm text-gray-500">No active medications</p>
                )}
              </div>
            </div>

            {/* Critical Allergies */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Critical Allergies</span>
              </h4>
              <div className="space-y-2">
                {allergies
                  .filter(a => a.status === 'ACTIVE' && (a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING'))
                  .map((allergy) => (
                    <div key={allergy.id} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        allergy.severity === 'LIFE_THREATENING' ? 'bg-red-600' : 'bg-orange-500'
                      }`} />
                      <div className="text-sm">
                        <span className="font-medium">{allergy.allergen}</span>
                        <span className="text-gray-600 ml-1">({allergy.allergenType.toLowerCase()})</span>
                      </div>
                    </div>
                  ))
                }
                {allergies.filter(a => a.status === 'ACTIVE' && (a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING')).length === 0 && (
                  <p className="text-sm text-gray-500">No critical allergies recorded</p>
                )}
              </div>
            </div>

            {/* Upcoming Care */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>Upcoming Care</span>
              </h4>
              <div className="space-y-2">
                {vaccinations
                  .filter(v => v.status === 'OVERDUE' || (v.nextDueDate && new Date(v.nextDueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)))
                  .slice(0, 3)
                  .map((vaccine) => (
                    <div key={vaccine.id} className="text-sm">
                      <div className={`font-medium ${
                        vaccine.status === 'OVERDUE' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {vaccine.vaccineName} {vaccine.status === 'OVERDUE' ? '(Overdue)' : '(Due Soon)'}
                      </div>
                      <div className="text-gray-600">
                        {vaccine.nextDueDate ? new Date(vaccine.nextDueDate).toLocaleDateString() : 'Date TBD'}
                      </div>
                    </div>
                  ))
                }
                {medicalForms.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').slice(0, 2).map((form) => (
                  <div key={form.id} className="text-sm">
                    <div className={`font-medium ${
                      form.status === 'OVERDUE' ? 'text-red-600' : 'text-[#5A7965]'
                    }`}>
                      {form.formName} {form.status === 'OVERDUE' ? '(Overdue)' : '(Pending)'}
                    </div>
                    <div className="text-gray-600">
                      {form.dueDate ? `Due: ${new Date(form.dueDate).toLocaleDateString()}` : 'Complete soon'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span>Care Team</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium">Primary Care</div>
                  <div className="text-gray-600">Dr. Sarah Johnson</div>
                </div>
                <div>
                  <div className="font-medium">Cardiology</div>
                  <div className="text-gray-600">Dr. Robert Chen</div>
                </div>
                <div>
                  <div className="font-medium">Endocrinology</div>
                  <div className="text-gray-600">Referred - Pending</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {labResults.map((result, index) => {
            // Create enhanced lab result with trend data (simulated)
            const enhancedResult = {
              ...result,
              trend: index === 0 ? 'up' as const : index === 1 ? 'down' as const : 'stable' as const,
              previousValue: index === 0 ? '85' : index === 1 ? '220' : result.result,
              daysSinceLast: 30 + (index * 15)
            }
            
            // Sample patient factors (in real app, get from user profile)
            const patientFactors = {
              age: userProfile?.dateOfBirth ? 
                Math.floor((new Date().getTime() - new Date(userProfile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 35,
              medications: ['Lisinopril', 'Metformin', 'Vitamin D'],
              conditions: userProfile?.medicalHistory ? userProfile.medicalHistory.split(', ') : ['Hypertension', 'Type 2 Diabetes'],
              lifestyle: ['Regular exercise', 'Non-smoker']
            }
            
            return (
              <EnhancedLabResult
                key={result.id}
                result={enhancedResult}
                patientFactors={patientFactors}
                showTrends={true}
                showFactors={true}
              />
            )
          })}
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
                    vaccine.status === 'COMPLETED' ? 'bg-[#FAF8F3]0' :
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

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Prescriptions & Medications</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search medications..."
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
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5" />
            <span>Active Medications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptions
            .filter(p => p.status === 'ACTIVE')
            .map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{prescription.medicationName}</h3>
                    {prescription.genericName && (
                      <p className="text-sm text-gray-600">Generic: {prescription.genericName}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Prescribed by {prescription.prescriber} • {new Date(prescription.prescribedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status}
                    </Badge>
                    {prescription.refillsRemaining === 0 && prescription.status === 'ACTIVE' && (
                      <Badge variant="destructive">No Refills</Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Dosage & Frequency:</span>
                    <p className="text-gray-900">{prescription.dosage} - {prescription.frequency}</p>
                    <p className="text-gray-600">Route: {prescription.route}</p>
                  </div>
                  <div>
                    <span className="font-medium">Refills:</span>
                    <p className="text-gray-900">{prescription.refillsRemaining} of {prescription.totalRefills} remaining</p>
                    {prescription.pharmacy && (
                      <p className="text-gray-600">Pharmacy: {prescription.pharmacy}</p>
                    )}
                  </div>
                  <div>
                    {prescription.cost && (
                      <div>
                        <span className="font-medium">Cost:</span>
                        <p className="text-gray-900">{prescription.cost}</p>
                      </div>
                    )}
                    {prescription.endDate && (
                      <div>
                        <span className="font-medium">End Date:</span>
                        <p className="text-gray-600">{new Date(prescription.endDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="font-medium text-sm">Instructions:</span>
                    <p className="text-gray-700 mt-1">{prescription.instructions}</p>
                  </div>
                )}

                {prescription.sideEffects && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Side Effects:</span>
                    <p className="text-gray-600 mt-1">{prescription.sideEffects}</p>
                  </div>
                )}
              </div>
            ))
          }
        </CardContent>
      </Card>

      {/* Medication History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Medication History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptions
            .filter(p => p.status !== 'ACTIVE')
            .map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{prescription.medicationName}</h3>
                    <p className="text-sm text-gray-600">
                      {prescription.dosage} - {prescription.frequency}
                    </p>
                  </div>
                  <Badge className={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Prescribed:</span> {new Date(prescription.prescribedDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {new Date(prescription.startDate).toLocaleDateString()} - {prescription.endDate ? new Date(prescription.endDate).toLocaleDateString() : 'Ongoing'}
                  </div>
                </div>
              </div>
            ))
          }
        </CardContent>
      </Card>
    </div>
  )

  const renderHealthSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Health Summary</h2>
        <Button variant="outline" size="sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Trends
        </Button>
      </div>

      {/* Key Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest BP</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {vitalSigns[0] && (
              <>
                <div className="text-2xl font-bold">
                  {vitalSigns[0].bloodPressureSystolic}/{vitalSigns[0].bloodPressureDiastolic}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(vitalSigns[0].date).toLocaleDateString()}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            {vitalSigns[0] && (
              <>
                <div className="text-2xl font-bold">{vitalSigns[0].heartRate} bpm</div>
                <p className="text-xs text-muted-foreground">
                  {new Date(vitalSigns[0].date).toLocaleDateString()}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {vitalSigns[0] && (
              <>
                <div className="text-2xl font-bold">{vitalSigns[0].weight} lbs</div>
                <p className="text-xs text-muted-foreground">
                  BMI: {vitalSigns[0].bmi}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O2 Saturation</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {vitalSigns[0] && (
              <>
                <div className="text-2xl font-bold">{vitalSigns[0].oxygenSaturation}%</div>
                <p className="text-xs text-muted-foreground">
                  Normal range
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Recent Vital Signs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vitalSigns.map((vital) => (
              <div key={vital.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{new Date(vital.date).toLocaleDateString()}</h3>
                    <p className="text-sm text-gray-600">
                      Recorded by: {vital.recordedBy || 'Healthcare Provider'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {vital.bloodPressureSystolic && vital.bloodPressureDiastolic && (
                    <div>
                      <span className="font-medium text-gray-700">Blood Pressure:</span>
                      <p className="text-gray-900">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} mmHg</p>
                    </div>
                  )}
                  {vital.heartRate && (
                    <div>
                      <span className="font-medium text-gray-700">Heart Rate:</span>
                      <p className="text-gray-900">{vital.heartRate} bpm</p>
                    </div>
                  )}
                  {vital.temperature && (
                    <div>
                      <span className="font-medium text-gray-700">Temperature:</span>
                      <p className="text-gray-900">{vital.temperature}°F</p>
                    </div>
                  )}
                  {vital.oxygenSaturation && (
                    <div>
                      <span className="font-medium text-gray-700">O2 Saturation:</span>
                      <p className="text-gray-900">{vital.oxygenSaturation}%</p>
                    </div>
                  )}
                  {vital.weight && (
                    <div>
                      <span className="font-medium text-gray-700">Weight:</span>
                      <p className="text-gray-900">{vital.weight} lbs</p>
                    </div>
                  )}
                  {vital.height && (
                    <div>
                      <span className="font-medium text-gray-700">Height:</span>
                      <p className="text-gray-900">{vital.height} in</p>
                    </div>
                  )}
                  {vital.bmi && (
                    <div>
                      <span className="font-medium text-gray-700">BMI:</span>
                      <p className="text-gray-900">{vital.bmi}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts & Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Health Alerts & Reminders</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-orange-400 bg-orange-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-orange-800">
                  <strong>Vaccination Reminder:</strong> Flu vaccine is overdue. Schedule your annual vaccination.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-red-400 bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  <strong>Lab Results:</strong> HbA1c levels are elevated. Discuss with your provider about medication adjustments.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-blue-400 bg-[#E8EBE4] p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Prescription Alert:</strong> Metformin refill needed soon. Contact your pharmacy.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Medical Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded">
              <TestTube className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Lab Results Received</p>
                <p className="text-sm text-gray-600">Complete Blood Count - January 15, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded">
              <Pill className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">New Prescription</p>
                <p className="text-sm text-gray-600">Metformin prescribed - January 10, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded">
              <Activity className="h-5 w-5 text-[#6B8E7D]" />
              <div>
                <p className="font-medium">Imaging Study</p>
                <p className="text-sm text-gray-600">Chest X-Ray completed - January 10, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded">
              <User className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Provider Visit</p>
                <p className="text-sm text-gray-600">Annual Physical with Dr. Johnson - January 8, 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderForms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medical Forms</h2>
        <Button variant="outline" size="sm">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          New Form
        </Button>
      </div>

      {/* Form Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalForms.filter(f => f.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">Forms completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalForms.filter(f => f.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalForms.filter(f => f.status === 'OVERDUE').length}
            </div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span>Action Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicalForms
            .filter(form => form.status === 'PENDING' || form.status === 'OVERDUE')
            .map((form) => (
              <div key={form.id} className={`border rounded-lg p-4 ${
                form.status === 'OVERDUE' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{form.formName}</h3>
                    <p className="text-sm text-gray-600">{form.description}</p>
                    {form.requiredBy && (
                      <p className="text-sm text-gray-500">Required by: {form.requiredBy}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(form.status)}>
                      {form.status}
                    </Badge>
                    <Button size="sm">
                      Complete Form
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Form Type:</span>
                    <p className="text-gray-900">{form.formType.replace('_', ' ')}</p>
                  </div>
                  {form.dueDate && (
                    <div>
                      <span className="font-medium">Due Date:</span>
                      <p className={`${
                        new Date(form.dueDate) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-900'
                      }`}>
                        {new Date(form.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
          {medicalForms.filter(form => form.status === 'PENDING' || form.status === 'OVERDUE').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>All forms are up to date!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Completed Forms</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicalForms
            .filter(form => form.status === 'COMPLETED')
            .map((form) => (
              <div key={form.id} className="border rounded-lg p-4 bg-[#FAF8F3] border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{form.formName}</h3>
                    <p className="text-sm text-gray-600">{form.description}</p>
                    {form.requiredBy && (
                      <p className="text-sm text-gray-500">Required by: {form.requiredBy}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(form.status)}>
                      {form.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Form Type:</span>
                    <p className="text-gray-900">{form.formType.replace('_', ' ')}</p>
                  </div>
                  {form.completedDate && (
                    <div>
                      <span className="font-medium">Completed:</span>
                      <p className="text-gray-900">{new Date(form.completedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className="text-green-700 font-medium">On file</p>
                  </div>
                </div>
              </div>
            ))
          }
        </CardContent>
      </Card>

      {/* Form Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileStack className="h-5 w-5" />
            <span>Form Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Patient Intake</h3>
                  <p className="text-sm text-gray-600">Initial patient information</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">HIPAA & Privacy</h3>
                  <p className="text-sm text-gray-600">Privacy authorizations</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-[#6B8E7D]" />
                <div>
                  <h3 className="font-semibold">Insurance</h3>
                  <p className="text-sm text-gray-600">Coverage information</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <ClipboardCheck className="h-8 w-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold">Consent Forms</h3>
                  <p className="text-sm text-gray-600">Treatment consents</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">Referrals</h3>
                  <p className="text-sm text-gray-600">Specialist referrals</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <FileStack className="h-8 w-8 text-gray-500" />
                <div>
                  <h3 className="font-semibold">Other Forms</h3>
                  <p className="text-sm text-gray-600">Miscellaneous forms</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medical Documents</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="REPORT">Reports</SelectItem>
              <SelectItem value="REFERRAL">Referrals</SelectItem>
              <SelectItem value="INSURANCE">Insurance</SelectItem>
              <SelectItem value="IMAGE">Images</SelectItem>
              <SelectItem value="LAB">Lab Results</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicalDocuments.length}</div>
            <p className="text-xs text-muted-foreground">Files stored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalDocuments.filter(d => d.documentType === 'REPORT').length}
            </div>
            <p className="text-xs text-muted-foreground">Medical reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Activity className="h-4 w-4 text-[#6B8E7D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalDocuments.filter(d => d.documentType === 'IMAGE').length}
            </div>
            <p className="text-xs text-muted-foreground">X-rays, scans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <FileStack className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalDocuments.filter(d => d.documentType === 'REFERRAL').length}
            </div>
            <p className="text-xs text-muted-foreground">Specialist referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicalDocuments
            .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
            .slice(0, 5)
            .map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    document.documentType === 'REPORT' ? 'bg-[#E8EBE4] text-[#4A7C59]' :
                    document.documentType === 'IMAGE' ? 'bg-[#E8EBE4] text-[#6B8E7D]' :
                    document.documentType === 'INSURANCE' ? 'bg-[#E8EBE4] text-[#5A7965]' :
                    document.documentType === 'REFERRAL' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{document.documentName}</h3>
                    <p className="text-sm text-gray-600">
                      {document.provider && `${document.provider} • `}
                      {new Date(document.uploadDate).toLocaleDateString()}
                      {document.fileSize && ` • ${document.fileSize}`}
                    </p>
                    {document.description && (
                      <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {document.documentType.replace('_', ' ')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          }
        </CardContent>
      </Card>

      {/* Documents by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Medical Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicalDocuments
              .filter(d => d.documentType === 'REPORT')
              .map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{document.documentName}</h4>
                    <p className="text-sm text-gray-600">
                      {document.provider} • {new Date(document.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        {/* Imaging Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-[#6B8E7D]" />
              <span>Imaging & Scans</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicalDocuments
              .filter(d => d.documentType === 'IMAGE')
              .map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{document.documentName}</h4>
                    <p className="text-sm text-gray-600">
                      {document.provider} • {new Date(document.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>

      {/* All Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>All Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicalDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    document.documentType === 'REPORT' ? 'bg-[#E8EBE4] text-[#4A7C59]' :
                    document.documentType === 'IMAGE' ? 'bg-[#E8EBE4] text-[#6B8E7D]' :
                    document.documentType === 'INSURANCE' ? 'bg-[#E8EBE4] text-[#5A7965]' :
                    document.documentType === 'REFERRAL' ? 'bg-orange-100 text-orange-600' :
                    document.documentType === 'LAB' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{document.documentName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Type: {document.documentType.replace('_', ' ')}</span>
                      <span>Size: {document.fileSize || 'Unknown'}</span>
                      <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                    {document.provider && (
                      <p className="text-sm text-gray-500 mt-1">Provider: {document.provider}</p>
                    )}
                    {document.description && (
                      <p className="text-sm text-gray-700 mt-2">{document.description}</p>
                    )}
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileStack className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
      case 'patient-details':
        return renderPatientDetails()
      case 'allergies':
        return renderAllergies()
      case 'lab-imaging':
        return renderLabImaging()
      case 'immunizations':
        return renderVaccines()
      case 'prescriptions':
        return renderPrescriptions()
      case 'health-summary':
        return renderHealthSummary()
      case 'forms':
        return renderForms()
      case 'documents':
        return renderDocuments()
      default:
        return renderPatientDetails()
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
            
            {/* Back to Dashboard Button - Only show for patients */}
            {session?.user.role === 'PATIENT' && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="mt-4 w-full justify-start"
              >
                <Link href="/patient/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            )}
          </div>
          
          <nav className="mt-6">
            {sidebarNavigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as RecordSection)}
                  className={`w-full flex items-start space-x-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#E8EBE4] border-r-2 border-[#5A7965] text-[#2D4A3E]'
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
          {/* User Info Card */}
          {userProfile && renderUserInfoCard()}
          
          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
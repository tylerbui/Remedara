'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Pill, 
  Search, 
  Filter, 
  Calendar,
  User,
  Stethoscope,
  Clock,
  FileText,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Archive
} from 'lucide-react'
import Link from 'next/link'

interface PastPrescription {
  id: string
  medicationName: string
  genericName?: string
  strength: string
  dosage: string
  quantity: number
  refillsRemaining: number
  totalRefills: number
  prescribedDate: string
  filledDate?: string
  expiryDate: string
  doctorName: string
  doctorSpecialty: string
  visitReason: string
  instructions: string
  sideEffects: string[]
  status: 'active' | 'expired' | 'discontinued' | 'completed'
  pharmacy: string
  cost: number
  insurance: boolean
  notes?: string
}

export default function PastPrescriptionsPage() {
  const { data: session, status } = useSession()
  const [prescriptions, setPrescriptions] = useState<PastPrescription[]>([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<PastPrescription[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedMedication, setSelectedMedication] = useState('')
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    // Only patients should access this page
    if (session.user.role !== 'PATIENT') {
      redirect('/provider')
    }
  }, [session, status])

  // Mock data - replace with API call
  useEffect(() => {
    const mockPrescriptions: PastPrescription[] = [
      {
        id: '1',
        medicationName: 'Lisinopril',
        genericName: 'Lisinopril',
        strength: '10mg',
        dosage: 'Take 1 tablet once daily',
        quantity: 90,
        refillsRemaining: 3,
        totalRefills: 5,
        prescribedDate: '2024-01-15',
        filledDate: '2024-01-16',
        expiryDate: '2025-01-15',
        doctorName: 'Dr. Sarah Johnson',
        doctorSpecialty: 'Family Medicine',
        visitReason: 'Annual Physical Examination',
        instructions: 'Take once daily in the morning with or without food. Monitor blood pressure regularly.',
        sideEffects: ['Dizziness', 'Dry cough', 'Headache', 'Fatigue'],
        status: 'active',
        pharmacy: 'CVS Pharmacy #1234',
        cost: 15.50,
        insurance: true,
        notes: 'Patient tolerating well. Continue current dose.'
      },
      {
        id: '2',
        medicationName: 'Metformin XR',
        genericName: 'Metformin Extended Release',
        strength: '500mg',
        dosage: 'Take 1 tablet twice daily with meals',
        quantity: 180,
        refillsRemaining: 2,
        totalRefills: 5,
        prescribedDate: '2023-12-10',
        filledDate: '2023-12-11',
        expiryDate: '2024-12-10',
        doctorName: 'Dr. Lisa Thompson',
        doctorSpecialty: 'Endocrinology',
        visitReason: 'Diabetes Follow-up',
        instructions: 'Take with meals to reduce stomach upset. Monitor blood sugar levels as directed.',
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
        status: 'active',
        pharmacy: 'Walgreens #5678',
        cost: 25.00,
        insurance: true,
        notes: 'Excellent diabetes control. HbA1c improved significantly.'
      },
      {
        id: '3',
        medicationName: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        strength: '20mg',
        dosage: 'Take 1 tablet once daily at bedtime',
        quantity: 90,
        refillsRemaining: 0,
        totalRefills: 3,
        prescribedDate: '2023-11-20',
        filledDate: '2023-11-22',
        expiryDate: '2024-11-20',
        doctorName: 'Dr. Robert Chen',
        doctorSpecialty: 'Cardiology',
        visitReason: 'Chest Pain Consultation',
        instructions: 'Take at bedtime. Avoid grapefruit juice. Monitor for muscle pain or weakness.',
        sideEffects: ['Muscle pain', 'Joint pain', 'Digestive issues', 'Memory problems'],
        status: 'expired',
        pharmacy: 'CVS Pharmacy #1234',
        cost: 12.75,
        insurance: true,
        notes: 'Cholesterol levels improved. May need dose adjustment at next visit.'
      },
      {
        id: '4',
        medicationName: 'Ibuprofen',
        genericName: 'Ibuprofen',
        strength: '600mg',
        dosage: 'Take 1 tablet every 8 hours as needed for pain',
        quantity: 30,
        refillsRemaining: 0,
        totalRefills: 1,
        prescribedDate: '2023-07-25',
        filledDate: '2023-07-26',
        expiryDate: '2024-07-25',
        doctorName: 'Dr. Michael Rodriguez',
        doctorSpecialty: 'Orthopedics',
        visitReason: 'Knee Pain Evaluation',
        instructions: 'Take with food to prevent stomach irritation. Do not exceed 3 tablets per day.',
        sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness', 'Headache'],
        status: 'completed',
        pharmacy: 'Rite Aid #9012',
        cost: 8.99,
        insurance: false,
        notes: 'Short-term use only. Transition to physical therapy as primary treatment.'
      },
      {
        id: '5',
        medicationName: 'Prednisone',
        genericName: 'Prednisone',
        strength: '10mg',
        dosage: 'Take as directed: 2 tablets for 3 days, then 1 tablet for 4 days',
        quantity: 10,
        refillsRemaining: 0,
        totalRefills: 0,
        prescribedDate: '2023-09-10',
        filledDate: '2023-09-10',
        expiryDate: '2024-09-10',
        doctorName: 'Dr. Emily Davis',
        doctorSpecialty: 'Dermatology',
        visitReason: 'Skin Lesion Examination',
        instructions: 'Take with food. Follow tapering schedule exactly as prescribed. Do not stop abruptly.',
        sideEffects: ['Increased appetite', 'Mood changes', 'Difficulty sleeping', 'Increased blood sugar'],
        status: 'completed',
        pharmacy: 'CVS Pharmacy #1234',
        cost: 5.25,
        insurance: true,
        notes: 'Short course for inflammation control post-biopsy. Patient completed full course.'
      }
    ]
    
    setPrescriptions(mockPrescriptions)
    setFilteredPrescriptions(mockPrescriptions)
    setLoading(false)
  }, [])

  // Filter prescriptions based on search and filters
  useEffect(() => {
    let filtered = prescriptions

    if (searchTerm) {
      filtered = filtered.filter(prescription =>
        prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.visitReason.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDoctor) {
      filtered = filtered.filter(prescription => prescription.doctorName === selectedDoctor)
    }

    if (selectedStatus) {
      filtered = filtered.filter(prescription => prescription.status === selectedStatus)
    }

    if (selectedMedication) {
      filtered = filtered.filter(prescription => prescription.medicationName === selectedMedication)
    }

    setFilteredPrescriptions(filtered)
  }, [prescriptions, searchTerm, selectedDoctor, selectedStatus, selectedMedication])

  const toggleExpandPrescription = (prescriptionId: string) => {
    setExpandedPrescription(expandedPrescription === prescriptionId ? null : prescriptionId)
  }

  const getStatusColor = (status: PastPrescription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#E8EBE4] text-[#2D4A3E]'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'discontinued':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-[#E8EBE4] text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: PastPrescription['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'expired':
        return <AlertCircle className="h-4 w-4" />
      case 'discontinued':
        return <Archive className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const uniqueDoctors = Array.from(new Set(prescriptions.map(prescription => prescription.doctorName)))
  const uniqueMedications = Array.from(new Set(prescriptions.map(prescription => prescription.medicationName)))

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/patient/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Past Prescriptions</h1>
              <p className="text-gray-600 mt-2">
                View your complete prescription history with detailed medication information
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E8EBE4] rounded-lg">
                  <CheckCircle className="h-6 w-6 text-[#4A7C59]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.filter(p => p.status === 'expired').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E8EBE4] rounded-lg">
                  <RefreshCw className="h-6 w-6 text-[#5A7965]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Refills</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.reduce((sum, p) => sum + p.refillsRemaining, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E8EBE4] rounded-lg">
                  <Pill className="h-6 w-6 text-[#6B8E7D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Meds</p>
                  <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search medications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medication</Label>
                <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                  <SelectTrigger>
                    <SelectValue placeholder="All medications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All medications</SelectItem>
                    {uniqueMedications.map(medication => (
                      <SelectItem key={medication} value={medication}>{medication}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="All doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All doctors</SelectItem>
                    {uniqueDoctors.map(doctor => (
                      <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || selectedDoctor || selectedStatus || selectedMedication) && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedDoctor('')
                    setSelectedStatus('')
                    setSelectedMedication('')
                  }}
                  className="text-sm"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <div className="space-y-6">
          {filteredPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                <p className="text-gray-600">
                  {prescriptions.length === 0 
                    ? "You don't have any prescriptions recorded yet."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <Card key={prescription.id} className="overflow-hidden">
                <CardHeader className="cursor-pointer" onClick={() => toggleExpandPrescription(prescription.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Pill className="h-5 w-5 text-[#6B8E7D]" />
                        <h3 className="text-xl font-semibold text-gray-900">{prescription.medicationName}</h3>
                        {prescription.genericName && prescription.genericName !== prescription.medicationName && (
                          <span className="text-sm text-gray-600">({prescription.genericName})</span>
                        )}
                      </div>
                      
                      <p className="text-lg text-gray-700">{prescription.strength} - {prescription.dosage}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{prescription.doctorName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Prescribed {new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RefreshCw className="h-4 w-4" />
                          <span>{prescription.refillsRemaining} refills left</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(prescription.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(prescription.status)}
                          <span>{prescription.status}</span>
                        </div>
                      </Badge>
                      {expandedPrescription === prescription.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedPrescription === prescription.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-6" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Prescription Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Prescription Details</span>
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Prescribed by</Label>
                            <p className="text-gray-900">{prescription.doctorName}</p>
                            <p className="text-sm text-gray-600">{prescription.doctorSpecialty}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Visit Reason</Label>
                            <p className="text-gray-900">{prescription.visitReason}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                              <p className="text-gray-900">{prescription.quantity} tablets</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Refills</Label>
                              <p className="text-gray-900">{prescription.refillsRemaining} / {prescription.totalRefills}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Filled Date</Label>
                              <p className="text-gray-900">
                                {prescription.filledDate 
                                  ? new Date(prescription.filledDate).toLocaleDateString()
                                  : 'Not filled'
                                }
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Expires</Label>
                              <p className="text-gray-900">{new Date(prescription.expiryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Pharmacy</Label>
                              <p className="text-gray-900">{prescription.pharmacy}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Cost</Label>
                              <p className="text-gray-900">
                                ${prescription.cost.toFixed(2)}
                                {prescription.insurance && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Insurance Applied
                                  </Badge>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Instructions and Side Effects */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                            {prescription.instructions}
                          </p>
                        </div>
                        
                        {prescription.sideEffects.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Possible Side Effects</h4>
                            <div className="flex flex-wrap gap-1">
                              {prescription.sideEffects.map((sideEffect, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                                  {sideEffect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {prescription.notes && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Provider Notes</h4>
                            <p className="text-gray-700 text-sm leading-relaxed bg-[#E8EBE4] p-3 rounded-lg border-l-4 border-blue-200">
                              {prescription.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
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
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Download,
  User,
  Stethoscope,
  Clock,
  FileText,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'

interface PastVisit {
  id: string
  date: string
  time: string
  reason: string
  doctorName: string
  profession: string
  specialty: string
  visitType: string
  visitSummary: string
  providerNotes: string
  status: 'completed' | 'cancelled' | 'no-show'
  followUpRequired: boolean
  prescriptionsIssued: number
  testsOrdered: string[]
}

export default function PastVisitsPage() {
  const { data: session, status } = useSession()
  const [visits, setVisits] = useState<PastVisit[]>([])
  const [filteredVisits, setFilteredVisits] = useState<PastVisit[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null)
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
    const mockVisits: PastVisit[] = [
      {
        id: '1',
        date: '2024-01-15',
        time: '10:00 AM',
        reason: 'Annual Physical Examination',
        doctorName: 'Dr. Sarah Johnson',
        profession: 'Doctor of Medicine (MD)',
        specialty: 'Family Medicine',
        visitType: 'Routine Checkup',
        visitSummary: 'Comprehensive annual physical examination completed. Patient in good overall health with normal vital signs. Discussed preventive care and lifestyle recommendations.',
        providerNotes: 'Patient appears healthy and active. Blood pressure 120/80, heart rate 72 bpm. Recommended continuing current exercise routine. Schedule mammography and routine labs in 6 months. Patient educated on importance of regular checkups.',
        status: 'completed',
        followUpRequired: true,
        prescriptionsIssued: 1,
        testsOrdered: ['Complete Blood Count', 'Lipid Panel', 'Mammography']
      },
      {
        id: '2',
        date: '2023-11-20',
        time: '2:30 PM',
        reason: 'Chest Pain Consultation',
        doctorName: 'Dr. Robert Chen',
        profession: 'Doctor of Medicine (MD)',
        specialty: 'Cardiology',
        visitType: 'Specialist Consultation',
        visitSummary: 'Patient presented with intermittent chest discomfort. Comprehensive cardiac evaluation performed including ECG and stress test. Results indicate no significant cardiac abnormalities.',
        providerNotes: 'Chest pain appears to be musculoskeletal in nature rather than cardiac. ECG normal, stress test negative. Advised on posture improvement and stress management techniques. Follow-up in 3 months if symptoms persist.',
        status: 'completed',
        followUpRequired: false,
        prescriptionsIssued: 0,
        testsOrdered: ['ECG', 'Stress Test', 'Chest X-ray']
      },
      {
        id: '3',
        date: '2023-09-10',
        time: '11:15 AM',
        reason: 'Skin Lesion Examination',
        doctorName: 'Dr. Emily Davis',
        profession: 'Doctor of Medicine (MD)',
        specialty: 'Dermatology',
        visitType: 'Specialist Consultation',
        visitSummary: 'Examination of suspicious mole on left shoulder. Dermoscopy performed and biopsy taken for histological analysis. Provided patient education on skin cancer prevention.',
        providerNotes: 'Mole exhibits some irregular features. Biopsy sent for pathology. Results expected within 7-10 days. Patient counseled on sun protection and regular self-examinations. Recommend annual dermatology screening.',
        status: 'completed',
        followUpRequired: true,
        prescriptionsIssued: 1,
        testsOrdered: ['Skin Biopsy', 'Histopathology']
      },
      {
        id: '4',
        date: '2023-07-25',
        time: '9:45 AM',
        reason: 'Knee Pain Evaluation',
        doctorName: 'Dr. Michael Rodriguez',
        profession: 'Doctor of Medicine (MD)',
        specialty: 'Orthopedics',
        visitType: 'Specialist Consultation',
        visitSummary: 'Evaluation of chronic right knee pain. Physical examination and imaging review completed. Diagnosed with mild osteoarthritis. Treatment plan discussed including physical therapy and lifestyle modifications.',
        providerNotes: 'Right knee shows signs of mild degenerative changes consistent with early osteoarthritis. Range of motion slightly limited. Recommended physical therapy, weight management, and low-impact exercises. Consider joint injection if conservative treatment fails.',
        status: 'completed',
        followUpRequired: true,
        prescriptionsIssued: 2,
        testsOrdered: ['Knee X-ray', 'MRI']
      },
      {
        id: '5',
        date: '2023-05-12',
        time: '3:00 PM',
        reason: 'Diabetes Follow-up',
        doctorName: 'Dr. Lisa Thompson',
        profession: 'Doctor of Medicine (MD)',
        specialty: 'Endocrinology',
        visitType: 'Follow-up Visit',
        visitSummary: 'Routine diabetes management appointment. Reviewed blood glucose logs and HbA1c results. Medication adjustments made and dietary counseling provided.',
        providerNotes: 'HbA1c improved to 7.2% from previous 7.8%. Blood glucose control has shown good improvement. Adjusted metformin dosage and added SGLT-2 inhibitor. Continue current diet and exercise regimen. Follow-up in 3 months.',
        status: 'completed',
        followUpRequired: true,
        prescriptionsIssued: 3,
        testsOrdered: ['HbA1c', 'Comprehensive Metabolic Panel', 'Microalbumin']
      }
    ]
    
    setVisits(mockVisits)
    setFilteredVisits(mockVisits)
    setLoading(false)
  }, [])

  // Filter visits based on search and filters
  useEffect(() => {
    let filtered = visits

    if (searchTerm) {
      filtered = filtered.filter(visit =>
        visit.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.visitSummary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDoctor) {
      filtered = filtered.filter(visit => visit.doctorName === selectedDoctor)
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(visit => visit.specialty === selectedSpecialty)
    }

    if (selectedStatus) {
      filtered = filtered.filter(visit => visit.status === selectedStatus)
    }

    setFilteredVisits(filtered)
  }, [visits, searchTerm, selectedDoctor, selectedSpecialty, selectedStatus])

  const toggleExpandVisit = (visitId: string) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId)
  }

  const getStatusColor = (status: PastVisit['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no-show':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const uniqueDoctors = Array.from(new Set(visits.map(visit => visit.doctorName)))
  const uniqueSpecialties = Array.from(new Set(visits.map(visit => visit.specialty)))

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
              <h1 className="text-3xl font-bold text-gray-900">Past Visits</h1>
              <p className="text-gray-600 mt-2">
                View your complete medical visit history with detailed summaries and provider notes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {filteredVisits.length} visit{filteredVisits.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
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
                    placeholder="Search visits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
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
                <Label>Specialty</Label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All specialties</SelectItem>
                    {uniqueSpecialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || selectedDoctor || selectedSpecialty || selectedStatus) && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedDoctor('')
                    setSelectedSpecialty('')
                    setSelectedStatus('')
                  }}
                  className="text-sm"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visits List */}
        <div className="space-y-6">
          {filteredVisits.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
                <p className="text-gray-600">
                  {visits.length === 0 
                    ? "You don't have any past visits recorded yet."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredVisits.map((visit) => (
              <Card key={visit.id} className="overflow-hidden">
                <CardHeader className="cursor-pointer" onClick={() => toggleExpandVisit(visit.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {new Date(visit.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-500">at {visit.time}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900">{visit.reason}</h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{visit.doctorName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Stethoscope className="h-4 w-4" />
                          <span>{visit.specialty}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                      {expandedVisit === visit.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedVisit === visit.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-6" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Visit Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Visit Details</span>
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Doctor</Label>
                            <p className="text-gray-900">{visit.doctorName}</p>
                            <p className="text-sm text-gray-600">{visit.profession}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Specialty</Label>
                            <p className="text-gray-900">{visit.specialty}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Visit Type</Label>
                            <p className="text-gray-900">{visit.visitType}</p>
                          </div>
                          
                          {visit.testsOrdered.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Tests Ordered</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {visit.testsOrdered.map((test, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {test}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm text-gray-600">
                              Prescriptions: {visit.prescriptionsIssued}
                            </div>
                            {visit.followUpRequired && (
                              <Badge variant="outline" className="text-xs">
                                Follow-up Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Visit Summary and Notes */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Visit Summary</h4>
                          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                            {visit.visitSummary}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Provider Notes</h4>
                          <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">
                            {visit.providerNotes}
                          </p>
                        </div>
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
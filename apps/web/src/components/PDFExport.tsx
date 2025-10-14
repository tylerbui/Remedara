'use client'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Calendar, User, Phone, MapPin, AlertTriangle, Syringe, TestTube, Activity } from 'lucide-react'

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

interface PDFExportProps {
  userProfile: UserProfile
  labResults: LabResult[]
  imagingResults: ImagingResult[]
  vaccinations: Vaccination[]
  allergies: Allergy[]
  selectedSections?: string[]
}

const PrintableReport = React.forwardRef<HTMLDivElement, PDFExportProps>(({
  userProfile,
  labResults,
  imagingResults,
  vaccinations,
  allergies,
  selectedSections = ['all']
}, ref) => {
  const shouldInclude = (section: string) => 
    selectedSections.includes('all') || selectedSections.includes(section)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LIFE_THREATENING': return 'bg-red-600 text-white'
      case 'SEVERE': return 'bg-orange-500 text-white'
      case 'MODERATE': return 'bg-yellow-500 text-white'
      case 'MILD': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-600 text-white'
      case 'PENDING': return 'bg-yellow-500 text-white'
      case 'ABNORMAL': return 'bg-red-600 text-white'
      case 'OVERDUE': return 'bg-red-600 text-white'
      case 'UPCOMING': return 'bg-blue-600 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto print:mx-0 print:max-w-none">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Remedara Healthcare</h1>
        <h2 className="text-xl font-semibold text-gray-700">Medical Records Summary</h2>
        <p className="text-gray-600 mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Patient Information */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 mr-2" />
          <h3 className="text-xl font-bold">Patient Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div><strong>Name:</strong> {userProfile.name}</div>
            <div><strong>Email:</strong> {userProfile.email}</div>
            <div><strong>Phone:</strong> {userProfile.phone || 'Not provided'}</div>
            <div><strong>Date of Birth:</strong> {userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'Not provided'}</div>
          </div>
          <div className="space-y-2">
            <div><strong>Address:</strong> {userProfile.address ? `${userProfile.address}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}` : 'Not provided'}</div>
            <div><strong>Emergency Contact:</strong> {userProfile.emergencyContact || 'Not provided'}</div>
            <div><strong>Emergency Phone:</strong> {userProfile.emergencyPhone || 'Not provided'}</div>
            {userProfile.medicalHistory && (
              <div><strong>Medical History:</strong> {userProfile.medicalHistory}</div>
            )}
          </div>
        </div>
      </div>

      {/* Active Allergies */}
      {shouldInclude('allergies') && allergies.filter(a => a.status === 'ACTIVE').length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
            <h3 className="text-xl font-bold">Active Allergies</h3>
          </div>
          <div className="space-y-4">
            {allergies.filter(a => a.status === 'ACTIVE').map((allergy, index) => (
              <div key={allergy.id} className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-lg">{allergy.allergen}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
                    {allergy.severity.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">({allergy.allergenType})</span>
                </div>
                <div><strong>Reaction:</strong> {allergy.reaction}</div>
                {allergy.onsetDate && <div><strong>Onset:</strong> {new Date(allergy.onsetDate).toLocaleDateString()}</div>}
                {allergy.notes && <div><strong>Notes:</strong> {allergy.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lab Results */}
      {shouldInclude('lab-results') && labResults.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TestTube className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-bold">Laboratory Results</h3>
          </div>
          <div className="space-y-4">
            {labResults.map((result, index) => (
              <div key={result.id} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{result.testName}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                    {result.flagged && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500 text-white">
                        FLAGGED
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><strong>Result:</strong> {result.result} {result.unit}</div>
                  <div><strong>Reference Range:</strong> {result.referenceRange || 'N/A'}</div>
                  <div><strong>Date:</strong> {new Date(result.resultDate).toLocaleDateString()}</div>
                </div>
                <div className="mt-2 text-sm">
                  <div><strong>Lab Facility:</strong> {result.labFacility}</div>
                  {result.providerNotes && (
                    <div><strong>Provider Notes:</strong> {result.providerNotes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Imaging Results */}
      {shouldInclude('imaging') && imagingResults.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-bold">Imaging Studies</h3>
          </div>
          <div className="space-y-4">
            {imagingResults.map((result, index) => (
              <div key={result.id} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{result.studyType}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white">
                      {result.urgency}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div><strong>Date:</strong> {new Date(result.studyDate).toLocaleDateString()}</div>
                  <div><strong>Facility:</strong> {result.facility}</div>
                </div>
                {result.radiologist && (
                  <div className="text-sm mb-2"><strong>Radiologist:</strong> {result.radiologist}</div>
                )}
                <div className="space-y-2 text-sm">
                  <div><strong>Findings:</strong> {result.findings}</div>
                  <div><strong>Impression:</strong> {result.impression}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vaccinations */}
      {shouldInclude('vaccines') && vaccinations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Syringe className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-bold">Vaccination History</h3>
          </div>
          <div className="space-y-4">
            {vaccinations.map((vaccine, index) => (
              <div key={vaccine.id} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{vaccine.vaccineName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(vaccine.status)}`}>
                    {vaccine.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><strong>Date:</strong> {new Date(vaccine.administrationDate).toLocaleDateString()}</div>
                  <div><strong>Administered By:</strong> {vaccine.administeredBy || 'N/A'}</div>
                  <div><strong>Manufacturer:</strong> {vaccine.manufacturer || 'N/A'}</div>
                </div>
                {vaccine.doseNumber && vaccine.totalDoses && (
                  <div className="text-sm mt-2"><strong>Dose:</strong> {vaccine.doseNumber} of {vaccine.totalDoses}</div>
                )}
                {vaccine.nextDueDate && (
                  <div className="text-sm"><strong>Next Due:</strong> {new Date(vaccine.nextDueDate).toLocaleDateString()}</div>
                )}
                {vaccine.sideEffects && (
                  <div className="text-sm"><strong>Side Effects:</strong> {vaccine.sideEffects}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8 text-center text-sm text-gray-600">
        <p>This medical records summary was generated electronically by Remedara Healthcare.</p>
        <p>For questions about this report, please contact your healthcare provider.</p>
        <p className="mt-2"><strong>Confidential Patient Information - Handle with Care</strong></p>
      </div>
    </div>
  )
})

PrintableReport.displayName = 'PrintableReport'

export function PDFExport({ 
  userProfile, 
  labResults, 
  imagingResults, 
  vaccinations, 
  allergies,
  selectedSections = ['all']
}: PDFExportProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${userProfile.name}-Medical-Records-${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          font-size: 12px;
        }
        .print\\:hidden { display: none !important; }
        .print\\:block { display: block !important; }
      }
    `
  })

  return (
    <div className="space-y-4">
      <Button
        onClick={handlePrint}
        className="flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        <span>Export to PDF</span>
      </Button>
      
      {/* Hidden printable component */}
      <div className="hidden">
        <PrintableReport
          ref={componentRef}
          userProfile={userProfile}
          labResults={labResults}
          imagingResults={imagingResults}
          vaccinations={vaccinations}
          allergies={allergies}
          selectedSections={selectedSections}
        />
      </div>
    </div>
  )
}
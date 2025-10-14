'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  FileText, 
  Download, 
  Shield, 
  Clock, 
  User, 
  Calendar,
  Activity,
  Syringe,
  AlertTriangle,
  TestTube,
  Eye,
  Lock
} from 'lucide-react'

interface SharedRecordData {
  id: string
  patientName: string
  patientEmail: string
  recordTypes: string[]
  shareDate: string
  expiryDate: string
  message?: string
  allowDownload: boolean
  recipientName: string
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED'
  medicalData: {
    labResults?: any[]
    imagingResults?: any[]
    vaccinations?: any[]
    allergies?: any[]
    testResults?: any[]
  }
}

export default function SharedRecordsPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [recordData, setRecordData] = useState<SharedRecordData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      fetchSharedRecord()
    }
  }, [token])

  const fetchSharedRecord = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/records/shared/${token}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shared records')
      }

      if (data.success) {
        setRecordData(data.recordData)
      }
    } catch (error: any) {
      console.error('Error fetching shared record:', error)
      setError(error.message || 'Failed to load shared records')
      toast.error(error.message || 'Failed to load shared records')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadRecords = async () => {
    if (!recordData?.allowDownload) return

    try {
      const response = await fetch(`/api/records/shared/${token}/download`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to download records')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${recordData.patientName.replace(/\s+/g, '_')}_Medical_Records.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Records downloaded successfully')
    } catch (error: any) {
      console.error('Error downloading records:', error)
      toast.error('Failed to download records')
    }
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'lab-results': return <TestTube className="h-4 w-4" />
      case 'imaging': return <Activity className="h-4 w-4" />
      case 'vaccines': return <Syringe className="h-4 w-4" />
      case 'allergies': return <AlertTriangle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getRecordTypeLabel = (type: string) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading shared medical records...</p>
        </div>
      </div>
    )
  }

  if (error || !recordData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">
              {error || 'The shared record link is invalid, expired, or has been revoked.'}
            </p>
            <Button onClick={() => router.push('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(recordData.expiryDate) < new Date()
  const isRevoked = recordData.status === 'REVOKED'

  if (isExpired || isRevoked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRevoked ? 'Access Revoked' : 'Link Expired'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isRevoked 
                ? 'The patient has revoked access to these medical records.'
                : `This link expired on ${new Date(recordData.expiryDate).toLocaleDateString()}.`
              }
            </p>
            <Button onClick={() => router.push('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle className="text-2xl">Shared Medical Records</CardTitle>
                  <CardDescription>
                    Securely shared by {recordData.patientName}
                  </CardDescription>
                </div>
              </div>
              {recordData.allowDownload && (
                <Button onClick={downloadRecords} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Shared with:</span>
                <p className="font-semibold">{recordData.recipientName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Shared on:</span>
                <p>{new Date(recordData.shareDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Expires:</span>
                <p>{new Date(recordData.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            {recordData.message && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="font-medium text-blue-800">Message from Patient:</p>
                <p className="text-blue-700 italic">"{recordData.message}"</p>
              </div>
            )}

            <div className="mt-4">
              <span className="font-medium text-gray-600">Shared Records:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {recordData.recordTypes.map(type => (
                  <Badge key={type} variant="secondary" className="flex items-center space-x-1">
                    {getRecordTypeIcon(type)}
                    <span>{getRecordTypeLabel(type)}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Records Content */}
        <div className="space-y-6">
          {/* Lab Results */}
          {recordData.recordTypes.includes('lab-results') && recordData.medicalData.labResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Laboratory Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordData.medicalData.labResults.map((lab: any) => (
                    <div key={lab.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{lab.testName}</h4>
                        <Badge variant={lab.status === 'completed' ? 'default' : 'secondary'}>
                          {lab.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Result:</span> {lab.result} {lab.unit}
                        </div>
                        <div>
                          <span className="text-gray-600">Reference Range:</span> {lab.referenceRange}
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span> {new Date(lab.resultDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-600">Lab:</span> {lab.labFacility}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Imaging Results */}
          {recordData.recordTypes.includes('imaging') && recordData.medicalData.imagingResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Imaging Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordData.medicalData.imagingResults.map((imaging: any) => (
                    <div key={imaging.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{imaging.studyType}</h4>
                        <Badge variant={imaging.status === 'completed' ? 'default' : 'secondary'}>
                          {imaging.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Findings:</span> {imaging.findings || 'N/A'}
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span> {new Date(imaging.studyDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-600">Facility:</span> {imaging.facility}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vaccinations */}
          {recordData.recordTypes.includes('vaccines') && recordData.medicalData.vaccinations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Syringe className="h-5 w-5" />
                  <span>Vaccination Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordData.medicalData.vaccinations.map((vaccine: any) => (
                    <div key={vaccine.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{vaccine.vaccineName}</h4>
                        <Badge variant="default">Administered</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span> {new Date(vaccine.administrationDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-600">Dose:</span> {vaccine.dose || 'N/A'}
                        </div>
                        <div>
                          <span className="text-gray-600">Provider:</span> {vaccine.administeringProvider || 'N/A'}
                        </div>
                        <div>
                          <span className="text-gray-600">Lot Number:</span> {vaccine.lotNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allergies */}
          {recordData.recordTypes.includes('allergies') && recordData.medicalData.allergies && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Allergies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordData.medicalData.allergies.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No known allergies</p>
                  ) : (
                    recordData.medicalData.allergies.map((allergy: any) => (
                      <div key={allergy.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{allergy.allergen}</h4>
                          <Badge variant="destructive">{allergy.severity}</Badge>
                        </div>
                        <div className="text-sm">
                          <div>
                            <span className="text-gray-600">Reaction:</span> {allergy.reaction}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="text-center py-6 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Medical Record Sharing via Remedara</span>
            </div>
            <p>This is a secure, time-limited view of medical records. Do not share this link.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
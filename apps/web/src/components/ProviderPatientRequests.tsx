'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  X,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Bell,
  MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'

interface PatientConnectionRequest {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone?: string
  status: 'pending' | 'approved' | 'rejected'
  initiatedBy: 'PATIENT' | 'PROVIDER'
  requestDate: string
  responseDate?: string
  requestMessage?: string
  responseMessage?: string
  totalAppointments?: number
  lastAppointment?: string
}

export default function ProviderPatientRequests() {
  const [requests, setRequests] = useState<PatientConnectionRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/provider-connections')
      
      if (!response.ok) {
        throw new Error('Failed to fetch connection requests')
      }
      
      const data = await response.json()
      setRequests(data.connections || [])
    } catch (error) {
      console.error('Error fetching connection requests:', error)
      setError('Failed to load connection requests')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/provider-connections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionId: requestId,
          action: 'approve'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to approve request')
      }

      toast.success('Patient connection approved!')
      fetchRequests() // Refresh the list
    } catch (error: any) {
      console.error('Error approving request:', error)
      toast.error(error.message || 'Failed to approve request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/provider-connections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionId: requestId,
          action: 'reject'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reject request')
      }

      toast.success('Patient request rejected')
      fetchRequests() // Refresh the list
    } catch (error: any) {
      console.error('Error rejecting request:', error)
      toast.error(error.message || 'Failed to reject request')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Patient Connection Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Patient Connection Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const approvedConnections = requests.filter(r => r.status === 'approved')

  return (
    <div className="space-y-6">
      {/* Pending Patient Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span>Pending Patient Requests</span>
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            </CardTitle>
            <CardDescription>
              Patients have requested to connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Patient Request
                      </span>
                    </div>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {request.patientEmail}
                        </span>
                        {request.patientPhone && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {request.patientPhone}
                          </span>
                        )}
                      </div>
                      {request.requestMessage && (
                        <p className="text-sm text-gray-600 italic mt-2">"{request.requestMessage}"</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApproveRequest(request.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Connected Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Connected Patients</span>
            <Badge variant="default">{approvedConnections.length}</Badge>
          </CardTitle>
          <CardDescription>
            Patients you're currently connected with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedConnections.length > 0 ? (
            <div className="space-y-4">
              {approvedConnections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{connection.patientName}</h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          Connected via {connection.initiatedBy === 'PROVIDER' ? 'Your' : 'Patient'} Request
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {connection.patientEmail}
                        </span>
                        {connection.totalAppointments && (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {connection.totalAppointments} appointments
                          </span>
                        )}
                        {connection.responseDate && (
                          <span>
                            Connected: {new Date(connection.responseDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Patients</h3>
              <p className="text-gray-600">
                You don't have any connected patients yet. Patient connection requests will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
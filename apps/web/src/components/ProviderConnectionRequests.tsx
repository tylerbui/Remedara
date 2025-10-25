'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2,
  UserCheck,
  Clock,
  CheckCircle,
  X,
  Calendar,
  Stethoscope,
  AlertTriangle,
  Bell
} from 'lucide-react'
import { toast } from 'sonner'

interface ProviderConnection {
  id: string
  providerId?: string
  patientId?: string
  providerName?: string
  patientName?: string
  providerEmail?: string
  patientEmail?: string
  specialization?: string
  status: 'pending' | 'approved' | 'rejected'
  initiatedBy?: 'PATIENT' | 'PROVIDER'
  requestDate?: string
  responseDate?: string
  requestMessage?: string
  responseMessage?: string
  totalAppointments?: number
  lastAppointment?: string
}

export default function ProviderConnectionRequests() {
  const [connections, setConnections] = useState<ProviderConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/provider-connections')
      
      if (!response.ok) {
        throw new Error('Failed to fetch provider connections')
      }
      
      const data = await response.json()
      setConnections(data.connections || [])
    } catch (error) {
      console.error('Error fetching provider connections:', error)
      setError('Failed to load provider connections')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveConnection = async (connectionId: string) => {
    try {
      const response = await fetch('/api/provider-connections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionId,
          action: 'approve'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to approve connection')
      }

      // Update local state
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'approved' as const }
          : conn
      ))
      
      toast.success('Provider connection approved!')
      fetchConnections() // Refresh the list
    } catch (error: any) {
      console.error('Error approving connection:', error)
      toast.error(error.message || 'Failed to approve connection')
    }
  }

  const handleRejectConnection = async (connectionId: string) => {
    try {
      const response = await fetch('/api/provider-connections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionId,
          action: 'reject'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reject connection')
      }

      // Remove from local state or mark as rejected
      setConnections(prev => prev.filter(conn => conn.id !== connectionId))
      
      toast.success('Provider connection rejected')
      fetchConnections() // Refresh the list
    } catch (error: any) {
      console.error('Error rejecting connection:', error)
      toast.error(error.message || 'Failed to reject connection')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Provider Connections</span>
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
            <Building2 className="h-5 w-5" />
            <span>Provider Connections</span>
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

  const pendingConnections = connections.filter(c => c.status === 'pending')
  const approvedConnections = connections.filter(c => c.status === 'approved')

  return (
    <div className="space-y-6">
      {/* Pending Connection Requests */}
      {pendingConnections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span>Pending Provider Requests</span>
              <Badge variant="secondary">{pendingConnections.length}</Badge>
            </CardTitle>
            <CardDescription>
              Healthcare providers have requested to connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingConnections.map((connection) => {
              const isFromProvider = connection.initiatedBy === 'PROVIDER'
              const displayName = isFromProvider ? connection.providerName : connection.patientName
              const displayEmail = isFromProvider ? connection.providerEmail : connection.patientEmail
              const displayRole = isFromProvider ? connection.specialization || 'Healthcare Provider' : 'Patient'
              
              return (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-[#E8EBE4] rounded-full flex items-center justify-center">
                      {isFromProvider ? (
                        <Stethoscope className="h-6 w-6 text-[#5A7965]" />
                      ) : (
                        <UserCheck className="h-6 w-6 text-[#4A7C59]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{displayName}</h3>
                        {connection.initiatedBy && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {connection.initiatedBy === 'PROVIDER' ? 'Provider Request' : 'Patient Request'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{displayRole}</p>
                      <p className="text-sm text-gray-500">{displayEmail}</p>
                      {connection.requestMessage && (
                        <p className="text-sm text-gray-600 mt-1 italic">"${connection.requestMessage}"</p>
                      )}
                      {connection.requestDate && (
                        <p className="text-xs text-gray-400 mt-1">
                          Requested: {new Date(connection.requestDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectConnection(connection.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveConnection(connection.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Connected Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Connected Providers</span>
            <Badge variant="default">{approvedConnections.length}</Badge>
          </CardTitle>
          <CardDescription>
            Healthcare providers you're currently connected with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedConnections.length > 0 ? (
            <div className="space-y-4">
              {approvedConnections.map((connection) => {
                const isFromProvider = connection.initiatedBy === 'PROVIDER'
                const displayName = isFromProvider ? connection.providerName : connection.patientName
                const displayRole = isFromProvider ? connection.specialization || 'Healthcare Provider' : 'Patient'
                
                return (
                  <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-[#E8EBE4] rounded-full flex items-center justify-center">
                        {isFromProvider ? (
                          <Stethoscope className="h-6 w-6 text-[#4A7C59]" />
                        ) : (
                          <UserCheck className="h-6 w-6 text-[#4A7C59]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{displayName}</h3>
                          {connection.initiatedBy && (
                            <span className="text-xs px-2 py-1 bg-[#E8EBE4] text-green-700 rounded">
                              Connected via {connection.initiatedBy === 'PROVIDER' ? 'Provider' : 'Patient'} Request
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{displayRole}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {connection.totalAppointments && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {connection.totalAppointments} appointments
                            </span>
                          )}
                          {connection.lastAppointment && (
                            <span>
                              Last visit: {new Date(connection.lastAppointment).toLocaleDateString()}
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
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Providers</h3>
              <p className="text-gray-600">
                You don't have any connected healthcare providers yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
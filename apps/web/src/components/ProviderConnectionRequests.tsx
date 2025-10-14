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
  providerId: string
  providerName: string
  providerEmail: string
  specialization?: string
  status: 'pending' | 'approved' | 'rejected'
  requestDate?: string
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
      // TODO: Implement approval logic
      toast.success('Provider connection approved')
    } catch (error) {
      toast.error('Failed to approve connection')
    }
  }

  const handleRejectConnection = async (connectionId: string) => {
    try {
      // TODO: Implement rejection logic
      toast.success('Provider connection rejected')
    } catch (error) {
      toast.error('Failed to reject connection')
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
            {pendingConnections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{connection.providerName}</h3>
                    <p className="text-sm text-gray-600">{connection.specialization || 'Healthcare Provider'}</p>
                    <p className="text-sm text-gray-500">{connection.providerEmail}</p>
                    {connection.requestDate && (
                      <p className="text-xs text-gray-400">
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
            ))}
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
              {approvedConnections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{connection.providerName}</h3>
                      <p className="text-sm text-gray-600">{connection.specialization || 'Healthcare Provider'}</p>
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
              ))}
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
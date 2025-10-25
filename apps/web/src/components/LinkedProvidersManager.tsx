'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Building2,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  RotateCw,
  Unlink,
  MessageSquare,
  CalendarPlus,
  Eye,
  EyeOff,
  Trash2,
  Plus
} from 'lucide-react'

interface LinkedProvider {
  _id: string
  organizationName: string
  organizationId: string
  baseUrl: string
  status: 'active' | 'expired' | 'revoked' | 'error'
  lastSyncAt?: string
  lastSyncSuccess?: boolean
  linkingCompletedAt?: string
  capabilities: {
    canSchedule: boolean
    canMessage: boolean
    canAccessLabs: boolean
    canAccessMedications: boolean
    canAccessAllergies: boolean
    canAccessVitals: boolean
    supportedResources: string[]
  }
  isTokenExpiring?: boolean
  isTokenExpired?: boolean
  daysSinceLastSync?: number | null
}

interface ProvidersResponse {
  providers: LinkedProvider[]
  total: number
  active: number
  expired: number
}

export function LinkedProvidersManager() {
  const [providers, setProviders] = useState<LinkedProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/fhir/providers')
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers')
      }
      
      const data: ProvidersResponse = await response.json()
      setProviders(data.providers)
    } catch (error) {
      console.error('Error fetching providers:', error)
      setError('Failed to load linked providers')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkNewProvider = () => {
    // This would open a modal or navigate to provider selection
    window.location.href = '/patient/link-provider'
  }

  const handleSync = async (providerId?: string) => {
    try {
      setSyncing(true)
      setError('')
      
      const response = await fetch('/api/fhir/timeline/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(providerId ? { providerId } : {})
      })
      
      if (!response.ok) {
        throw new Error('Sync failed')
      }
      
      const result = await response.json()
      setSuccess(`Successfully synced ${result.summary.totalRecordsSynced} records from ${result.summary.providersProcessed} provider(s)`)
      
      // Refresh providers list
      await fetchProviders()
      
    } catch (error) {
      console.error('Sync error:', error)
      setError('Failed to sync data. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  const handleUnlink = async (providerId: string, providerName: string) => {
    if (!confirm(`Are you sure you want to unlink ${providerName}? This will remove all synced data from this provider.`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/fhir/providers?id=${providerId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to unlink provider')
      }
      
      setSuccess(`Successfully unlinked ${providerName}`)
      await fetchProviders()
      
    } catch (error) {
      console.error('Unlink error:', error)
      setError('Failed to unlink provider')
    }
  }

  const getStatusColor = (status: LinkedProvider['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#E8EBE4] text-[#2D4A3E]'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'revoked':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: LinkedProvider['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'expired':
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const toggleProvider = (providerId: string) => {
    setExpandedProvider(expandedProvider === providerId ? null : providerId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Linked Providers</h2>
          <p className="text-gray-600 mt-1">
            Manage connections to your healthcare providers and sync your medical data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => handleSync()} 
            disabled={syncing || providers.length === 0}
            variant="outline"
          >
            <RotateCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          <Button onClick={handleLinkNewProvider}>
            <Plus className="h-4 w-4 mr-2" />
            Link Provider
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-[#FAF8F3]">
          <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
          <AlertTitle className="text-[#2D4A3E]">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Provider Stats */}
      {providers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E8EBE4] rounded-lg">
                  <Building2 className="h-6 w-6 text-[#5A7965]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Providers</p>
                  <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E8EBE4] rounded-lg">
                  <CheckCircle className="h-6 w-6 text-[#4A7C59]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {providers.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {providers.filter(p => p.isTokenExpiring || p.isTokenExpired).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E8EBE4] rounded-lg">
                  <RotateCw className="h-6 w-6 text-[#6B8E7D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Syncs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {providers.filter(p => p.daysSinceLastSync !== null && p.daysSinceLastSync! <= 7).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Providers List */}
      {providers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Linked Providers</h3>
            <p className="text-gray-600 mb-6">
              Link your healthcare providers to access and sync your medical data in one place.
            </p>
            <Button onClick={handleLinkNewProvider}>
              <Plus className="h-4 w-4 mr-2" />
              Link Your First Provider
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <Card key={provider._id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleProvider(provider._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {provider.organizationName}
                      </h3>
                      <Badge className={getStatusColor(provider.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(provider.status)}
                          <span className="capitalize">{provider.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Linked {new Date(provider.linkingCompletedAt!).toLocaleDateString()}
                        </span>
                      </div>
                      {provider.lastSyncAt && (
                        <div className="flex items-center space-x-1">
            <RotateCw className="h-4 w-4" />
                          <span>
                            Last sync {provider.daysSinceLastSync === 0 
                              ? 'today' 
                              : `${provider.daysSinceLastSync} days ago`
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Warnings */}
                    {(provider.isTokenExpiring || provider.isTokenExpired) && (
                      <div className="flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          {provider.isTokenExpired 
                            ? 'Access token expired - please re-link this provider'
                            : 'Access token expires soon - may need re-linking'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {expandedProvider === provider._id ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedProvider === provider._id && (
                <CardContent className="border-t bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
                    {/* Capabilities */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Capabilities</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Lab Results</span>
                          {provider.capabilities.canAccessLabs ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-200 rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Medications</span>
                          {provider.capabilities.canAccessMedications ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-200 rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Allergies</span>
                          {provider.capabilities.canAccessAllergies ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-200 rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Vital Signs</span>
                          {provider.capabilities.canAccessVitals ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-200 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {provider.capabilities.canMessage && (
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          )}
                          {provider.capabilities.canSchedule && (
                            <Button size="sm" variant="outline">
                              <CalendarPlus className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSync(provider._id)}
                            disabled={syncing}
                          >
                            <RotateCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                            Sync
                          </Button>
                        </div>
                        
                        <div className="border-t pt-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUnlink(provider._id, provider.organizationName)}
                          >
                            <Unlink className="h-4 w-4 mr-2" />
                            Unlink Provider
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="mt-6 pt-6 border-t">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                        Technical Details
                      </summary>
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        <div><strong>Organization ID:</strong> {provider.organizationId}</div>
                        <div><strong>Base URL:</strong> {provider.baseUrl}</div>
                        <div><strong>Supported Resources:</strong> {provider.capabilities.supportedResources.join(', ') || 'None'}</div>
                      </div>
                    </details>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Mail, 
  UserPlus, 
  Clock,
  ArrowLeft,
  CheckCircle,
  User,
  Building2,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Pill,
  Zap,
  Filter,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Provider {
  id: string
  firstName: string
  lastName: string
  title?: string
  specialization?: string
  phone?: string
  email?: string
  isActive: boolean
  user: {
    name?: string
    email?: string
  }
  connectionStatus?: 'connected' | 'pending' | 'not_connected'
  rating?: number
  totalAppointments?: number
}

const SPECIALIZATION_ICONS: Record<string, any> = {
  'Cardiology': Heart,
  'Neurology': Brain,
  'Ophthalmology': Eye,
  'Orthopedics': Bone,
  'Pediatrics': Baby,
  'Pharmacy': Pill,
  'Emergency Medicine': Zap,
  'General Practice': User,
  'Family Medicine': User,
}

const COMMON_SPECIALIZATIONS = [
  'All Specializations',
  'General Practice',
  'Family Medicine', 
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology'
]

export default function ConnectProviderPage() {
  const { data: session, status } = useSession()
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations')
  const [connectionMessage, setConnectionMessage] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    if (session.user.role !== 'PATIENT') {
      redirect('/provider')
    }
  }, [session, status])

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    filterProviders()
  }, [searchQuery, selectedSpecialization, providers])

  const fetchProviders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/providers')
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers')
      }
      
      const data = await response.json()
      setProviders(data.providers || [])
    } catch (error) {
      console.error('Error fetching providers:', error)
      toast.error('Failed to load providers')
    } finally {
      setIsLoading(false)
    }
  }

  const filterProviders = () => {
    let filtered = [...providers]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(provider => 
        provider.firstName.toLowerCase().includes(query) ||
        provider.lastName.toLowerCase().includes(query) ||
        provider.user.name?.toLowerCase().includes(query) ||
        provider.specialization?.toLowerCase().includes(query) ||
        provider.user.email?.toLowerCase().includes(query)
      )
    }

    // Apply specialization filter
    if (selectedSpecialization !== 'All Specializations') {
      filtered = filtered.filter(provider => 
        provider.specialization === selectedSpecialization
      )
    }

    // Only show active providers
    filtered = filtered.filter(provider => provider.isActive)

    setFilteredProviders(filtered)
  }

  const handleConnectRequest = async (providerId: string, message: string) => {
    try {
      const response = await fetch('/api/provider-connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          message,
          initiatedBy: 'PATIENT'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send connection request')
      }

      // Update provider status locally
      setProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, connectionStatus: 'pending' }
          : provider
      ))

      toast.success('Connection request sent to provider!')
      setShowConnectionModal(false)
      setConnectionMessage('')
      setSelectedProvider(null)
    } catch (error: any) {
      console.error('Error sending connection request:', error)
      toast.error(error.message || 'Failed to send connection request')
    }
  }

  const openConnectionModal = (provider: Provider) => {
    setSelectedProvider(provider)
    setConnectionMessage(`Hi Dr. ${provider.lastName}, I would like to connect with you to manage my healthcare. Thank you!`)
    setShowConnectionModal(true)
  }

  const getSpecializationIcon = (specialization?: string) => {
    if (!specialization) return Stethoscope
    return SPECIALIZATION_ICONS[specialization] || Stethoscope
  }

  const getProviderDisplayName = (provider: Provider) => {
    const title = provider.title || 'Dr.'
    return provider.user.name || `${title} ${provider.firstName} ${provider.lastName}`
  }

  if (status === 'loading') {
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
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Connect with Healthcare Providers</h1>
            <p className="text-gray-600 mt-2">
              Search and connect with healthcare providers to manage your care
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Providers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Search by name, specialization, or email</Label>
                <Input
                  id="search"
                  placeholder="Enter provider name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="specialization">Filter by Specialization</Label>
                <select
                  id="specialization"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  {COMMON_SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Providers List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Healthcare Providers</CardTitle>
            <CardDescription>
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredProviders.length > 0 ? (
              <div className="space-y-4">
                {filteredProviders.map((provider) => {
                  const SpecIcon = getSpecializationIcon(provider.specialization)
                  return (
                    <div key={provider.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-[#E8EBE4] rounded-full flex items-center justify-center">
                          <SpecIcon className="h-8 w-8 text-[#5A7965]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getProviderDisplayName(provider)}
                            </h3>
                            {provider.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{provider.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          {provider.specialization && (
                            <p className="text-[#5A7965] font-medium mt-1">{provider.specialization}</p>
                          )}
                          
                          <div className="space-y-1 mt-2">
                            {provider.user.email && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span>{provider.user.email}</span>
                              </div>
                            )}
                            {provider.phone && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{provider.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {provider.connectionStatus === 'connected' && (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                        {provider.connectionStatus === 'pending' && (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Request Sent
                          </Badge>
                        )}
                        {(!provider.connectionStatus || provider.connectionStatus === 'not_connected') && (
                          <Button 
                            onClick={() => openConnectionModal(provider)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600">
                  {searchQuery || selectedSpecialization !== 'All Specializations' 
                    ? 'Try adjusting your search criteria' 
                    : 'No providers available at the moment'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Modal */}
        {showConnectionModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Connect with Provider</span>
                </CardTitle>
                <CardDescription>
                  Send a connection request to {getProviderDisplayName(selectedProvider)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <textarea
                    id="message"
                    placeholder="Include a message with your connection request..."
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowConnectionModal(false)
                      setConnectionMessage('')
                      setSelectedProvider(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleConnectRequest(selectedProvider.id, connectionMessage)}
                  >
                    Send Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
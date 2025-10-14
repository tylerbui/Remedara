'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Building2,
  ArrowLeft,
  ExternalLink,
  Shield,
  CheckCircle,
  AlertCircle,
  Globe,
  Plus,
  Search,
  Loader2,
  Info
} from 'lucide-react'
import Link from 'next/link'

interface KnownProvider {
  id: string
  name: string
  description: string
  logo?: string
  baseUrl: string
  wellKnown: string
  category: 'major' | 'regional' | 'sandbox'
  features: string[]
  testCredentials?: {
    info: string
    demoPatientId?: string
  }
}

const KNOWN_PROVIDERS: KnownProvider[] = [
  {
    id: 'epic',
    name: 'Epic MyChart',
    description: 'Major EHR system used by many large healthcare organizations',
    baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    wellKnown: 'https://fhir.epic.com/interconnect-fhir-oauth/.well-known/smart_configuration',
    category: 'major',
    features: ['Labs', 'Medications', 'Allergies', 'Vitals', 'Appointments']
  },
  {
    id: 'cerner',
    name: 'Cerner PowerChart',
    description: 'Widely used EHR system in hospitals and clinics',
    baseUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    wellKnown: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/.well-known/smart_configuration',
    category: 'major',
    features: ['Labs', 'Medications', 'Allergies', 'Immunizations']
  },
  {
    id: 'hapi-fhir',
    name: 'HAPI FHIR Test Server',
    description: 'Public FHIR test server for development and testing',
    baseUrl: 'http://hapi.fhir.org/baseR4',
    wellKnown: 'http://hapi.fhir.org/baseR4/.well-known/smart_configuration',
    category: 'sandbox',
    features: ['All Resources', 'Testing Only'],
    testCredentials: {
      info: 'This is a public test server. Any patient ID can be used for testing.',
      demoPatientId: '87a339d0-8cae-418e-89c7-8651e6aab3c6'
    }
  },
  {
    id: 'smart-sandbox',
    name: 'SMART Sandbox',
    description: 'Official SMART on FHIR testing environment',
    baseUrl: 'https://launch.smarthealthit.org/v/r4/sim',
    wellKnown: 'https://launch.smarthealthit.org/v/r4/sim/fhir/.well-known/smart_configuration',
    category: 'sandbox',
    features: ['Complete FHIR R4', 'Synthetic Data'],
    testCredentials: {
      info: 'Use the SMART Health IT launcher to generate test scenarios.',
      demoPatientId: 'smart-1288992'
    }
  }
]

export default function LinkProviderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [customFhirUrl, setCustomFhirUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) redirect('/login')
    
    // Only patients can access this page
    if (session.user.role !== 'PATIENT') {
      redirect('/provider')
    }

    // Check for callback messages
    const errorMsg = searchParams.get('error')
    const successMsg = searchParams.get('success')
    const providerName = searchParams.get('provider')

    if (errorMsg) {
      setError(decodeURIComponent(errorMsg))
    }
    if (successMsg && providerName) {
      setSuccess(`Successfully linked ${decodeURIComponent(providerName)}!`)
    }
  }, [session, status, searchParams])

  const handleProviderLink = async (provider: KnownProvider) => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`/api/fhir/authorize?provider=${provider.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to initiate provider linking')
      }
      
      const data = await response.json()
      
      // Redirect to OAuth authorization URL
      window.location.href = data.authorizationUrl
      
    } catch (error) {
      console.error('Error linking provider:', error)
      setError('Failed to connect to provider. Please try again.')
      setLoading(false)
    }
  }

  const handleCustomLink = async () => {
    if (!customFhirUrl.trim()) {
      setError('Please enter a valid FHIR server URL')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`/api/fhir/authorize?fhirUrl=${encodeURIComponent(customFhirUrl.trim())}`)
      
      if (!response.ok) {
        throw new Error('Failed to initiate provider linking')
      }
      
      const data = await response.json()
      
      // Redirect to OAuth authorization URL
      window.location.href = data.authorizationUrl
      
    } catch (error) {
      console.error('Error linking custom provider:', error)
      setError('Failed to connect to custom FHIR server. Please check the URL and try again.')
      setLoading(false)
    }
  }

  const filteredProviders = KNOWN_PROVIDERS.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const majorProviders = filteredProviders.filter(p => p.category === 'major')
  const sandboxProviders = filteredProviders.filter(p => p.category === 'sandbox')

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
            <h1 className="text-3xl font-bold text-gray-900">Link Healthcare Provider</h1>
            <p className="text-gray-600 mt-2">
              Connect your healthcare providers to access your medical records in one place
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Connection Failed</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for your healthcare provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Major Healthcare Providers */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Major Healthcare Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {majorProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span>{provider.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {provider.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Production</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Data:</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleProviderLink(provider)}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Connect to {provider.name}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testing & Sandbox Environments */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Testing & Sandbox Environments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sandboxProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow border-dashed border-2 border-gray-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        <span>{provider.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {provider.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Testing
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {provider.testCredentials && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700 text-sm">
                          {provider.testCredentials.info}
                          {provider.testCredentials.demoPatientId && (
                            <div className="mt-2">
                              <strong>Demo Patient ID:</strong> {provider.testCredentials.demoPatientId}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleProviderLink(provider)}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Connect to {provider.name}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom FHIR Server */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-purple-600" />
              <span>Custom FHIR Server</span>
            </CardTitle>
            <CardDescription>
              Connect to a custom FHIR R4 server by entering its base URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fhir-url">FHIR Server URL</Label>
                <Input
                  id="fhir-url"
                  type="url"
                  placeholder="https://your-fhir-server.com/fhir/R4"
                  value={customFhirUrl}
                  onChange={(e) => setCustomFhirUrl(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  The server must support SMART on FHIR OAuth 2.0 authorization
                </p>
              </div>
              
              <Button
                onClick={handleCustomLink}
                disabled={loading || !customFhirUrl.trim()}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect to Custom Server
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-8 border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Security & Privacy</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• All connections use OAuth 2.0 with PKCE for maximum security</p>
                  <p>• Your login credentials are never shared with Remedara</p>
                  <p>• Access tokens are encrypted and stored securely</p>
                  <p>• You can revoke access at any time from your dashboard</p>
                  <p>• Data is synced using industry-standard FHIR protocols</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
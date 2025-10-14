import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { generatePKCE, generateState, encrypt } from '@/lib/encryption'
import { connectToDatabase } from '@/lib/mongodb'
import { COLLECTIONS, type LinkedProvider, type SMARTConfiguration } from '@/lib/models/fhir'

// Known FHIR endpoints - in production, discover these dynamically
const KNOWN_FHIR_ENDPOINTS = {
  epic: {
    name: 'Epic MyChart',
    baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    wellKnown: 'https://fhir.epic.com/interconnect-fhir-oauth/.well-known/smart_configuration'
  },
  cerner: {
    name: 'Cerner PowerChart',
    baseUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    wellKnown: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/.well-known/smart_configuration'
  },
  // Add more as needed
}

/**
 * GET /api/fhir/authorize
 * Initiates SMART on FHIR OAuth flow with PKCE
 * 
 * Query params:
 * - provider: Known provider key (epic, cerner) or custom base URL
 * - fhirUrl: Custom FHIR base URL (if not using known provider)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')
    const customFhirUrl = searchParams.get('fhirUrl')

    if (!provider && !customFhirUrl) {
      return NextResponse.json(
        { error: 'provider or fhirUrl parameter required' },
        { status: 400 }
      )
    }

    let baseUrl: string
    let wellKnownUrl: string
    let providerName: string

    if (provider && KNOWN_FHIR_ENDPOINTS[provider as keyof typeof KNOWN_FHIR_ENDPOINTS]) {
      const endpoint = KNOWN_FHIR_ENDPOINTS[provider as keyof typeof KNOWN_FHIR_ENDPOINTS]
      baseUrl = endpoint.baseUrl
      wellKnownUrl = endpoint.wellKnown
      providerName = endpoint.name
    } else if (customFhirUrl) {
      baseUrl = customFhirUrl
      wellKnownUrl = `${customFhirUrl}/.well-known/smart_configuration`
      providerName = new URL(customFhirUrl).hostname
    } else {
      return NextResponse.json(
        { error: 'Unknown provider or invalid fhirUrl' },
        { status: 400 }
      )
    }

    // Discover SMART configuration
    let smartConfig: SMARTConfiguration
    try {
      const response = await fetch(wellKnownUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Remedara/1.0 SMART-on-FHIR Client'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SMART configuration: ${response.status}`)
      }
      
      smartConfig = await response.json()
    } catch (error) {
      console.error('Error fetching SMART configuration:', error)
      return NextResponse.json(
        { error: 'Failed to discover SMART configuration' },
        { status: 500 }
      )
    }

    // Validate required SMART capabilities
    if (!smartConfig.authorization_endpoint || !smartConfig.token_endpoint) {
      return NextResponse.json(
        { error: 'Invalid SMART configuration - missing required endpoints' },
        { status: 400 }
      )
    }

    // Generate PKCE parameters
    const { codeVerifier, codeChallenge, codeChallengeMethod } = generatePKCE()
    const state = generateState()

    // Store linking session in database
    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)
    
    // Create or update linking session
    const linkingSession: Partial<LinkedProvider> = {
      userId,
      organizationName: providerName,
      baseUrl,
      smartConfig,
      pkceCodeVerifier: codeVerifier,
      pkceState: state,
      status: 'active', // Will be updated when linking completes
      syncEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      complianceFlags: {
        auditEnabled: true,
        encryptionVerified: false,
        consentVerified: false,
        dataRetentionDays: 365
      },
      capabilities: {
        canSchedule: false,
        canMessage: false,
        canAccessLabs: smartConfig.scopes_supported?.includes('patient/Observation.read') || false,
        canAccessMedications: smartConfig.scopes_supported?.includes('patient/MedicationRequest.read') || false,
        canAccessAllergies: smartConfig.scopes_supported?.includes('patient/AllergyIntolerance.read') || false,
        canAccessVitals: smartConfig.scopes_supported?.includes('patient/Observation.read') || false,
        supportedResources: []
      }
    }

    // Store temporary linking session (will be completed in callback)
    await db.collection(COLLECTIONS.LINKED_PROVIDERS).insertOne(linkingSession as LinkedProvider)

    // Build authorization URL
    const authParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SMART_CLIENT_ID || 'remedara-client',
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/fhir/callback`,
      scope: 'openid profile patient/Patient.read patient/Observation.read patient/MedicationRequest.read patient/AllergyIntolerance.read patient/Immunization.read patient/DiagnosticReport.read',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      aud: baseUrl
    })

    const authorizationUrl = `${smartConfig.authorization_endpoint}?${authParams.toString()}`

    // Return authorization URL for redirect
    return NextResponse.json({
      authorizationUrl,
      provider: providerName,
      baseUrl,
      state
    })

  } catch (error) {
    console.error('Error in FHIR authorize:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
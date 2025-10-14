import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { encrypt, hashPatientId } from '@/lib/encryption'
import { connectToDatabase } from '@/lib/mongodb'
import { COLLECTIONS, type LinkedProvider, type OAuthTokens, type PatientIdentity, type FHIRAuditLog } from '@/lib/models/fhir'

/**
 * GET /api/fhir/callback
 * Handles OAuth callback from SMART on FHIR authorization server
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=unauthorized`)
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/patient/dashboard?error=oauth_failed&message=${encodeURIComponent(errorDescription || error)}`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/patient/dashboard?error=invalid_callback`
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Find the linking session by state parameter
    const linkingSession = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .findOne({
        userId,
        pkceState: state,
        pkceCodeVerifier: { $exists: true }
      }) as LinkedProvider | null

    if (!linkingSession) {
      console.error('No linking session found for state:', state)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/patient/dashboard?error=invalid_state`
      )
    }

    // Exchange authorization code for tokens
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/fhir/callback`,
      client_id: process.env.SMART_CLIENT_ID || 'remedara-client',
      code_verifier: linkingSession.pkceCodeVerifier!
    })

    let tokenResponse: Response
    let tokens: OAuthTokens

    try {
      tokenResponse = await fetch(linkingSession.smartConfig.token_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'Remedara/1.0 SMART-on-FHIR Client'
        },
        body: tokenParams.toString()
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`)
      }

      tokens = await tokenResponse.json()
    } catch (error) {
      console.error('Token exchange error:', error)
      
      // Log audit event
      await logAuditEvent(db, linkingSession._id!, userId, 'link_created', false, error instanceof Error ? error.message : 'Unknown error')
      
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/patient/dashboard?error=token_exchange_failed`
      )
    }

    // Validate token response
    if (!tokens.access_token || !tokens.patient) {
      console.error('Invalid token response - missing access_token or patient')
      
      await logAuditEvent(db, linkingSession._id!, userId, 'link_created', false, 'Missing access_token or patient')
      
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/patient/dashboard?error=invalid_token_response`
      )
    }

    // Fetch patient information to get identifiers
    let patientResource: any
    try {
      const patientResponse = await fetch(`${linkingSession.baseUrl}/Patient/${tokens.patient}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Accept': 'application/fhir+json',
          'User-Agent': 'Remedara/1.0 SMART-on-FHIR Client'
        }
      })

      if (patientResponse.ok) {
        patientResource = await patientResponse.json()
      } else {
        console.warn('Failed to fetch patient resource:', patientResponse.status)
      }
    } catch (error) {
      console.warn('Error fetching patient resource:', error)
    }

    // Extract patient identities
    const patientIdentities: PatientIdentity[] = []
    
    // Add FHIR patient ID
    patientIdentities.push({
      system: `${linkingSession.baseUrl}/Patient`,
      value: tokens.patient,
      hashedValue: hashPatientId(tokens.patient),
      use: 'official'
    })

    // Add additional identifiers from Patient resource
    if (patientResource?.identifier) {
      for (const identifier of patientResource.identifier) {
        if (identifier.system && identifier.value) {
          patientIdentities.push({
            system: identifier.system,
            value: identifier.value,
            hashedValue: hashPatientId(`${identifier.system}|${identifier.value}`),
            use: identifier.use || 'usual'
          })
        }
      }
    }

    // Encrypt tokens
    const encryptedTokens = encrypt(JSON.stringify(tokens))

    // Calculate token expiry
    const tokenExpiresAt = new Date(Date.now() + (tokens.expires_in * 1000))

    // Extract organization info if available
    let organizationId = 'unknown'
    let organizationMetadata = {
      resourceType: 'Organization' as const,
      id: 'unknown',
      name: linkingSession.organizationName
    }

    // Try to get organization info from patient resource
    if (patientResource?.managingOrganization?.reference) {
      const orgRef = patientResource.managingOrganization.reference
      if (orgRef.startsWith('Organization/')) {
        organizationId = orgRef.replace('Organization/', '')
        
        // Optionally fetch full organization resource
        try {
          const orgResponse = await fetch(`${linkingSession.baseUrl}/${orgRef}`, {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`,
              'Accept': 'application/fhir+json'
            }
          })
          
          if (orgResponse.ok) {
            organizationMetadata = await orgResponse.json()
          }
        } catch (error) {
          console.warn('Failed to fetch organization resource:', error)
        }
      }
    }

    // Update capabilities based on actual scopes granted
    const grantedScopes = tokens.scope.split(' ')
    const capabilities = {
      canSchedule: grantedScopes.some(scope => scope.includes('Appointment')),
      canMessage: grantedScopes.some(scope => scope.includes('Communication')),
      canAccessLabs: grantedScopes.some(scope => scope.includes('Observation')),
      canAccessMedications: grantedScopes.some(scope => scope.includes('MedicationRequest')),
      canAccessAllergies: grantedScopes.some(scope => scope.includes('AllergyIntolerance')),
      canAccessVitals: grantedScopes.some(scope => scope.includes('Observation')),
      supportedResources: grantedScopes
        .filter(scope => scope.includes('/'))
        .map(scope => scope.split('/')[0].replace('patient', ''))
        .filter(resource => resource && resource !== 'patient')
    }

    // Complete the linking by updating the provider record
    const updateResult = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .updateOne(
        { _id: linkingSession._id },
        {
          $set: {
            organizationId,
            organizationMetadata,
            patientIdentities,
            encryptedTokens,
            tokenExpiresAt,
            tokenScope: tokens.scope,
            capabilities,
            status: 'active',
            linkingCompletedAt: new Date(),
            updatedAt: new Date(),
            'complianceFlags.encryptionVerified': true,
            'complianceFlags.consentVerified': true
          },
          $unset: {
            pkceCodeVerifier: '',
            pkceState: ''
          }
        }
      )

    if (updateResult.modifiedCount === 0) {
      console.error('Failed to update linking session')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/patient/dashboard?error=update_failed`
      )
    }

    // Log successful linking
    await logAuditEvent(db, linkingSession._id!, userId, 'link_created', true)

    // Schedule initial data sync (if you have a job queue)
    // await scheduleInitialSync(linkingSession._id!)

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/patient/dashboard?success=provider_linked&provider=${encodeURIComponent(linkingSession.organizationName)}`
    )

  } catch (error) {
    console.error('Error in FHIR callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/patient/dashboard?error=callback_failed`
    )
  }
}

/**
 * Helper function to log audit events
 */
async function logAuditEvent(
  db: any,
  linkedProviderId: ObjectId,
  userId: ObjectId,
  action: FHIRAuditLog['action'],
  success: boolean,
  error?: string,
  metadata?: Record<string, any>
) {
  const auditLog: Omit<FHIRAuditLog, '_id'> = {
    linkedProviderId,
    userId,
    action,
    timestamp: new Date(),
    success,
    error,
    metadata
  }

  try {
    await db.collection(COLLECTIONS.FHIR_AUDIT_LOGS).insertOne(auditLog)
  } catch (auditError) {
    console.error('Failed to log audit event:', auditError)
  }
}
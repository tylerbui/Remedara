import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { COLLECTIONS, type LinkedProvider, type FHIRAuditLog } from '@/lib/models/fhir'
import { FHIRClient } from '@/lib/fhir-client'
import { decrypt } from '@/lib/encryption'

/**
 * GET /api/fhir/providers
 * List all linked providers for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    const providers = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .find(
        { userId },
        {
          projection: {
            // Exclude sensitive data from API response
            encryptedTokens: 0,
            pkceCodeVerifier: 0,
            pkceState: 0
          }
        }
      )
      .sort({ createdAt: -1 })
      .toArray() as LinkedProvider[]

    // Add computed fields
    const providersWithStatus = providers.map(provider => ({
      ...provider,
      isTokenExpiring: provider.tokenExpiresAt <= new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24h
      isTokenExpired: provider.tokenExpiresAt <= new Date(),
      daysSinceLastSync: provider.lastSyncAt 
        ? Math.floor((Date.now() - provider.lastSyncAt.getTime()) / (1000 * 60 * 60 * 24))
        : null
    }))

    return NextResponse.json({
      providers: providersWithStatus,
      total: providers.length,
      active: providers.filter(p => p.status === 'active').length,
      expired: providers.filter(p => p.status === 'expired').length
    })

  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/fhir/providers?id=<providerId>
 * Unlink/revoke a FHIR provider
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('id')

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)
    const linkedProviderId = new ObjectId(providerId)

    // Find the provider to unlink
    const provider = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .findOne({
        _id: linkedProviderId,
        userId
      }) as LinkedProvider

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Revoke tokens if possible
    let revocationSuccess = false
    if (provider.smartConfig.revocation_endpoint && provider.status === 'active') {
      try {
        const fhirClient = new FHIRClient(provider)
        
        // Attempt to revoke the refresh token
        const tokens = JSON.parse(decrypt(provider.encryptedTokens))
        if (tokens.refresh_token) {
          const revokeParams = new URLSearchParams({
            token: tokens.refresh_token,
            token_type_hint: 'refresh_token',
            client_id: process.env.SMART_CLIENT_ID || 'remedara-client'
          })

          const revokeResponse = await fetch(provider.smartConfig.revocation_endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            body: revokeParams.toString()
          })

          revocationSuccess = revokeResponse.ok
          if (!revocationSuccess) {
            console.warn(`Token revocation failed for provider ${providerId}: ${revokeResponse.status}`)
          }
        }
      } catch (error) {
        console.error('Error revoking tokens:', error)
        // Continue with unlinking even if revocation fails
      }
    }

    // Update provider status to revoked
    await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .updateOne(
        { _id: linkedProviderId },
        {
          $set: {
            status: 'revoked',
            syncEnabled: false,
            updatedAt: new Date()
          },
          $unset: {
            encryptedTokens: '',
            pkceCodeVerifier: '',
            pkceState: ''
          }
        }
      )

    // Remove timeline entries for this provider
    await db
      .collection(COLLECTIONS.UNIFIED_TIMELINE)
      .deleteMany({ linkedProviderId })

    // Log audit event
    const auditLog: Omit<FHIRAuditLog, '_id'> = {
      linkedProviderId,
      userId,
      action: 'link_revoked',
      timestamp: new Date(),
      success: true,
      metadata: {
        tokenRevocationSuccess: revocationSuccess,
        revokedBy: 'patient'
      }
    }
    
    await db.collection(COLLECTIONS.FHIR_AUDIT_LOGS).insertOne(auditLog)

    return NextResponse.json({
      success: true,
      message: 'Provider successfully unlinked',
      tokenRevoked: revocationSuccess
    })

  } catch (error) {
    console.error('Error unlinking provider:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
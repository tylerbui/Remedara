import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { COLLECTIONS, type UnifiedTimelineEntry } from '@/lib/models/fhir'
import { FHIRClient } from '@/lib/fhir-client'

/**
 * GET /api/fhir/timeline
 * Get unified timeline of patient data from all linked providers
 * 
 * Query params:
 * - category: Filter by category (lab, medication, allergy, vital, etc.)
 * - provider: Filter by specific provider ID
 * - since: Get entries since this date (ISO string)
 * - search: Text search in titles and summaries
 * - limit: Number of entries to return (default 50)
 * - offset: Pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const providerId = searchParams.get('provider')
    const since = searchParams.get('since')
    const searchQuery = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Build query
    const query: any = { userId }

    if (category) {
      query.category = category
    }

    if (providerId) {
      query.linkedProviderId = new ObjectId(providerId)
    }

    if (since) {
      query.effectiveDate = { $gte: new Date(since) }
    }

    if (searchQuery) {
      query.$text = { $search: searchQuery }
    }

    // Get timeline entries
    const timelineEntries = await db
      .collection(COLLECTIONS.UNIFIED_TIMELINE)
      .find(query)
      .sort({ effectiveDate: -1 })
      .skip(offset)
      .limit(limit)
      .toArray() as UnifiedTimelineEntry[]

    // Get total count for pagination
    const totalCount = await db
      .collection(COLLECTIONS.UNIFIED_TIMELINE)
      .countDocuments(query)

    // Group by date for timeline view
    const groupedByDate = timelineEntries.reduce((acc, entry) => {
      const dateKey = entry.effectiveDate.toISOString().split('T')[0] // YYYY-MM-DD
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(entry)
      return acc
    }, {} as Record<string, UnifiedTimelineEntry[]>)

    // Get provider info for filtering UI
    const providers = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .find(
        { userId, status: 'active' },
        { projection: { organizationName: 1, organizationId: 1, capabilities: 1 } }
      )
      .toArray()

    return NextResponse.json({
      timeline: timelineEntries,
      groupedByDate,
      providers,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      categories: [
        { key: 'lab', label: 'Lab Results', count: await getCountByCategory(db, userId, 'lab') },
        { key: 'vital', label: 'Vital Signs', count: await getCountByCategory(db, userId, 'vital') },
        { key: 'medication', label: 'Medications', count: await getCountByCategory(db, userId, 'medication') },
        { key: 'allergy', label: 'Allergies', count: await getCountByCategory(db, userId, 'allergy') },
        { key: 'immunization', label: 'Immunizations', count: await getCountByCategory(db, userId, 'immunization') },
        { key: 'procedure', label: 'Procedures', count: await getCountByCategory(db, userId, 'procedure') },
        { key: 'encounter', label: 'Encounters', count: await getCountByCategory(db, userId, 'encounter') }
      ]
    })

  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/fhir/timeline/sync
 * Trigger data sync for specific provider or all providers
 * 
 * Body:
 * - providerId?: ObjectId (optional, sync specific provider)
 * - resourceTypes?: string[] (optional, sync specific resource types)
 * - since?: string (optional, incremental sync since date)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { providerId, resourceTypes, since } = body

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    let providersToSync: ObjectId[] = []

    if (providerId) {
      // Sync specific provider
      const provider = await db
        .collection(COLLECTIONS.LINKED_PROVIDERS)
        .findOne({
          _id: new ObjectId(providerId),
          userId,
          status: 'active'
        })

      if (!provider) {
        return NextResponse.json(
          { error: 'Provider not found or not active' },
          { status: 404 }
        )
      }

      providersToSync = [new ObjectId(providerId)]
    } else {
      // Sync all active providers
      const providers = await db
        .collection(COLLECTIONS.LINKED_PROVIDERS)
        .find(
          { userId, status: 'active', syncEnabled: true },
          { projection: { _id: 1 } }
        )
        .toArray()

      providersToSync = providers.map(p => p._id)
    }

    if (providersToSync.length === 0) {
      return NextResponse.json(
        { error: 'No providers available for sync' },
        { status: 400 }
      )
    }

    // Perform sync for each provider
    const syncResults = []
    
    for (const linkedProviderId of providersToSync) {
      try {
        const fhirClient = await FHIRClient.fromDatabase(linkedProviderId)
        
        const result = await fhirClient.syncPatientData({
          since,
          resourceTypes
        })

        syncResults.push({
          providerId: linkedProviderId.toString(),
          success: true,
          synced: result.synced,
          errors: result.errors
        })

      } catch (error) {
        console.error(`Sync failed for provider ${linkedProviderId}:`, error)
        syncResults.push({
          providerId: linkedProviderId.toString(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Calculate totals
    const totalSynced = syncResults.reduce((sum, result) => {
      if (result.success && result.synced) {
        return sum + Object.values(result.synced as Record<string, number>).reduce((a, b) => a + b, 0)
      }
      return sum
    }, 0)

    const totalErrors = syncResults.reduce((sum, result) => {
      if (result.success && result.errors) {
        return sum + (result.errors as Array<any>).length
      }
      return sum + (result.success ? 0 : 1)
    }, 0)

    return NextResponse.json({
      success: true,
      syncResults,
      summary: {
        providersProcessed: providersToSync.length,
        totalRecordsSynced: totalSynced,
        totalErrors,
        syncedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in sync operation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Helper function to get count by category
 */
async function getCountByCategory(db: any, userId: ObjectId, category: string): Promise<number> {
  return db
    .collection(COLLECTIONS.UNIFIED_TIMELINE)
    .countDocuments({ userId, category })
}
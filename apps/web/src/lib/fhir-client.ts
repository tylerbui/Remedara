import { decrypt, encrypt } from './encryption'
import { connectToDatabase } from './mongodb'
import { COLLECTIONS, type LinkedProvider, type OAuthTokens, type UnifiedTimelineEntry } from './models/fhir'
import { ObjectId } from 'mongodb'

// FHIR R4 Resource Types
export interface FHIRResource {
  resourceType: string
  id: string
  meta?: {
    versionId?: string
    lastUpdated?: string
    source?: string
    profile?: string[]
    security?: Array<{
      system: string
      code: string
      display?: string
    }>
    tag?: Array<{
      system: string
      code: string
      display?: string
    }>
  }
}

export interface FHIRBundle {
  resourceType: 'Bundle'
  id?: string
  meta?: FHIRResource['meta']
  type: 'searchset' | 'collection' | 'transaction' | 'batch'
  total?: number
  link?: Array<{
    relation: 'self' | 'next' | 'previous' | 'first' | 'last'
    url: string
  }>
  entry?: Array<{
    fullUrl?: string
    resource?: FHIRResource
    search?: {
      mode?: 'match' | 'include' | 'outcome'
      score?: number
    }
  }>
}

export interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient'
  identifier?: Array<{
    use?: 'usual' | 'official' | 'temp' | 'secondary'
    system: string
    value: string
  }>
  name?: Array<{
    use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden'
    family: string
    given: string[]
    prefix?: string[]
    suffix?: string[]
  }>
  gender?: 'male' | 'female' | 'other' | 'unknown'
  birthDate?: string
  managingOrganization?: {
    reference: string
    display?: string
  }
}

export interface FHIRObservation extends FHIRResource {
  resourceType: 'Observation'
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled'
  category?: Array<{
    coding: Array<{
      system: string
      code: string
      display?: string
    }>
  }>
  code: {
    coding: Array<{
      system: string
      code: string
      display?: string
    }>
    text?: string
  }
  subject: {
    reference: string
    display?: string
  }
  effectiveDateTime?: string
  effectivePeriod?: {
    start?: string
    end?: string
  }
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
  }
  valueString?: string
  valueBoolean?: boolean
  component?: Array<{
    code: {
      coding: Array<{
        system: string
        code: string
        display?: string
      }>
    }
    valueQuantity?: {
      value: number
      unit: string
      system: string
      code: string
    }
  }>
}

export interface FHIRMedicationRequest extends FHIRResource {
  resourceType: 'MedicationRequest'
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown'
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option'
  medicationCodeableConcept?: {
    coding: Array<{
      system: string
      code: string
      display?: string
    }>
    text?: string
  }
  subject: {
    reference: string
    display?: string
  }
  authoredOn?: string
  requester?: {
    reference: string
    display?: string
  }
  dosageInstruction?: Array<{
    text?: string
    timing?: {
      repeat?: {
        frequency?: number
        period?: number
        periodUnit?: string
      }
    }
    route?: {
      coding: Array<{
        system: string
        code: string
        display?: string
      }>
    }
    doseAndRate?: Array<{
      doseQuantity?: {
        value: number
        unit: string
        system: string
        code: string
      }
    }>
  }>
  dispenseRequest?: {
    numberOfRepeatsAllowed?: number
    quantity?: {
      value: number
      unit: string
      system: string
      code: string
    }
  }
}

/**
 * FHIR Client with token management and sync capabilities
 */
export class FHIRClient {
  private linkedProvider: LinkedProvider
  private tokens: OAuthTokens
  
  constructor(linkedProvider: LinkedProvider) {
    this.linkedProvider = linkedProvider
    this.tokens = JSON.parse(decrypt(linkedProvider.encryptedTokens))
  }

  /**
   * Create FHIRClient from database
   */
  static async fromDatabase(linkedProviderId: ObjectId): Promise<FHIRClient> {
    const { db } = await connectToDatabase()
    
    const provider = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .findOne({ _id: linkedProviderId }) as LinkedProvider
    
    if (!provider) {
      throw new Error('LinkedProvider not found')
    }
    
    if (provider.status !== 'active') {
      throw new Error(`LinkedProvider is ${provider.status}`)
    }
    
    // Check if token is expired and refresh if needed
    if (provider.tokenExpiresAt <= new Date()) {
      await FHIRClient.refreshToken(linkedProviderId)
      
      // Fetch updated provider
      const updatedProvider = await db
        .collection(COLLECTIONS.LINKED_PROVIDERS)
        .findOne({ _id: linkedProviderId }) as LinkedProvider
      
      return new FHIRClient(updatedProvider)
    }
    
    return new FHIRClient(provider)
  }

  /**
   * Refresh OAuth token
   */
  static async refreshToken(linkedProviderId: ObjectId): Promise<void> {
    const { db } = await connectToDatabase()
    
    const provider = await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .findOne({ _id: linkedProviderId }) as LinkedProvider
    
    if (!provider?.tokens?.refresh_token) {
      throw new Error('No refresh token available')
    }
    
    const currentTokens: OAuthTokens = JSON.parse(decrypt(provider.encryptedTokens))
    
    const refreshParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: currentTokens.refresh_token!,
      client_id: process.env.SMART_CLIENT_ID || 'remedara-client'
    })
    
    const response = await fetch(provider.smartConfig.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: refreshParams.toString()
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Token refresh failed: ${response.status} - ${errorText}`)
    }
    
    const newTokens: OAuthTokens = await response.json()
    
    // Keep the refresh token if not provided in response
    if (!newTokens.refresh_token && currentTokens.refresh_token) {
      newTokens.refresh_token = currentTokens.refresh_token
    }
    
    const encryptedTokens = encrypt(JSON.stringify(newTokens))
    const tokenExpiresAt = new Date(Date.now() + (newTokens.expires_in * 1000))
    
    await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .updateOne(
        { _id: linkedProviderId },
        {
          $set: {
            encryptedTokens,
            tokenExpiresAt,
            tokenScope: newTokens.scope,
            updatedAt: new Date()
          }
        }
      )
  }

  /**
   * Make authenticated FHIR request
   */
  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.linkedProvider.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.tokens.access_token}`,
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        'User-Agent': 'Remedara/1.0 SMART-on-FHIR Client',
        ...options.headers
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`FHIR request failed: ${response.status} - ${errorText}`)
    }
    
    return response.json()
  }

  /**
   * Search for resources with pagination support
   */
  async search<T extends FHIRResource>(
    resourceType: string,
    params: Record<string, string | number> = {},
    options: {
      count?: number
      since?: string
      include?: string[]
      revInclude?: string[]
    } = {}
  ): Promise<FHIRBundle> {
    const searchParams = new URLSearchParams()
    
    // Add search parameters
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, value.toString())
    }
    
    // Add options
    if (options.count) searchParams.append('_count', options.count.toString())
    if (options.since) searchParams.append('_since', options.since)
    if (options.include) {
      options.include.forEach(inc => searchParams.append('_include', inc))
    }
    if (options.revInclude) {
      options.revInclude.forEach(inc => searchParams.append('_revinclude', inc))
    }
    
    const path = `/${resourceType}?${searchParams.toString()}`
    return this.request<FHIRBundle>(path)
  }

  /**
   * Get a specific resource by ID
   */
  async read<T extends FHIRResource>(resourceType: string, id: string): Promise<T> {
    return this.request<T>(`/${resourceType}/${id}`)
  }

  /**
   * Get patient data
   */
  async getPatient(): Promise<FHIRPatient> {
    if (!this.tokens.patient) {
      throw new Error('No patient context in token')
    }
    return this.read<FHIRPatient>('Patient', this.tokens.patient)
  }

  /**
   * Get patient observations (labs, vitals, etc.)
   */
  async getObservations(options: {
    category?: 'vital-signs' | 'laboratory' | 'imaging' | 'procedure' | 'social-history'
    since?: string
    count?: number
  } = {}): Promise<FHIRBundle> {
    const params: Record<string, string> = {
      patient: this.tokens.patient!,
      _sort: '-date'
    }
    
    if (options.category) {
      params.category = options.category
    }
    
    return this.search('Observation', params, {
      count: options.count || 100,
      since: options.since
    })
  }

  /**
   * Get patient medications
   */
  async getMedications(options: {
    status?: string[]
    since?: string
    count?: number
  } = {}): Promise<FHIRBundle> {
    const params: Record<string, string> = {
      patient: this.tokens.patient!,
      _sort: '-authored-on'
    }
    
    if (options.status) {
      params.status = options.status.join(',')
    }
    
    return this.search('MedicationRequest', params, {
      count: options.count || 100,
      since: options.since
    })
  }

  /**
   * Get patient allergies
   */
  async getAllergies(options: {
    since?: string
    count?: number
  } = {}): Promise<FHIRBundle> {
    return this.search('AllergyIntolerance', 
      {
        patient: this.tokens.patient!,
        _sort: '-recorded-date'
      },
      {
        count: options.count || 100,
        since: options.since
      }
    )
  }

  /**
   * Sync all patient data and store in unified timeline
   */
  async syncPatientData(options: {
    since?: string
    resourceTypes?: string[]
  } = {}): Promise<{
    synced: Record<string, number>
    errors: Array<{ resourceType: string, error: string }>
  }> {
    const resourceTypes = options.resourceTypes || [
      'Observation',
      'MedicationRequest', 
      'AllergyIntolerance',
      'Immunization',
      'DiagnosticReport',
      'Procedure'
    ]
    
    const synced: Record<string, number> = {}
    const errors: Array<{ resourceType: string, error: string }> = []
    
    for (const resourceType of resourceTypes) {
      try {
        const bundle = await this.search(resourceType, 
          {
            patient: this.tokens.patient!,
            _sort: '-_lastUpdated'
          },
          {
            count: 1000, // Adjust based on your needs
            since: options.since
          }
        )
        
        if (bundle.entry) {
          const timelineEntries = await this.convertToTimelineEntries(bundle.entry, resourceType)
          await this.saveTimelineEntries(timelineEntries)
          synced[resourceType] = bundle.entry.length
        } else {
          synced[resourceType] = 0
        }
        
      } catch (error) {
        console.error(`Error syncing ${resourceType}:`, error)
        errors.push({
          resourceType,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        synced[resourceType] = 0
      }
    }
    
    // Update last sync time
    const { db } = await connectToDatabase()
    await db
      .collection(COLLECTIONS.LINKED_PROVIDERS)
      .updateOne(
        { _id: this.linkedProvider._id },
        {
          $set: {
            lastSyncAt: new Date(),
            lastSyncSuccess: errors.length === 0,
            lastSyncError: errors.length > 0 ? errors[0].error : null,
            updatedAt: new Date()
          }
        }
      )
    
    return { synced, errors }
  }

  /**
   * Convert FHIR resources to timeline entries
   */
  private async convertToTimelineEntries(
    entries: FHIRBundle['entry']!, 
    resourceType: string
  ): Promise<UnifiedTimelineEntry[]> {
    const timelineEntries: UnifiedTimelineEntry[] = []
    
    for (const entry of entries) {
      if (!entry.resource) continue
      
      const resource = entry.resource
      let effectiveDate: Date
      let category: UnifiedTimelineEntry['category']
      let title: string
      let summary: string | undefined
      let searchTerms: string[] = []
      let tags: string[] = [resourceType.toLowerCase()]
      
      // Extract data based on resource type
      switch (resourceType) {
        case 'Observation':
          const obs = resource as FHIRObservation
          effectiveDate = new Date(obs.effectiveDateTime || obs.effectivePeriod?.start || resource.meta?.lastUpdated || new Date())
          category = obs.category?.[0]?.coding?.[0]?.code === 'vital-signs' ? 'vital' : 'lab'
          title = obs.code.text || obs.code.coding?.[0]?.display || 'Observation'
          summary = obs.valueQuantity ? `${obs.valueQuantity.value} ${obs.valueQuantity.unit}` : obs.valueString
          searchTerms = [title, summary || '', obs.code.coding?.[0]?.code || ''].filter(Boolean)
          break
          
        case 'MedicationRequest':
          const med = resource as FHIRMedicationRequest
          effectiveDate = new Date(med.authoredOn || resource.meta?.lastUpdated || new Date())
          category = 'medication'
          title = med.medicationCodeableConcept?.text || med.medicationCodeableConcept?.coding?.[0]?.display || 'Medication'
          summary = med.dosageInstruction?.[0]?.text
          searchTerms = [title, summary || '', med.medicationCodeableConcept?.coding?.[0]?.code || ''].filter(Boolean)
          tags.push(med.status)
          break
          
        case 'AllergyIntolerance':
          effectiveDate = new Date(resource.meta?.lastUpdated || new Date())
          category = 'allergy'
          title = (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Allergy'
          summary = (resource as any).reaction?.[0]?.description
          searchTerms = [title, summary || ''].filter(Boolean)
          break
          
        default:
          effectiveDate = new Date(resource.meta?.lastUpdated || new Date())
          category = 'other'
          title = `${resourceType} - ${resource.id}`
          searchTerms = [title]
      }
      
      const timelineEntry: UnifiedTimelineEntry = {
        userId: this.linkedProvider.userId,
        linkedProviderId: this.linkedProvider._id!,
        organizationName: this.linkedProvider.organizationName,
        fhirResourceType: resourceType,
        fhirResourceId: resource.id,
        fhirResource: resource,
        effectiveDate,
        syncedAt: new Date(),
        category,
        title,
        summary,
        providerActions: {
          canMessage: this.linkedProvider.capabilities.canMessage,
          canSchedule: this.linkedProvider.capabilities.canSchedule
        },
        searchTerms,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      timelineEntries.push(timelineEntry)
    }
    
    return timelineEntries
  }

  /**
   * Save timeline entries to database
   */
  private async saveTimelineEntries(entries: UnifiedTimelineEntry[]): Promise<void> {
    if (entries.length === 0) return
    
    const { db } = await connectToDatabase()
    
    // Use upsert to avoid duplicates
    for (const entry of entries) {
      await db
        .collection(COLLECTIONS.UNIFIED_TIMELINE)
        .replaceOne(
          {
            linkedProviderId: entry.linkedProviderId,
            fhirResourceType: entry.fhirResourceType,
            fhirResourceId: entry.fhirResourceId
          },
          entry,
          { upsert: true }
        )
    }
  }
}
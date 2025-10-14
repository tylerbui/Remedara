import { ObjectId } from 'mongodb'
import { EncryptedData } from '../encryption'

// FHIR Organization metadata
export interface FHIROrganization {
  resourceType: 'Organization'
  id: string
  name: string
  alias?: string[]
  telecom?: Array<{
    system: 'phone' | 'fax' | 'email' | 'url'
    value: string
    use?: 'work' | 'home' | 'mobile'
  }>
  address?: Array<{
    use?: 'work' | 'home' | 'billing'
    line?: string[]
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }>
}

// SMART on FHIR Configuration
export interface SMARTConfiguration {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint?: string
  introspection_endpoint?: string
  revocation_endpoint?: string
  scopes_supported: string[]
  response_types_supported: string[]
  grant_types_supported: string[]
  code_challenge_methods_supported: string[]
  capabilities: string[]
}

// OAuth Token Response
export interface OAuthTokens {
  access_token: string
  refresh_token?: string
  token_type: 'Bearer'
  expires_in: number
  scope: string
  patient?: string // FHIR Patient ID
  encounter?: string // FHIR Encounter ID
  intent?: string
  smart_style_url?: string
}

// Patient Identity mapping
export interface PatientIdentity {
  system: string // e.g., "http://hospital.smart/identifiers"
  value: string  // Patient ID in the source system
  hashedValue: string // Privacy-protected hash
  use?: 'usual' | 'official' | 'temp' | 'secondary'
  period?: {
    start?: string
    end?: string
  }
}

// Audit log entry
export interface FHIRAuditLog {
  _id?: ObjectId
  linkedProviderId: ObjectId
  userId: ObjectId
  action: 'token_refresh' | 'data_sync' | 'data_access' | 'link_created' | 'link_revoked'
  resource?: string // FHIR resource type accessed
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  success: boolean
  error?: string
  metadata?: Record<string, any>
}

// Main LinkedProvider document
export interface LinkedProvider {
  _id?: ObjectId
  userId: ObjectId // Remedara user ID
  
  // Provider Organization Info
  organizationId: string // FHIR Organization ID
  organizationName: string
  organizationMetadata: FHIROrganization
  
  // SMART on FHIR Configuration
  smartConfig: SMARTConfiguration
  baseUrl: string // FHIR base URL (e.g., https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4)
  
  // Patient Identity
  patientIdentities: PatientIdentity[] // Multiple identifiers for same patient
  
  // OAuth Tokens (encrypted)
  encryptedTokens: EncryptedData
  tokenExpiresAt: Date
  tokenScope: string
  
  // PKCE session data (temporary, cleared after auth)
  pkceCodeVerifier?: string
  pkceState?: string
  
  // Sync tracking
  lastSyncAt?: Date
  lastSyncSuccess?: boolean
  lastSyncError?: string
  syncEnabled: boolean
  
  // Status and metadata
  status: 'active' | 'expired' | 'revoked' | 'error'
  linkingCompletedAt?: Date
  createdAt: Date
  updatedAt: Date
  
  // Features and capabilities
  capabilities: {
    canSchedule: boolean
    canMessage: boolean
    canAccessLabs: boolean
    canAccessMedications: boolean
    canAccessAllergies: boolean
    canAccessVitals: boolean
    supportedResources: string[] // FHIR resource types
  }
  
  // Rate limiting and compliance
  rateLimitRemaining?: number
  rateLimitReset?: Date
  complianceFlags: {
    auditEnabled: boolean
    encryptionVerified: boolean
    consentVerified: boolean
    dataRetentionDays: number
  }
}

// FHIR Sync Job for background processing
export interface FHIRSyncJob {
  _id?: ObjectId
  linkedProviderId: ObjectId
  userId: ObjectId
  
  jobType: 'full_sync' | 'incremental_sync' | 'single_resource'
  resourceType?: string // If single_resource
  
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: 'low' | 'normal' | 'high'
  
  scheduledAt: Date
  startedAt?: Date
  completedAt?: Date
  
  progress: {
    totalResources: number
    processedResources: number
    errorCount: number
  }
  
  syncParams: {
    since?: string // _since parameter for incremental sync
    count?: number // _count parameter
    resourceTypes: string[]
  }
  
  result?: {
    resourcesCounted: Record<string, number>
    errors: Array<{
      resourceType: string
      resourceId: string
      error: string
    }>
  }
  
  retryCount: number
  maxRetries: number
  nextRetryAt?: Date
  
  createdAt: Date
  updatedAt: Date
}

// Unified timeline entry for merged provider data
export interface UnifiedTimelineEntry {
  _id?: ObjectId
  userId: ObjectId
  linkedProviderId: ObjectId
  organizationName: string
  
  // FHIR Resource data
  fhirResourceType: string
  fhirResourceId: string
  fhirResource: Record<string, any> // Full FHIR resource
  
  // Timeline metadata
  effectiveDate: Date // When the event occurred (medication date, lab date, etc.)
  syncedAt: Date // When we synced this data
  
  // Categorization for UI
  category: 'lab' | 'medication' | 'allergy' | 'vital' | 'immunization' | 'procedure' | 'encounter' | 'other'
  title: string // Human-readable title
  summary?: string // Brief summary for timeline
  
  // Provider routing info
  providerActions: {
    canMessage: boolean
    canSchedule: boolean
    messageEndpoint?: string
    scheduleEndpoint?: string
  }
  
  // Search and filtering
  searchTerms: string[] // For text search
  tags: string[] // For categorization
  
  createdAt: Date
  updatedAt: Date
}

// MongoDB Collections
export const COLLECTIONS = {
  LINKED_PROVIDERS: 'linkedProviders',
  FHIR_AUDIT_LOGS: 'fhirAuditLogs',
  FHIR_SYNC_JOBS: 'fhirSyncJobs',
  UNIFIED_TIMELINE: 'unifiedTimeline'
} as const

// MongoDB Indexes
export const MONGODB_INDEXES = {
  linkedProviders: [
    { userId: 1 },
    { userId: 1, status: 1 },
    { organizationId: 1 },
    { tokenExpiresAt: 1 },
    { lastSyncAt: 1 },
    { 'patientIdentities.hashedValue': 1 }
  ],
  fhirAuditLogs: [
    { linkedProviderId: 1, timestamp: -1 },
    { userId: 1, timestamp: -1 },
    { action: 1, timestamp: -1 }
  ],
  fhirSyncJobs: [
    { linkedProviderId: 1, status: 1 },
    { status: 1, scheduledAt: 1 },
    { userId: 1, createdAt: -1 }
  ],
  unifiedTimeline: [
    { userId: 1, effectiveDate: -1 },
    { userId: 1, category: 1, effectiveDate: -1 },
    { linkedProviderId: 1, effectiveDate: -1 },
    { searchTerms: 'text' } // Text search index
  ]
}
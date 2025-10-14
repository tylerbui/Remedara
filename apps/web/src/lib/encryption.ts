import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32-chars!!'
const ALGORITHM = 'aes-256-cbc'

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters long')
}

export interface EncryptedData {
  encryptedData: string
  iv: string
  authTag: string
}

/**
 * Encrypt sensitive data (like OAuth tokens)
 */
export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: '' // Not used with CBC
  }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedObj: EncryptedData): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  
  let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Generate PKCE code verifier and challenge
 */
export function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')
  
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256'
  }
}

/**
 * Generate secure state parameter for OAuth
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('base64url')
}

/**
 * Hash patient identifier for privacy
 */
export function hashPatientId(patientId: string, salt?: string): string {
  const actualSalt = salt || process.env.PATIENT_ID_SALT || 'remedara-default-salt'
  return crypto
    .createHmac('sha256', actualSalt)
    .update(patientId)
    .digest('hex')
}

/**
 * Generate a secure random token for API operations
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url')
}
# Medical Record Sharing Feature

## Overview

The Medical Record Sharing feature allows patients to securely share specific medical records with healthcare providers through time-limited, secure links. This feature includes comprehensive sharing controls, email notifications, and access tracking.

## Components

### 1. RecordSharing Component (`/src/components/RecordSharing.tsx`)

**Features:**
- Interactive dialog for sharing records with healthcare providers
- Granular selection of record types (Lab Results, Imaging, Vaccines, Allergies)
- Configurable access duration (7-90 days)
- Optional download permissions
- Access revocation capabilities
- Real-time status tracking (Active, Expired, Revoked)

**Usage:**
```tsx
<RecordSharing 
  userProfile={{
    id: patient.id,
    name: patient.name,
    email: patient.email
  }}
  availableRecordTypes={[
    { id: 'lab-results', label: 'Lab Results', count: 5 },
    { id: 'imaging', label: 'Imaging Results', count: 3 },
    { id: 'vaccines', label: 'Vaccinations', count: 8 },
    { id: 'allergies', label: 'Allergies', count: 2 }
  ]}
  onShare={async (shareData) => {
    // API call to share records
  }}
/>
```

### 2. API Routes

#### Share Creation (`/api/records/share`)

**POST** - Create a new record share
- Validates request data using Zod schema
- Generates secure access tokens
- Sends email notifications to providers
- Tracks share metadata and permissions

**GET** - Retrieve patient's shared records
- Automatically expires old shares
- Returns current sharing status and access statistics

**DELETE** - Revoke shared record access
- Immediately revokes access to shared records
- Updates audit trail

#### Provider Access (`/api/records/shared/[token]`)

**GET** - Access shared medical records
- Token-based authentication
- Automatic expiration checking
- Access count tracking
- Returns filtered medical data based on shared record types

**POST** - Download shared records
- PDF export functionality (placeholder implementation)
- Download permission verification
- Download count tracking

### 3. Shared Records Viewer (`/app/records/shared/[token]/page.tsx`)

**Features:**
- Secure token-based access for healthcare providers
- Professional medical record display
- Access status indicators (Active, Expired, Revoked)
- Download capabilities (when permitted)
- Responsive design for various devices

**Security Features:**
- Time-limited access links
- Automatic expiration handling
- Access tracking and audit trails
- Secure token generation

## Database Schema

### RecordShare Model

```prisma
model RecordShare {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  patientId       String    @db.ObjectId
  recipientEmail  String
  recipientName   String
  recordTypes     String[]  // ["lab-results", "imaging", "vaccines", "allergies"]
  message         String?
  accessToken     String    @unique
  
  // Access control
  allowDownload   Boolean   @default(false)
  status          String    @default("ACTIVE") // ACTIVE, EXPIRED, REVOKED
  expiryDate      DateTime?
  
  // Tracking
  accessCount     Int       @default(0)
  downloadCount   Int       @default(0)
  lastAccessed    DateTime?
  lastDownloaded  DateTime?
  revokedAt       DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  patient         Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("record_shares")
}
```

## Email Notifications

The system uses Resend to send professional email notifications to healthcare providers when records are shared:

**Features:**
- Responsive HTML email templates
- Secure access links
- Expiration warnings
- Professional medical branding
- Patient message inclusion

**Template includes:**
- Provider name personalization
- Patient information
- Shared record types
- Access expiration date
- Secure access button/link

## Security Considerations

### Access Control
- Unique, cryptographically secure access tokens
- Time-based expiration (1-365 days)
- Granular permission system (view-only vs. downloadable)
- Immediate revocation capabilities

### Audit Trail
- Comprehensive access logging
- Download tracking
- Patient consent records
- Provider access history

### Data Protection
- No direct database access for providers
- Token-based authentication only
- Automatic cleanup of expired shares
- HIPAA-compliant access patterns

## Integration Points

### Main Records Page
The RecordSharing component is integrated into the main patient records page (`/app/records/page.tsx`) within the overview section, allowing patients to:

1. View their current record shares
2. Create new shares with healthcare providers
3. Revoke existing access
4. Monitor access statistics

### Provider Workflow
1. Patient shares records via the Records page
2. Provider receives email notification with secure link
3. Provider accesses records through time-limited link
4. Optional PDF download (if permitted)
5. Access tracked and logged for audit purposes

## Environment Variables

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Future Enhancements

### Planned Features
- Real PDF generation with medical formatting
- Provider identity verification
- Bulk record sharing
- Integration with EHR systems
- Mobile-optimized provider access
- Advanced access analytics

### Security Improvements
- Two-factor authentication for sensitive shares
- IP-based access restrictions
- Provider account integration
- Enhanced audit reporting

## Usage Analytics

The system tracks comprehensive usage analytics:

- **Share Creation**: When and how often patients share records
- **Provider Access**: Access patterns and frequency
- **Download Activity**: When records are downloaded
- **Expiration Management**: Automatic cleanup and notifications

## Compliance

The record sharing feature is designed with healthcare compliance in mind:

- **HIPAA Compliance**: Secure access controls and audit trails
- **Patient Consent**: Explicit sharing permissions
- **Access Logging**: Comprehensive audit trails
- **Data Minimization**: Only shared record types are accessible
- **Time Limitations**: Automatic expiration prevents indefinite access

## Testing

### Manual Testing Checklist

1. **Record Sharing Creation**
   - [ ] Patient can select record types
   - [ ] Duration settings work correctly
   - [ ] Email notifications are sent
   - [ ] Access tokens are generated

2. **Provider Access**
   - [ ] Secure links work correctly
   - [ ] Expired links are blocked
   - [ ] Revoked access is prevented
   - [ ] Medical data displays properly

3. **Access Management**
   - [ ] Patients can view active shares
   - [ ] Revocation works immediately
   - [ ] Access counts are accurate
   - [ ] Expiration handling works

4. **Security**
   - [ ] Invalid tokens are rejected
   - [ ] Expired shares are blocked
   - [ ] Access is logged properly
   - [ ] Permissions are enforced
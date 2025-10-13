# Remedara - Clinic Scheduling & Patient Management System

A comprehensive healthcare management platform built with Next.js, focusing on clinic scheduling, patient intake, and centralized medical records management.

## 🏥 Key Features

### Core Scheduling
- **Smart Scheduling**: Real-time provider availability with conflict prevention
- **Patient Self-Booking**: User-friendly appointment booking interface
- **Role-Based Access**: Secure access for patients, providers, front desk, and admins
- **Digital Intake Forms**: Comprehensive patient intake with e-signatures
- **Automated Reminders**: SMS/email appointment reminders

### Medical Records Hub ⭐
- **Centralized Records**: All lab results, imaging, and vaccines in one place
- **External Lab Integration**: Direct upload from partner labs and imaging centers
- **Vaccine Tracking**: Automated alerts for overdue vaccines (tetanus, etc.)
- **Document Management**: Secure storage of all medical documents

### Patient Experience
- **Transportation Assistance**: Coordinated rides for elderly patients to appointments
- **Elderly-Friendly Interface**: Large fonts and simplified navigation
- **Real-Time Notifications**: Instant alerts for new results and appointments
- **Insurance Management**: Capture and verify insurance information

### Compliance & Security
- **HIPAA Compliant**: Encrypted PHI storage and comprehensive audit logs
- **PHI Access Controls**: Role-based permissions and data encryption
- **Audit Logging**: Complete activity tracking for compliance

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Authentication**: NextAuth.js with role-based access
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI with Tailwind CSS
- **Notifications**: Sonner for toast messages
- **Build System**: Turbo (monorepo)
- **Package Manager**: npm

## 📁 Project Structure

```
Remedara/
├── apps/
│   └── web/                 # Main Next.js application
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # Reusable UI components
│       │   ├── lib/         # Utilities and configurations
│       │   └── types/       # TypeScript type definitions
│       └── prisma/          # Database schema and migrations
├── packages/                # Shared packages (future)
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd Remedara
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
   
   Update the following in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/remedara"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up the database**:
   ```bash
   cd apps/web
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start the development server**:
   ```bash
   npm run dev:web
   ```

The application will be available at `http://localhost:3000`.

## 🎯 Current Implementation Status

### ✅ Completed Features
- [x] Monorepo structure with npm workspaces
- [x] Next.js application with TypeScript
- [x] Database schema with comprehensive models
- [x] Authentication system with role-based access
- [x] Core UI components with minimal, healthcare-appropriate design

### 🚧 In Progress
- [ ] Provider availability management
- [ ] Patient self-scheduling interface
- [ ] Digital intake forms
- [ ] Medical records hub implementation
- [ ] External facility integrations

### 📋 Upcoming Features
- [ ] Appointment reminder system
- [ ] Transportation assistance program  
- [ ] Immunization tracking & alerts
- [ ] Lab results integration API
- [ ] Imaging center portal integration
- [ ] Elderly-friendly navigation system
- [ ] Audit logging & PHI security
- [ ] Reporting dashboard
- [ ] Deployment configuration

## 🔐 User Roles & Permissions

### Patient
- Book appointments
- Complete intake forms
- View own medical records
- Request transportation assistance

### Provider
- Manage availability
- View patient records
- Update appointment notes
- Access medical history

### Front Desk
- Manage all appointments
- Process patient check-ins
- Handle intake forms
- Coordinate with facilities

### Admin
- Full system access
- User management
- Reporting & analytics
- System configuration

## 🏗️ Architecture Decisions

### Healthcare-First Design
- Minimal color palette appropriate for medical settings
- Clean, professional interface focusing on functionality
- HIPAA compliance built into the foundation
- Accessibility considerations for elderly patients

### External Integration Ready
- API endpoints designed for lab/imaging facility integration
- Flexible document storage system
- Notification system for real-time updates
- Transportation coordination capabilities

## 📞 Key Differentiators

1. **Unified Medical Records**: Solves the major patient complaint about scattered records from different systems (like Kaiser)
2. **External Facility Contracts**: Direct integration with labs and imaging centers
3. **Vaccine Tracking**: Automatic alerts for overdue vaccines (e.g., tetanus every 10 years)
4. **Transportation Assistance**: Specialized support for elderly patients navigating healthcare
5. **Minimal, Professional Design**: Clean interface appropriate for healthcare settings

## 🤝 Contributing

This project is designed to address real healthcare pain points. When contributing, please consider:

- Patient safety and data security first
- Accessibility for elderly users
- Healthcare compliance requirements
- Clean, professional design standards

## 📄 License

This project is proprietary and confidential.
# Development Workflow for Remedara

## 🔧 Git Setup Complete ✅

Your repository is now configured with:
- **GitHub Repository**: https://github.com/tylerbui/Remedara.git
- **Classic Token Authentication**: Configured for seamless push/pull
- **Husky Git Hooks**: Automatic code formatting and commit linting
- **Conventional Commits**: Standardized commit message format

## 📝 Commit Message Format

We use **Conventional Commits** for consistent commit messages. The format is:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types:
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples:
```bash
git commit -m "feat(auth): add role-based access control for providers"
git commit -m "fix(scheduling): resolve double-booking conflict detection"
git commit -m "docs: update API documentation for lab integration"
```

### Using Commitizen (Recommended):
For guided commit messages:
```bash
npx cz
# or
npm run commit  # (we can add this script)
```

## 🚀 Development Commands

### Start Development Server
```bash
npm run dev:web
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
cd apps/web && npx prisma studio
```

### Code Quality
```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Build project
npm run build:web
```

## 🌿 Branching Strategy

### Main Branches:
- `main` - Production-ready code
- `develop` - Integration branch for features

### Feature Development:
```bash
# Create feature branch
git checkout -b feat/patient-scheduling
git checkout -b fix/login-redirect
git checkout -b docs/api-documentation

# Work on your changes...

# Commit with conventional format
git commit -m "feat(scheduling): implement provider availability calendar"

# Push to GitHub
git push -u origin feat/patient-scheduling

# Create Pull Request on GitHub
```

## 🔒 Security & Compliance

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Store sensitive data in environment variables

### PHI Data Handling
- All PHI fields should be encrypted
- Use audit logging for all data access
- Follow HIPAA compliance guidelines

### Database Security
- Use parameterized queries (Prisma handles this)
- Implement role-based access control
- Regular security audits

## 🏥 Healthcare-Specific Guidelines

### Code Review Checklist:
- [ ] PHI data properly encrypted
- [ ] Audit logging implemented
- [ ] Role-based permissions verified
- [ ] Input validation for medical data
- [ ] Error handling doesn't expose sensitive data

### Testing Priorities:
1. Authentication and authorization
2. Data encryption/decryption
3. Appointment scheduling conflicts
4. Medical record access controls
5. External API integrations

## 🎯 Next Development Steps

1. **Provider Availability Management**
   - Calendar integration
   - Conflict detection
   - Recurring availability patterns

2. **Patient Self-Scheduling**
   - Provider selection interface
   - Time slot booking
   - Confirmation system

3. **Medical Records Hub**
   - Lab results integration
   - Imaging reports management
   - Vaccine tracking system

4. **External Integrations**
   - Lab facility APIs
   - Imaging center connections
   - Transportation services

## 📞 Emergency Procedures

### Hotfixes:
```bash
git checkout main
git checkout -b hotfix/critical-security-patch
# Make urgent fix
git commit -m "fix(security): patch authentication vulnerability"
git push -u origin hotfix/critical-security-patch
# Create urgent PR to main
```

### Database Issues:
```bash
# Reset local database (development only)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name describe_changes
```

---

**Remember**: We're building healthcare software - patient safety and data security are our top priorities! 🏥
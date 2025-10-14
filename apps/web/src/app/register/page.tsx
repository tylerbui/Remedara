'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  User, 
  UserCheck, 
  Stethoscope, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  MapPin,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

type UserRole = 'PATIENT' | 'PROVIDER'

interface PatientFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  emergencyContact: string
  emergencyPhone: string
}

interface ProviderFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  title: string
  specialization: string
  licenseNumber: string
  npi: string
  address: string
  city: string
  state: string
  zipCode: string
}

const SPECIALIZATIONS = [
  'General Practice',
  'Internal Medicine', 
  'Family Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Radiology',
  'Emergency Medicine',
  'Anesthesiology',
  'Surgery',
  'Obstetrics & Gynecology',
  'Ophthalmology',
  'Other'
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'role' | 'form' | 'success'>('role')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [patientForm, setPatientForm] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const [providerForm, setProviderForm] = useState<ProviderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    title: '',
    specialization: '',
    licenseNumber: '',
    npi: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setCurrentStep('form')
  }

  const validateForm = () => {
    const form = selectedRole === 'PATIENT' ? patientForm : providerForm

    // Basic validation
    if (!form.firstName.trim()) {
      toast.error('First name is required')
      return false
    }
    if (!form.lastName.trim()) {
      toast.error('Last name is required')
      return false
    }
    if (!form.email.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (!form.phone.trim()) {
      toast.error('Phone number is required')
      return false
    }

    // Provider-specific validation
    if (selectedRole === 'PROVIDER') {
      const providerData = form as ProviderFormData
      if (!providerData.specialization) {
        toast.error('Specialization is required')
        return false
      }
      if (!providerData.licenseNumber.trim()) {
        toast.error('License number is required')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const formData = selectedRole === 'PATIENT' ? patientForm : providerForm
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: selectedRole,
          ...formData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setCurrentStep('success')
      toast.success('Registration successful!')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Join Remedara</h2>
        <p className="text-lg text-gray-600">Choose your account type to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Registration */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 p-6"
          onClick={() => handleRoleSelect('PATIENT')}
        >
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl mb-2">I&apos;m a Patient</CardTitle>
            <CardDescription className="text-base">
              Book appointments and manage your healthcare
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3 text-base text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Book appointments online</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Access medical records</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Receive appointment reminders</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Complete intake forms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Registration */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-300 p-6"
          onClick={() => handleRoleSelect('PROVIDER')}
        >
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl mb-2">I&apos;m a Provider</CardTitle>
            <CardDescription className="text-base">
              Manage your practice and patient care
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3 text-base text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Manage your schedule</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>View patient information</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Set availability</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Patient communication</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-base text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-900 hover:underline font-medium text-lg">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )

  const renderPatientForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <User className="h-8 w-8" />
            <span>Patient Registration</span>
          </h2>
          <p className="text-lg text-gray-600 mt-2">Create your patient account</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          className="px-6 py-3 text-base"
          onClick={() => setCurrentStep('role')}
        >
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-base font-medium mb-2 block">First Name *</Label>
          <Input
            id="firstName"
            value={patientForm.firstName}
            onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
            placeholder="Enter your first name"
            className="h-12 px-4 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-base font-medium mb-2 block">Last Name *</Label>
          <Input
            id="lastName"
            value={patientForm.lastName}
            onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
            placeholder="Enter your last name"
            className="h-12 px-4 text-base"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-base font-medium mb-2 block">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={patientForm.email}
          onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
          placeholder="Enter your email address"
          className="h-12 px-4 text-base"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="password" className="text-base font-medium mb-2 block">Password *</Label>
          <Input
            id="password"
            type="password"
            value={patientForm.password}
            onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
            placeholder="At least 8 characters"
            className="h-12 px-4 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-base font-medium mb-2 block">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={patientForm.confirmPassword}
            onChange={(e) => setPatientForm({ ...patientForm, confirmPassword: e.target.value })}
            placeholder="Re-enter your password"
            className="h-12 px-4 text-base"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-base font-medium mb-2 block">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={patientForm.phone}
            onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="h-12 px-4 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth" className="text-base font-medium mb-2 block">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientForm.dateOfBirth}
            onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
            className="h-12 px-4 text-base"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-base font-medium mb-2 block">Address</Label>
        <Input
          id="address"
          value={patientForm.address}
          onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
          placeholder="Street address"
          className="h-12 px-4 text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="city" className="text-base font-medium mb-2 block">City</Label>
          <Input
            id="city"
            value={patientForm.city}
            onChange={(e) => setPatientForm({ ...patientForm, city: e.target.value })}
            placeholder="City"
            className="h-12 px-4 text-base"
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-base font-medium mb-2 block">State</Label>
          <Select value={patientForm.state} onValueChange={(value) => setPatientForm({ ...patientForm, state: value })}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode" className="text-base font-medium mb-2 block">ZIP Code</Label>
          <Input
            id="zipCode"
            value={patientForm.zipCode}
            onChange={(e) => setPatientForm({ ...patientForm, zipCode: e.target.value })}
            placeholder="12345"
            className="h-12 px-4 text-base"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-xl font-medium">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="emergencyContact" className="text-base font-medium mb-2 block">Contact Name</Label>
            <Input
              id="emergencyContact"
              value={patientForm.emergencyContact}
              onChange={(e) => setPatientForm({ ...patientForm, emergencyContact: e.target.value })}
              placeholder="Emergency contact name"
              className="h-12 px-4 text-base"
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone" className="text-base font-medium mb-2 block">Contact Phone</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={patientForm.emergencyPhone}
              onChange={(e) => setPatientForm({ ...patientForm, emergencyPhone: e.target.value })}
              placeholder="(555) 123-4567"
              className="h-12 px-4 text-base"
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Patient Account'}
      </Button>
    </form>
  )

  const renderProviderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Stethoscope className="h-8 w-8" />
            <span>Provider Registration</span>
          </h2>
          <p className="text-lg text-gray-600 mt-2">Create your healthcare provider account</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          className="px-6 py-3 text-base"
          onClick={() => setCurrentStep('role')}
        >
          Back
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
          <div>
            <p className="text-base text-yellow-800">
              <strong>Provider Verification Required:</strong> Your account will be reviewed and verified 
              before activation. This process typically takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title" className="text-base font-medium mb-2 block">Title *</Label>
          <Input
            id="title"
            value={providerForm.title}
            onChange={(e) => setProviderForm({ ...providerForm, title: e.target.value })}
            placeholder="Dr., NP, PA, etc."
            className="h-12 px-4 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="specialization" className="text-base font-medium mb-2 block">Specialization *</Label>
          <Select 
            value={providerForm.specialization} 
            onValueChange={(value) => setProviderForm({ ...providerForm, specialization: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select your specialization" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-base font-medium mb-2 block">First Name *</Label>
          <Input
            id="firstName"
            value={providerForm.firstName}
            onChange={(e) => setProviderForm({ ...providerForm, firstName: e.target.value })}
            placeholder="Enter your first name"
            className="h-12 px-4 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-base font-medium mb-2 block">Last Name *</Label>
          <Input
            id="lastName"
            value={providerForm.lastName}
            onChange={(e) => setProviderForm({ ...providerForm, lastName: e.target.value })}
            placeholder="Enter your last name"
            className="h-12 px-4 text-base"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-base font-medium mb-2 block">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={providerForm.email}
          onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })}
          placeholder="Enter your email address"
          className="h-12 px-4 text-base"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="password" className="text-base font-medium mb-2 block">Password *</Label>
          <Input
            id="password"
            type="password"
            value={providerForm.password}
            onChange={(e) => setProviderForm({ ...providerForm, password: e.target.value })}
            placeholder="At least 8 characters"
            className="h-12 px-4 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-base font-medium mb-2 block">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={providerForm.confirmPassword}
            onChange={(e) => setProviderForm({ ...providerForm, confirmPassword: e.target.value })}
            placeholder="Re-enter your password"
            className="h-12 px-4 text-base"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone" className="text-base font-medium mb-2 block">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={providerForm.phone}
          onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
          placeholder="(555) 123-4567"
          className="h-12 px-4 text-base"
          required
        />
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-xl font-medium flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Professional Credentials</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="licenseNumber" className="text-base font-medium mb-2 block">Medical License Number *</Label>
            <Input
              id="licenseNumber"
              value={providerForm.licenseNumber}
              onChange={(e) => setProviderForm({ ...providerForm, licenseNumber: e.target.value })}
              placeholder="Enter license number"
              className="h-12 px-4 text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="npi" className="text-base font-medium mb-2 block">NPI Number</Label>
            <Input
              id="npi"
              value={providerForm.npi}
              onChange={(e) => setProviderForm({ ...providerForm, npi: e.target.value })}
              placeholder="National Provider Identifier"
              className="h-12 px-4 text-base"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-base font-medium mb-2 block">Practice Address</Label>
        <Input
          id="address"
          value={providerForm.address}
          onChange={(e) => setProviderForm({ ...providerForm, address: e.target.value })}
          placeholder="Street address"
          className="h-12 px-4 text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="city" className="text-base font-medium mb-2 block">City</Label>
          <Input
            id="city"
            value={providerForm.city}
            onChange={(e) => setProviderForm({ ...providerForm, city: e.target.value })}
            placeholder="City"
            className="h-12 px-4 text-base"
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-base font-medium mb-2 block">State</Label>
          <Select value={providerForm.state} onValueChange={(value) => setProviderForm({ ...providerForm, state: value })}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode" className="text-base font-medium mb-2 block">ZIP Code</Label>
          <Input
            id="zipCode"
            value={providerForm.zipCode}
            onChange={(e) => setProviderForm({ ...providerForm, zipCode: e.target.value })}
            placeholder="12345"
            className="h-12 px-4 text-base"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Provider Account'}
      </Button>
    </form>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {selectedRole === 'PROVIDER' ? 'Registration Submitted!' : 'Welcome to Remedara!'}
        </h2>
        {selectedRole === 'PROVIDER' ? (
          <p className="text-gray-600">
            Your provider registration has been submitted for review. You&apos;ll receive an email 
            confirmation once your account has been verified and activated.
          </p>
        ) : (
          <p className="text-gray-600">
            Your patient account has been created successfully. You can now sign in and start 
            booking appointments.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Button 
          onClick={() => router.push('/login')}
          className="w-full bg-gray-900 hover:bg-gray-800"
        >
          Sign In to Your Account
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            setCurrentStep('role')
            setSelectedRole(null)
            setPatientForm({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              phone: '',
              dateOfBirth: '',
              address: '',
              city: '',
              state: '',
              zipCode: '',
              emergencyContact: '',
              emergencyPhone: ''
            })
            setProviderForm({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              phone: '',
              title: '',
              specialization: '',
              licenseNumber: '',
              npi: '',
              address: '',
              city: '',
              state: '',
              zipCode: ''
            })
          }}
        >
          Register Another Account
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Create Your Account</h1>
        </div>

        <Card>
          <CardContent className="p-10">
            {currentStep === 'role' && renderRoleSelection()}
            {currentStep === 'form' && selectedRole === 'PATIENT' && renderPatientForm()}
            {currentStep === 'form' && selectedRole === 'PROVIDER' && renderProviderForm()}
            {currentStep === 'success' && renderSuccess()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
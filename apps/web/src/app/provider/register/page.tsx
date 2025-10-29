'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Stethoscope, Check, Building2, User, Mail, Lock, Phone } from 'lucide-react'
import { toast } from 'sonner'

type RegistrationStep = 'account' | 'practice' | 'credentials' | 'complete'

export default function ProviderRegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('account')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    // Account info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Practice info
    practiceName: '',
    specialty: '',
    npiNumber: '',
    licenseNumber: '',

    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',

    // Agreements
    agreeToTerms: false,
    agreeToHipaa: false,
  })
  const router = useRouter()

  const specialties = [
    'Family Medicine',
    'Internal Medicine',
    'Pediatrics',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology (ENT)',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Rheumatology',
    'Urology',
    'Other',
  ]

  const states = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ]

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // Validate terms agreement
      if (!formData.agreeToTerms || !formData.agreeToHipaa) {
        setError('You must agree to the terms and HIPAA agreement')
        return
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'PROVIDER',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        toast.error('Registration failed', {
          description: data.error || 'Please try again',
        })
        return
      }

      toast.success('Registration successful!', {
        description: 'Redirecting to provider portal...',
      })

      // Move to complete step
      setCurrentStep('complete')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/provider/login')
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      setError('An unexpected error occurred')
      toast.error('Registration failed', {
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 'account') {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError('Please fill in all account fields')
        return
      }
      setCurrentStep('practice')
    } else if (currentStep === 'practice') {
      if (!formData.practiceName || !formData.specialty) {
        setError('Please fill in required practice fields')
        return
      }
      setCurrentStep('credentials')
    } else if (currentStep === 'credentials') {
      handleSubmit()
    }
    setError('')
  }

  const handleBack = () => {
    if (currentStep === 'practice') {
      setCurrentStep('account')
    } else if (currentStep === 'credentials') {
      setCurrentStep('practice')
    }
    setError('')
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {(['account', 'practice', 'credentials'] as RegistrationStep[]).map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === step
                ? 'bg-[#3D7A5F] text-white'
                : index < ['account', 'practice', 'credentials'].indexOf(currentStep)
                  ? 'bg-[#3D7A5F] text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index < ['account', 'practice', 'credentials'].indexOf(currentStep) ? (
              <Check className="h-5 w-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < 2 && (
            <div
              className={`w-16 h-1 mx-2 ${
                index < ['account', 'practice', 'credentials'].indexOf(currentStep)
                  ? 'bg-[#3D7A5F]'
                  : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderAccountStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="provider@clinic.com"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
          disabled={isLoading}
        />
      </div>
    </div>
  )

  const renderPracticeStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="practiceName">Practice Name *</Label>
        <Input
          id="practiceName"
          value={formData.practiceName}
          onChange={e => setFormData({ ...formData, practiceName: e.target.value })}
          placeholder="ABC Medical Clinic"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Specialty *</Label>
        <Select
          value={formData.specialty}
          onValueChange={value => setFormData({ ...formData, specialty: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map(specialty => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="npiNumber">NPI Number</Label>
          <Input
            id="npiNumber"
            value={formData.npiNumber}
            onChange={e => setFormData({ ...formData, npiNumber: e.target.value })}
            placeholder="1234567890"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
            placeholder="ABC123456"
            disabled={isLoading}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Practice Address</h3>

        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
            placeholder="123 Main Street"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
            placeholder="Suite 100"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="San Francisco"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state}
              onValueChange={value => setFormData({ ...formData, state: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
            placeholder="94101"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )

  const renderCredentialsStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Create Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">Must be at least 8 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={checked =>
              setFormData({ ...formData, agreeToTerms: checked as boolean })
            }
            disabled={isLoading}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            I agree to the{' '}
            <Link href="/terms" className="text-[#3D7A5F] underline" target="_blank">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#3D7A5F] underline" target="_blank">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="hipaa"
            checked={formData.agreeToHipaa}
            onCheckedChange={checked =>
              setFormData({ ...formData, agreeToHipaa: checked as boolean })
            }
            disabled={isLoading}
          />
          <Label htmlFor="hipaa" className="text-sm leading-relaxed cursor-pointer">
            I acknowledge and agree to comply with{' '}
            <Link href="/hipaa" className="text-[#3D7A5F] underline" target="_blank">
              HIPAA regulations
            </Link>{' '}
            in handling patient information
          </Label>
        </div>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[#2D5F4C] mb-2">Registration Complete!</h3>
        <p className="text-[#5A7366]">Your provider account has been created successfully.</p>
      </div>
      <div className="bg-[#F5F1E8] p-4 rounded-lg">
        <p className="text-sm text-[#5A7366]">Redirecting you to the login page...</p>
      </div>
    </div>
  )

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-[#E8E2D5] flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">{renderCompleteStep()}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-[#E8E2D5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#3D7A5F] rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-[#2D5F4C]">Register Your Practice</h2>
          <p className="mt-2 text-sm text-[#5A7366]">
            Join Remedara to streamline your practice management
          </p>
        </div>

        <Card className="border-[#D4C9B3] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-[#2D5F4C]">
              {currentStep === 'account' && 'Account Information'}
              {currentStep === 'practice' && 'Practice Details'}
              {currentStep === 'credentials' && 'Security & Agreements'}
            </CardTitle>
            <CardDescription>
              {currentStep === 'account' && 'Tell us about yourself'}
              {currentStep === 'practice' && 'Provide your practice information'}
              {currentStep === 'credentials' && 'Set up your login credentials'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepIndicator()}

            {currentStep === 'account' && renderAccountStep()}
            {currentStep === 'practice' && renderPracticeStep()}
            {currentStep === 'credentials' && renderCredentialsStep()}

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex space-x-4">
              {currentStep !== 'account' && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-[#3D7A5F] hover:bg-[#2D5F4C] text-white"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : currentStep === 'credentials' ? (
                  'Complete Registration'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm">
          <p className="text-[#5A7366]">
            Already have an account?{' '}
            <Link href="/provider/login" className="text-[#3D7A5F] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

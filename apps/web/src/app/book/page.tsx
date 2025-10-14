'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Calendar, Clock, User, MapPin, Star, CheckCircle, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Provider {
  id: string
  user: {
    name: string
    email: string
  }
  specialization: string
  location: string
  rating?: number
  image?: string
  bio?: string
}

interface AvailableSlot {
  id: string
  date: string
  time: string
  datetime: string
  providerId: string
}

export default function BookAppointmentPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [currentStep, setCurrentStep] = useState<'providers' | 'slots' | 'details' | 'confirmation'>('providers')
  const [isLoading, setIsLoading] = useState(false)
  const [bookedAppointment, setBookedAppointment] = useState<any>(null)
  
  // Patient form data
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    reason: '',
    notes: ''
  })

  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/providers')
      if (!response.ok) throw new Error('Failed to fetch providers')
      
      const data = await response.json()
      setProviders(data.providers || [])
    } catch (error) {
      console.error('Error fetching providers:', error)
      toast.error('Failed to load providers')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableSlots = async (providerId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/providers/${providerId}/slots`)
      if (!response.ok) throw new Error('Failed to fetch available slots')
      
      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      toast.error('Failed to load available appointments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider)
    setCurrentStep('slots')
    await fetchAvailableSlots(provider.id)
  }

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot)
    setCurrentStep('details')
  }

  const handleBackStep = () => {
    if (currentStep === 'slots') {
      setCurrentStep('providers')
      setSelectedProvider(null)
      setAvailableSlots([])
    } else if (currentStep === 'details') {
      setCurrentStep('slots')
      setSelectedSlot(null)
    } else if (currentStep === 'confirmation') {
      setCurrentStep('details')
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedProvider || !selectedSlot) return

    // Validate form
    if (!patientForm.firstName || !patientForm.lastName || !patientForm.email || !patientForm.phone || !patientForm.reason) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providerId: selectedProvider.id,
          dateTime: selectedSlot.datetime,
          patientInfo: patientForm,
          reason: patientForm.reason,
          notes: patientForm.notes,
          duration: 30
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      setBookedAppointment(data.appointment)
      setCurrentStep('confirmation')
      toast.success('Appointment booked successfully!')
    } catch (error: any) {
      console.error('Error booking appointment:', error)
      toast.error(error.message || 'Failed to book appointment')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { id: 'providers', label: 'Select Provider' },
      { id: 'slots', label: 'Choose Time' },
      { id: 'details', label: 'Your Details' },
      { id: 'confirmation', label: 'Confirm' }
    ]

    const currentStepIndex = steps.findIndex(step => step.id === currentStep)

    return (
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStepIndex 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index < currentStepIndex ? 'bg-gray-900' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Provider</h2>
        <p className="text-gray-600">Select a healthcare provider for your appointment</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading providers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Card 
              key={provider.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProviderSelect(provider)}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <CardTitle className="text-lg">{provider.user.name}</CardTitle>
                <CardDescription className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary">{provider.specialization}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
                {provider.rating && (
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                  </div>
                )}
                {provider.bio && (
                  <p className="text-sm text-gray-600 mt-2">{provider.bio}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderSlotSelection = () => {
    // Group slots by date
    const slotsByDate = availableSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = []
      }
      acc[slot.date].push(slot)
      return acc
    }, {} as Record<string, AvailableSlot[]>)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Appointment Time</h2>
            <p className="text-gray-600">Available appointments with {selectedProvider?.user.name}</p>
          </div>
          <Button variant="outline" onClick={handleBackStep}>
            Back to Providers
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading available times...</p>
          </div>
        ) : Object.keys(slotsByDate).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No available appointments found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Schedule your visit with our healthcare providers</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content based on current step */}
        {currentStep === 'providers' && renderProviderSelection()}
        {currentStep === 'slots' && renderSlotSelection()}
        {currentStep === 'details' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
                <p className="text-gray-600">Please provide your details for the appointment</p>
              </div>
              <Button variant="outline" onClick={handleBackStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            {/* Appointment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{selectedProvider?.user.name}</p>
                      <p className="text-sm text-gray-600">{selectedProvider?.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">
                        {selectedSlot && new Date(selectedSlot.datetime).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{selectedSlot?.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">30 minutes</p>
                      <p className="text-sm text-gray-600">Appointment duration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Please fill out your details below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={patientForm.firstName}
                      onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={patientForm.lastName}
                      onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patientForm.dateOfBirth}
                    onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Input
                    id="reason"
                    value={patientForm.reason}
                    onChange={(e) => setPatientForm({ ...patientForm, reason: e.target.value })}
                    placeholder="Brief description of your visit reason"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={patientForm.notes}
                    onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                    placeholder="Any additional information or special requests"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="outline" onClick={handleBackStep}>
                    Back to Time Selection
                  </Button>
                  <Button 
                    onClick={handleBookAppointment}
                    disabled={isLoading}
                    className="bg-gray-900 hover:bg-gray-800"
                  >
                    {isLoading ? 'Booking...' : 'Book Appointment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {currentStep === 'confirmation' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
              <p className="text-gray-600">Your appointment has been successfully booked</p>
            </div>

            {bookedAppointment && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                  <CardDescription>Please save these details for your records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Provider</Label>
                        <p className="font-medium">{bookedAppointment.provider?.user?.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                        <p className="font-medium">
                          {new Date(bookedAppointment.dateTime).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Duration</Label>
                        <p className="font-medium">{bookedAppointment.duration || 30} minutes</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Patient</Label>
                        <p className="font-medium">{bookedAppointment.patient?.user?.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Reason for Visit</Label>
                        <p className="font-medium">{bookedAppointment.reason}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {bookedAppointment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {bookedAppointment.notes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Notes</Label>
                      <p className="text-gray-900 mt-1">{bookedAppointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                You will receive a confirmation email shortly with your appointment details.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset form for new booking
                    setCurrentStep('providers')
                    setSelectedProvider(null)
                    setSelectedSlot(null)
                    setAvailableSlots([])
                    setBookedAppointment(null)
                    setPatientForm({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      dateOfBirth: '',
                      reason: '',
                      notes: ''
                    })
                  }}
                >
                  Book Another Appointment
                </Button>
                <Button 
                  className="bg-gray-900 hover:bg-gray-800"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
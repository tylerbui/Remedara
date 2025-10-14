'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Calendar,
  Clock,
  User,
  Search,
  Check,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

interface Patient {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  lastVisit?: string
  isConnected: boolean
}

interface AppointmentData {
  patientId: string
  appointmentType: string
  date: string
  time: string
  duration: number
  location: string
  notes?: string
  isUrgent: boolean
}

interface AppointmentSchedulingModalProps {
  isOpen: boolean
  onClose: () => void
  onScheduled: () => void
}

export default function AppointmentSchedulingModal({ 
  isOpen, 
  onClose, 
  onScheduled 
}: AppointmentSchedulingModalProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    patientId: '',
    appointmentType: '',
    date: '',
    time: '',
    duration: 30,
    location: 'Main Office',
    notes: '',
    isUrgent: false
  })

  // Appointment types
  const appointmentTypes = [
    'Annual Physical',
    'Follow-up Visit',
    'Consultation',
    'Preventive Care',
    'Urgent Care',
    'Specialist Referral',
    'Lab Review',
    'Procedure',
    'Wellness Check'
  ]

  // Time slots (15-minute intervals from 8 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        slots.push({ value: time, display: displayTime })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Fetch connected patients when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchConnectedPatients()
    }
  }, [isOpen])

  const fetchConnectedPatients = async () => {
    setIsLoading(true)
    try {
      // Fetch real patients from API - only connected ones for appointment scheduling
      const response = await fetch('/api/patients?connected=true')
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }
      
      const data = await response.json()
      setPatients(data.patients || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to load patients')
      setPatients([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setAppointmentData(prev => ({ ...prev, patientId: patient.id }))
    setSearchQuery('')
  }

  const handleSubmit = async () => {
    if (!selectedPatient || !appointmentData.appointmentType || !appointmentData.date || !appointmentData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointmentData,
          status: 'PENDING_APPROVAL' // Patient needs to approve
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to schedule appointment')
      }

      const result = await response.json()
      
      toast.success(`Appointment request sent to ${selectedPatient.name}`)
      onScheduled()
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      toast.error('Failed to schedule appointment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedPatient(null)
    setSearchQuery('')
    setAppointmentData({
      patientId: '',
      appointmentType: '',
      date: '',
      time: '',
      duration: 30,
      location: 'Main Office',
      notes: '',
      isUrgent: false
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Appointment</span>
          </DialogTitle>
          <DialogDescription>
            Create an appointment request that will be sent to the patient for approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-4">
            <Label>Select Patient *</Label>
            
            {!selectedPatient ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {searchQuery && (
                  <div className="border rounded-md max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">Loading patients...</div>
                    ) : filteredPatients.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {filteredPatients.map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md text-left"
                          >
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-gray-600 flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {patient.email}
                                </span>
                                {patient.phone && (
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {patient.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge variant="secondary">Connected</Badge>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No patients found</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedPatient.name}</div>
                        <div className="text-sm text-gray-600">{selectedPatient.email}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPatient(null)}
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Appointment Details */}
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointmentType">Appointment Type *</Label>
                  <Select
                    value={appointmentData.appointmentType}
                    onValueChange={(value) => setAppointmentData(prev => ({ ...prev, appointmentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={appointmentData.location}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Main Office"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Select
                    value={appointmentData.time}
                    onValueChange={(value) => setAppointmentData(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Select
                    value={appointmentData.duration.toString()}
                    onValueChange={(value) => setAppointmentData(prev => ({ ...prev, duration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or instructions for the patient..."
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={appointmentData.isUrgent}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isUrgent" className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Mark as urgent</span>
                </Label>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div className="text-sm text-gray-500">
              {selectedPatient && (
                <span>Patient will receive a notification to approve this appointment</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!selectedPatient || !appointmentData.appointmentType || !appointmentData.date || !appointmentData.time || isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
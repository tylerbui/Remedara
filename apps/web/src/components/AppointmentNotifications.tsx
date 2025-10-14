'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  AlertCircle,
  Check,
  X,
  Bell,
  Stethoscope
} from 'lucide-react'

interface AppointmentRequest {
  id: string
  provider: {
    name: string
    email: string
    specialization?: string
  }
  dateTime: string
  reason: string
  location: string
  duration: number
  notes?: string
  isUrgent: boolean
  status: string
  createdAt: string
}

export default function AppointmentNotifications() {
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingAppointments()
  }, [])

  const fetchPendingAppointments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/appointments?status=PENDING_APPROVAL')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentAction = async (appointmentId: string, action: 'approve' | 'reject') => {
    setProcessingId(appointmentId)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        
        // Remove the appointment from the list
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to process appointment')
      }
    } catch (error) {
      console.error('Error processing appointment:', error)
      toast.error('Failed to process appointment')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (appointments.length === 0) {
    return null // Don't show anything if no pending appointments
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <Bell className="h-5 w-5" />
          <span>Appointment Requests</span>
        </CardTitle>
        <CardDescription className="text-orange-700">
          You have {appointments.length} appointment request{appointments.length !== 1 ? 's' : ''} waiting for your approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appointment) => {
          const { date, time } = formatDateTime(appointment.dateTime)
          return (
            <Card key={appointment.id} className="bg-white border border-orange-200">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* Header with urgency badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Dr. {appointment.provider.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.provider.specialization || 'Healthcare Provider'}
                        </p>
                      </div>
                    </div>
                    {appointment.isUrgent && (
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Urgent</span>
                      </Badge>
                    )}
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{time} ({appointment.duration} minutes)</span>
                      </div>
                      {appointment.location && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-900">Type: </span>
                        <span className="text-gray-600">{appointment.reason}</span>
                      </div>
                      {appointment.notes && (
                        <div>
                          <span className="font-medium text-gray-900">Notes: </span>
                          <span className="text-gray-600">{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Requested {new Date(appointment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAppointmentAction(appointment.id, 'reject')}
                        disabled={processingId === appointment.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                        disabled={processingId === appointment.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {processingId === appointment.id ? 'Processing...' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
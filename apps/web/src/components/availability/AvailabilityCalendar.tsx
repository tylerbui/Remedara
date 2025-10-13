'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Clock, Plus, Edit, Trash2, Calendar, Users } from 'lucide-react'

interface AvailabilitySlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
  specificDate?: string
  provider?: {
    user: {
      name: string
      email: string
    }
  }
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  backgroundColor?: string
  borderColor?: string
  classNames?: string[]
  extendedProps?: {
    type: 'availability' | 'appointment'
    availabilityId?: string
    isActive?: boolean
  }
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilityCalendar() {
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [editingAvailability, setEditingAvailability] = useState<AvailabilitySlot | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    isActive: true,
    specificDate: '',
  })

  const calendarRef = useRef<FullCalendar>(null)

  // Fetch availabilities from API
  const fetchAvailabilities = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/availability')
      if (!response.ok) throw new Error('Failed to fetch availabilities')

      const data = await response.json()
      setAvailabilities(data.availabilities || [])

      // Convert availabilities to calendar events
      const events = convertAvailabilitiesToEvents(data.availabilities || [])
      setCalendarEvents(events)
    } catch (error) {
      console.error('Error fetching availabilities:', error)
      toast.error('Failed to load availability schedule')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Convert availability slots to FullCalendar events
  const convertAvailabilitiesToEvents = (availabilities: AvailabilitySlot[]): CalendarEvent[] => {
    const events: CalendarEvent[] = []

    availabilities.forEach(availability => {
      if (availability.specificDate) {
        // Handle specific date availability
        const date = new Date(availability.specificDate)
        const startDateTime = new Date(date)
        const endDateTime = new Date(date)

        const [startHour, startMin] = availability.startTime.split(':')
        const [endHour, endMin] = availability.endTime.split(':')

        startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0)
        endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0)

        events.push({
          id: availability.id,
          title: availability.isActive ? 'Available' : 'Unavailable',
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          backgroundColor: availability.isActive ? '#10b981' : '#ef4444',
          borderColor: availability.isActive ? '#059669' : '#dc2626',
          classNames: ['availability-event'],
          extendedProps: {
            type: 'availability',
            availabilityId: availability.id,
            isActive: availability.isActive,
          },
        })
      } else {
        // Handle recurring weekly availability
        const today = new Date()
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))

        // Generate events for the next 4 weeks
        for (let week = 0; week < 4; week++) {
          const eventDate = new Date(startOfWeek)
          eventDate.setDate(startOfWeek.getDate() + week * 7 + availability.dayOfWeek)

          const startDateTime = new Date(eventDate)
          const endDateTime = new Date(eventDate)

          const [startHour, startMin] = availability.startTime.split(':')
          const [endHour, endMin] = availability.endTime.split(':')

          startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0)
          endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0)

          events.push({
            id: `${availability.id}-${week}`,
            title: availability.isActive
              ? `Available (${DAYS_OF_WEEK[availability.dayOfWeek]})`
              : 'Unavailable',
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            backgroundColor: availability.isActive ? '#3b82f6' : '#ef4444',
            borderColor: availability.isActive ? '#2563eb' : '#dc2626',
            classNames: ['availability-event', 'recurring'],
            extendedProps: {
              type: 'availability',
              availabilityId: availability.id,
              isActive: availability.isActive,
            },
          })
        }
      }
    })

    return events
  }

  // Handle date click - open dialog to add availability
  const handleDateClick = (selectInfo: any) => {
    setSelectedDate(selectInfo.dateStr)
    setEditingAvailability(null)
    setFormData({
      dayOfWeek: selectInfo.date.getDay(),
      startTime: '09:00',
      endTime: '17:00',
      isActive: true,
      specificDate: selectInfo.dateStr,
    })
    setIsDialogOpen(true)
  }

  // Handle event click - edit availability
  const handleEventClick = (clickInfo: any) => {
    const availabilityId = clickInfo.event.extendedProps.availabilityId
    const availability = availabilities.find(a => a.id === availabilityId)

    if (availability) {
      setEditingAvailability(availability)
      setFormData({
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        isActive: availability.isActive,
        specificDate: availability.specificDate || '',
      })
      setIsDialogOpen(true)
    }
  }

  // Create or update availability
  const handleSaveAvailability = async () => {
    setIsLoading(true)
    try {
      const url = editingAvailability ? '/api/availability' : '/api/availability'
      const method = editingAvailability ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        ...(editingAvailability && { id: editingAvailability.id }),
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save availability')
      }

      toast.success(editingAvailability ? 'Availability updated' : 'Availability created')
      setIsDialogOpen(false)
      fetchAvailabilities() // Refresh the calendar
    } catch (error: any) {
      console.error('Error saving availability:', error)
      toast.error(error.message || 'Failed to save availability')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete availability
  const handleDeleteAvailability = async () => {
    if (!editingAvailability) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/availability/${editingAvailability.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete availability')
      }

      toast.success('Availability deleted')
      setIsDialogOpen(false)
      fetchAvailabilities() // Refresh the calendar
    } catch (error: any) {
      console.error('Error deleting availability:', error)
      toast.error(error.message || 'Failed to delete availability')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailabilities()
  }, [fetchAvailabilities])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Provider Availability</h2>
          <p className="text-gray-600">
            Manage your schedule and availability for patient appointments
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAvailability(null)
            setFormData({
              dayOfWeek: 1,
              startTime: '09:00',
              endTime: '17:00',
              isActive: true,
              specificDate: '',
            })
            setIsDialogOpen(true)
          }}
          className="bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Availability
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Time Slots</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availabilities.filter(a => a.isActive).length}
            </div>
            <p className="text-xs text-gray-600">Available for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calendarEvents.filter(e => e.extendedProps?.isActive).length}
            </div>
            <p className="text-xs text-gray-600">Available appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Times</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availabilities.filter(a => !a.isActive).length}
            </div>
            <p className="text-xs text-gray-600">Unavailable slots</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Calendar</CardTitle>
          <CardDescription>
            Click on a date to add availability, or click on existing events to edit them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              events={calendarEvents}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '08:00',
                endTime: '18:00',
              }}
              eventClassNames="cursor-pointer hover:opacity-80"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Availability Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAvailability ? 'Edit Availability' : 'Add Availability'}
            </DialogTitle>
            <DialogDescription>
              {editingAvailability
                ? 'Update your availability slot details'
                : 'Set your availability for patient appointments'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Specific Date vs Recurring */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={!!formData.specificDate}
                onCheckedChange={checked => {
                  setFormData({
                    ...formData,
                    specificDate: checked
                      ? selectedDate || new Date().toISOString().split('T')[0]
                      : '',
                  })
                }}
              />
              <Label>Specific date only (otherwise recurring weekly)</Label>
            </div>

            {/* Specific Date Input */}
            {formData.specificDate && (
              <div>
                <Label htmlFor="specificDate">Date</Label>
                <Input
                  id="specificDate"
                  type="date"
                  value={formData.specificDate}
                  onChange={e => setFormData({ ...formData, specificDate: e.target.value })}
                />
              </div>
            )}

            {/* Day of Week for Recurring */}
            {!formData.specificDate && (
              <div>
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select
                  value={formData.dayOfWeek.toString()}
                  onValueChange={value => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Available for appointments</Label>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {editingAvailability && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteAvailability}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveAvailability}
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {isLoading ? 'Saving...' : editingAvailability ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

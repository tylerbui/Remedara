'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Provider {
  id: string
  name: string
  specialty: string
  email: string
}

interface Message {
  id: string
  subject: string
  content: string
  providerId: string
  providerName: string
  sentAt: string
  status: 'sent' | 'delivered' | 'read' | 'replied'
}

export function MessageProvider() {
  const { data: session } = useSession()
  const [providers, setProviders] = useState<Provider[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [subject, setSubject] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Mock data - replace with API calls
  useEffect(() => {
    // Mock providers data
    const mockProviders: Provider[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Primary Care',
        email: 'sarah.johnson@remedara.com'
      },
      {
        id: '2',
        name: 'Dr. Robert Chen',
        specialty: 'Cardiology',
        email: 'robert.chen@remedara.com'
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        specialty: 'Dermatology',
        email: 'emily.davis@remedara.com'
      }
    ]
    
    // Mock messages data
    const mockMessages: Message[] = [
      {
        id: '1',
        subject: 'Question about test results',
        content: 'Hi Dr. Johnson, I have a question about my recent lab results...',
        providerId: '1',
        providerName: 'Dr. Sarah Johnson',
        sentAt: '2024-01-20T10:30:00Z',
        status: 'read'
      },
      {
        id: '2',
        subject: 'Appointment follow-up',
        content: 'Thank you for the appointment yesterday. I wanted to ask about...',
        providerId: '2',
        providerName: 'Dr. Robert Chen',
        sentAt: '2024-01-18T14:15:00Z',
        status: 'replied'
      }
    ]
    
    setProviders(mockProviders)
    setMessages(mockMessages)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProvider || !subject.trim() || !messageContent.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          subject: subject.trim(),
          content: messageContent.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const result = await response.json()
      
      // Add the new message to the list
      const provider = providers.find(p => p.id === selectedProvider)
      const newMessage: Message = {
        id: result.id || Date.now().toString(),
        subject: subject.trim(),
        content: messageContent.trim(),
        providerId: selectedProvider,
        providerName: provider?.name || 'Unknown Provider',
        sentAt: new Date().toISOString(),
        status: 'sent'
      }
      
      setMessages([newMessage, ...messages])
      
      // Reset form
      setSelectedProvider('')
      setSubject('')
      setMessageContent('')
      setSuccess(true)
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
      
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'replied':
        return <MessageSquare className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return 'Sent'
      case 'delivered':
        return 'Delivered'
      case 'read':
        return 'Read'
      case 'replied':
        return 'Replied'
      default:
        return 'Sent'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Provider</h2>
          <p className="text-gray-600 mt-1">Send secure messages to your healthcare providers</p>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Message Sent Successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your message has been sent to your provider. You should receive a response within 24-48 hours.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Send Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Send New Message</span>
          </CardTitle>
          <CardDescription>
            Send a secure message to one of your healthcare providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Select Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a provider to message" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.specialty}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter message subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
              />
              <p className="text-sm text-gray-500">{subject.length}/200 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
                maxLength={2000}
              />
              <p className="text-sm text-gray-500">{messageContent.length}/2000 characters</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Message History */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Messages</span>
            </CardTitle>
            <CardDescription>
              Your recent communications with healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">{message.subject}</h4>
                      <p className="text-sm text-gray-600">
                        To: {message.providerName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(message.status)}
                      <Badge variant="secondary" className="text-xs">
                        {getStatusText(message.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sent on {new Date(message.sentAt).toLocaleDateString()} at{' '}
                    {new Date(message.sentAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Share2, 
  Send, 
  Clock, 
  Shield, 
  User, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react'

interface SharedRecord {
  id: string
  sharedWith: string
  sharedWithName: string
  recordTypes: string[]
  shareDate: string
  expiryDate?: string
  accessCount: number
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED'
  message?: string
}

interface RecordSharingProps {
  userProfile: {
    id: string
    name: string
    email: string
  }
  availableRecordTypes: { id: string; label: string; count: number }[]
  onShare: (shareData: ShareRequest) => Promise<void>
}

interface ShareRequest {
  recipientEmail: string
  recipientName: string
  recordTypes: string[]
  message: string
  expiryDays: number
  allowDownload: boolean
}

export function RecordSharing({ userProfile, availableRecordTypes, onShare }: RecordSharingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shareRequests, setShareRequests] = useState<SharedRecord[]>([
    {
      id: '1',
      sharedWith: 'dr.smith@example.com',
      sharedWithName: 'Dr. Sarah Smith',
      recordTypes: ['lab-results', 'imaging'],
      shareDate: '2024-01-15',
      expiryDate: '2024-02-15',
      accessCount: 3,
      status: 'ACTIVE',
      message: 'Lab results for cardiology consultation'
    },
    {
      id: '2',
      sharedWith: 'nurse.johnson@clinic.com',
      sharedWithName: 'Nurse Michael Johnson',
      recordTypes: ['vaccines', 'allergies'],
      shareDate: '2024-01-10',
      expiryDate: '2024-01-25',
      accessCount: 1,
      status: 'EXPIRED',
      message: 'Vaccination records for employment'
    }
  ])

  const [formData, setFormData] = useState<ShareRequest>({
    recipientEmail: '',
    recipientName: '',
    recordTypes: [],
    message: '',
    expiryDays: 30,
    allowDownload: false
  })

  const handleShare = async () => {
    if (!formData.recipientEmail || !formData.recipientName || formData.recordTypes.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await onShare(formData)
      
      // Add to local state for demo
      const newShare: SharedRecord = {
        id: Date.now().toString(),
        sharedWith: formData.recipientEmail,
        sharedWithName: formData.recipientName,
        recordTypes: formData.recordTypes,
        shareDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + formData.expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        accessCount: 0,
        status: 'ACTIVE',
        message: formData.message
      }
      
      setShareRequests(prev => [newShare, ...prev])
      
      // Reset form
      setFormData({
        recipientEmail: '',
        recipientName: '',
        recordTypes: [],
        message: '',
        expiryDays: 30,
        allowDownload: false
      })
      
      setIsOpen(false)
      toast.success('Records shared successfully!')
    } catch (error: any) {
      console.error('Error sharing records:', error)
      toast.error(error.message || 'Failed to share records')
    } finally {
      setIsLoading(false)
    }
  }

  const revokeAccess = async (shareId: string) => {
    try {
      // TODO: Call API to revoke access
      setShareRequests(prev => 
        prev.map(share => 
          share.id === shareId 
            ? { ...share, status: 'REVOKED' as const }
            : share
        )
      )
      toast.success('Access revoked successfully')
    } catch (error) {
      toast.error('Failed to revoke access')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      case 'REVOKED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />
      case 'EXPIRED': return <Clock className="h-4 w-4" />
      case 'REVOKED': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Record Sharing</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share Records</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Medical Records</DialogTitle>
              <DialogDescription>
                Securely share your medical records with healthcare providers
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientName">Provider Name *</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="Dr. Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="recipientEmail">Provider Email *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    placeholder="provider@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Record Types to Share *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableRecordTypes.map((recordType) => (
                    <div key={recordType.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={recordType.id}
                        checked={formData.recordTypes.includes(recordType.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              recordTypes: [...formData.recordTypes, recordType.id]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              recordTypes: formData.recordTypes.filter(id => id !== recordType.id)
                            })
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={recordType.id} className="text-sm">
                        {recordType.label} ({recordType.count})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDays">Access Duration</Label>
                  <Select value={formData.expiryDays.toString()} onValueChange={(value) => setFormData({ ...formData, expiryDays: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowDownload"
                      checked={formData.allowDownload}
                      onChange={(e) => setFormData({ ...formData, allowDownload: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="allowDownload" className="text-sm">Allow Download</label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Additional context for the healthcare provider..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShare} disabled={isLoading}>
                {isLoading ? 'Sharing...' : 'Share Records'}
                <Send className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Shares */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Shared Records</h4>
        {shareRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No records have been shared yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Share your medical records securely with healthcare providers
              </p>
            </CardContent>
          </Card>
        ) : (
          shareRequests.map((share) => (
            <Card key={share.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{share.sharedWithName}</p>
                      <p className="text-sm text-gray-600">{share.sharedWith}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(share.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(share.status)}
                        <span>{share.status}</span>
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-medium">Shared Records:</span>
                    {share.recordTypes.map(type => (
                      <Badge key={type} variant="outline">
                        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Shared on:</span> {new Date(share.shareDate).toLocaleDateString()}
                    </div>
                    {share.expiryDate && (
                      <div>
                        <span className="font-medium">Expires:</span> {new Date(share.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-medium">Access count:</span> {share.accessCount} times
                  </div>

                  {share.message && (
                    <div>
                      <span className="font-medium">Message:</span> {share.message}
                    </div>
                  )}
                </div>

                {share.status === 'ACTIVE' && (
                  <div className="flex justify-end mt-4 pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => revokeAccess(share.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Revoke Access
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
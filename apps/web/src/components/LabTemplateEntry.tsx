'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  LAB_TEMPLATES,
  LabTemplate,
  LabValue,
  getLabTemplateById,
  getLabTemplatesByCategory,
  getAllLabCategories,
  calculateLabStatus
} from '@/lib/labTemplates'
import {
  TestTube,
  Plus,
  Save,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Edit
} from 'lucide-react'

interface LabEntryData extends LabTemplate {
  patientId?: string
  providerId?: string
  orderDate?: string
  collectionDate?: string
  resultDate?: string
  notes?: string
  status: 'pending' | 'completed' | 'reviewed'
}

export default function LabTemplateEntry() {
  const [selectedTemplate, setSelectedTemplate] = useState<LabTemplate | null>(null)
  const [labEntry, setLabEntry] = useState<LabEntryData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('templates')

  const categories = getAllLabCategories()
  const filteredTemplates = LAB_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleTemplateSelect = (templateId: string) => {
    const template = getLabTemplateById(templateId)
    if (template) {
      setSelectedTemplate(template)
      setLabEntry({
        ...template,
        status: 'pending',
        orderDate: new Date().toISOString().split('T')[0],
        collectionDate: new Date().toISOString().split('T')[0],
        resultDate: new Date().toISOString().split('T')[0]
      })
      setIsTemplateDialogOpen(false)
    }
  }

  const handleValueChange = (index: number, field: keyof LabValue, value: any) => {
    if (!labEntry) return
    
    const updatedValues = [...labEntry.values]
    updatedValues[index] = { ...updatedValues[index], [field]: value }
    
    // Auto-calculate status for numeric values
    if (field === 'value' && typeof value === 'number') {
      const referenceRange = updatedValues[index].referenceRange
      updatedValues[index].status = calculateLabStatus(value, referenceRange)
    }
    
    setLabEntry({ ...labEntry, values: updatedValues })
  }

  const handleSaveLabResults = () => {
    if (!labEntry) return
    
    // Here you would typically save to your backend
    console.log('Saving lab results:', labEntry)
    
    // Update status to completed
    setLabEntry({ ...labEntry, status: 'completed' })
    
    // You could show a success message or redirect
    alert('Lab results saved successfully!')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      high: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      low: { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      critical: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      pending: { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={config.color}>
        {status}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'high': case 'critical': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'low': return <TrendingDown className="h-4 w-4 text-blue-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const groupValuesByCategory = (values: LabValue[]) => {
    const grouped = values.reduce((acc, value) => {
      const category = value.category || 'General'
      if (!acc[category]) acc[category] = []
      acc[category].push(value)
      return acc
    }, {} as Record<string, LabValue[]>)
    
    return grouped
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lab Results Entry</h2>
          <p className="text-gray-600 mt-1">Use standardized templates to enter lab results efficiently</p>
        </div>
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Lab Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Lab Template</DialogTitle>
              <DialogDescription>
                Choose from standardized lab templates to ensure consistent data entry
              </DialogDescription>
            </DialogHeader>
            
            {/* Template Selection */}
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {template.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{template.values.length} values</span>
                        {template.cptCodes && (
                          <span>CPT: {template.cptCodes.join(', ')}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lab Entry Form */}
      {labEntry && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>{labEntry.name}</span>
                  {getStatusBadge(labEntry.status)}
                </CardTitle>
                <CardDescription>{labEntry.description}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSaveLabResults} disabled={labEntry.status === 'completed'}>
                  <Save className="h-4 w-4 mr-2" />
                  {labEntry.status === 'completed' ? 'Saved' : 'Save Results'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Patient and Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={labEntry.orderDate || ''}
                  onChange={(e) => setLabEntry({ ...labEntry, orderDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="collectionDate">Collection Date</Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={labEntry.collectionDate || ''}
                  onChange={(e) => setLabEntry({ ...labEntry, collectionDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="resultDate">Result Date</Label>
                <Input
                  id="resultDate"
                  type="date"
                  value={labEntry.resultDate || ''}
                  onChange={(e) => setLabEntry({ ...labEntry, resultDate: e.target.value })}
                />
              </div>
            </div>

            {/* Lab Values Entry */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lab Values</h3>
              
              {Object.keys(groupValuesByCategory(labEntry.values)).length > 1 ? (
                // Grouped by category
                <Tabs defaultValue={Object.keys(groupValuesByCategory(labEntry.values))[0]}>
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(groupValuesByCategory(labEntry.values)).length}, 1fr)` }}>
                    {Object.keys(groupValuesByCategory(labEntry.values)).map(category => (
                      <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(groupValuesByCategory(labEntry.values)).map(([category, values]) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                      {values.map((labValue, originalIndex) => {
                        const actualIndex = labEntry.values.findIndex(v => v === labValue)
                        return (
                          <Card key={`${category}-${originalIndex}`}>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div className="md:col-span-2">
                                  <Label className="font-medium">{labValue.name}</Label>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Code: {labValue.code} • Reference: {labValue.referenceRange}
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor={`value-${actualIndex}`}>Value</Label>
                                  <Input
                                    id={`value-${actualIndex}`}
                                    type="number"
                                    step="0.01"
                                    value={labValue.value || ''}
                                    onChange={(e) => handleValueChange(actualIndex, 'value', parseFloat(e.target.value) || null)}
                                    placeholder="Enter value"
                                  />
                                </div>
                                <div>
                                  <Label>Unit</Label>
                                  <div className="flex items-center h-10 px-3 bg-gray-50 border rounded-md text-sm text-gray-600">
                                    {labValue.unit}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(labValue.status)}
                                  {getStatusBadge(labValue.status)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                // Single category or no categories
                <div className="space-y-4">
                  {labEntry.values.map((labValue, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                          <div className="md:col-span-2">
                            <Label className="font-medium">{labValue.name}</Label>
                            <p className="text-xs text-gray-500 mt-1">
                              Code: {labValue.code} • Reference: {labValue.referenceRange}
                            </p>
                          </div>
                          <div>
                            <Label htmlFor={`value-${index}`}>Value</Label>
                            <Input
                              id={`value-${index}`}
                              type="number"
                              step="0.01"
                              value={labValue.value || ''}
                              onChange={(e) => handleValueChange(index, 'value', parseFloat(e.target.value) || null)}
                              placeholder="Enter value"
                            />
                          </div>
                          <div>
                            <Label>Unit</Label>
                            <div className="flex items-center h-10 px-3 bg-gray-50 border rounded-md text-sm text-gray-600">
                              {labValue.unit}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(labValue.status)}
                            {getStatusBadge(labValue.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Interpretation Notes */}
            {labEntry.interpretationNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Clinical Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{labEntry.interpretationNotes}</p>
                </CardContent>
              </Card>
            )}

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Provider Notes</Label>
              <Textarea
                id="notes"
                value={labEntry.notes || ''}
                onChange={(e) => setLabEntry({ ...labEntry, notes: e.target.value })}
                placeholder="Add any additional notes or observations..."
                className="mt-2"
                rows={3}
              />
            </div>

            {/* CPT Codes */}
            {labEntry.cptCodes && labEntry.cptCodes.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">CPT Codes</h4>
                <div className="flex flex-wrap gap-2">
                  {labEntry.cptCodes.map(code => (
                    <Badge key={code} variant="secondary">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!labEntry && (
        <Card>
          <CardContent className="py-12 text-center">
            <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Entry Selected</h3>
            <p className="text-gray-600 mb-6">
              Select a lab template to start entering results with standardized formats and reference ranges.
            </p>
            <Button onClick={() => setIsTemplateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Choose Lab Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar,
  Search,
  Filter,
  TestTube,
  Pill,
  Activity,
  AlertTriangle,
  Syringe,
  FileText,
  Building2,
  MessageSquare,
  CalendarPlus,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react'

interface TimelineEntry {
  _id: string
  organizationName: string
  fhirResourceType: string
  fhirResourceId: string
  effectiveDate: string
  syncedAt: string
  category: 'lab' | 'medication' | 'allergy' | 'vital' | 'immunization' | 'procedure' | 'encounter' | 'other'
  title: string
  summary?: string
  providerActions: {
    canMessage: boolean
    canSchedule: boolean
  }
  tags: string[]
}

interface Category {
  key: string
  label: string
  count: number
}

interface Provider {
  _id: string
  organizationName: string
  capabilities: {
    canMessage: boolean
    canSchedule: boolean
  }
}

interface TimelineResponse {
  timeline: TimelineEntry[]
  groupedByDate: Record<string, TimelineEntry[]>
  providers: Provider[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  categories: Category[]
}

export function UnifiedTimeline() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [groupedByDate, setGroupedByDate] = useState<Record<string, TimelineEntry[]>>({})
  const [providers, setProviders] = useState<Provider[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [dateRange, setDateRange] = useState('')
  
  // Pagination
  const [offset, setOffset] = useState(0)
  const limit = 25

  useEffect(() => {
    fetchTimeline(true) // Reset on filter change
  }, [selectedCategory, selectedProvider, dateRange, searchTerm])

  const fetchTimeline = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setOffset(0)
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: reset ? '0' : offset.toString()
      })

      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedProvider) params.append('provider', selectedProvider)
      if (searchTerm) params.append('search', searchTerm)
      if (dateRange) {
        const since = new Date()
        switch (dateRange) {
          case '7d':
            since.setDate(since.getDate() - 7)
            break
          case '30d':
            since.setDate(since.getDate() - 30)
            break
          case '90d':
            since.setDate(since.getDate() - 90)
            break
          case '1y':
            since.setFullYear(since.getFullYear() - 1)
            break
        }
        if (dateRange !== 'all') {
          params.append('since', since.toISOString())
        }
      }

      const response = await fetch(`/api/fhir/timeline?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch timeline')
      }
      
      const data: TimelineResponse = await response.json()
      
      if (reset) {
        setTimeline(data.timeline)
        setGroupedByDate(data.groupedByDate)
        setProviders(data.providers)
        setCategories(data.categories)
      } else {
        setTimeline(prev => [...prev, ...data.timeline])
        // Merge grouped data
        setGroupedByDate(prev => {
          const merged = { ...prev }
          Object.entries(data.groupedByDate).forEach(([date, entries]) => {
            if (merged[date]) {
              merged[date] = [...merged[date], ...entries]
            } else {
              merged[date] = entries
            }
          })
          return merged
        })
      }
      
      setHasMore(data.pagination.hasMore)
      setOffset(data.pagination.offset + data.pagination.limit)

    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchTimeline(false)
    }
  }

  const toggleEntry = (entryId: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId)
    } else {
      newExpanded.add(entryId)
    }
    setExpandedEntries(newExpanded)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lab':
        return <TestTube className="h-4 w-4" />
      case 'medication':
        return <Pill className="h-4 w-4" />
      case 'vital':
        return <Activity className="h-4 w-4" />
      case 'allergy':
        return <AlertTriangle className="h-4 w-4" />
      case 'immunization':
        return <Syringe className="h-4 w-4" />
      case 'procedure':
      case 'encounter':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lab':
        return 'bg-[#E8EBE4] text-blue-800'
      case 'medication':
        return 'bg-[#E8EBE4] text-[#2D4A3E]'
      case 'vital':
        return 'bg-red-100 text-red-800'
      case 'allergy':
        return 'bg-yellow-100 text-yellow-800'
      case 'immunization':
        return 'bg-[#E8EBE4] text-purple-800'
      case 'procedure':
        return 'bg-indigo-100 text-indigo-800'
      case 'encounter':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays === 0) return 'Today'
    if (diffDays <= 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Timeline</h2>
          <p className="text-gray-600 mt-1">
            Your complete medical history from all connected providers
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medical records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="All providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All providers</SelectItem>
                  {providers.map(provider => (
                    <SelectItem key={provider._id} value={provider._id}>
                      {provider.organizationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear filters */}
          {(searchTerm || selectedCategory || selectedProvider || dateRange) && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedProvider('')
                  setDateRange('')
                }}
                className="text-sm"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
            <p className="text-gray-600">
              {providers.length === 0 
                ? "Link your healthcare providers to see your medical timeline."
                : "Try adjusting your search criteria or sync your provider data."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByDate)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, entries]) => (
              <div key={date} className="relative">
                {/* Date Header */}
                <div className="sticky top-0 z-10 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(date)}</span>
                    <Badge variant="secondary">{entries.length} records</Badge>
                  </h3>
                </div>

                {/* Timeline Entries */}
                <div className="space-y-4 ml-4 border-l-2 border-gray-200 pl-6">
                  {entries.map((entry, index) => (
                    <div key={entry._id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-8 top-6 w-4 h-4 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#E8EBE4]0 rounded-full"></div>
                      </div>

                      <Card className="ml-4">
                        <CardHeader 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleEntry(entry._id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-3">
                                <Badge className={getCategoryColor(entry.category)}>
                                  <div className="flex items-center space-x-1">
                                    {getCategoryIcon(entry.category)}
                                    <span className="capitalize">{entry.category}</span>
                                  </div>
                                </Badge>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Building2 className="h-3 w-3" />
                                  <span>{entry.organizationName}</span>
                                </div>
                              </div>
                              
                              <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                              
                              {entry.summary && (
                                <p className="text-gray-600 text-sm">{entry.summary}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {expandedEntries.has(entry._id) ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        {expandedEntries.has(entry._id) && (
                          <CardContent className="pt-0 border-t bg-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
                              {/* Entry Details */}
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3">Details</h5>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Resource Type:</strong> {entry.fhirResourceType}</div>
                                  <div><strong>Resource ID:</strong> {entry.fhirResourceId}</div>
                                  <div><strong>Provider:</strong> {entry.organizationName}</div>
                                  <div><strong>Synced:</strong> {new Date(entry.syncedAt).toLocaleDateString()}</div>
                                  {entry.tags.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                      <strong>Tags:</strong>
                                      <div className="flex flex-wrap gap-1">
                                        {entry.tags.map((tag, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Provider Actions */}
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3">Actions</h5>
                                <div className="flex flex-wrap gap-2">
                                  {entry.providerActions.canMessage && (
                                    <Button size="sm" variant="outline">
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message Provider
                                    </Button>
                                  )}
                                  {entry.providerActions.canSchedule && (
                                    <Button size="sm" variant="outline">
                                      <CalendarPlus className="h-4 w-4 mr-2" />
                                      Schedule Appointment
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={loadingMore} variant="outline">
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Records'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
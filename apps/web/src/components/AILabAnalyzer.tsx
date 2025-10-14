'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Brain,
  TestTube,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Eye,
  Download,
  Sparkles,
  Lightbulb,
  Target,
  AlertCircle
} from 'lucide-react'

interface LabAnalysis {
  overview: string
  criticalFindings: string[]
  abnormalResults: Array<{
    test: string
    value: string
    interpretation: string
    severity: 'low' | 'moderate' | 'high' | 'critical'
    recommendations: string[]
  }>
  patterns: string[]
  clinicalInsights: string[]
  followUpRecommendations: string[]
  riskAssessment: {
    level: 'low' | 'moderate' | 'high' | 'critical'
    factors: string[]
    description: string
  }
  metadata: {
    analyzedAt: string
    confidence: number
    flaggedCount: number
  }
}

interface Patient {
  id: string
  name: string
  email: string
}

interface LabUploadData {
  patientId: string
  textContent: string
  labFacility: string
  resultDate: string
  fileType?: string
  fileName?: string
}

export default function AILabAnalyzer() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<LabAnalysis | null>(null)
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)
  
  // Upload form data
  const [uploadData, setUploadData] = useState<LabUploadData>({
    patientId: '',
    textContent: '',
    labFacility: '',
    resultDate: new Date().toISOString().split('T')[0],
    fileName: ''
  })

  // Recent analyses (you might want to store these in state management)
  const [recentAnalyses, setRecentAnalyses] = useState<Array<{
    id: string
    patientName: string
    analysisDate: string
    riskLevel: string
    flaggedCount: number
  }>>([])

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setIsLoadingPatients(true)
    try {
      const response = await fetch('/api/patients?connected=true')
      if (response.ok) {
        const data = await response.json()
        setPatients(data.patients || [])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to load patients')
    } finally {
      setIsLoadingPatients(false)
    }
  }

  const handleUploadLab = async () => {
    if (!uploadData.patientId || !uploadData.textContent || !uploadData.labFacility) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/labs/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      })

      if (!response.ok) {
        throw new Error('Failed to upload lab results')
      }

      const result = await response.json()
      
      setAnalysis(result.results.analysis)
      toast.success(`Successfully processed ${result.results.createdLabResults} lab results`)
      
      // Add to recent analyses
      const patientName = patients.find(p => p.id === uploadData.patientId)?.name || 'Unknown Patient'
      setRecentAnalyses(prev => [{
        id: Date.now().toString(),
        patientName,
        analysisDate: new Date().toISOString(),
        riskLevel: result.results.analysis.riskAssessment.level,
        flaggedCount: result.results.analysis.metadata.flaggedCount
      }, ...prev.slice(0, 9)]) // Keep only last 10

      setIsUploadModalOpen(false)
      resetUploadForm()
      
    } catch (error) {
      console.error('Error uploading lab results:', error)
      toast.error('Failed to process lab upload')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyzeExistingLabs = async (patientId: string) => {
    if (!patientId) return

    setIsAnalyzing(true)
    try {
      const response = await fetch(`/api/labs/${patientId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          patientId,
          dateRange: {
            start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Last 90 days
            end: new Date().toISOString()
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze lab results')
      }

      const result = await response.json()
      setAnalysis(result.analysis)
      toast.success(`Analyzed ${result.labResults.length} lab results`)
      
    } catch (error) {
      console.error('Error analyzing lab results:', error)
      toast.error('Failed to analyze lab results')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetUploadForm = () => {
    setUploadData({
      patientId: '',
      textContent: '',
      labFacility: '',
      resultDate: new Date().toISOString().split('T')[0],
      fileName: ''
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-l-red-500 bg-red-50'
      case 'high': return 'border-l-orange-500 bg-orange-50'
      case 'moderate': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="h-7 w-7 mr-3 text-blue-600" />
            AI Lab Analyzer
          </h2>
          <p className="text-gray-600 mt-1">Upload and analyze laboratory results with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => fetchPatients()}
            disabled={isLoadingPatients}
          >
            <Search className="h-4 w-4 mr-2" />
            Refresh Patients
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Lab Results
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAnalyses.length}</div>
            <p className="text-xs text-muted-foreground">This session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentAnalyses.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Patients</CardTitle>
            <TestTube className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">Available for analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Selection for Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Analyze Existing Lab Results</span>
          </CardTitle>
          <CardDescription>
            Select a patient to analyze their existing laboratory results with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select 
                value={selectedPatient?.id || ''} 
                onValueChange={(value) => {
                  const patient = patients.find(p => p.id === value)
                  setSelectedPatient(patient || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => selectedPatient && handleAnalyzeExistingLabs(selectedPatient.id)}
              disabled={!selectedPatient || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Labs
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>AI Analysis Results</span>
                <Badge variant="secondary">
                  Confidence: {Math.round(analysis.metadata.confidence * 100)}%
                </Badge>
              </CardTitle>
              <CardDescription>
                Generated on {new Date(analysis.metadata.analyzedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overview */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                <p className="text-gray-700">{analysis.overview}</p>
              </div>

              {/* Risk Assessment */}
              <div className={`p-4 rounded-lg border-l-4 ${getRiskLevelColor(analysis.riskAssessment.level)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Risk Assessment</h3>
                  <Badge className={getSeverityColor(analysis.riskAssessment.level)}>
                    {analysis.riskAssessment.level.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-gray-700 mb-3">{analysis.riskAssessment.description}</p>
                {analysis.riskAssessment.factors.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Risk Factors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="text-gray-600">{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Critical Findings */}
              {analysis.criticalFindings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-red-800 mb-2 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Critical Findings
                  </h3>
                  <ul className="space-y-2">
                    {analysis.criticalFindings.map((finding, index) => (
                      <li key={index} className="text-red-700 font-medium">• {finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Abnormal Results */}
              {analysis.abnormalResults.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Abnormal Results</h3>
                  <div className="space-y-3">
                    {analysis.abnormalResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{result.test}</h4>
                          <Badge className={getSeverityColor(result.severity)}>
                            {result.severity}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          <strong>Value:</strong> {result.value}
                        </p>
                        <p className="text-gray-700 mb-3">{result.interpretation}</p>
                        {result.recommendations.length > 0 && (
                          <div>
                            <p className="font-medium text-sm mb-1">Recommendations:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {result.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-gray-600">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Insights */}
              {analysis.clinicalInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Clinical Insights
                  </h3>
                  <ul className="space-y-2">
                    {analysis.clinicalInsights.map((insight, index) => (
                      <li key={index} className="text-gray-700">• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Patterns */}
              {analysis.patterns.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Identified Patterns
                  </h3>
                  <ul className="space-y-2">
                    {analysis.patterns.map((pattern, index) => (
                      <li key={index} className="text-gray-700">• {pattern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Recommendations */}
              {analysis.followUpRecommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-blue-800 mb-3">Follow-up Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.followUpRecommendations.map((rec, index) => (
                      <li key={index} className="text-blue-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Analyses */}
      {recentAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Previously analyzed lab results in this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{analysis.patientName}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(analysis.analysisDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(analysis.riskLevel)}>
                      {analysis.riskLevel}
                    </Badge>
                    {analysis.flaggedCount > 0 && (
                      <Badge variant="outline">
                        {analysis.flaggedCount} flagged
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Lab Results</DialogTitle>
            <DialogDescription>
              Upload lab results text or file content for AI analysis
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Patient Selection */}
            <div>
              <Label htmlFor="patient">Patient *</Label>
              <Select 
                value={uploadData.patientId} 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lab Facility */}
            <div>
              <Label htmlFor="facility">Lab Facility *</Label>
              <Input
                id="facility"
                value={uploadData.labFacility}
                onChange={(e) => setUploadData(prev => ({ ...prev, labFacility: e.target.value }))}
                placeholder="e.g., Quest Diagnostics, LabCorp"
              />
            </div>

            {/* Result Date */}
            <div>
              <Label htmlFor="date">Result Date *</Label>
              <Input
                id="date"
                type="date"
                value={uploadData.resultDate}
                onChange={(e) => setUploadData(prev => ({ ...prev, resultDate: e.target.value }))}
              />
            </div>

            {/* File Name (optional) */}
            <div>
              <Label htmlFor="filename">File Name (optional)</Label>
              <Input
                id="filename"
                value={uploadData.fileName}
                onChange={(e) => setUploadData(prev => ({ ...prev, fileName: e.target.value }))}
                placeholder="e.g., CBC_Panel_2024.pdf"
              />
            </div>

            {/* Lab Content */}
            <div>
              <Label htmlFor="content">Lab Results Content *</Label>
              <Textarea
                id="content"
                value={uploadData.textContent}
                onChange={(e) => setUploadData(prev => ({ ...prev, textContent: e.target.value }))}
                placeholder="Paste lab results text here or copy content from lab report..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Copy and paste lab results text. The AI will extract and analyze all laboratory values.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadLab} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
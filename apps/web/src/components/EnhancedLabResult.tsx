'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Calendar,
  Pill,
  User,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

interface LabResult {
  id: string
  testName: string
  result: string
  unit?: string
  referenceRange?: string
  status: 'COMPLETED' | 'PENDING' | 'ABNORMAL'
  resultDate: string
  labFacility: string
  flagged: boolean
  trend?: 'up' | 'down' | 'stable'
  previousValue?: string
  daysSinceLast?: number
}

interface PatientFactors {
  age: number
  medications: string[]
  conditions: string[]
  lifestyle: string[]
}

interface LabExplanation {
  plainLanguage: string
  normalMeaning: string
  abnormalMeaning: string
  commonCauses: string[]
  affectingFactors: {
    medications: string[]
    conditions: string[]
    lifestyle: string[]
    demographics: string[]
  }
  references: Array<{
    title: string
    source: string
    url?: string
  }>
}

const labExplanations: Record<string, LabExplanation> = {
  'glucose': {
    plainLanguage: 'Blood sugar level - measures how much sugar (glucose) is in your blood',
    normalMeaning: 'Your body is properly regulating blood sugar levels',
    abnormalMeaning: 'May indicate diabetes, pre-diabetes, or blood sugar regulation issues',
    commonCauses: ['Diabetes', 'Pre-diabetes', 'Stress', 'Recent meals', 'Medications'],
    affectingFactors: {
      medications: ['Steroids', 'Diuretics', 'Beta-blockers', 'Antipsychotics'],
      conditions: ['Diabetes', 'Pancreatic disease', 'Liver disease', 'Kidney disease'],
      lifestyle: ['Diet', 'Exercise', 'Stress', 'Sleep patterns', 'Alcohol consumption'],
      demographics: ['Age over 45', 'Family history', 'Obesity', 'Ethnicity']
    },
    references: [
      { title: 'Blood Glucose Testing', source: 'American Diabetes Association', url: 'https://diabetes.org' },
      { title: 'Diabetes Diagnosis Criteria', source: 'CDC', url: 'https://cdc.gov' }
    ]
  },
  'cholesterol': {
    plainLanguage: 'Measures fats in your blood that can affect heart health',
    normalMeaning: 'Good balance of fats that support healthy heart function',
    abnormalMeaning: 'May increase risk of heart disease and stroke',
    commonCauses: ['Diet', 'Genetics', 'Lack of exercise', 'Age', 'Medical conditions'],
    affectingFactors: {
      medications: ['Statins', 'Beta-blockers', 'Diuretics', 'Steroids'],
      conditions: ['Hypothyroidism', 'Diabetes', 'Kidney disease', 'Liver disease'],
      lifestyle: ['High-fat diet', 'Smoking', 'Lack of exercise', 'Alcohol use'],
      demographics: ['Age', 'Gender', 'Family history', 'Menopause']
    },
    references: [
      { title: 'Cholesterol Guidelines', source: 'American Heart Association' },
      { title: 'Lipid Management', source: 'ACC/AHA Guidelines' }
    ]
  },
  'hemoglobin': {
    plainLanguage: 'Protein in red blood cells that carries oxygen throughout your body',
    normalMeaning: 'Your blood can carry oxygen effectively to all organs',
    abnormalMeaning: 'May indicate anemia, blood disorders, or other health conditions',
    commonCauses: ['Iron deficiency', 'Blood loss', 'Chronic disease', 'Nutritional deficiencies'],
    affectingFactors: {
      medications: ['Blood thinners', 'Chemotherapy', 'NSAIDs', 'Antibiotics'],
      conditions: ['Anemia', 'Chronic kidney disease', 'Cancer', 'Inflammatory diseases'],
      lifestyle: ['Diet', 'Menstrual periods', 'Blood donation', 'High altitude'],
      demographics: ['Age', 'Gender', 'Pregnancy', 'Genetics']
    },
    references: [
      { title: 'Anemia Overview', source: 'National Heart, Lung, and Blood Institute' },
      { title: 'Hemoglobin Testing', source: 'Mayo Clinic' }
    ]
  },
  'creatinine': {
    plainLanguage: 'Waste product filtered by your kidneys - shows how well kidneys are working',
    normalMeaning: 'Your kidneys are filtering waste from your blood effectively',
    abnormalMeaning: 'May indicate kidney disease or reduced kidney function',
    commonCauses: ['Kidney disease', 'Dehydration', 'Muscle breakdown', 'Medications'],
    affectingFactors: {
      medications: ['NSAIDs', 'ACE inhibitors', 'Diuretics', 'Antibiotics'],
      conditions: ['Diabetes', 'High blood pressure', 'Kidney disease', 'Heart failure'],
      lifestyle: ['Dehydration', 'High-protein diet', 'Intense exercise', 'Creatine supplements'],
      demographics: ['Age', 'Gender', 'Muscle mass', 'Race/ethnicity']
    },
    references: [
      { title: 'Kidney Function Tests', source: 'National Kidney Foundation' },
      { title: 'Creatinine Test', source: 'National Institute of Health' }
    ]
  }
}

interface EnhancedLabResultProps {
  result: LabResult
  patientFactors?: PatientFactors
  showTrends?: boolean
  showFactors?: boolean
}

export default function EnhancedLabResult({ 
  result, 
  patientFactors, 
  showTrends = true, 
  showFactors = true 
}: EnhancedLabResultProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  // Get explanation for this test (try multiple variations)
  const getTestExplanation = (testName: string): LabExplanation | null => {
    const normalizedName = testName.toLowerCase()
    
    // Direct match
    if (labExplanations[normalizedName]) {
      return labExplanations[normalizedName]
    }
    
    // Partial matches
    for (const [key, explanation] of Object.entries(labExplanations)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return explanation
      }
    }
    
    return null
  }
  
  const explanation = getTestExplanation(result.testName)
  
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }
  
  const getStatusColor = (status: string, flagged: boolean) => {
    if (flagged) return 'border-l-red-500 bg-red-50'
    switch (status) {
      case 'ABNORMAL': return 'border-l-orange-500 bg-orange-50'
      case 'PENDING': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-green-500 bg-green-50'
    }
  }
  
  const getStatusIcon = (status: string, flagged: boolean) => {
    if (flagged) return <AlertCircle className="h-4 w-4 text-red-500" />
    switch (status) {
      case 'ABNORMAL': return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'PENDING': return <Calendar className="h-4 w-4 text-yellow-500" />
      default: return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }
  
  const getRelevantFactors = (factors: LabExplanation['affectingFactors']) => {
    if (!patientFactors) return []
    
    const relevant = []
    
    // Check medications
    patientFactors.medications.forEach(med => {
      if (factors.medications.some(factor => 
        med.toLowerCase().includes(factor.toLowerCase()) || 
        factor.toLowerCase().includes(med.toLowerCase())
      )) {
        relevant.push({ type: 'medication', value: med })
      }
    })
    
    // Check conditions
    patientFactors.conditions.forEach(condition => {
      if (factors.conditions.some(factor => 
        condition.toLowerCase().includes(factor.toLowerCase()) || 
        factor.toLowerCase().includes(condition.toLowerCase())
      )) {
        relevant.push({ type: 'condition', value: condition })
      }
    })
    
    // Age factors
    if (patientFactors.age > 65) {
      relevant.push({ type: 'age', value: 'Advanced age' })
    }
    
    return relevant
  }

  return (
    <Card className={`border-l-4 ${getStatusColor(result.status, result.flagged)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(result.status, result.flagged)}
            <div>
              <CardTitle className="text-base font-semibold">{result.testName}</CardTitle>
              {explanation && (
                <p className="text-sm text-gray-600 mt-1">{explanation.plainLanguage}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showTrends && result.trend && getTrendIcon(result.trend)}
            {explanation && (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-4xl">
                    <DrawerHeader>
                      <DrawerTitle className="flex items-center space-x-2">
                        <span>What affects this test?</span>
                        <Badge variant="outline">{result.testName}</Badge>
                      </DrawerTitle>
                      <DrawerDescription>
                        Factors that can influence your {result.testName.toLowerCase()} levels
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-8 space-y-6">
                      
                      {/* Test Explanation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-green-700">Normal Results Mean</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{explanation.normalMeaning}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-orange-700">Abnormal Results May Indicate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{explanation.abnormalMeaning}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Patient-Specific Factors */}
                      {showFactors && patientFactors && (
                        <Card className="border-blue-200 bg-blue-50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-blue-700 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Your Specific Factors
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {getRelevantFactors(explanation.affectingFactors).map((factor, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  {factor.type === 'medication' && <Pill className="h-3 w-3 text-blue-600" />}
                                  {factor.type === 'condition' && <AlertCircle className="h-3 w-3 text-blue-600" />}
                                  {factor.type === 'age' && <User className="h-3 w-3 text-blue-600" />}
                                  <span className="text-sm font-medium text-blue-800">{factor.value}</span>
                                </div>
                              ))}
                            </div>
                            {getRelevantFactors(explanation.affectingFactors).length === 0 && (
                              <p className="text-sm text-blue-700">No specific factors identified based on your profile.</p>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Affecting Factors */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <Pill className="h-4 w-4 mr-2" />
                              Medications
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-xs space-y-1">
                              {explanation.affectingFactors.medications.map((med, index) => (
                                <li key={index}>• {med}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Conditions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-xs space-y-1">
                              {explanation.affectingFactors.conditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Lifestyle
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-xs space-y-1">
                              {explanation.affectingFactors.lifestyle.map((lifestyle, index) => (
                                <li key={index}>• {lifestyle}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Demographics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-xs space-y-1">
                              {explanation.affectingFactors.demographics.map((demo, index) => (
                                <li key={index}>• {demo}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* References */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">References & More Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {explanation.references.map((ref, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="text-sm font-medium">{ref.title}</p>
                                  <p className="text-xs text-gray-600">{ref.source}</p>
                                </div>
                                {ref.url && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-lg font-semibold">{result.result}</span>
                {result.unit && <span className="text-sm text-gray-600 ml-1">{result.unit}</span>}
              </div>
              {result.referenceRange && (
                <div className="text-sm text-gray-500">
                  Normal: {result.referenceRange}
                </div>
              )}
            </div>
            
            {result.trend && result.previousValue && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getTrendIcon(result.trend)}
                <span>
                  Previous: {result.previousValue}
                  {result.daysSinceLast && ` (${result.daysSinceLast} days ago)`}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-right text-sm text-gray-500">
            <div>{new Date(result.resultDate).toLocaleDateString()}</div>
            <div>{result.labFacility}</div>
          </div>
        </div>

        {explanation && result.status === 'ABNORMAL' && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm text-orange-800">
              <strong>What this might mean:</strong> {explanation.abnormalMeaning}
            </p>
            {explanation.commonCauses.length > 0 && (
              <p className="text-xs text-orange-700 mt-2">
                <strong>Common causes:</strong> {explanation.commonCauses.join(', ')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
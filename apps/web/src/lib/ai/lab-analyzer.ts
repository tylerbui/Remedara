import { OpenAI } from 'openai'

const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder-key-for-development' 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export interface LabValue {
  testName: string
  result: string
  unit?: string
  referenceRange?: string
  status?: string
}

export interface LabAnalysis {
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

export class LabAnalyzer {
  private static async callOpenAI(messages: any[]): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.')
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4',
        messages,
        temperature: 0.1, // Low temperature for medical accuracy
        max_tokens: 2000
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to analyze lab results with AI')
    }
  }

  static async analyzeSingleLabResult(labValue: LabValue): Promise<LabAnalysis> {
    const prompt = `
As a clinical laboratory AI assistant, analyze the following lab result and provide a comprehensive interpretation:

Lab Test: ${labValue.testName}
Result: ${labValue.result} ${labValue.unit || ''}
Reference Range: ${labValue.referenceRange || 'Not provided'}
Current Status: ${labValue.status || 'Unknown'}

Please provide a detailed analysis in the following JSON format:
{
  "overview": "Brief summary of the result",
  "criticalFindings": ["list of any critical findings"],
  "abnormalResults": [{
    "test": "test name",
    "value": "result value",
    "interpretation": "clinical interpretation",
    "severity": "low|moderate|high|critical",
    "recommendations": ["specific recommendations"]
  }],
  "patterns": ["any notable patterns"],
  "clinicalInsights": ["key clinical insights"],
  "followUpRecommendations": ["recommended follow-up actions"],
  "riskAssessment": {
    "level": "low|moderate|high|critical",
    "factors": ["risk factors identified"],
    "description": "overall risk description"
  }
}

Focus on:
1. Clinical significance of the result
2. Potential health implications
3. Whether the result is within normal limits
4. Any immediate actions needed
5. Follow-up recommendations

Be precise, evidence-based, and include appropriate medical disclaimers.
`

    const messages = [
      {
        role: 'system',
        content: 'You are a clinical laboratory AI assistant with expertise in interpreting lab results. Provide accurate, evidence-based analysis while emphasizing that this is AI-generated content that should be reviewed by healthcare professionals.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.callOpenAI(messages)
    
    try {
      const analysis = JSON.parse(response)
      return {
        ...analysis,
        metadata: {
          analyzedAt: new Date().toISOString(),
          confidence: 0.85, // Default confidence score
          flaggedCount: analysis.abnormalResults?.length || 0
        }
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return this.createFallbackAnalysis(labValue, response)
    }
  }

  static async analyzeMultipleLabResults(labValues: LabValue[]): Promise<LabAnalysis> {
    const labSummary = labValues.map(lab => 
      `${lab.testName}: ${lab.result} ${lab.unit || ''} (Ref: ${lab.referenceRange || 'N/A'})`
    ).join('\n')

    const prompt = `
As a clinical laboratory AI assistant, analyze the following comprehensive lab panel and provide insights on patterns and relationships:

Lab Results:
${labSummary}

Please provide a comprehensive analysis in the following JSON format:
{
  "overview": "Overall assessment of the lab panel",
  "criticalFindings": ["list of critical findings requiring immediate attention"],
  "abnormalResults": [{
    "test": "test name",
    "value": "result value",
    "interpretation": "clinical interpretation",
    "severity": "low|moderate|high|critical",
    "recommendations": ["specific recommendations"]
  }],
  "patterns": ["patterns identified across multiple tests"],
  "clinicalInsights": ["insights from test correlations and patterns"],
  "followUpRecommendations": ["comprehensive follow-up recommendations"],
  "riskAssessment": {
    "level": "overall risk level",
    "factors": ["key risk factors from the panel"],
    "description": "comprehensive risk assessment"
  }
}

Focus on:
1. Correlations between different test results
2. Patterns suggesting specific conditions
3. Metabolic, cardiac, renal, hepatic, or other organ system assessments
4. Risk stratification based on multiple markers
5. Comprehensive care recommendations

Provide evidence-based interpretations with appropriate medical disclaimers.
`

    const messages = [
      {
        role: 'system',
        content: 'You are a clinical laboratory AI assistant specializing in comprehensive lab panel interpretation. Analyze patterns across multiple tests and provide holistic clinical insights.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.callOpenAI(messages)
    
    try {
      const analysis = JSON.parse(response)
      return {
        ...analysis,
        metadata: {
          analyzedAt: new Date().toISOString(),
          confidence: 0.88, // Higher confidence for panel analysis
          flaggedCount: analysis.abnormalResults?.length || 0
        }
      }
    } catch (parseError) {
      return this.createMultiLabFallbackAnalysis(labValues, response)
    }
  }

  static async extractLabDataFromText(textContent: string): Promise<LabValue[]> {
    const prompt = `
Extract laboratory test results from the following text content. Parse all numerical results, test names, units, and reference ranges.

Text Content:
${textContent}

Please extract the data in the following JSON format:
{
  "labResults": [{
    "testName": "complete test name",
    "result": "numerical or text result",
    "unit": "unit of measurement if available",
    "referenceRange": "reference range if provided",
    "status": "normal/abnormal/high/low if indicated"
  }]
}

Focus on extracting:
1. Complete blood count (CBC) values
2. Basic metabolic panel (BMP) or comprehensive metabolic panel (CMP)
3. Lipid panels
4. Liver function tests
5. Kidney function tests
6. Cardiac markers
7. Thyroid function tests
8. Any other laboratory values present

Be thorough and accurate in extraction.
`

    const messages = [
      {
        role: 'system',
        content: 'You are a medical data extraction AI specialized in parsing laboratory reports and extracting structured data from unstructured text.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.callOpenAI(messages)
    
    try {
      const parsed = JSON.parse(response)
      return parsed.labResults || []
    } catch (parseError) {
      console.error('Failed to parse extracted lab data:', parseError)
      return []
    }
  }

  private static createFallbackAnalysis(labValue: LabValue, aiResponse: string): LabAnalysis {
    return {
      overview: `Analysis of ${labValue.testName}: ${labValue.result} ${labValue.unit || ''}`,
      criticalFindings: [],
      abnormalResults: [],
      patterns: [],
      clinicalInsights: [aiResponse.substring(0, 500)],
      followUpRecommendations: ['Consult with healthcare provider for detailed interpretation'],
      riskAssessment: {
        level: 'moderate',
        factors: ['AI parsing error - manual review needed'],
        description: 'Unable to fully parse AI analysis - manual review recommended'
      },
      metadata: {
        analyzedAt: new Date().toISOString(),
        confidence: 0.5,
        flaggedCount: 0
      }
    }
  }

  private static createMultiLabFallbackAnalysis(labValues: LabValue[], aiResponse: string): LabAnalysis {
    return {
      overview: `Analysis of ${labValues.length} lab tests`,
      criticalFindings: [],
      abnormalResults: [],
      patterns: [],
      clinicalInsights: [aiResponse.substring(0, 500)],
      followUpRecommendations: ['Consult with healthcare provider for detailed interpretation'],
      riskAssessment: {
        level: 'moderate',
        factors: ['AI parsing error - manual review needed'],
        description: 'Unable to fully parse AI analysis - manual review recommended'
      },
      metadata: {
        analyzedAt: new Date().toISOString(),
        confidence: 0.5,
        flaggedCount: 0
      }
    }
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { LabAnalyzer, LabValue } from '@/lib/ai/lab-analyzer'
import { z } from 'zod'

// Schema for lab upload validation
const labUploadSchema = z.object({
  patientId: z.string(),
  textContent: z.string().min(1, 'Lab content is required'),
  labFacility: z.string().min(1, 'Lab facility is required'),
  resultDate: z.string(),
  fileType: z.string().optional(),
  fileName: z.string().optional()
})

// POST /api/labs/upload - Upload and parse lab file with AI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers can upload lab results
    if (session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Access denied - providers only' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = labUploadSchema.parse(body)

    // Verify the patient exists and provider has access
    const patient = await prisma.patient.findUnique({
      where: { id: validatedData.patientId }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Get provider profile
    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id }
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
    }

    // Extract lab data from text using AI
    console.log('Extracting lab data from text content...')
    const extractedLabValues = await LabAnalyzer.extractLabDataFromText(validatedData.textContent)

    if (extractedLabValues.length === 0) {
      return NextResponse.json({ 
        error: 'No lab data could be extracted from the provided content' 
      }, { status: 400 })
    }

    // Analyze the extracted lab values
    console.log(`Analyzing ${extractedLabValues.length} extracted lab values...`)
    const analysis = await LabAnalyzer.analyzeMultipleLabResults(extractedLabValues)

    // Create lab results in database
    const createdLabResults = []
    
    for (const labValue of extractedLabValues) {
      try {
        // Determine if result should be flagged
        const isFlagged = analysis.abnormalResults.some(abnormal => 
          abnormal.test.toLowerCase().includes(labValue.testName.toLowerCase()) &&
          (abnormal.severity === 'high' || abnormal.severity === 'critical')
        )

        const labResult = await prisma.labResult.create({
          data: {
            patientId: validatedData.patientId,
            testName: labValue.testName,
            testCode: '', // Could be extracted if available
            result: labValue.result,
            referenceRange: labValue.referenceRange || null,
            unit: labValue.unit || null,
            status: labValue.status?.toUpperCase() === 'ABNORMAL' ? 'ABNORMAL' : 'COMPLETED',
            resultDate: new Date(validatedData.resultDate),
            labFacility: validatedData.labFacility,
            flagged: isFlagged,
            providerNotes: null,
            externalId: null,
            uploadedBy: session.user.id
          }
        })

        createdLabResults.push(labResult)
      } catch (error) {
        console.error(`Error creating lab result for ${labValue.testName}:`, error)
        // Continue with other results even if one fails
      }
    }

    // Store the AI analysis (you might want to create a separate table for this)
    // For now, we'll include it in the response
    
    return NextResponse.json({
      message: `Successfully processed lab upload with ${createdLabResults.length} results`,
      results: {
        extractedLabValues: extractedLabValues.length,
        createdLabResults: createdLabResults.length,
        analysis: analysis,
        labResults: createdLabResults.map(result => ({
          id: result.id,
          testName: result.testName,
          result: result.result,
          unit: result.unit,
          referenceRange: result.referenceRange,
          status: result.status,
          flagged: result.flagged,
          resultDate: result.resultDate.toISOString()
        }))
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error processing lab upload:', error)
    
    if (error instanceof Error && error.message.includes('analyze lab results with AI')) {
      return NextResponse.json({ 
        error: 'AI analysis service unavailable. Please try again later.' 
      }, { status: 503 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
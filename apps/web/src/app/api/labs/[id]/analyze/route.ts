import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { LabAnalyzer, LabValue } from '@/lib/ai/lab-analyzer'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/labs/[id]/analyze - Analyze specific lab result with AI
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers can analyze lab results
    if (session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Access denied - providers only' }, { status: 403 })
    }

    const labResultId = params.id

    // Fetch the lab result
    const labResult = await prisma.labResult.findUnique({
      where: { id: labResultId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!labResult) {
      return NextResponse.json({ error: 'Lab result not found' }, { status: 404 })
    }

    // Prepare lab value for analysis
    const labValue: LabValue = {
      testName: labResult.testName,
      result: labResult.result,
      unit: labResult.unit || undefined,
      referenceRange: labResult.referenceRange || undefined,
      status: labResult.status
    }

    // Analyze the lab result with AI
    console.log(`Analyzing lab result: ${labResult.testName}`)
    const analysis = await LabAnalyzer.analyzeSingleLabResult(labValue)

    // Update the lab result with AI-generated insights (if needed)
    if (analysis.abnormalResults.length > 0) {
      const shouldFlag = analysis.abnormalResults.some(
        abnormal => abnormal.severity === 'high' || abnormal.severity === 'critical'
      )

      if (shouldFlag && !labResult.flagged) {
        await prisma.labResult.update({
          where: { id: labResultId },
          data: { 
            flagged: true,
            providerNotes: analysis.clinicalInsights.join('; ')
          }
        })
      }
    }

    return NextResponse.json({
      labResult: {
        id: labResult.id,
        testName: labResult.testName,
        result: labResult.result,
        unit: labResult.unit,
        referenceRange: labResult.referenceRange,
        status: labResult.status,
        resultDate: labResult.resultDate.toISOString(),
        labFacility: labResult.labFacility,
        flagged: labResult.flagged,
        providerNotes: labResult.providerNotes,
        patient: {
          name: labResult.patient.user.name,
          email: labResult.patient.user.email
        }
      },
      analysis
    })

  } catch (error) {
    console.error('Error analyzing lab result:', error)
    
    if (error instanceof Error && error.message.includes('analyze lab results with AI')) {
      return NextResponse.json({ 
        error: 'AI analysis service unavailable. Please try again later.' 
      }, { status: 503 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/labs/[id]/analyze - Analyze multiple lab results for a patient with pattern recognition
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers can analyze lab results
    if (session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Access denied - providers only' }, { status: 403 })
    }

    const body = await request.json()
    const { patientId, dateRange } = body

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    // Build date filter if provided
    const whereClause: any = { patientId }
    if (dateRange?.start || dateRange?.end) {
      whereClause.resultDate = {}
      if (dateRange.start) {
        whereClause.resultDate.gte = new Date(dateRange.start)
      }
      if (dateRange.end) {
        whereClause.resultDate.lte = new Date(dateRange.end)
      }
    }

    // Fetch all lab results for the patient within the date range
    const labResults = await prisma.labResult.findMany({
      where: whereClause,
      orderBy: { resultDate: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (labResults.length === 0) {
      return NextResponse.json({ error: 'No lab results found for analysis' }, { status: 404 })
    }

    // Prepare lab values for analysis
    const labValues: LabValue[] = labResults.map(result => ({
      testName: result.testName,
      result: result.result,
      unit: result.unit || undefined,
      referenceRange: result.referenceRange || undefined,
      status: result.status
    }))

    // Analyze multiple lab results with pattern recognition
    console.log(`Analyzing ${labResults.length} lab results for patient ${patientId}`)
    const analysis = await LabAnalyzer.analyzeMultipleLabResults(labValues)

    // Update flagged status for results based on analysis
    const updatePromises = labResults.map(async (labResult) => {
      const abnormalResult = analysis.abnormalResults.find(abnormal =>
        abnormal.test.toLowerCase().includes(labResult.testName.toLowerCase())
      )

      if (abnormalResult && (abnormalResult.severity === 'high' || abnormalResult.severity === 'critical')) {
        if (!labResult.flagged) {
          return prisma.labResult.update({
            where: { id: labResult.id },
            data: { 
              flagged: true,
              providerNotes: abnormalResult.interpretation
            }
          })
        }
      }
      return null
    })

    await Promise.all(updatePromises.filter(Boolean))

    return NextResponse.json({
      patient: {
        name: labResults[0].patient.user.name,
        email: labResults[0].patient.user.email
      },
      labResults: labResults.map(result => ({
        id: result.id,
        testName: result.testName,
        result: result.result,
        unit: result.unit,
        referenceRange: result.referenceRange,
        status: result.status,
        resultDate: result.resultDate.toISOString(),
        labFacility: result.labFacility,
        flagged: result.flagged,
        providerNotes: result.providerNotes
      })),
      analysis,
      summary: {
        totalResults: labResults.length,
        flaggedResults: labResults.filter(r => r.flagged).length,
        dateRange: {
          earliest: labResults[labResults.length - 1]?.resultDate.toISOString(),
          latest: labResults[0]?.resultDate.toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Error analyzing patient lab results:', error)
    
    if (error instanceof Error && error.message.includes('analyze lab results with AI')) {
      return NextResponse.json({ 
        error: 'AI analysis service unavailable. Please try again later.' 
      }, { status: 503 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
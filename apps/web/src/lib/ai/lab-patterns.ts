import { LabValue } from './lab-analyzer'

export interface LabPattern {
  patternType: string
  description: string
  severity: 'low' | 'moderate' | 'high' | 'critical'
  confidence: number
  relatedTests: string[]
  clinicalSignificance: string
  recommendations: string[]
}

export interface TrendAnalysis {
  testName: string
  trend: 'improving' | 'stable' | 'worsening' | 'insufficient_data'
  direction: 'increasing' | 'decreasing' | 'fluctuating' | 'stable'
  changePercent: number
  timeSpan: string
  interpretation: string
}

export class LabPatternAnalyzer {
  
  /**
   * Analyze patterns across multiple lab results
   */
  static identifyPatterns(labValues: LabValue[]): LabPattern[] {
    const patterns: LabPattern[] = []
    
    // Metabolic syndrome pattern
    const metabolicPattern = this.checkMetabolicSyndrome(labValues)
    if (metabolicPattern) patterns.push(metabolicPattern)
    
    // Kidney function pattern
    const kidneyPattern = this.checkKidneyFunction(labValues)
    if (kidneyPattern) patterns.push(kidneyPattern)
    
    // Liver function pattern
    const liverPattern = this.checkLiverFunction(labValues)
    if (liverPattern) patterns.push(liverPattern)
    
    // Cardiac risk pattern
    const cardiacPattern = this.checkCardiacRisk(labValues)
    if (cardiacPattern) patterns.push(cardiacPattern)
    
    // Thyroid function pattern
    const thyroidPattern = this.checkThyroidFunction(labValues)
    if (thyroidPattern) patterns.push(thyroidPattern)
    
    // Diabetic pattern
    const diabeticPattern = this.checkDiabeticPattern(labValues)
    if (diabeticPattern) patterns.push(diabeticPattern)
    
    // Inflammation pattern
    const inflammationPattern = this.checkInflammationMarkers(labValues)
    if (inflammationPattern) patterns.push(inflammationPattern)
    
    return patterns
  }
  
  /**
   * Check for metabolic syndrome indicators
   */
  private static checkMetabolicSyndrome(labValues: LabValue[]): LabPattern | null {
    const glucose = this.findLabValue(labValues, ['glucose', 'blood glucose', 'fasting glucose'])
    const hdl = this.findLabValue(labValues, ['hdl', 'hdl cholesterol'])
    const triglycerides = this.findLabValue(labValues, ['triglycerides', 'trig'])
    const waistCirc = this.findLabValue(labValues, ['waist', 'waist circumference'])
    const bp = this.findLabValue(labValues, ['blood pressure', 'bp', 'systolic'])
    
    let score = 0
    const relatedTests: string[] = []
    
    if (glucose && this.parseNumericValue(glucose.result) >= 100) {
      score++
      relatedTests.push(glucose.testName)
    }
    
    if (hdl && this.parseNumericValue(hdl.result) < 40) {
      score++
      relatedTests.push(hdl.testName)
    }
    
    if (triglycerides && this.parseNumericValue(triglycerides.result) >= 150) {
      score++
      relatedTests.push(triglycerides.testName)
    }
    
    if (score >= 2) {
      return {
        patternType: 'metabolic_syndrome',
        description: 'Multiple markers suggest metabolic syndrome risk',
        severity: score >= 3 ? 'high' : 'moderate',
        confidence: 0.8,
        relatedTests,
        clinicalSignificance: 'Increased risk for cardiovascular disease and type 2 diabetes',
        recommendations: [
          'Consider comprehensive metabolic evaluation',
          'Lifestyle modifications (diet and exercise)',
          'Monitor blood pressure and weight',
          'Consider cardiology consultation if high risk'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Check kidney function indicators
   */
  private static checkKidneyFunction(labValues: LabValue[]): LabPattern | null {
    const creatinine = this.findLabValue(labValues, ['creatinine', 'serum creatinine'])
    const bun = this.findLabValue(labValues, ['bun', 'blood urea nitrogen'])
    const gfr = this.findLabValue(labValues, ['gfr', 'egfr', 'glomerular filtration'])
    const protein = this.findLabValue(labValues, ['protein', 'urine protein', 'proteinuria'])
    
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    const relatedTests: string[] = []
    let description = ''
    
    if (creatinine) {
      const creatVal = this.parseNumericValue(creatinine.result)
      relatedTests.push(creatinine.testName)
      
      if (creatVal > 1.5) {
        severity = creatVal > 3.0 ? 'critical' : 'high'
        description = 'Elevated creatinine suggests kidney dysfunction'
      }
    }
    
    if (gfr) {
      const gfrVal = this.parseNumericValue(gfr.result)
      relatedTests.push(gfr.testName)
      
      if (gfrVal < 60) {
        severity = gfrVal < 30 ? 'critical' : severity === 'critical' ? 'critical' : 'high'
        description += (description ? '. ' : '') + 'Reduced GFR indicates chronic kidney disease'
      }
    }
    
    if (relatedTests.length > 0 && severity !== 'low') {
      return {
        patternType: 'kidney_dysfunction',
        description,
        severity,
        confidence: 0.85,
        relatedTests,
        clinicalSignificance: 'Kidney function impairment may require monitoring and treatment',
        recommendations: [
          'Monitor kidney function regularly',
          'Review medications for nephrotoxicity',
          'Consider nephrology consultation',
          'Manage blood pressure and diabetes if present'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Check liver function indicators
   */
  private static checkLiverFunction(labValues: LabValue[]): LabPattern | null {
    const alt = this.findLabValue(labValues, ['alt', 'alanine aminotransferase'])
    const ast = this.findLabValue(labValues, ['ast', 'aspartate aminotransferase'])
    const bilirubin = this.findLabValue(labValues, ['bilirubin', 'total bilirubin'])
    const albumin = this.findLabValue(labValues, ['albumin', 'serum albumin'])
    const alk_phos = this.findLabValue(labValues, ['alkaline phosphatase', 'alk phos', 'alp'])
    
    let elevatedEnzymes = 0
    const relatedTests: string[] = []
    
    if (alt && this.parseNumericValue(alt.result) > 40) {
      elevatedEnzymes++
      relatedTests.push(alt.testName)
    }
    
    if (ast && this.parseNumericValue(ast.result) > 40) {
      elevatedEnzymes++
      relatedTests.push(ast.testName)
    }
    
    if (alk_phos && this.parseNumericValue(alk_phos.result) > 120) {
      elevatedEnzymes++
      relatedTests.push(alk_phos.testName)
    }
    
    if (elevatedEnzymes >= 2) {
      return {
        patternType: 'liver_dysfunction',
        description: 'Multiple elevated liver enzymes suggest hepatic dysfunction',
        severity: elevatedEnzymes >= 3 ? 'high' : 'moderate',
        confidence: 0.8,
        relatedTests,
        clinicalSignificance: 'Liver enzyme elevation may indicate hepatitis, fatty liver, or drug toxicity',
        recommendations: [
          'Review medications and alcohol use',
          'Consider hepatitis screening',
          'Monitor liver function trends',
          'Consider hepatology consultation if persistent'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Check cardiac risk indicators
   */
  private static checkCardiacRisk(labValues: LabValue[]): LabPattern | null {
    const totalChol = this.findLabValue(labValues, ['total cholesterol', 'cholesterol'])
    const ldl = this.findLabValue(labValues, ['ldl', 'ldl cholesterol'])
    const hdl = this.findLabValue(labValues, ['hdl', 'hdl cholesterol'])
    const troponin = this.findLabValue(labValues, ['troponin', 'cardiac troponin'])
    const bnp = this.findLabValue(labValues, ['bnp', 'brain natriuretic peptide', 'pro-bnp'])
    
    let riskFactors = 0
    const relatedTests: string[] = []
    
    if (totalChol && this.parseNumericValue(totalChol.result) > 240) {
      riskFactors++
      relatedTests.push(totalChol.testName)
    }
    
    if (ldl && this.parseNumericValue(ldl.result) > 160) {
      riskFactors++
      relatedTests.push(ldl.testName)
    }
    
    if (hdl && this.parseNumericValue(hdl.result) < 40) {
      riskFactors++
      relatedTests.push(hdl.testName)
    }
    
    if (troponin && this.parseNumericValue(troponin.result) > 0.04) {
      return {
        patternType: 'acute_cardiac_injury',
        description: 'Elevated troponin indicates cardiac muscle injury',
        severity: 'critical',
        confidence: 0.95,
        relatedTests: [troponin.testName],
        clinicalSignificance: 'Possible myocardial infarction or cardiac injury',
        recommendations: [
          'IMMEDIATE cardiology consultation',
          'ECG and cardiac monitoring',
          'Serial troponin measurements',
          'Consider emergency intervention'
        ]
      }
    }
    
    if (riskFactors >= 2) {
      return {
        patternType: 'cardiac_risk_factors',
        description: 'Multiple cardiac risk factors identified',
        severity: 'moderate',
        confidence: 0.75,
        relatedTests,
        clinicalSignificance: 'Increased cardiovascular disease risk',
        recommendations: [
          'Lifestyle modifications',
          'Consider statin therapy',
          'Blood pressure monitoring',
          'Cardiovascular risk assessment'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Check thyroid function pattern
   */
  private static checkThyroidFunction(labValues: LabValue[]): LabPattern | null {
    const tsh = this.findLabValue(labValues, ['tsh', 'thyroid stimulating hormone'])
    const t4 = this.findLabValue(labValues, ['t4', 'thyroxine', 'free t4'])
    const t3 = this.findLabValue(labValues, ['t3', 'triiodothyronine', 'free t3'])
    
    if (!tsh) return null
    
    const tshVal = this.parseNumericValue(tsh.result)
    const relatedTests = [tsh.testName]
    
    if (t4) relatedTests.push(t4.testName)
    if (t3) relatedTests.push(t3.testName)
    
    if (tshVal > 4.5) {
      return {
        patternType: 'hypothyroidism',
        description: 'Elevated TSH suggests hypothyroidism',
        severity: tshVal > 10 ? 'high' : 'moderate',
        confidence: 0.85,
        relatedTests,
        clinicalSignificance: 'Thyroid hormone deficiency affecting metabolism',
        recommendations: [
          'Consider thyroid hormone replacement',
          'Monitor thyroid function regularly',
          'Assess for symptoms of hypothyroidism',
          'Consider endocrinology consultation'
        ]
      }
    }
    
    if (tshVal < 0.4) {
      return {
        patternType: 'hyperthyroidism',
        description: 'Suppressed TSH suggests hyperthyroidism',
        severity: tshVal < 0.1 ? 'high' : 'moderate',
        confidence: 0.85,
        relatedTests,
        clinicalSignificance: 'Thyroid hormone excess affecting metabolism',
        recommendations: [
          'Consider anti-thyroid therapy',
          'Monitor cardiac function',
          'Assess for thyroid nodules/goiter',
          'Consider endocrinology consultation'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Check diabetic pattern indicators
   */
  private static checkDiabeticPattern(labValues: LabValue[]): LabPattern | null {
    const glucose = this.findLabValue(labValues, ['glucose', 'blood glucose', 'fasting glucose'])
    const hba1c = this.findLabValue(labValues, ['hba1c', 'hemoglobin a1c', 'glycated hemoglobin'])
    const microalbumin = this.findLabValue(labValues, ['microalbumin', 'albumin/creatinine'])
    
    const relatedTests: string[] = []
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let description = ''
    
    if (glucose) {
      const glucoseVal = this.parseNumericValue(glucose.result)
      relatedTests.push(glucose.testName)
      
      if (glucoseVal >= 126) {
        severity = 'high'
        description = 'Elevated fasting glucose indicates diabetes'
      } else if (glucoseVal >= 100) {
        severity = 'moderate'
        description = 'Elevated fasting glucose suggests pre-diabetes'
      }
    }
    
    if (hba1c) {
      const hba1cVal = this.parseNumericValue(hba1c.result)
      relatedTests.push(hba1c.testName)
      
      if (hba1cVal >= 6.5) {
        severity = 'high'
        description += (description ? '. ' : '') + 'Elevated HbA1c confirms diabetes diagnosis'
      } else if (hba1cVal >= 5.7) {
        severity = severity === 'high' ? 'high' : 'moderate'
        description += (description ? '. ' : '') + 'Elevated HbA1c suggests pre-diabetes'
      }
    }
    
    if (severity !== 'low') {
      return {
        patternType: severity === 'high' ? 'diabetes' : 'pre_diabetes',
        description,
        severity,
        confidence: 0.9,
        relatedTests,
        clinicalSignificance: 'Glucose metabolism dysfunction requiring management',
        recommendations: [
          'Diabetes education and lifestyle counseling',
          'Regular glucose monitoring',
          'Consider antidiabetic medications',
          'Screen for diabetic complications',
          'Ophthalmology and podiatry referrals'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Check inflammation markers
   */
  private static checkInflammationMarkers(labValues: LabValue[]): LabPattern | null {
    const crp = this.findLabValue(labValues, ['crp', 'c-reactive protein', 'high sensitivity crp'])
    const esr = this.findLabValue(labValues, ['esr', 'sedimentation rate'])
    const wbc = this.findLabValue(labValues, ['wbc', 'white blood cell', 'leukocyte'])
    
    let markers = 0
    const relatedTests: string[] = []
    
    if (crp && this.parseNumericValue(crp.result) > 3.0) {
      markers++
      relatedTests.push(crp.testName)
    }
    
    if (esr && this.parseNumericValue(esr.result) > 30) {
      markers++
      relatedTests.push(esr.testName)
    }
    
    if (wbc && this.parseNumericValue(wbc.result) > 11.0) {
      markers++
      relatedTests.push(wbc.testName)
    }
    
    if (markers >= 2) {
      return {
        patternType: 'systemic_inflammation',
        description: 'Multiple elevated inflammatory markers',
        severity: 'moderate',
        confidence: 0.7,
        relatedTests,
        clinicalSignificance: 'Systemic inflammation may indicate infection, autoimmune disease, or chronic condition',
        recommendations: [
          'Investigate source of inflammation',
          'Consider infectious disease workup',
          'Monitor inflammatory markers',
          'Consider rheumatology consultation if persistent'
        ]
      }
    }
    
    return null
  }
  
  /**
   * Helper function to find lab value by test name patterns
   */
  private static findLabValue(labValues: LabValue[], patterns: string[]): LabValue | null {
    for (const pattern of patterns) {
      const found = labValues.find(lab => 
        lab.testName.toLowerCase().includes(pattern.toLowerCase())
      )
      if (found) return found
    }
    return null
  }
  
  /**
   * Helper function to parse numeric value from result string
   */
  private static parseNumericValue(result: string): number {
    const match = result.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : 0
  }
  
  /**
   * Analyze trends over time (would need historical data)
   */
  static analyzeTrends(historicalData: Array<{date: string, labValues: LabValue[]}>): TrendAnalysis[] {
    // This would analyze trends over time if historical data is available
    // For now, return empty array as this requires more complex implementation
    return []
  }
  
  /**
   * Calculate risk scores based on multiple factors
   */
  static calculateRiskScores(labValues: LabValue[]): {[key: string]: number} {
    const scores: {[key: string]: number} = {}
    
    // Cardiovascular risk score
    scores.cardiovascular = this.calculateCardiovascularRisk(labValues)
    
    // Diabetes risk score
    scores.diabetes = this.calculateDiabetesRisk(labValues)
    
    // Kidney disease risk score
    scores.kidneyDisease = this.calculateKidneyRisk(labValues)
    
    return scores
  }
  
  private static calculateCardiovascularRisk(labValues: LabValue[]): number {
    let score = 0
    
    const totalChol = this.findLabValue(labValues, ['total cholesterol'])
    const hdl = this.findLabValue(labValues, ['hdl cholesterol'])
    const ldl = this.findLabValue(labValues, ['ldl cholesterol'])
    
    if (totalChol && this.parseNumericValue(totalChol.result) > 240) score += 2
    if (hdl && this.parseNumericValue(hdl.result) < 40) score += 2
    if (ldl && this.parseNumericValue(ldl.result) > 160) score += 3
    
    return Math.min(score / 7 * 100, 100) // Normalize to 0-100
  }
  
  private static calculateDiabetesRisk(labValues: LabValue[]): number {
    let score = 0
    
    const glucose = this.findLabValue(labValues, ['glucose', 'fasting glucose'])
    const hba1c = this.findLabValue(labValues, ['hba1c'])
    
    if (glucose) {
      const val = this.parseNumericValue(glucose.result)
      if (val >= 126) score += 5
      else if (val >= 100) score += 3
    }
    
    if (hba1c) {
      const val = this.parseNumericValue(hba1c.result)
      if (val >= 6.5) score += 5
      else if (val >= 5.7) score += 3
    }
    
    return Math.min(score / 10 * 100, 100) // Normalize to 0-100
  }
  
  private static calculateKidneyRisk(labValues: LabValue[]): number {
    let score = 0
    
    const creatinine = this.findLabValue(labValues, ['creatinine'])
    const gfr = this.findLabValue(labValues, ['gfr', 'egfr'])
    
    if (creatinine) {
      const val = this.parseNumericValue(creatinine.result)
      if (val > 2.0) score += 5
      else if (val > 1.3) score += 3
    }
    
    if (gfr) {
      const val = this.parseNumericValue(gfr.result)
      if (val < 30) score += 5
      else if (val < 60) score += 3
    }
    
    return Math.min(score / 10 * 100, 100) // Normalize to 0-100
  }
}
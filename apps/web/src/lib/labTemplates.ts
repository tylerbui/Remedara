export interface LabValue {
  name: string
  code: string
  value: string | number | null
  unit: string
  referenceRange: string
  status: 'normal' | 'high' | 'low' | 'critical' | 'pending'
  category?: string
}

export interface LabTemplate {
  id: string
  name: string
  description: string
  category: string
  values: LabValue[]
  interpretationNotes?: string
  cptCodes?: string[]
}

export const LAB_TEMPLATES: LabTemplate[] = [
  {
    id: 'cbc_with_diff',
    name: 'Complete Blood Count with Differential',
    description: 'Comprehensive blood count analysis with white blood cell differential',
    category: 'Hematology',
    cptCodes: ['85025', '85027'],
    values: [
      {
        name: 'White Blood Cell Count',
        code: 'WBC',
        value: null,
        unit: '10³/µL',
        referenceRange: '4.5-11.0',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Red Blood Cell Count',
        code: 'RBC',
        value: null,
        unit: '10⁶/µL',
        referenceRange: 'M: 4.7-6.1, F: 4.2-5.4',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Hemoglobin',
        code: 'HGB',
        value: null,
        unit: 'g/dL',
        referenceRange: 'M: 14.0-18.0, F: 12.0-16.0',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Hematocrit',
        code: 'HCT',
        value: null,
        unit: '%',
        referenceRange: 'M: 42.0-52.0, F: 37.0-47.0',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Mean Corpuscular Volume',
        code: 'MCV',
        value: null,
        unit: 'fL',
        referenceRange: '80-100',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Mean Corpuscular Hemoglobin',
        code: 'MCH',
        value: null,
        unit: 'pg',
        referenceRange: '27-31',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Mean Corpuscular Hemoglobin Concentration',
        code: 'MCHC',
        value: null,
        unit: 'g/dL',
        referenceRange: '32-36',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Red Cell Distribution Width',
        code: 'RDW',
        value: null,
        unit: '%',
        referenceRange: '11.5-14.5',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Platelet Count',
        code: 'PLT',
        value: null,
        unit: '10³/µL',
        referenceRange: '150-450',
        status: 'pending',
        category: 'Complete Blood Count'
      },
      {
        name: 'Neutrophils',
        code: 'NEUT',
        value: null,
        unit: '%',
        referenceRange: '50-70',
        status: 'pending',
        category: 'Differential'
      },
      {
        name: 'Lymphocytes',
        code: 'LYMPH',
        value: null,
        unit: '%',
        referenceRange: '20-40',
        status: 'pending',
        category: 'Differential'
      },
      {
        name: 'Monocytes',
        code: 'MONO',
        value: null,
        unit: '%',
        referenceRange: '2-8',
        status: 'pending',
        category: 'Differential'
      },
      {
        name: 'Eosinophils',
        code: 'EOS',
        value: null,
        unit: '%',
        referenceRange: '1-4',
        status: 'pending',
        category: 'Differential'
      },
      {
        name: 'Basophils',
        code: 'BASO',
        value: null,
        unit: '%',
        referenceRange: '0.5-1',
        status: 'pending',
        category: 'Differential'
      }
    ],
    interpretationNotes: 'Evaluate for anemia, infection, bleeding disorders, and hematologic malignancies'
  },
  {
    id: 'lipid_panel',
    name: 'Lipid Panel',
    description: 'Comprehensive cholesterol and triglyceride assessment',
    category: 'Chemistry',
    cptCodes: ['80061'],
    values: [
      {
        name: 'Total Cholesterol',
        code: 'CHOL',
        value: null,
        unit: 'mg/dL',
        referenceRange: '<200',
        status: 'pending'
      },
      {
        name: 'LDL Cholesterol',
        code: 'LDL',
        value: null,
        unit: 'mg/dL',
        referenceRange: '<100',
        status: 'pending'
      },
      {
        name: 'HDL Cholesterol',
        code: 'HDL',
        value: null,
        unit: 'mg/dL',
        referenceRange: 'M: >40, F: >50',
        status: 'pending'
      },
      {
        name: 'Triglycerides',
        code: 'TRIG',
        value: null,
        unit: 'mg/dL',
        referenceRange: '<150',
        status: 'pending'
      },
      {
        name: 'Non-HDL Cholesterol',
        code: 'NON_HDL',
        value: null,
        unit: 'mg/dL',
        referenceRange: '<130',
        status: 'pending'
      }
    ],
    interpretationNotes: 'Assess cardiovascular risk and guide lipid management therapy'
  },
  {
    id: 'bmp',
    name: 'Basic Metabolic Panel',
    description: 'Essential electrolytes, kidney function, and glucose',
    category: 'Chemistry',
    cptCodes: ['80048'],
    values: [
      {
        name: 'Glucose',
        code: 'GLU',
        value: null,
        unit: 'mg/dL',
        referenceRange: '70-99',
        status: 'pending'
      },
      {
        name: 'Blood Urea Nitrogen',
        code: 'BUN',
        value: null,
        unit: 'mg/dL',
        referenceRange: '7-20',
        status: 'pending'
      },
      {
        name: 'Creatinine',
        code: 'CREAT',
        value: null,
        unit: 'mg/dL',
        referenceRange: 'M: 0.74-1.35, F: 0.59-1.04',
        status: 'pending'
      },
      {
        name: 'Estimated GFR',
        code: 'eGFR',
        value: null,
        unit: 'mL/min/1.73m²',
        referenceRange: '>60',
        status: 'pending'
      },
      {
        name: 'Sodium',
        code: 'NA',
        value: null,
        unit: 'mmol/L',
        referenceRange: '136-145',
        status: 'pending'
      },
      {
        name: 'Potassium',
        code: 'K',
        value: null,
        unit: 'mmol/L',
        referenceRange: '3.5-5.1',
        status: 'pending'
      },
      {
        name: 'Chloride',
        code: 'CL',
        value: null,
        unit: 'mmol/L',
        referenceRange: '98-107',
        status: 'pending'
      },
      {
        name: 'Carbon Dioxide',
        code: 'CO2',
        value: null,
        unit: 'mmol/L',
        referenceRange: '22-28',
        status: 'pending'
      }
    ],
    interpretationNotes: 'Monitor kidney function, electrolyte balance, and acid-base status'
  },
  {
    id: 'cmp',
    name: 'Comprehensive Metabolic Panel',
    description: 'Extended chemistry panel including liver function',
    category: 'Chemistry',
    cptCodes: ['80053'],
    values: [
      {
        name: 'Glucose',
        code: 'GLU',
        value: null,
        unit: 'mg/dL',
        referenceRange: '70-99',
        status: 'pending',
        category: 'Metabolic'
      },
      {
        name: 'Blood Urea Nitrogen',
        code: 'BUN',
        value: null,
        unit: 'mg/dL',
        referenceRange: '7-20',
        status: 'pending',
        category: 'Kidney Function'
      },
      {
        name: 'Creatinine',
        code: 'CREAT',
        value: null,
        unit: 'mg/dL',
        referenceRange: 'M: 0.74-1.35, F: 0.59-1.04',
        status: 'pending',
        category: 'Kidney Function'
      },
      {
        name: 'Estimated GFR',
        code: 'eGFR',
        value: null,
        unit: 'mL/min/1.73m²',
        referenceRange: '>60',
        status: 'pending',
        category: 'Kidney Function'
      },
      {
        name: 'Sodium',
        code: 'NA',
        value: null,
        unit: 'mmol/L',
        referenceRange: '136-145',
        status: 'pending',
        category: 'Electrolytes'
      },
      {
        name: 'Potassium',
        code: 'K',
        value: null,
        unit: 'mmol/L',
        referenceRange: '3.5-5.1',
        status: 'pending',
        category: 'Electrolytes'
      },
      {
        name: 'Chloride',
        code: 'CL',
        value: null,
        unit: 'mmol/L',
        referenceRange: '98-107',
        status: 'pending',
        category: 'Electrolytes'
      },
      {
        name: 'Carbon Dioxide',
        code: 'CO2',
        value: null,
        unit: 'mmol/L',
        referenceRange: '22-28',
        status: 'pending',
        category: 'Electrolytes'
      },
      {
        name: 'Total Protein',
        code: 'TP',
        value: null,
        unit: 'g/dL',
        referenceRange: '6.0-8.3',
        status: 'pending',
        category: 'Liver Function'
      },
      {
        name: 'Albumin',
        code: 'ALB',
        value: null,
        unit: 'g/dL',
        referenceRange: '3.5-5.0',
        status: 'pending',
        category: 'Liver Function'
      },
      {
        name: 'Total Bilirubin',
        code: 'TBILI',
        value: null,
        unit: 'mg/dL',
        referenceRange: '0.3-1.2',
        status: 'pending',
        category: 'Liver Function'
      },
      {
        name: 'Alkaline Phosphatase',
        code: 'ALP',
        value: null,
        unit: 'U/L',
        referenceRange: '44-147',
        status: 'pending',
        category: 'Liver Function'
      },
      {
        name: 'AST (SGOT)',
        code: 'AST',
        value: null,
        unit: 'U/L',
        referenceRange: 'M: 10-40, F: 9-32',
        status: 'pending',
        category: 'Liver Function'
      },
      {
        name: 'ALT (SGPT)',
        code: 'ALT',
        value: null,
        unit: 'U/L',
        referenceRange: 'M: 10-40, F: 7-35',
        status: 'pending',
        category: 'Liver Function'
      }
    ],
    interpretationNotes: 'Comprehensive assessment of metabolic function, kidney function, liver function, and electrolyte balance'
  },
  {
    id: 'thyroid_function',
    name: 'Thyroid Function Panel',
    description: 'Complete thyroid hormone assessment',
    category: 'Endocrinology',
    cptCodes: ['84443', '84479', '84480'],
    values: [
      {
        name: 'Thyroid Stimulating Hormone',
        code: 'TSH',
        value: null,
        unit: 'mIU/L',
        referenceRange: '0.27-4.20',
        status: 'pending'
      },
      {
        name: 'Free T4',
        code: 'fT4',
        value: null,
        unit: 'ng/dL',
        referenceRange: '0.93-1.70',
        status: 'pending'
      },
      {
        name: 'Free T3',
        code: 'fT3',
        value: null,
        unit: 'pg/mL',
        referenceRange: '2.0-4.4',
        status: 'pending'
      },
      {
        name: 'Total T4',
        code: 'T4',
        value: null,
        unit: 'µg/dL',
        referenceRange: '4.5-12.0',
        status: 'pending'
      },
      {
        name: 'Total T3',
        code: 'T3',
        value: null,
        unit: 'ng/dL',
        referenceRange: '71-180',
        status: 'pending'
      }
    ],
    interpretationNotes: 'Evaluate thyroid function for hyper/hypothyroidism'
  },
  {
    id: 'hemoglobin_a1c',
    name: 'Hemoglobin A1C',
    description: 'Long-term glucose control assessment',
    category: 'Endocrinology',
    cptCodes: ['83036'],
    values: [
      {
        name: 'Hemoglobin A1C',
        code: 'HbA1c',
        value: null,
        unit: '%',
        referenceRange: '<5.7',
        status: 'pending'
      },
      {
        name: 'Estimated Average Glucose',
        code: 'eAG',
        value: null,
        unit: 'mg/dL',
        referenceRange: '<117',
        status: 'pending'
      }
    ],
    interpretationNotes: 'Normal: <5.7%, Prediabetes: 5.7-6.4%, Diabetes: ≥6.5%'
  },
  {
    id: 'urinalysis',
    name: 'Urinalysis with Microscopy',
    description: 'Complete urine analysis including microscopic examination',
    category: 'Urinalysis',
    cptCodes: ['81001', '81015'],
    values: [
      {
        name: 'Color',
        code: 'COLOR',
        value: null,
        unit: '',
        referenceRange: 'Yellow',
        status: 'pending',
        category: 'Physical'
      },
      {
        name: 'Clarity',
        code: 'CLARITY',
        value: null,
        unit: '',
        referenceRange: 'Clear',
        status: 'pending',
        category: 'Physical'
      },
      {
        name: 'Specific Gravity',
        code: 'SG',
        value: null,
        unit: '',
        referenceRange: '1.005-1.030',
        status: 'pending',
        category: 'Physical'
      },
      {
        name: 'pH',
        code: 'pH',
        value: null,
        unit: '',
        referenceRange: '5.0-8.0',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Protein',
        code: 'PROT',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Glucose',
        code: 'GLU',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Ketones',
        code: 'KET',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Blood',
        code: 'BLOOD',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Bilirubin',
        code: 'BILI',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Nitrites',
        code: 'NIT',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'Leukocyte Esterase',
        code: 'LE',
        value: null,
        unit: '',
        referenceRange: 'Negative',
        status: 'pending',
        category: 'Chemical'
      },
      {
        name: 'WBC',
        code: 'WBC',
        value: null,
        unit: '/hpf',
        referenceRange: '0-5',
        status: 'pending',
        category: 'Microscopic'
      },
      {
        name: 'RBC',
        code: 'RBC',
        value: null,
        unit: '/hpf',
        referenceRange: '0-2',
        status: 'pending',
        category: 'Microscopic'
      },
      {
        name: 'Bacteria',
        code: 'BACT',
        value: null,
        unit: '',
        referenceRange: 'Few',
        status: 'pending',
        category: 'Microscopic'
      }
    ],
    interpretationNotes: 'Screen for UTI, kidney disease, diabetes, and other urinary tract disorders'
  },
  {
    id: 'coagulation_panel',
    name: 'Coagulation Studies',
    description: 'Blood clotting function assessment',
    category: 'Hematology',
    cptCodes: ['85610', '85730'],
    values: [
      {
        name: 'Prothrombin Time',
        code: 'PT',
        value: null,
        unit: 'seconds',
        referenceRange: '9.5-13.8',
        status: 'pending'
      },
      {
        name: 'INR',
        code: 'INR',
        value: null,
        unit: '',
        referenceRange: '0.8-1.1',
        status: 'pending'
      },
      {
        name: 'Partial Thromboplastin Time',
        code: 'PTT',
        value: null,
        unit: 'seconds',
        referenceRange: '25-35',
        status: 'pending'
      }
    ],
    interpretationNotes: 'Monitor anticoagulation therapy and assess bleeding risk'
  }
]

export const getLabTemplateById = (id: string): LabTemplate | undefined => {
  return LAB_TEMPLATES.find(template => template.id === id)
}

export const getLabTemplatesByCategory = (category: string): LabTemplate[] => {
  return LAB_TEMPLATES.filter(template => template.category === category)
}

export const getAllLabCategories = (): string[] => {
  return Array.from(new Set(LAB_TEMPLATES.map(template => template.category)))
}

export const calculateLabStatus = (value: number, referenceRange: string): 'normal' | 'high' | 'low' | 'critical' => {
  // Simple parser for reference ranges like "70-99", "<200", ">40", etc.
  // This is a basic implementation - you might want to make it more robust
  
  if (referenceRange.includes('<')) {
    const max = parseFloat(referenceRange.replace('<', ''))
    return value < max ? 'normal' : 'high'
  }
  
  if (referenceRange.includes('>')) {
    const min = parseFloat(referenceRange.replace('>', ''))
    return value > min ? 'normal' : 'low'
  }
  
  if (referenceRange.includes('-')) {
    const [min, max] = referenceRange.split('-').map(v => parseFloat(v))
    if (value < min) return 'low'
    if (value > max) return 'high'
    return 'normal'
  }
  
  return 'normal'
}
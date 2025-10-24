export interface FHIRProvider {
  id: string;
  name: string;
  description: string;
  logo?: string;
  baseUrl: string;
  wellKnown: string;
  category: 'major' | 'regional' | 'sandbox';
  features: string[];
  testCredentials?: {
    info: string;
    demoPatientId?: string;
  };
}

export const KNOWN_FHIR_PROVIDERS: FHIRProvider[] = [
  {
    id: 'epic',
    name: 'Epic MyChart',
    description: 'Major EHR system used by many large healthcare organizations',
    baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    wellKnown: 'https://fhir.epic.com/interconnect-fhir-oauth/.well-known/smart_configuration',
    category: 'major',
    features: ['Labs', 'Medications', 'Allergies', 'Vitals', 'Appointments'],
  },
  {
    id: 'cerner',
    name: 'Cerner PowerChart',
    description: 'Widely used EHR system in hospitals and clinics',
    baseUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    wellKnown: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/.well-known/smart_configuration',
    category: 'major',
    features: ['Labs', 'Medications', 'Allergies', 'Immunizations'],
  },
  {
    id: 'hapi-fhir',
    name: 'HAPI FHIR Test Server',
    description: 'Public FHIR test server for development and testing',
    baseUrl: 'http://hapi.fhir.org/baseR4',
    wellKnown: 'http://hapi.fhir.org/baseR4/.well-known/smart_configuration',
    category: 'sandbox',
    features: ['All Resources', 'Testing Only'],
    testCredentials: {
      info: 'This is a public test server. Any patient ID can be used for testing.',
      demoPatientId: '87a339d0-8cae-418e-89c7-8651e6aab3c6',
    },
  },
  {
    id: 'smart-sandbox',
    name: 'SMART Sandbox',
    description: 'Official SMART on FHIR testing environment',
    baseUrl: 'https://launch.smarthealthit.org/v/r4/sim',
    wellKnown: 'https://launch.smarthealthit.org/v/r4/sim/fhir/.well-known/smart_configuration',
    category: 'sandbox',
    features: ['Complete FHIR R4', 'Synthetic Data'],
    testCredentials: {
      info: 'Use the SMART Health IT launcher to generate test scenarios.',
      demoPatientId: 'smart-1288992',
    },
  },
];

export interface LinkedProvider {
  _id: string;
  organizationName: string;
  organizationId: string;
  baseUrl: string;
  status: 'active' | 'expired' | 'revoked' | 'error';
  lastSyncAt?: string;
  lastSyncSuccess?: boolean;
  linkingCompletedAt?: string;
  capabilities: {
    canSchedule: boolean;
    canMessage: boolean;
    canAccessLabs: boolean;
    canAccessMedications: boolean;
    canAccessAllergies: boolean;
    canAccessVitals: boolean;
    supportedResources: string[];
  };
  isTokenExpiring?: boolean;
  isTokenExpired?: boolean;
  daysSinceLastSync?: number | null;
}

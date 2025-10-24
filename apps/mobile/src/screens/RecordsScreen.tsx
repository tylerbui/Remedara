import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

type RecordSection = 'overview' | 'lab-results' | 'prescriptions' | 'allergies' | 'vaccines' | 'vitals' | 'documents';

export function RecordsScreen() {
  const [activeSection, setActiveSection] = useState<RecordSection>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'grid-outline' },
    { id: 'lab-results', label: 'Lab Results', icon: 'flask-outline' },
    { id: 'prescriptions', label: 'Prescriptions', icon: 'medical-outline' },
    { id: 'allergies', label: 'Allergies', icon: 'warning-outline' },
    { id: 'vaccines', label: 'Immunizations', icon: 'bandage-outline' },
    { id: 'vitals', label: 'Vital Signs', icon: 'pulse-outline' },
    { id: 'documents', label: 'Documents', icon: 'document-text-outline' },
  ];

  const renderOverview = () => (
    <View style={styles.content}>
      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="flask" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Lab Results</Text>
          <Text style={styles.statDetail}>1 new</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="medical" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Active Rx</Text>
          <Text style={styles.statDetail}>1 refill needed</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="warning" size={24} color={Colors.error} />
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Allergies</Text>
          <Text style={styles.statDetail}>1 severe</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Documents</Text>
          <Text style={styles.statDetail}>All up to date</Text>
        </View>
      </View>

      {/* Critical Allergies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Critical Allergies</Text>
        <View style={styles.allergyCard}>
          <View style={styles.allergyHeader}>
            <Ionicons name="warning" size={20} color={Colors.error} />
            <View style={styles.allergyInfo}>
              <Text style={styles.allergyName}>Penicillin</Text>
              <Text style={styles.allergyType}>Medication</Text>
            </View>
            <View style={[styles.severityBadge, styles.severeBadge]}>
              <Text style={styles.badgeText}>SEVERE</Text>
            </View>
          </View>
          <Text style={styles.allergyReaction}>Anaphylaxis, difficulty breathing</Text>
        </View>

        <View style={styles.allergyCard}>
          <View style={styles.allergyHeader}>
            <Ionicons name="warning" size={20} color={Colors.warning} />
            <View style={styles.allergyInfo}>
              <Text style={styles.allergyName}>Peanuts</Text>
              <Text style={styles.allergyType}>Food</Text>
            </View>
            <View style={[styles.severityBadge, styles.moderateBadge]}>
              <Text style={styles.badgeText}>MODERATE</Text>
            </View>
          </View>
          <Text style={styles.allergyReaction}>Hives, stomach upset</Text>
        </View>
      </View>

      {/* Recent Lab Results */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Lab Results</Text>
          <TouchableOpacity onPress={() => setActiveSection('lab-results')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.labCard}>
          <View style={styles.labHeader}>
            <View>
              <Text style={styles.labName}>Complete Blood Count</Text>
              <Text style={styles.labDate}>January 15, 2024</Text>
            </View>
            <View style={[styles.statusBadge, styles.normalBadge]}>
              <Text style={styles.badgeText}>NORMAL</Text>
            </View>
          </View>
          <View style={styles.labDetails}>
            <Text style={styles.labFacility}>LabCorp</Text>
          </View>
        </View>

        <View style={styles.labCard}>
          <View style={styles.labHeader}>
            <View>
              <Text style={styles.labName}>Hemoglobin A1C</Text>
              <Text style={styles.labDate}>January 15, 2024</Text>
            </View>
            <View style={[styles.statusBadge, styles.abnormalBadge]}>
              <Ionicons name="alert-circle" size={14} color={Colors.error} style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>ABNORMAL</Text>
            </View>
          </View>
          <View style={styles.labDetails}>
            <Text style={styles.labResult}>Result: 7.2% (High)</Text>
            <Text style={styles.labNote}>Slightly elevated - discuss with provider</Text>
          </View>
        </View>
      </View>

      {/* Active Medications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Medications</Text>
          <TouchableOpacity onPress={() => setActiveSection('prescriptions')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <Ionicons name="medical" size={20} color={Colors.primary} />
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>Metformin</Text>
              <Text style={styles.medicationDosage}>500mg - Twice daily</Text>
            </View>
          </View>
          <View style={styles.medicationDetails}>
            <View style={styles.medicationRow}>
              <Text style={styles.medicationLabel}>Refills:</Text>
              <Text style={styles.medicationValue}>3 remaining</Text>
            </View>
            <View style={styles.medicationRow}>
              <Text style={styles.medicationLabel}>Pharmacy:</Text>
              <Text style={styles.medicationValue}>CVS Pharmacy</Text>
            </View>
          </View>
        </View>

        <View style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <Ionicons name="medical" size={20} color={Colors.primary} />
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>Lisinopril</Text>
              <Text style={styles.medicationDosage}>10mg - Once daily</Text>
            </View>
          </View>
          <View style={styles.medicationDetails}>
            <View style={styles.medicationRow}>
              <Text style={styles.medicationLabel}>Refills:</Text>
              <Text style={styles.medicationValue}>2 remaining</Text>
            </View>
            <View style={styles.medicationRow}>
              <Text style={styles.medicationLabel}>Pharmacy:</Text>
              <Text style={styles.medicationValue}>CVS Pharmacy</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderLabResults = () => (
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Laboratory Results</Text>
      
      <View style={styles.labCard}>
        <View style={styles.labHeader}>
          <View>
            <Text style={styles.labName}>Complete Blood Count (CBC)</Text>
            <Text style={styles.labDate}>January 15, 2024</Text>
          </View>
          <View style={[styles.statusBadge, styles.normalBadge]}>
            <Text style={styles.badgeText}>COMPLETED</Text>
          </View>
        </View>
        <View style={styles.labDetails}>
          <Text style={styles.labFacility}>LabCorp</Text>
          <Text style={styles.labResult}>Result: Normal</Text>
          <Text style={styles.labNote}>All values within normal limits</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Ionicons name="eye-outline" size={16} color={Colors.primary} />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.labCard}>
        <View style={styles.labHeader}>
          <View>
            <Text style={styles.labName}>Hemoglobin A1C</Text>
            <Text style={styles.labDate}>January 15, 2024</Text>
          </View>
          <View style={[styles.statusBadge, styles.abnormalBadge]}>
            <Ionicons name="alert-circle" size={14} color={Colors.error} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>ABNORMAL</Text>
          </View>
        </View>
        <View style={styles.labDetails}>
          <Text style={styles.labFacility}>LabCorp</Text>
          <Text style={styles.labResult}>Result: 7.2% (Above 7.0%)</Text>
          <Text style={styles.labNote}>⚠️ Slightly elevated - discuss medication adjustment</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Ionicons name="eye-outline" size={16} color={Colors.primary} />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.labCard}>
        <View style={styles.labHeader}>
          <View>
            <Text style={styles.labName}>Lipid Panel</Text>
            <Text style={styles.labDate}>December 10, 2023</Text>
          </View>
          <View style={[styles.statusBadge, styles.normalBadge]}>
            <Text style={styles.badgeText}>COMPLETED</Text>
          </View>
        </View>
        <View style={styles.labDetails}>
          <Text style={styles.labFacility}>Quest Diagnostics</Text>
          <Text style={styles.labResult}>Result: Normal</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Ionicons name="eye-outline" size={16} color={Colors.primary} />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPrescriptions = () => (
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Prescriptions</Text>
      
      <View style={styles.medicationCard}>
        <View style={styles.medicationHeader}>
          <Ionicons name="medical" size={24} color={Colors.primary} />
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>Metformin</Text>
            <Text style={styles.medicationDosage}>500mg - Twice daily</Text>
            <Text style={styles.prescriber}>Dr. Sarah Johnson</Text>
          </View>
        </View>
        <View style={styles.medicationDetails}>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Prescribed:</Text>
            <Text style={styles.medicationValue}>Jan 10, 2024</Text>
          </View>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Refills:</Text>
            <Text style={styles.medicationValue}>3 of 5 remaining</Text>
          </View>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Pharmacy:</Text>
            <Text style={styles.medicationValue}>CVS Pharmacy</Text>
          </View>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Cost:</Text>
            <Text style={styles.medicationValue}>$15.99</Text>
          </View>
        </View>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsLabel}>Instructions:</Text>
          <Text style={styles.instructionsText}>Take with meals to reduce stomach upset</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.refillButton}>
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
            <Text style={styles.refillButtonText}>Refill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.medicationCard}>
        <View style={styles.medicationHeader}>
          <Ionicons name="medical" size={24} color={Colors.primary} />
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>Lisinopril</Text>
            <Text style={styles.medicationDosage}>10mg - Once daily</Text>
            <Text style={styles.prescriber}>Dr. Sarah Johnson</Text>
          </View>
        </View>
        <View style={styles.medicationDetails}>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Prescribed:</Text>
            <Text style={styles.medicationValue}>Jan 10, 2024</Text>
          </View>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Refills:</Text>
            <Text style={styles.medicationValue}>2 of 6 remaining</Text>
          </View>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Pharmacy:</Text>
            <Text style={styles.medicationValue}>CVS Pharmacy</Text>
          </View>
          <View style={styles.medicationRow}>
            <Text style={styles.medicationLabel}>Cost:</Text>
            <Text style={styles.medicationValue}>$8.50</Text>
          </View>
        </View>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsLabel}>Instructions:</Text>
          <Text style={styles.instructionsText}>Take in the morning</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.refillButton}>
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
            <Text style={styles.refillButtonText}>Refill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAllergies = () => (
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Allergies & Sensitivities</Text>
      
      <View style={styles.allergyDetailCard}>
        <View style={styles.allergyDetailHeader}>
          <View style={styles.allergyIconContainer}>
            <Ionicons name="warning" size={32} color={Colors.error} />
          </View>
          <View style={styles.allergyDetailInfo}>
            <Text style={styles.allergyDetailName}>Penicillin</Text>
            <Text style={styles.allergyDetailType}>Medication Allergy</Text>
          </View>
          <View style={[styles.severityBadge, styles.severeBadge]}>
            <Text style={styles.badgeText}>SEVERE</Text>
          </View>
        </View>
        <View style={styles.allergyDetailBody}>
          <View style={styles.allergyDetailRow}>
            <Text style={styles.allergyDetailLabel}>Reaction:</Text>
            <Text style={styles.allergyDetailValue}>Anaphylaxis, difficulty breathing</Text>
          </View>
          <View style={styles.allergyDetailRow}>
            <Text style={styles.allergyDetailLabel}>Onset Date:</Text>
            <Text style={styles.allergyDetailValue}>March 15, 2010</Text>
          </View>
          <View style={styles.allergyDetailRow}>
            <Text style={styles.allergyDetailLabel}>Status:</Text>
            <Text style={[styles.allergyDetailValue, { color: Colors.error }]}>ACTIVE</Text>
          </View>
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>Avoid all penicillin-based antibiotics</Text>
          </View>
        </View>
      </View>

      <View style={styles.allergyDetailCard}>
        <View style={styles.allergyDetailHeader}>
          <View style={styles.allergyIconContainer}>
            <Ionicons name="warning" size={32} color={Colors.warning} />
          </View>
          <View style={styles.allergyDetailInfo}>
            <Text style={styles.allergyDetailName}>Peanuts</Text>
            <Text style={styles.allergyDetailType}>Food Allergy</Text>
          </View>
          <View style={[styles.severityBadge, styles.moderateBadge]}>
            <Text style={styles.badgeText}>MODERATE</Text>
          </View>
        </View>
        <View style={styles.allergyDetailBody}>
          <View style={styles.allergyDetailRow}>
            <Text style={styles.allergyDetailLabel}>Reaction:</Text>
            <Text style={styles.allergyDetailValue}>Hives, stomach upset</Text>
          </View>
          <View style={styles.allergyDetailRow}>
            <Text style={styles.allergyDetailLabel}>Onset Date:</Text>
            <Text style={styles.allergyDetailValue}>August 20, 2005</Text>
          </View>
          <View style={styles.allergyDetailRow}>
            <Text style={styles.allergyDetailLabel}>Status:</Text>
            <Text style={[styles.allergyDetailValue, { color: Colors.warning }]}>ACTIVE</Text>
          </View>
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>Can tolerate trace amounts</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderVaccines = () => (
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Immunization Records</Text>
      
      <View style={styles.vaccineCard}>
        <View style={styles.vaccineHeader}>
          <View style={[styles.vaccineDot, { backgroundColor: Colors.success }]} />
          <View style={styles.vaccineInfo}>
            <Text style={styles.vaccineName}>COVID-19 mRNA Vaccine</Text>
            <Text style={styles.vaccineDetails}>Pfizer-BioNTech • CVS Pharmacy</Text>
            <Text style={styles.vaccineDate}>September 15, 2023</Text>
          </View>
          <View style={[styles.statusBadge, styles.completedBadge]}>
            <Text style={styles.badgeText}>COMPLETED</Text>
          </View>
        </View>
        <View style={styles.vaccineBody}>
          <View style={styles.vaccineRow}>
            <Text style={styles.vaccineLabel}>Dose:</Text>
            <Text style={styles.vaccineValue}>3 of 3</Text>
          </View>
          <View style={styles.vaccineRow}>
            <Text style={styles.vaccineLabel}>Next Due:</Text>
            <Text style={styles.vaccineValue}>September 15, 2024</Text>
          </View>
        </View>
      </View>

      <View style={styles.vaccineCard}>
        <View style={styles.vaccineHeader}>
          <View style={[styles.vaccineDot, { backgroundColor: Colors.error }]} />
          <View style={styles.vaccineInfo}>
            <Text style={styles.vaccineName}>Influenza Vaccine</Text>
            <Text style={styles.vaccineDetails}>Sanofi • Primary Care Clinic</Text>
            <Text style={styles.vaccineDate}>October 1, 2023</Text>
          </View>
          <View style={[styles.statusBadge, styles.overdueBadge]}>
            <Text style={styles.badgeText}>OVERDUE</Text>
          </View>
        </View>
        <View style={styles.vaccineBody}>
          <View style={styles.vaccineRow}>
            <Text style={styles.vaccineLabel}>Dose:</Text>
            <Text style={styles.vaccineValue}>1 of 1</Text>
          </View>
          <View style={styles.vaccineRow}>
            <Text style={styles.vaccineLabel}>Next Due:</Text>
            <Text style={[styles.vaccineValue, { color: Colors.error }]}>October 1, 2024</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>Schedule Vaccine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVitals = () => (
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Vital Signs History</Text>
      
      <View style={styles.vitalCard}>
        <View style={styles.vitalHeader}>
          <Text style={styles.vitalDate}>January 15, 2024</Text>
          <Text style={styles.vitalRecorder}>Recorded by: Nurse Jennifer</Text>
        </View>
        <View style={styles.vitalGrid}>
          <View style={styles.vitalItem}>
            <Ionicons name="heart" size={20} color={Colors.error} />
            <Text style={styles.vitalLabel}>Blood Pressure</Text>
            <Text style={styles.vitalValue}>128/82 mmHg</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="pulse" size={20} color={Colors.primary} />
            <Text style={styles.vitalLabel}>Heart Rate</Text>
            <Text style={styles.vitalValue}>72 bpm</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="thermometer" size={20} color={Colors.warning} />
            <Text style={styles.vitalLabel}>Temperature</Text>
            <Text style={styles.vitalValue}>98.6°F</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="fitness" size={20} color={Colors.success} />
            <Text style={styles.vitalLabel}>Weight</Text>
            <Text style={styles.vitalValue}>175 lbs</Text>
          </View>
        </View>
      </View>

      <View style={styles.vitalCard}>
        <View style={styles.vitalHeader}>
          <Text style={styles.vitalDate}>December 10, 2023</Text>
          <Text style={styles.vitalRecorder}>Recorded by: Nurse Michael</Text>
        </View>
        <View style={styles.vitalGrid}>
          <View style={styles.vitalItem}>
            <Ionicons name="heart" size={20} color={Colors.error} />
            <Text style={styles.vitalLabel}>Blood Pressure</Text>
            <Text style={styles.vitalValue}>132/86 mmHg</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="pulse" size={20} color={Colors.primary} />
            <Text style={styles.vitalLabel}>Heart Rate</Text>
            <Text style={styles.vitalValue}>68 bpm</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="thermometer" size={20} color={Colors.warning} />
            <Text style={styles.vitalLabel}>Temperature</Text>
            <Text style={styles.vitalValue}>98.4°F</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="fitness" size={20} color={Colors.success} />
            <Text style={styles.vitalLabel}>Weight</Text>
            <Text style={styles.vitalValue}>178 lbs</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Medical Documents</Text>
      
      <View style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <View style={[styles.documentIcon, { backgroundColor: '#10B981' }]}>
            <Ionicons name="document-text" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>Cardiology Consultation Report</Text>
            <Text style={styles.documentProvider}>Dr. Robert Chen, Cardiologist</Text>
            <Text style={styles.documentDate}>January 12, 2024 • 2.5 MB</Text>
          </View>
        </View>
        <Text style={styles.documentDescription}>Heart health assessment and recommendations</Text>
        <View style={styles.documentActions}>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="eye-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="download-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="share-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <View style={[styles.documentIcon, { backgroundColor: '#8B5CF6' }]}>
            <Ionicons name="image" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>Chest X-Ray Images</Text>
            <Text style={styles.documentProvider}>Regional Imaging Center</Text>
            <Text style={styles.documentDate}>January 10, 2024 • 8.3 MB</Text>
          </View>
        </View>
        <Text style={styles.documentDescription}>Digital chest X-ray images</Text>
        <View style={styles.documentActions}>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="eye-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="download-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="share-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <View style={[styles.documentIcon, { backgroundColor: '#3B82F6' }]}>
            <Ionicons name="card" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>Insurance Card Copy</Text>
            <Text style={styles.documentProvider}>Front and back of insurance card</Text>
            <Text style={styles.documentDate}>January 5, 2024 • 156 KB</Text>
          </View>
        </View>
        <View style={styles.documentActions}>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="eye-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="download-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentButton}>
            <Ionicons name="share-outline" size={16} color={Colors.primary} />
            <Text style={styles.documentButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
        <Text style={styles.uploadButtonText}>Upload Document</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'lab-results':
        return renderLabResults();
      case 'prescriptions':
        return renderPrescriptions();
      case 'allergies':
        return renderAllergies();
      case 'vaccines':
        return renderVaccines();
      case 'vitals':
        return renderVitals();
      case 'documents':
        return renderDocuments();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Records</Text>
      </View>

      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab,
            ]}
            onPress={() => setActiveSection(section.id as RecordSection)}
          >
            <Ionicons
              name={section.icon as any}
              size={20}
              color={activeSection === section.id ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeSection === section.id && styles.activeTabLabel,
              ]}
            >
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  tabsContainer: {
    flexGrow: 0,
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  statDetail: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  allergyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  allergyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  allergyType: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  allergyReaction: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severeBadge: {
    backgroundColor: '#FEE2E2',
  },
  moderateBadge: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
  labCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  labHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  labDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  normalBadge: {
    backgroundColor: '#D1FAE5',
  },
  abnormalBadge: {
    backgroundColor: '#FEE2E2',
  },
  labDetails: {
    gap: 4,
  },
  labFacility: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  labResult: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  labNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  medicationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  medicationDosage: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  prescriber: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  medicationDetails: {
    gap: 8,
    marginBottom: 12,
  },
  medicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicationLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  medicationValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  instructionsBox: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  refillButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  refillButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  allergyDetailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allergyDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  allergyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  allergyDetailInfo: {
    flex: 1,
  },
  allergyDetailName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  allergyDetailType: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  allergyDetailBody: {
    gap: 12,
  },
  allergyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  allergyDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  allergyDetailValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  notesBox: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  vaccineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vaccineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vaccineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  vaccineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  vaccineDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vaccineDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
  },
  vaccineBody: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  vaccineRow: {
    flex: 1,
  },
  vaccineLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  vaccineValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  scheduleButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  vitalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vitalHeader: {
    marginBottom: 16,
  },
  vitalDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  vitalRecorder: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalItem: {
    width: '47%',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  vitalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  documentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  documentProvider: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  documentDate: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  documentDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  documentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.background,
    gap: 4,
  },
  documentButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

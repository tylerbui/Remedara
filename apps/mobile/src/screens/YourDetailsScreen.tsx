import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface YourDetailsScreenProps {
  onBack?: () => void;
  providerName?: string;
  selectedDate?: string;
  selectedTime?: string;
}

export function YourDetailsScreen({ 
  onBack, 
  providerName = 'Dr. Sarah Johnson',
  selectedDate = 'December 17, 2025',
  selectedTime = '2:00 PM'
}: YourDetailsScreenProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Common visit reasons
  const visitReasons = [
    'Annual Physical Exam',
    'Follow-up Appointment',
    'New Patient Visit',
    'Sick Visit',
    'Routine Check-up',
    'Vaccination',
    'Lab Results Review',
    'Medication Refill',
    'Specialist Consultation',
    'Injury or Accident',
    'Chronic Condition Management',
    'Mental Health Consultation',
    'Other (Specify)',
  ];

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    if (reason === 'Other (Specify)') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomReason('');
    }
  };

  const patientDetails = {
    name: 'Tyler Bui',
    dob: '12/17/1994',
    sex: 'Male',
    language: 'English',
    contact: '(626)899-8151',
    email: 'tylembui@gmail.com',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
            <Text style={styles.backButton}>← Back to Choose Time</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointments</Text>
        </View>

        {/* Your Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Your Details</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Patient Name:</Text>
              <Text style={styles.detailValue}>{patientDetails.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date of Birth:</Text>
              <Text style={styles.detailValue}>{patientDetails.dob}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sex at Birth:</Text>
              <Text style={styles.detailValue}>{patientDetails.sex}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Preferred Language:</Text>
              <Text style={styles.detailValue}>{patientDetails.language}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contact #:</Text>
              <Text style={styles.detailValue}>{patientDetails.contact}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{patientDetails.email}</Text>
            </View>
          </View>
        </View>

        {/* Reason for Visit Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <Text style={styles.sectionSubtitle}>
            Select the reason for your appointment or specify your own
          </Text>

          <View style={styles.reasonsGrid}>
            {visitReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reasonCard,
                  selectedReason === reason && styles.reasonCardSelected,
                ]}
                onPress={() => handleReasonSelect(reason)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason === reason && styles.reasonTextSelected,
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showCustomInput && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>Please specify:</Text>
              <TextInput
                style={styles.customInput}
                placeholder="Enter your reason for visit..."
                placeholderTextColor={Colors.textLight}
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>

        {/* Appointment Summary */}
        {selectedReason && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Appointment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Provider:</Text>
              <Text style={styles.summaryValue}>{providerName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date & Time:</Text>
              <Text style={styles.summaryValue}>{selectedDate} at {selectedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reason:</Text>
              <Text style={styles.summaryValue}>
                {selectedReason === 'Other (Specify)' ? customReason || 'Not specified' : selectedReason}
              </Text>
            </View>
          </View>
        )}

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedReason || (showCustomInput && !customReason)) && styles.continueButtonDisabled,
            ]}
            disabled={!selectedReason || (showCustomInput && !customReason)}
          >
            <Text style={styles.continueButtonText}>Continue to Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  backButtonContainer: {
    marginBottom: 10,
  },
  backButton: {
    fontSize: 16,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  reasonsGrid: {
    gap: 12,
  },
  reasonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  reasonCardSelected: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.primary,
  },
  reasonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  reasonTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: 16,
  },
  customInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  customInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
    color: Colors.text,
    minHeight: 100,
  },
  summaryCard: {
    backgroundColor: Colors.appointmentCard,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: 100,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

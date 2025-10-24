import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface HealthInformationScreenProps {
  onBack?: () => void;
}

export function HealthInformationScreen({ onBack }: HealthInformationScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: 'A+',
    height: '5\'10"',
    weight: '175 lbs',
    allergies: 'Penicillin, Peanuts',
    medications: 'Lisinopril 10mg daily',
    conditions: 'Hypertension',
    surgeries: 'Appendectomy (2015)',
    familyHistory: 'Heart disease, Diabetes',
    insuranceProvider: 'Blue Cross Blue Shield',
    insurancePolicyNumber: 'BCBS123456789',
    primaryPhysician: 'Dr. Sarah Johnson',
    physicianPhone: '(555) 987-6543',
  });

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving:', formData);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Information</Text>
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={styles.editButton}
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'create-outline'}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Basic Health Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Health Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Blood Type</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.bloodType}
              onChangeText={(text) => setFormData({ ...formData, bloodType: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
                editable={isEditing}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Allergies</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, !isEditing && styles.inputDisabled]}
              value={formData.allergies}
              onChangeText={(text) => setFormData({ ...formData, allergies: text })}
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Medications</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, !isEditing && styles.inputDisabled]}
              value={formData.medications}
              onChangeText={(text) => setFormData({ ...formData, medications: text })}
              editable={isEditing}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medical Conditions</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, !isEditing && styles.inputDisabled]}
              value={formData.conditions}
              onChangeText={(text) => setFormData({ ...formData, conditions: text })}
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Previous Surgeries</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, !isEditing && styles.inputDisabled]}
              value={formData.surgeries}
              onChangeText={(text) => setFormData({ ...formData, surgeries: text })}
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Family Medical History</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, !isEditing && styles.inputDisabled]}
              value={formData.familyHistory}
              onChangeText={(text) => setFormData({ ...formData, familyHistory: text })}
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Insurance Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Insurance Provider</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.insuranceProvider}
              onChangeText={(text) => setFormData({ ...formData, insuranceProvider: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Policy Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.insurancePolicyNumber}
              onChangeText={(text) => setFormData({ ...formData, insurancePolicyNumber: text })}
              editable={isEditing}
            />
          </View>
        </View>

        {/* Primary Care */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Care Provider</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Physician Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.primaryPhysician}
              onChangeText={(text) => setFormData({ ...formData, primaryPhysician: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Physician Phone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.physicianPhone}
              onChangeText={(text) => setFormData({ ...formData, physicianPhone: text })}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputDisabled: {
    backgroundColor: Colors.background,
    color: Colors.textSecondary,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

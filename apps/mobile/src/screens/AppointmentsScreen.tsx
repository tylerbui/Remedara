import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectProviderScreen } from './SelectProviderScreen';
import { ChooseTimeScreen } from './ChooseTimeScreen';
import { Colors } from '../constants/colors';

export function AppointmentsScreen() {
  const [showSelectProvider, setShowSelectProvider] = useState(false);
  const [showChooseTime, setShowChooseTime] = useState(false);

  if (showSelectProvider) {
    return <SelectProviderScreen onBack={() => setShowSelectProvider(false)} />;
  }

  if (showChooseTime) {
    return <ChooseTimeScreen onBack={() => setShowChooseTime(false)} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Appointments</Text>
        </View>

        {/* Recent Appointment Banner */}
        <View style={styles.recentBanner}>
          <View style={styles.recentLabel}>
            <Text style={styles.recentLabelText}>Recent</Text>
          </View>
          <View style={styles.recentContent}>
            <View style={styles.avatar} />
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>Dermatologist | Dr. Chris Diego</Text>
              <Text style={styles.recentDate}>October 26, 2025 | 2 PM</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <Text style={styles.sectionSubtitle}>
            Swipe for more appointments.{' \n'}
            Click to see more details.
          </Text>
          
          <TouchableOpacity style={styles.appointmentCard}>
            <View style={styles.cardContent}>
              <View style={styles.avatar} />
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentType}>Dentist</Text>
                <Text style={styles.appointmentDateTime}>Dec 17, 2025 | 2PM</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Book an Appointment Section */}
        <View style={[styles.section, styles.bookingSection]}>
          <Text style={styles.sectionTitle}>Book an Appointment</Text>
          <Text style={styles.sectionSubtitle}>
            Schedule your visit with our health care provider.
          </Text>

          <View style={styles.bookingSteps}>
            <TouchableOpacity 
              style={styles.stepButton}
              onPress={() => setShowSelectProvider(true)}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Select Provider</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.stepButton}
              onPress={() => setShowChooseTime(true)}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Choose Time</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stepButton}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Your Details & Reason for Visit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stepButton}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  recentBanner: {
    backgroundColor: Colors.appointmentRecent,
    marginHorizontal: 0,
    borderRadius: 0,
    overflow: 'hidden',
  },
  recentLabel: {
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  recentLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 14,
    color: '#4B5563',
  },
  section: {
    padding: 20,
  },
  bookingSection: {
    backgroundColor: Colors.background,
    marginHorizontal: 0,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  appointmentCard: {
    backgroundColor: Colors.appointmentCard,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#4B5563',
  },
  bookingSteps: {
    gap: 12,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appointmentCard,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
  stepText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
});

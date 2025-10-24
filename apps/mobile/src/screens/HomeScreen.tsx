import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/SimpleAuthProvider';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { SettingsScreen } from './SettingsScreen';

interface HomeScreenProps {
  onLogout?: () => void;
  onNavigateToRecords?: () => void;
}

export function HomeScreen({ onLogout, onNavigateToRecords }: HomeScreenProps) {
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsScreen onLogout={onLogout} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userName}>(Name)</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}
            >
              <Ionicons name="settings-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <View style={styles.profileCircle} />
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Upcoming Appointments</Text>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statDetail}>Next: Jan 25, 2026</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active Prescriptions</Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statDetail}>1 refill needed</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lab Results</Text>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statDetail}>1 new result</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Documents</Text>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statDetail}>All up to date</Text>
          </View>
        </View>

        {/* Health Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={20} color={Colors.text} />
            <Text style={styles.sectionTitle}>Health Alerts</Text>
          </View>
          
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Flu Vaccination Overdue</Text>
              <View style={styles.highBadge}>
                <Text style={styles.badgeText}>High</Text>
              </View>
            </View>
            <Text style={styles.alertDescription}>Your annual flu shot is passed due</Text>
          </View>

          <View style={styles.alertCardWarning}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Insurance Form Pending</Text>
              <View style={styles.mediumBadge}>
                <Text style={styles.badgeText}>Medium</Text>
              </View>
            </View>
            <Text style={styles.alertDescription}>Please complete your insurance verification</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={Colors.text} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Lab Results Available</Text>
              <View style={styles.newBadge}>
                <Text style={styles.badgeTextDark}>New</Text>
              </View>
            </View>
            <Text style={styles.activityDescription}>Complete Blood Count results are ready</Text>
            <Text style={styles.activityDate}>11/14/2025</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Prescription Refill</Text>
              <View style={styles.processedBadge}>
                <Text style={styles.badgeTextDark}>Processed</Text>
              </View>
            </View>
            <Text style={styles.activityDescription}>Metformin refill processed</Text>
            <Text style={styles.activityDate}>10/30/2025</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Appointment Confirmed</Text>
              <View style={styles.processedBadge}>
                <Text style={styles.badgeTextDark}>Confirmed</Text>
              </View>
            </View>
            <Text style={styles.activityDescription}>Annual Physical with Dr. Johnson</Text>
            <Text style={styles.activityDate}>10/26/2025</Text>
          </View>

          <TouchableOpacity style={styles.viewAllButton} onPress={onNavigateToRecords}>
            <Ionicons name="document-text" size={16} color={Colors.primary} />
            <Text style={styles.viewAllText}>View All Records</Text>
          </TouchableOpacity>
        </View>

        {/* Lab/Imaging Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleLarge}>Lab/Imaging Results</Text>
            <TouchableOpacity onPress={onNavigateToRecords}>
              <Text style={styles.refillLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.labResultCard}>
            <View style={styles.labResultHeader}>
              <Ionicons name="flask" size={24} color={Colors.primary} />
              <View style={styles.labResultInfo}>
                <Text style={styles.labResultTitle}>Complete Blood Count</Text>
                <Text style={styles.labResultDate}>January 15, 2024</Text>
              </View>
              <View style={styles.statusBadgeNormal}>
                <Text style={styles.statusBadgeText}>NORMAL</Text>
              </View>
            </View>
            <Text style={styles.labResultFacility}>LabCorp</Text>
          </View>

          <View style={styles.labResultCard}>
            <View style={styles.labResultHeader}>
              <Ionicons name="flask" size={24} color={Colors.error} />
              <View style={styles.labResultInfo}>
                <Text style={styles.labResultTitle}>Hemoglobin A1C</Text>
                <Text style={styles.labResultDate}>January 15, 2024</Text>
              </View>
              <View style={styles.statusBadgeAbnormal}>
                <Ionicons name="alert-circle" size={12} color={Colors.error} style={{ marginRight: 4 }} />
                <Text style={styles.statusBadgeText}>ABNORMAL</Text>
              </View>
            </View>
            <Text style={styles.labResultFacility}>LabCorp</Text>
            <Text style={styles.labResultNote}>⚠️ Result: 7.2% (elevated)</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToRecords}>
            <Ionicons name="flask" size={16} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>View All Lab Results</Text>
          </TouchableOpacity>
        </View>

        {/* Prescriptions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleLarge}>Prescriptions</Text>
            <TouchableOpacity>
              <Text style={styles.refillLink}>+ Refill Prescription</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="document-text" size={16} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>View Prescriptions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="document-text" size={16} color={Colors.text} />
            <Text style={styles.secondaryButtonText}>Past Prescriptions</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userName: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.appointmentCard,
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statDetail: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  refillLink: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  alertCardWarning: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  alertDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  highBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediumBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadge: {
    backgroundColor: Colors.info,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  processedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextDark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  activityDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 11,
    color: Colors.textLight,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.appointmentCard,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  labResultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  labResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  labResultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  labResultDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  labResultFacility: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 36,
  },
  labResultNote: {
    fontSize: 13,
    color: Colors.error,
    marginLeft: 36,
    marginTop: 4,
  },
  statusBadgeNormal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeAbnormal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
});

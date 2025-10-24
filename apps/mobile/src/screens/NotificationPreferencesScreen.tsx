import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface NotificationPreferencesScreenProps {
  onBack?: () => void;
}

export function NotificationPreferencesScreen({ onBack }: NotificationPreferencesScreenProps) {
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    appointments: true,
    appointmentReminders: true,
    messages: true,
    labResults: true,
    prescriptions: true,
    healthAlerts: true,
    billing: false,
    marketing: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const updateNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Master Toggle */}
        <View style={styles.section}>
          <View style={styles.masterToggle}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color={Colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Enable all notifications</Text>
              </View>
            </View>
            <Switch
              value={notifications.pushEnabled}
              onValueChange={() => updateNotification('pushEnabled')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Health & Care */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health & Care</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Appointments</Text>
              <Text style={styles.settingDescription}>New and updated appointments</Text>
            </View>
            <Switch
              value={notifications.appointments}
              onValueChange={() => updateNotification('appointments')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Appointment Reminders</Text>
              <Text style={styles.settingDescription}>24h before appointments</Text>
            </View>
            <Switch
              value={notifications.appointmentReminders}
              onValueChange={() => updateNotification('appointmentReminders')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Messages</Text>
              <Text style={styles.settingDescription}>New messages from providers</Text>
            </View>
            <Switch
              value={notifications.messages}
              onValueChange={() => updateNotification('messages')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Lab Results</Text>
              <Text style={styles.settingDescription}>When results are available</Text>
            </View>
            <Switch
              value={notifications.labResults}
              onValueChange={() => updateNotification('labResults')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Prescriptions</Text>
              <Text style={styles.settingDescription}>Refills and updates</Text>
            </View>
            <Switch
              value={notifications.prescriptions}
              onValueChange={() => updateNotification('prescriptions')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Health Alerts</Text>
              <Text style={styles.settingDescription}>Important health updates</Text>
            </View>
            <Switch
              value={notifications.healthAlerts}
              onValueChange={() => updateNotification('healthAlerts')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Other Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Billing & Payments</Text>
              <Text style={styles.settingDescription}>Bills and payment updates</Text>
            </View>
            <Switch
              value={notifications.billing}
              onValueChange={() => updateNotification('billing')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Marketing & Updates</Text>
              <Text style={styles.settingDescription}>App news and features</Text>
            </View>
            <Switch
              value={notifications.marketing}
              onValueChange={() => updateNotification('marketing')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Delivery Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Methods</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Send updates via email</Text>
            </View>
            <Switch
              value={notifications.emailNotifications}
              onValueChange={() => updateNotification('emailNotifications')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>SMS Notifications</Text>
              <Text style={styles.settingDescription}>Send updates via text</Text>
            </View>
            <Switch
              value={notifications.smsNotifications}
              onValueChange={() => updateNotification('smsNotifications')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
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
  masterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

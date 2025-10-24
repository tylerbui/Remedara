import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useTheme, ThemeMode } from '../providers/ThemeProvider';

interface AppearancePreferencesScreenProps {
  onBack?: () => void;
}

export function AppearancePreferencesScreen({ onBack }: AppearancePreferencesScreenProps) {
  const { themeMode, setThemeMode, isDark } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; description: string; icon: string }[] = [
    {
      mode: 'light',
      label: 'Light',
      description: 'Always use light mode',
      icon: 'sunny',
    },
    {
      mode: 'dark',
      label: 'Dark',
      description: 'Always use dark mode',
      icon: 'moon',
    },
    {
      mode: 'auto',
      label: 'Auto',
      description: 'Match system settings',
      icon: 'phone-portrait',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appearance</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Current Theme Info */}
        <View style={styles.infoCard}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={Colors.info}
          />
          <Text style={styles.infoText}>
            Currently using {isDark ? 'dark' : 'light'} mode
            {themeMode === 'auto' && ' (following system settings)'}
          </Text>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>

          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.themeOption,
                themeMode === option.mode && styles.themeOptionSelected,
              ]}
              onPress={() => setThemeMode(option.mode)}
            >
              <View style={styles.themeIconContainer}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={themeMode === option.mode ? Colors.primary : Colors.textSecondary}
                />
              </View>
              <View style={styles.themeContent}>
                <Text style={styles.themeLabel}>{option.label}</Text>
                <Text style={styles.themeDescription}>{option.description}</Text>
              </View>
              {themeMode === option.mode && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Sample Card</Text>
            <Text style={styles.previewText}>
              This is how text and cards will appear in {isDark ? 'dark' : 'light'} mode.
            </Text>
            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>Badge</Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            The app appearance will update automatically based on your selection. Auto mode follows your device's system settings.
          </Text>
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  themeOptionSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeContent: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  previewBadge: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  footerInfo: {
    padding: 20,
    paddingTop: 0,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

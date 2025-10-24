import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../providers/ThemeProvider';

interface AppearancePreferencesScreenProps {
  onBack?: () => void;
}

export function AppearancePreferencesScreen({ onBack }: AppearancePreferencesScreenProps) {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Current Theme Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={colors.info}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Currently using {isDark ? 'dark' : 'light'} mode
            {themeMode === 'auto' && ' (following system settings)'}
          </Text>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>

          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.themeOption,
                { backgroundColor: colors.surface, borderColor: themeMode === option.mode ? colors.primary : colors.border },
                themeMode === option.mode && styles.themeOptionSelected,
              ]}
              onPress={() => setThemeMode(option.mode)}
            >
              <View style={[styles.themeIconContainer, { backgroundColor: colors.background }]}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={themeMode === option.mode ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.themeContent}>
                <Text style={[styles.themeLabel, { color: colors.text }]}>{option.label}</Text>
                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>{option.description}</Text>
              </View>
              {themeMode === option.mode && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
          
          <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.previewTitle, { color: colors.text }]}>Sample Card</Text>
            <Text style={[styles.previewText, { color: colors.textSecondary }]}>
              This is how text and cards will appear in {isDark ? 'dark' : 'light'} mode.
            </Text>
            <View style={[styles.previewBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.previewBadgeText}>Badge</Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.footerInfo}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
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
    flex: 1,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  themeOptionSelected: {
    borderWidth: 2,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 13,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  previewBadge: {
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
    textAlign: 'center',
    lineHeight: 18,
  },
});

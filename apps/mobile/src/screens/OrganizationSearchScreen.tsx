import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { FHIRProvider } from '../constants/fhirProviders';

interface OrganizationSearchScreenProps {
  visible: boolean;
  onClose: () => void;
  provider: FHIRProvider;
  onSelectOrganization: (orgUrl: string, orgName: string) => void;
}

interface Organization {
  id: string;
  name: string;
  location: string;
  fhirUrl: string;
  system: string;
}

// Sample organizations - in production, this would come from an API
const EPIC_ORGANIZATIONS: Organization[] = [
  {
    id: 'uc-health',
    name: 'UC Health',
    location: 'Cincinnati, OH',
    fhirUrl: 'https://epicproxy.et1061.epichosted.com/FHIRProxy/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'mayo-clinic',
    name: 'Mayo Clinic',
    location: 'Rochester, MN',
    fhirUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'stanford-health',
    name: 'Stanford Health Care',
    location: 'Palo Alto, CA',
    fhirUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'cedars-sinai',
    name: 'Cedars-Sinai',
    location: 'Los Angeles, CA',
    fhirUrl: 'https://epicmobile.csmc.edu/FHIR/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'johns-hopkins',
    name: 'Johns Hopkins',
    location: 'Baltimore, MD',
    fhirUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'cleveland-clinic',
    name: 'Cleveland Clinic',
    location: 'Cleveland, OH',
    fhirUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'kaiser',
    name: 'Kaiser Permanente',
    location: 'Multiple Locations',
    fhirUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    system: 'Epic',
  },
  {
    id: 'ucla',
    name: 'UCLA Health',
    location: 'Los Angeles, CA',
    fhirUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    system: 'Epic',
  },
];

const CERNER_ORGANIZATIONS: Organization[] = [
  {
    id: 'ku-health',
    name: 'KU Health System',
    location: 'Kansas City, KS',
    fhirUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    system: 'Cerner',
  },
  {
    id: 'christus-health',
    name: 'CHRISTUS Health',
    location: 'Irving, TX',
    fhirUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    system: 'Cerner',
  },
  {
    id: 'hca-healthcare',
    name: 'HCA Healthcare',
    location: 'Nashville, TN',
    fhirUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    system: 'Cerner',
  },
];

export function OrganizationSearchScreen({
  visible,
  onClose,
  provider,
  onSelectOrganization,
}: OrganizationSearchScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const organizations =
    provider.id === 'epic'
      ? EPIC_ORGANIZATIONS
      : provider.id === 'cerner'
      ? CERNER_ORGANIZATIONS
      : [];

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOrganization = (org: Organization) => {
    Alert.alert(
      `Connect to ${org.name}`,
      `You'll be redirected to ${org.name}'s secure login page to authorize access to your medical records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => onSelectOrganization(org.fhirUrl, org.name),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Organization</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Provider Info */}
          <View style={styles.providerInfo}>
            <View style={styles.providerIcon}>
              <Ionicons name="medical" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerDescription}>
              Search for your healthcare organization below
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or location..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={Colors.textLight}
              autoFocus
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={Colors.info} />
            <Text style={styles.infoText}>
              Can't find your organization? Contact them to confirm they use {provider.name} and
              support patient data sharing.
            </Text>
          </View>

          {/* Organizations List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {filteredOrganizations.length} Organization
              {filteredOrganizations.length !== 1 ? 's' : ''} Found
            </Text>

            {filteredOrganizations.map((org) => (
              <TouchableOpacity
                key={org.id}
                style={styles.orgCard}
                onPress={() => handleSelectOrganization(org)}
              >
                <View style={styles.orgIconContainer}>
                  <Ionicons name="business" size={24} color={Colors.primary} />
                </View>
                <View style={styles.orgInfo}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <View style={styles.orgMeta}>
                    <Ionicons name="location" size={14} color={Colors.textSecondary} />
                    <Text style={styles.orgLocation}>{org.location}</Text>
                  </View>
                  <View style={styles.systemBadge}>
                    <Text style={styles.systemBadgeText}>{org.system}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}

            {filteredOrganizations.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={Colors.textLight} />
                <Text style={styles.emptyTitle}>No organizations found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search or contact your healthcare provider
                </Text>
              </View>
            )}
          </View>

          {/* Custom URL Option */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                Alert.alert(
                  'Custom Organization',
                  "If you know your organization's FHIR endpoint URL, you can enter it manually.",
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Enter URL',
                      onPress: () => {
                        // This would open a custom URL input
                        Alert.alert('Coming Soon', 'Manual URL entry will be available soon.');
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="link" size={20} color={Colors.primary} />
              <Text style={styles.customButtonText}>Enter Custom FHIR URL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  providerInfo: {
    alignItems: 'center',
    padding: 24,
  },
  providerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  providerDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
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
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orgIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orgMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  orgLocation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  systemBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  systemBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  customButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});

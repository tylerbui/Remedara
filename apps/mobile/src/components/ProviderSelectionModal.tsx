import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { KNOWN_FHIR_PROVIDERS, FHIRProvider } from '../constants/fhirProviders';
import { OrganizationSearchScreen } from '../screens/OrganizationSearchScreen';

interface ProviderSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProvider: (provider: FHIRProvider) => void;
}

export function ProviderSelectionModal({
  visible,
  onClose,
  onSelectProvider,
}: ProviderSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<FHIRProvider | null>(null);
  const [showOrgSearch, setShowOrgSearch] = useState(false);

  const filteredProviders = KNOWN_FHIR_PROVIDERS.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const majorProviders = filteredProviders.filter((p) => p.category === 'major');
  const sandboxProviders = filteredProviders.filter((p) => p.category === 'sandbox');

  const handleSelectProvider = (provider: FHIRProvider) => {
    // For Epic and Cerner, show organization search
    if (provider.id === 'epic' || provider.id === 'cerner') {
      setSelectedProvider(provider);
      setShowOrgSearch(true);
    } else {
      // For sandbox/test providers, connect directly
      onSelectProvider(provider);
      setSearchTerm('');
      setShowCustom(false);
      setCustomUrl('');
    }
  };

  const handleSelectOrganization = (orgUrl: string, orgName: string) => {
    if (selectedProvider) {
      // Create a modified provider object with the specific organization's FHIR URL
      const providerWithOrg: FHIRProvider = {
        ...selectedProvider,
        baseUrl: orgUrl,
        name: orgName,
      };
      onSelectProvider(providerWithOrg);
      setShowOrgSearch(false);
      setSelectedProvider(null);
      setSearchTerm('');
      setShowCustom(false);
      setCustomUrl('');
    }
  };

  const handleCustomProvider = () => {
    if (!customUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid FHIR server URL');
      return;
    }

    // Create a custom provider object
    const customProvider: FHIRProvider = {
      id: 'custom',
      name: 'Custom FHIR Server',
      description: 'Custom FHIR endpoint',
      baseUrl: customUrl.trim(),
      wellKnown: `${customUrl.trim()}/.well-known/smart_configuration`,
      category: 'regional',
      features: [],
    };

    handleSelectProvider(customProvider);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'major':
        return { bg: Colors.primary, text: '#FFFFFF' };
      case 'sandbox':
        return { bg: Colors.warning, text: '#FFFFFF' };
      default:
        return { bg: Colors.border, text: Colors.text };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Link Healthcare Provider</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search providers..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={Colors.textLight}
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
              Connect to your healthcare provider to automatically sync your medical records,
              appointments, lab results, and more.
            </Text>
          </View>

          {/* Major Providers */}
          {majorProviders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Major Healthcare Systems</Text>
              {majorProviders.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.providerCard}
                  onPress={() => handleSelectProvider(provider)}
                >
                  <View style={styles.providerIcon}>
                    <Ionicons name="medical" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.providerInfo}>
                    <View style={styles.providerHeader}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryBadgeColor(provider.category).bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryBadgeText,
                            { color: getCategoryBadgeColor(provider.category).text },
                          ]}
                        >
                          {provider.category.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.providerDescription}>{provider.description}</Text>
                    <View style={styles.featuresList}>
                      {provider.features.slice(0, 3).map((feature, index) => (
                        <View key={index} style={styles.featureTag}>
                          <Text style={styles.featureTagText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Sandbox/Test Providers */}
          {sandboxProviders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Test & Development</Text>
              {sandboxProviders.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.providerCard}
                  onPress={() => handleSelectProvider(provider)}
                >
                  <View style={styles.providerIcon}>
                    <Ionicons name="flask" size={24} color={Colors.warning} />
                  </View>
                  <View style={styles.providerInfo}>
                    <View style={styles.providerHeader}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryBadgeColor(provider.category).bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryBadgeText,
                            { color: getCategoryBadgeColor(provider.category).text },
                          ]}
                        >
                          {provider.category.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.providerDescription}>{provider.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Custom Provider Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.customToggle}
              onPress={() => setShowCustom(!showCustom)}
            >
              <View style={styles.customToggleLeft}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
                <Text style={styles.customToggleText}>Add Custom FHIR Server</Text>
              </View>
              <Ionicons
                name={showCustom ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>

            {showCustom && (
              <View style={styles.customForm}>
                <Text style={styles.inputLabel}>FHIR Server URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://fhir.example.com/R4"
                  value={customUrl}
                  onChangeText={setCustomUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                  placeholderTextColor={Colors.textLight}
                />
                <TouchableOpacity
                  style={styles.customConnectButton}
                  onPress={handleCustomProvider}
                >
                  <Text style={styles.customConnectButtonText}>Connect Custom Server</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              Contact your healthcare provider to see if they support FHIR data sharing. Most
              major health systems now offer patient access through MyChart or similar portals.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Organization Search Modal */}
      {selectedProvider && (
        <OrganizationSearchScreen
          visible={showOrgSearch}
          onClose={() => {
            setShowOrgSearch(false);
            setSelectedProvider(null);
          }}
          provider={selectedProvider}
          onSelectOrganization={handleSelectOrganization}
        />
      )}
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
  closeButton: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  providerDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  customToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  customToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  customForm: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  customConnectButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  customConnectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helpSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

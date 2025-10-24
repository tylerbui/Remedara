import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ProviderSelectionModal } from '../components/ProviderSelectionModal';
import { FHIRProvider, LinkedProvider } from '../constants/fhirProviders';

export function LinkProvidersScreen() {
  const [connectedProviders, setConnectedProviders] = useState<LinkedProvider[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchLinkedProviders();
  }, []);

  const fetchLinkedProviders = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint
      // const response = await fetch('YOUR_API_URL/api/fhir/providers');
      // const data = await response.json();
      // setConnectedProviders(data.providers);
      
      // Mock data for now
      setConnectedProviders([]);
    } catch (error) {
      console.error('Error fetching providers:', error);
      Alert.alert('Error', 'Failed to load linked providers');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkProvider = async (provider: FHIRProvider) => {
    try {
      setShowModal(false);
      
      // TODO: Replace with actual API URL
      const apiUrl = 'YOUR_API_URL'; // e.g., https://yourapp.com
      const authUrl = `${apiUrl}/api/fhir/authorize?provider=${provider.id}`;
      
      Alert.alert(
        'Connect Provider',
        `Opening browser to connect to ${provider.name}. You'll be redirected back to the app after authorization.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: async () => {
              const supported = await Linking.canOpenURL(authUrl);
              if (supported) {
                await Linking.openURL(authUrl);
              } else {
                Alert.alert('Error', 'Cannot open authorization URL');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error linking provider:', error);
      Alert.alert('Error', 'Failed to initiate provider linking');
    }
  };

  const handleSync = async (providerId?: string) => {
    try {
      setSyncing(true);
      // TODO: Implement sync with backend
      Alert.alert('Sync Started', 'Syncing your medical data...');
      
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Success', 'Data synced successfully!');
      await fetchLinkedProviders();
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  const handleUnlink = async (providerId: string, providerName: string) => {
    Alert.alert(
      'Unlink Provider',
      `Are you sure you want to unlink ${providerName}? This will remove all synced data from this provider.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement unlink API call
              Alert.alert('Success', `Unlinked ${providerName}`);
              await fetchLinkedProviders();
            } catch (error) {
              console.error('Unlink error:', error);
              Alert.alert('Error', 'Failed to unlink provider');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: LinkedProvider['status']) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'expired':
        return Colors.error;
      case 'error':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Healthcare Providers</Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => setShowModal(true)}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.linkButtonText}>Link Provider</Text>
          </TouchableOpacity>
        </View>

        {/* Connected Providers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📋</Text>
            </View>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.sectionTitle}>Connected Providers</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{connectedProviders.length}</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Healthcare providers you're currently connected with
              </Text>
            </View>
          </View>

          {/* Empty State */}
          {connectedProviders.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📋</Text>
              </View>
              <Text style={styles.emptyTitle}>No Connected Providers</Text>
              <Text style={styles.emptySubtitle}>
                You don't have any connected healthcare providers yet.
              </Text>
            </View>
          )}

          {/* Connected Providers List */}
          {connectedProviders.length > 0 && (
            <View style={styles.providersList}>
              {connectedProviders.map((provider) => (
                <View key={provider._id} style={styles.providerCard}>
                  <View style={styles.providerHeader}>
                    <View style={styles.providerInfo}>
                      <Text style={styles.providerName}>{provider.organizationName}</Text>
                      <Text style={styles.providerSystem}>{provider.baseUrl}</Text>
                      {provider.lastSyncAt && (
                        <Text style={styles.lastSync}>
                          Last synced: {new Date(provider.lastSyncAt).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(provider.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(provider.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(provider.status) }]}>
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Provider Actions */}
                  <View style={styles.providerActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSync(provider._id)}
                      disabled={syncing}
                    >
                      <Ionicons name="sync" size={16} color={Colors.primary} />
                      <Text style={styles.actionButtonText}>Sync</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonDanger]}
                      onPress={() => handleUnlink(provider._id, provider.organizationName)}
                    >
                      <Ionicons name="unlink" size={16} color={Colors.error} />
                      <Text style={[styles.actionButtonText, { color: Colors.error }]}>Unlink</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* External Provider Systems Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>External Provider Systems</Text>
          <Text style={styles.sectionDescription}>
            Connect to external healthcare systems to import your medical data
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Link to external systems like Epic, Cerner, and other FHIR-compliant 
              platforms to import your existing medical history.
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📋</Text>
                <Text style={styles.featureText}>
                  Epic MyChart, Cerner PowerChart, and more
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  Secure OAuth 2.0 authentication
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>
                  Automatic data synchronization
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Provider Selection Modal */}
      <ProviderSelectionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSelectProvider={handleLinkProvider}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  linkButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: Colors.surface,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 8,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  providersList: {
    gap: 12,
  },
  providerCard: {
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  providerSystem: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lastSync: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  providerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 4,
  },
  actionButtonDanger: {
    borderColor: Colors.error,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  infoCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
});

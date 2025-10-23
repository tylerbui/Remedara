import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChooseTimeScreen } from './ChooseTimeScreen';
import { Colors } from '../constants/colors';

interface ProviderCardProps {
  name: string;
  specialty: string;
  address: string;
  onBook: () => void;
  onDetails: () => void;
}

function ProviderCard({ name, specialty, address, onBook, onDetails }: ProviderCardProps) {
  return (
    <View style={styles.providerCard}>
      <View style={styles.avatar} />
      <Text style={styles.providerName}>{name}</Text>
      <View style={styles.specialtyBadge}>
        <Text style={styles.specialtyText}>{specialty}</Text>
      </View>
      <Text style={styles.providerAddress}>{address}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.bookButton} onPress={onBook}>
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton} onPress={onDetails}>
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface SelectProviderScreenProps {
  onBack?: () => void;
}

export function SelectProviderScreen({ onBack }: SelectProviderScreenProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showChooseTime, setShowChooseTime] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProvider, setDetailsProvider] = useState<any>(null);

  const providers = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      address: '333 N. Alameda Ave.\nLos Angeles, CA 91777',
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      address: '333 N. Alameda Ave.\nLos Angeles, CA 91777',
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      address: '333 N. Alameda Ave.\nLos Angeles, CA 91777',
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      address: '333 N. Alameda Ave.\nLos Angeles, CA 91777',
    },
  ];

  const handleBook = (provider: any) => {
    setSelectedProvider(provider.name);
    setShowChooseTime(true);
  };

  const handleDetails = (provider: any) => {
    setDetailsProvider(provider);
    setShowDetailsModal(true);
  };

  if (showChooseTime && selectedProvider) {
    return (
      <ChooseTimeScreen 
        onBack={() => setShowChooseTime(false)} 
        providerName={selectedProvider}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointments</Text>
        </View>

        {/* Select Provider Button */}
        <View style={styles.selectProviderSection}>
          <TouchableOpacity style={styles.selectProviderButton}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.selectProviderText}>Select Provider</Text>
          </TouchableOpacity>
        </View>

        {/* Provider Grid */}
        <View style={styles.providerGrid}>
          {providers.map((provider, index) => (
            <ProviderCard
              key={index}
              name={provider.name}
              specialty={provider.specialty}
              address={provider.address}
              onBook={() => handleBook(provider)}
              onDetails={() => handleDetails(provider)}
            />
          ))}
        </View>

        {/* Book Appointment Section */}
        <View style={styles.bookSection}>
          <Text style={styles.bookTitle}>Book Appointment</Text>
          <Text style={styles.bookSubtitle}>
            Book with your favorite doctor{'\n'}or add a new one
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickBookScroll}
          >
            <View style={styles.quickBookCard}>
              <View style={styles.quickBookAvatar} />
              <Text style={styles.quickBookName}>Dr. Sarah Johnson</Text>
              <Text style={styles.quickBookSpecialty}>Cardiology</Text>
              <View style={styles.quickBookDivider} />
              <TouchableOpacity 
                style={styles.quickBookButton}
                onPress={() => handleBook({ name: 'Dr. Sarah Johnson' })}
              >
                <Text style={styles.quickBookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickBookCard}>
              <View style={styles.quickBookAvatar} />
              <Text style={styles.quickBookName}>Dr. Michael Chen</Text>
              <Text style={styles.quickBookSpecialty}>Dermatology</Text>
              <View style={styles.quickBookDivider} />
              <TouchableOpacity 
                style={styles.quickBookButton}
                onPress={() => handleBook({ name: 'Dr. Michael Chen' })}
              >
                <Text style={styles.quickBookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickBookCard}>
              <View style={styles.quickBookAvatar} />
              <Text style={styles.quickBookName}>Dr. Emily Rodriguez</Text>
              <Text style={styles.quickBookSpecialty}>Pediatrics</Text>
              <View style={styles.quickBookDivider} />
              <TouchableOpacity 
                style={styles.quickBookButton}
                onPress={() => handleBook({ name: 'Dr. Emily Rodriguez' })}
              >
                <Text style={styles.quickBookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickBookCard}>
              <View style={styles.quickBookAvatar} />
              <Text style={styles.quickBookName}>Dr. James Wilson</Text>
              <Text style={styles.quickBookSpecialty}>Orthopedics</Text>
              <View style={styles.quickBookDivider} />
              <TouchableOpacity 
                style={styles.quickBookButton}
                onPress={() => handleBook({ name: 'Dr. James Wilson' })}
              >
                <Text style={styles.quickBookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  backButton: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  selectProviderSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectProviderButton: {
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
  selectProviderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  providerCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    marginBottom: 12,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  specialtyBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  specialtyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  providerAddress: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  bookSection: {
    padding: 20,
    marginTop: 20,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  bookSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  quickBookScroll: {
    paddingRight: 20,
    gap: 12,
  },
  quickBookCard: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickBookAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    marginBottom: 12,
  },
  quickBookName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickBookSpecialty: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  quickBookDivider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.primary,
    marginBottom: 12,
  },
  quickBookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickBookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
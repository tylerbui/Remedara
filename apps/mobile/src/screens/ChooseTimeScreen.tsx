import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { YourDetailsScreen } from './YourDetailsScreen';

interface ChooseTimeScreenProps {
  onBack?: () => void;
  providerName?: string;
}

export function ChooseTimeScreen({ onBack, providerName = 'Dr. Sarah Johnson' }: ChooseTimeScreenProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showYourDetails, setShowYourDetails] = useState(false);

  if (showYourDetails && selectedDate && selectedTime) {
    return (
      <YourDetailsScreen 
        onBack={() => setShowYourDetails(false)}
        providerName={providerName}
        selectedDate={`December ${selectedDate}, 2025`}
        selectedTime={selectedTime}
      />
    );
  }

  // Generate calendar dates for the current month
  const generateDates = () => {
    const dates = [];
    const startDate = 15; // Starting from 15th
    const endDate = 28;
    
    for (let i = startDate; i <= endDate; i++) {
      dates.push({
        date: i,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i % 7],
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Time</Text>
        </View>

        {/* Provider Info */}
        <View style={styles.providerInfo}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.providerName}>{providerName}</Text>
            <Text style={styles.providerSpecialty}>Internal Medicine</Text>
          </View>
        </View>

        {/* Month/Year Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity>
            <Text style={styles.monthArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>December 2025</Text>
          <TouchableOpacity>
            <Text style={styles.monthArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Dates */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScroll}
          >
            {dates.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  selectedDate === item.date && styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === item.date && styles.dateTextSelected,
                ]}>
                  {item.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === item.date && styles.dateTextSelected,
                ]}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected,
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Info */}
        {selectedDate && selectedTime && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>
              Selected: December {selectedDate}, 2025 at {selectedTime}
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              (!selectedDate || !selectedTime) && styles.continueButtonDisabled,
            ]}
            disabled={!selectedDate || !selectedTime}
            onPress={() => setShowYourDetails(true)}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  providerSpecialty: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  monthArrow: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  calendarSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  datesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    width: 70,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dateCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateDay: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  timeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  timeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedInfo: {
    backgroundColor: Colors.accentLight,
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  selectedText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
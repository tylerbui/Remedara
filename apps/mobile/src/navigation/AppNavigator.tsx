import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { RecordsScreen } from '../screens/RecordsScreen';
import { LinkProvidersScreen } from '../screens/LinkProvidersScreen';

type TabName = 'Appointments' | 'Messages' | 'Home' | 'Records' | 'Providers';

export function AppNavigator() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Appointments':
        return <AppointmentsScreen />;
      case 'Messages':
        return <MessagesScreen />;
      case 'Home':
        return <HomeScreen />;
      case 'Records':
        return <RecordsScreen />;
      case 'Providers':
        return <LinkProvidersScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Appointments')}
        >
          <Ionicons
            name={activeTab === 'Appointments' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'Appointments' ? Colors.primary : Colors.textLight}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'Appointments' ? Colors.primary : Colors.textLight }
          ]}>
            Appts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Messages')}
        >
          <Ionicons
            name={activeTab === 'Messages' ? 'chatbubbles' : 'chatbubbles-outline'}
            size={22}
            color={activeTab === 'Messages' ? Colors.primary : Colors.textLight}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'Messages' ? Colors.primary : Colors.textLight }
          ]}>
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Home')}
        >
          <Ionicons
            name={activeTab === 'Home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'Home' ? Colors.primary : Colors.textLight}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'Home' ? Colors.primary : Colors.textLight }
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Records')}
        >
          <Ionicons
            name={activeTab === 'Records' ? 'document-text' : 'document-text-outline'}
            size={22}
            color={activeTab === 'Records' ? Colors.primary : Colors.textLight}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'Records' ? Colors.primary : Colors.textLight }
          ]}>
            Records
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Providers')}
        >
          <Ionicons
            name={activeTab === 'Providers' ? 'link' : 'link-outline'}
            size={22}
            color={activeTab === 'Providers' ? Colors.primary : Colors.textLight}
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'Providers' ? Colors.primary : Colors.textLight }
          ]}>
            Providers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

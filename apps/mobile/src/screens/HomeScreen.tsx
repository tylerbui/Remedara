import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/SimpleAuthProvider';

export function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏥 Remedara</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
        <Text style={styles.text}>Your healthcare dashboard</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#3B82F6',
    marginBottom: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    color: '#6B7280',
  },
});
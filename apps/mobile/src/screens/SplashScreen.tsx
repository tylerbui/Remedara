import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto finish after 2 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Leaf icon using text (you can replace with actual SVG/Image) */}
        <View style={styles.logoContainer}>
          <Text style={styles.leafIcon}>🌿</Text>
        </View>
        <Text style={styles.logoText}>remedara</Text>
        <Text style={styles.tagline}>Your Healthcare Journey</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  leafIcon: {
    fontSize: 80,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '400',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
});
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  background: string;
  backgroundLight: string;
  surface: string;
  text: string;
  textSecondary: string;
  textLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  disabled: string;
  appointmentRecent: string;
  appointmentUpcoming: string;
  appointmentCard: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const lightColors: ThemeColors = {
  primary: '#2D4A3E',
  primaryLight: '#3D5A4E',
  primaryDark: '#1D3A2E',
  accent: '#5A7965',
  accentLight: '#7A9985',
  background: '#F5F1E8',
  backgroundLight: '#FAF8F3',
  surface: '#FFFFFF',
  text: '#2D4A3E',
  textSecondary: '#5A6B5F',
  textLight: '#8A9B8F',
  success: '#4A7C59',
  warning: '#B8956A',
  error: '#A65A52',
  info: '#6B8E7D',
  border: '#D4C9B8',
  disabled: '#C9C0B3',
  appointmentRecent: '#7A9985',
  appointmentUpcoming: '#5A7965',
  appointmentCard: '#E8EBE4',
};

const darkColors: ThemeColors = {
  primary: '#5A7965',
  primaryLight: '#7A9985',
  primaryDark: '#3D5A4E',
  accent: '#7A9985',
  accentLight: '#9AB9A5',
  background: '#1A1A1A',
  backgroundLight: '#2A2A2A',
  surface: '#2C2C2C',
  text: '#E8EBE4',
  textSecondary: '#B8C4B8',
  textLight: '#8A9B8F',
  success: '#6A9C79',
  warning: '#D8B58A',
  error: '#C67A72',
  info: '#8BAEA0',
  border: '#3A3A3A',
  disabled: '#4A4A4A',
  appointmentRecent: '#7A9985',
  appointmentUpcoming: '#5A7965',
  appointmentCard: '#353535',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  const isDark =
    themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

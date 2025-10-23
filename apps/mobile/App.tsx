import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleAuthProvider } from './src/providers/SimpleAuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SimpleAuthProvider>
        <AppNavigator />
      </SimpleAuthProvider>
    </SafeAreaProvider>
  );
}

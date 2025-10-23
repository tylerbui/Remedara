import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleAuthProvider } from './src/providers/SimpleAuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <SimpleAuthProvider>
        <AppNavigator />
      </SimpleAuthProvider>
    </SafeAreaProvider>
  );
}

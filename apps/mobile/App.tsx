import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleAuthProvider } from './src/providers/SimpleAuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <SafeAreaProvider>
          <SignupScreen
            onSignup={() => setIsAuthenticated(true)}
            onNavigateToLogin={() => setShowSignup(false)}
          />
        </SafeAreaProvider>
      );
    }
    return (
      <SafeAreaProvider>
        <LoginScreen
          onLogin={() => setIsAuthenticated(true)}
          onNavigateToSignup={() => setShowSignup(true)}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SimpleAuthProvider>
        <AppNavigator onLogout={() => setIsAuthenticated(false)} />
      </SimpleAuthProvider>
    </SafeAreaProvider>
  );
}

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: 'PATIENT' | 'PROVIDER' | 'ADMIN';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function SimpleAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple mock auth check
    setTimeout(() => {
      const mockUser: AuthUser = {
        id: '1',
        email: 'demo@remedara.com',
        name: 'Demo User',
        role: 'PATIENT',
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    const mockUser: AuthUser = {
      id: '1',
      email: email,
      name: 'Demo User',
      role: 'PATIENT',
    };
    setUser(mockUser);
  };

  const logout = async () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
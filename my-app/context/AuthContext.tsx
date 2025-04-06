import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Define types for user info and context
type UserInfo = {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;  // Auth0 user ID
  [key: string]: any;  // Allow for additional properties
};

type AuthContextType = {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  login: (accessToken: string, user: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userInfo: null,
  login: async () => { },
  logout: async () => { },
  isLoading: true,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('auth0Token');
        const user = await AsyncStorage.getItem('auth0User');

        if (token && user) {
          setIsAuthenticated(true);
          setUserInfo(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error checking auth status', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (accessToken: string, user: UserInfo) => {
    try {
      await AsyncStorage.setItem('auth0Token', accessToken);
      await AsyncStorage.setItem('auth0User', JSON.stringify(user));
      setIsAuthenticated(true);
      setUserInfo(user);
    } catch (error) {
      console.error('Error storing auth data', error);
    }
  };

  // Logout function - simplified version
  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('auth0Token');
      await AsyncStorage.removeItem('auth0User');

      // Update state
      setIsAuthenticated(false);
      setUserInfo(null);

      // Navigate to login page
      router.replace('/');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
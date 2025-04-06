import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Define types for user info and context
type UserInfo = {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;  // Auth0 user ID
  nickname?: string;
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
        console.log('Checking authentication status...');
        const token = await AsyncStorage.getItem('auth0Token');
        const user = await AsyncStorage.getItem('auth0User');

        if (token && user) {
          console.log('Found saved authentication');
          setIsAuthenticated(true);
          const parsedUser = JSON.parse(user);
          setUserInfo(parsedUser);
          console.log('User info loaded:', parsedUser);
        } else {
          console.log('No saved authentication found');
        }
      } catch (error) {
        console.error('Error checking auth status', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fetch user information from the backend
  const getUserInfo = async (user: UserInfo) => {
    try {
      // Try different API URLs in order of preference
      const API_URLS = [
        'http://127.0.0.1:5000',
        'http://10.0.2.2:5000'
      ];

      let response = null;
      let lastError = null;
      let successfulUrl = '';

      // Try each URL until one works
      for (const baseUrl of API_URLS) {
        const url = `${baseUrl}/users/fetch/${user.sub}`;
        console.log(`Attempting to connect to: ${url}`);

        try {
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userEmail: user.email,
              userName: user.name || user.nickname || user.email
            })
          });

          if (response.ok) {
            console.log(`Successfully connected to: ${baseUrl}`);
            successfulUrl = baseUrl;
            break; // Exit the loop if successful
          }
        } catch (error: any) {
          lastError = error;
          console.log(`Failed to connect to ${baseUrl}: ${error.message || 'Unknown error'}`);
          // Continue to try the next URL
        }
      }

      if (!response || !response.ok) {
        console.error('All connection attempts failed:', lastError);
        throw new Error('Failed to connect to any backend endpoint');
      }

      const data = await response.json();
      console.log(`User data response from ${successfulUrl}:`, data);

      if (data.success) {
        // Merge Auth0 and backend user data
        const mergedUserData = {
          ...user,
          ...data.data
        };

        console.log('User successfully fetched or created:', data.existing ? 'Existing user' : 'New user');
        return mergedUserData;
      } else {
        throw new Error(data.error || 'Unknown error from server');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);

      // Create a local fallback user when backend is unreachable
      console.log('Using Auth0 user data as fallback');
      return {
        ...user,
        userId: user.sub,
        userEmail: user.email,
        userName: user.name || user.nickname || user.email,
        numRecipe: 0,
        streak: 0
      };
    }
  };

  // Login function
  const login = async (accessToken: string, user: UserInfo) => {
    try {
      console.log('Logging in user:', user);
      console.log('user name:', user.name || user.nickname);
      console.log('user email:', user.email);
      await AsyncStorage.setItem('auth0Token', accessToken);
      await AsyncStorage.setItem('auth0User', JSON.stringify(user));

      setIsAuthenticated(true);
      setUserInfo(user); // Set initial userInfo from Auth0

      try {
        // Try to get backend user data
        const mergedUserData = await getUserInfo(user);
        setUserInfo(mergedUserData);
        console.log('Final user data after merging:', mergedUserData);
      } catch (backendError) {
        console.error('Error getting backend user data:', backendError);
        // We still set the user as authenticated with Auth0 data
      }

      console.log('Login successful');
    } catch (error) {
      console.error('Error storing auth data', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out user');
      // Clear AsyncStorage
      await AsyncStorage.removeItem('auth0Token');
      await AsyncStorage.removeItem('auth0User');

      // Update state
      setIsAuthenticated(false);
      setUserInfo(null);

      // Navigate to login page
      router.replace('/');
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userInfo,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
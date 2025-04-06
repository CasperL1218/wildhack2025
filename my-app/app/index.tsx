import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../environment';
import { useAuth } from '../context/AuthContext';

// Register for the AuthSession redirect
WebBrowser.maybeCompleteAuthSession();

// Auth0 configuration
const auth0ClientId = AUTH0_CLIENT_ID;
const auth0Domain = AUTH0_DOMAIN;

// Debug auth0 credentials
console.log('Auth0 credentials in index.tsx:');
console.log('CLIENT_ID:', auth0ClientId ? 'Available' : 'Missing');
console.log('DOMAIN:', auth0Domain ? 'Available' : 'Missing');

// Auth URL construction
const authorizationEndpoint = `https://${auth0Domain}/authorize`;

// Build the URL for authentication with Auth0
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'myapp'
});

// Log the redirect URI to configure in Auth0 dashboard
console.log('========== AUTH0 CONFIGURATION ==========');
console.log('IMPORTANT: Add this exact URL to your Auth0 application Allowed Callback URLs:');
console.log(redirectUri);
console.log('==========================================');

export default function LoginPage() {
  const { isAuthenticated, login, logout, isLoading, userInfo } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const navigatedRef = useRef(false);

  // Debug the backend user
  // useEffect(() => {
  //   if (backendUser) {
  //     console.log('Backend user loaded:', backendUser);
  //   }
  // }, [backendUser]);

  // If already authenticated, go to tabs - simple version
  useEffect(() => {
    if (isAuthenticated && !isLoading && !navigatedRef.current) {
      navigatedRef.current = true;
      console.log('Login page: Redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setLocalLoading(true);
      await logout();
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle login with Auth0
  const handleLogin = async () => {
    try {
      // Check if Auth0 credentials are properly configured
      if (!auth0ClientId || !auth0Domain) {
        console.error('Auth0 credentials are not configured properly');
        alert('Authentication is not configured properly. Please check your environment setup.');
        return;
      }

      setLocalLoading(true);
      const discovery = await AuthSession.fetchDiscoveryAsync(`https://${auth0Domain}`);

      // Configure Auth request
      const authRequest = new AuthSession.AuthRequest({
        clientId: auth0ClientId,
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        scopes: ['openid', 'profile', 'email'],
      });

      const result = await authRequest.promptAsync(discovery);

      if (result.type === 'success') {
        const response = await fetch(`https://${auth0Domain}/userinfo`, {
          headers: {
            Authorization: `Bearer ${result.authentication?.accessToken}`
          }
        });

        const userInfo = await response.json();

        // Use the context's login method
        await login(result.authentication?.accessToken || '', userInfo);

        // Navigate to tabs
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Login error', error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Show loading while checking auth state or performing login
  if (isLoading || localLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e8dfd5" />
      </View>
    );
  }

  // Login UI
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Welcome to ClickBite!</Text>
        {/* You can add your app logo here */}
        {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
      </View>

      {isAuthenticated ? (
        // Show logout button if authenticated
        <>
          <Text style={styles.welcomeText}>
            Welcome back, {userInfo?.name || 'User'}!
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Show login button if not authenticated
        <>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Sign in to access your account and start using the app.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#84A24D',
    alignItems: 'center',
    paddingTop: 320,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#9b9e8c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    marginBottom: -10,
    fontFamily: 'Baloo',
  },
  welcomeText: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 20,
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#e6e0d9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'NunitoBold',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'NunitoBold',
  },
  infoContainer: {
    width: '80%',
    marginTop: 30,
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
    color: '#f5f5f5',
    fontSize: 16,
    fontFamily: 'Nunito',
  },
}); 
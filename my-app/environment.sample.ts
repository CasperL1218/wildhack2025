// Sample Environment variables
// Copy this file to environment.ts and replace with your actual values
import Constants from 'expo-constants';

// Load env variables from .env file
// Access variables through Constants.expoConfig.extra
// These will be loaded if you set them up in app.config.js
export const AUTH0_CLIENT_ID = Constants.expoConfig?.extra?.auth0ClientId || process.env.AUTH0_CLIENT_ID || null;
export const AUTH0_DOMAIN = Constants.expoConfig?.extra?.auth0Domain || process.env.AUTH0_DOMAIN || null;

// DO NOT add actual credentials here - use .env file instead 
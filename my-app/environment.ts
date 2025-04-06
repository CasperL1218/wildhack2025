// Environment variables
import Constants from 'expo-constants';

// Load env variables from .env file via app.config.js
// Access variables through Constants.expoConfig.extra
const AUTH0_CLIENT_ID_VALUE = Constants.expoConfig?.extra?.auth0ClientId;
const AUTH0_DOMAIN_VALUE = Constants.expoConfig?.extra?.auth0Domain;

// For debugging - log to console to see if values are available
console.log('Auth0 Environment Variables from Constants:');
console.log('AUTH0_CLIENT_ID:', AUTH0_CLIENT_ID_VALUE ? 'Found' : 'Not found');
console.log('AUTH0_DOMAIN:', AUTH0_DOMAIN_VALUE ? 'Found' : 'Not found');

// For development only, fallback to hardcoded values
// In production, you should only use values from Constants.expoConfig.extra
export const AUTH0_CLIENT_ID = AUTH0_CLIENT_ID_VALUE || '8ZDMsBFomt07I0c0WX8scqC7ZD5Afi85';
export const AUTH0_DOMAIN = AUTH0_DOMAIN_VALUE || 'dev-kox1l31j1ydwit85.us.auth0.com'; 
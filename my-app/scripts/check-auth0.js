#!/usr/bin/env node

/**
 * Auth0 Configuration Helper
 * 
 * This script helps set up the correct callback URLs for Auth0 authentication.
 * Run it with: node scripts/check-auth0.js
 */

const { makeRedirectUri } = require('expo-auth-session/build/AuthSession');

// Generate all possible redirect URIs for different environments
const webRedirectUri = makeRedirectUri({ scheme: 'myapp', useProxy: false });
const nativeRedirectUri = 'myapp://';
const expoDevelopmentUris = [
  'exp://127.0.0.1:8081/--/',
  'exp://localhost:8081/--/',
  'exp://172.17.0.1:8081/--/',
  `exp://${process.env.EXPO_DEVSERVER_HOST || 'localhost'}:8081/--/`,
];

console.log('\n=============== AUTH0 CONFIGURATION GUIDE ===============');
console.log('\nFor Auth0 login to work properly, you need to add these URLs to your Auth0 application settings:');
console.log('\n1. Go to https://manage.auth0.com/');
console.log('2. Navigate to Applications > [Your App] > Settings');
console.log('3. In the "Allowed Callback URLs" field, add these URLs (separated by commas):');
console.log('\n--- WEB REDIRECT URI ---');
console.log(webRedirectUri);
console.log('\n--- NATIVE REDIRECT URI ---');
console.log(nativeRedirectUri);
console.log('\n--- EXPO DEVELOPMENT REDIRECT URIS ---');
expoDevelopmentUris.forEach(uri => console.log(uri));

console.log('\n=== COMPLETE URL LIST TO COPY/PASTE ===');
const allUris = [webRedirectUri, nativeRedirectUri, ...expoDevelopmentUris];
console.log(allUris.join(','));
console.log('\n=================================================');
console.log('\nMake sure to also update "Allowed Logout URLs" and "Allowed Web Origins" with similar values.');
console.log('For questions, see: https://docs.expo.dev/guides/authentication/#auth0\n'); 
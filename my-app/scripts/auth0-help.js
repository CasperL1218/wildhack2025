#!/usr/bin/env node

/**
 * Auth0 Configuration Helper
 * 
 * This script provides instructions for setting up Auth0 callback URLs.
 */

console.log('\n=============== AUTH0 CONFIGURATION GUIDE ===============');
console.log('\nFor Auth0 login to work properly, you need to add these URLs to your Auth0 application settings:');
console.log('\n1. Go to https://manage.auth0.com/');
console.log('2. Navigate to Applications > [Your App] > Settings');
console.log('3. In the "Allowed Callback URLs" field, add these URLs (separated by commas):');

// Web and native redirect URIs
console.log('\n=== CALLBACK URLS TO ADD ===');
console.log('myapp://');  // Native URI scheme
console.log('http://localhost:8081');  // Web
console.log('exp://localhost:8081/--/');  // Expo Go
console.log('exp://localhost:19000/--/');  // Expo Go alternative port
console.log('exp://127.0.0.1:8081/--/');  // Expo Go IP
console.log('exp://127.0.0.1:19000/--/');  // Expo Go IP alternative port

console.log('\n=== COPY/PASTE VERSION (ADD ALL THESE) ===');
const allUris = [
  'myapp://',
  'http://localhost:8081',
  'http://localhost:19000',
  'exp://localhost:8081/--/',
  'exp://localhost:19000/--/',
  'exp://127.0.0.1:8081/--/',
  'exp://127.0.0.1:19000/--/',
  'exp://192.168.0.1:8081/--/',
  'exp://172.17.0.1:8081/--/'
];
console.log(allUris.join(','));

console.log('\n4. Copy the same URLs to "Allowed Logout URLs"');
console.log('5. For "Allowed Web Origins", add:');
console.log('http://localhost:8081');
console.log('http://localhost:19000');

console.log('\n=================================================\n'); 
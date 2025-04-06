#!/usr/bin/env node

/**
 * Auth0 Setup Helper
 * 
 * This script installs all the packages needed for Auth0 authentication.
 * Run it with: node scripts/setup-auth.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n==== Installing Auth0 Dependencies ====\n');

// Required packages
const packages = [
  'expo-auth-session',
  'expo-web-browser',
  '@react-native-async-storage/async-storage'
];

// Check if each package is already in package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = packageJson.dependencies || {};

// Filter out already installed packages
const missingPackages = packages.filter(pkg => !dependencies[pkg]);

if (missingPackages.length === 0) {
  console.log('All required packages are already installed! 🎉');
} else {
  console.log(`Installing missing packages: ${missingPackages.join(', ')}`);

  try {
    // Install missing packages
    execSync(`npx expo install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
    console.log('\n✅ Successfully installed all required packages!');
  } catch (error) {
    console.error('\n❌ Error installing packages:', error.message);
    console.log('\nTry installing them manually with:');
    console.log(`npx expo install ${missingPackages.join(' ')}`);
  }
}

console.log('\n==== Auth0 Setup Instructions ====');
console.log('1. Make sure you have an Auth0 account and have created an application');
console.log('2. Copy the .env.sample file to .env and add your Auth0 credentials');
console.log('3. Run the auth0-help.js script to configure your callback URLs');
console.log('\n==== Done ====\n'); 
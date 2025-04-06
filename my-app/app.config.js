import { ExpoConfig } from 'expo/config';

// Read from .env file
const MARKET_API_KEY = process.env.MARKET_API_KEY;

// Export Expo config
const config = {
  name: "my-app",
  slug: "my-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png"
  },
  extra: {
    // Make environment variables available to your app
    marketApiKey: MARKET_API_KEY,
  },
};

export default config; 
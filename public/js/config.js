// Authentication Configuration
// This file contains API keys and configuration for authentication providers

const AUTH_CONFIG = {
  // Facebook OAuth Configuration
  facebook: {
    appId: '1541137253706088',
    version: 'v18.0'
  },

  // Firebase Configuration
  // NOTE: Replace these placeholder values with your actual Firebase credentials
  // Get these from Firebase Console > Project Settings > Your apps
  firebase: {
    apiKey: "AIzaSyD_placeholder_replace_with_your_key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AUTH_CONFIG;
}

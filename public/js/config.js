// Authentication Configuration
// This file contains API keys and configuration for authentication providers

const AUTH_CONFIG = {
  // Facebook OAuth Configuration
  facebook: {
    appId: '1541137253706088',
    version: 'v18.0'
  },

  // Firebase Configuration (Optional - for future cloud sync)
  firebase: {
    // Add your Firebase config here when ready
    // apiKey: "...",
    // authDomain: "...",
    // projectId: "ai-detective-crime-scene",
    // etc.
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AUTH_CONFIG;
}

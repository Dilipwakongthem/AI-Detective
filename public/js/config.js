// Authentication Configuration
// This file contains API keys and configuration for authentication providers

const AUTH_CONFIG = {
  // Facebook OAuth Configuration
  facebook: {
    appId: '1541137253706088',
    version: 'v18.0'
  },

  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyBHO7eT_qpKS4H_Ws4igemFIKerdSAEkXs",
    authDomain: "ai-detective-crime-scene.firebaseapp.com",
    projectId: "ai-detective-crime-scene",
    storageBucket: "ai-detective-crime-scene.firebasestorage.app",
    messagingSenderId: "830519648794",
    appId: "1:830519648794:web:75ec848913c67b4819e7a3",
    measurementId: "G-3T0JLKNEWJ"
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AUTH_CONFIG;
}

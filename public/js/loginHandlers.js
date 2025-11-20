// loginHandlers.js
// Firebase-based login handlers for AI Detective Game
// This replaces localStorage authentication with Firebase Auth

// ============================================
// EMAIL AUTHENTICATION WITH FIREBASE
// ============================================

/**
 * Handle Email Signup with Firebase
 */
async function handleFirebaseEmailSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupPasswordConfirm').value;

  console.log('[Firebase Signup] Signup attempt for:', email);

  // Validation
  if (!email || !password) {
    showNotification('❌ Email and password are required!', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('❌ Password must be at least 6 characters!', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('❌ Passwords do not match!', 'error');
    return;
  }

  try {
    // Sign up with Firebase
    const result = await FirebaseAuth.signUpWithEmail(email, password, name || 'Detective');

    if (result.success) {
      console.log('[Firebase Signup] Account created successfully:', result.user);
      showNotification('✅ Account created successfully!', 'success');

      // Close modal and navigate
      closeEmailSignupModal();
      setTimeout(() => {
        console.log('[Firebase Signup] Redirecting to game...');
        navigateToGame();
      }, 1500);
    } else {
      console.error('[Firebase Signup] Signup failed:', result.error);
      showNotification(`❌ ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('[Firebase Signup] Unexpected error:', error);
    showNotification('❌ An unexpected error occurred. Please try again.', 'error');
  }
}

/**
 * Handle Email Login with Firebase
 */
async function handleFirebaseEmailLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  console.log('[Firebase Login] Login attempt for:', email);

  // Validation
  if (!email || !password) {
    showNotification('❌ Email and password are required!', 'error');
    return;
  }

  try {
    // Sign in with Firebase
    const result = await FirebaseAuth.signInWithEmail(email, password);

    if (result.success) {
      console.log('[Firebase Login] Login successful:', result.user);
      showNotification(`✅ Welcome back, ${result.user.displayName}!`, 'success');

      // Close modal and navigate
      closeEmailLoginModal();
      setTimeout(() => {
        console.log('[Firebase Login] Redirecting to game...');
        navigateToGame();
      }, 1500);
    } else {
      console.error('[Firebase Login] Login failed:', result.error);
      showNotification(`❌ ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('[Firebase Login] Unexpected error:', error);
    showNotification('❌ An unexpected error occurred. Please try again.', 'error');
  }
}

/**
 * Handle Facebook Login with Firebase
 */
async function handleFirebaseFacebookLogin() {
  console.log('[Firebase Facebook] Facebook login initiated');

  try {
    const result = await FirebaseAuth.signInWithFacebook();

    if (result.success) {
      console.log('[Firebase Facebook] Login successful:', result.user);
      showNotification(`✅ Welcome, ${result.user.displayName}!`, 'success');

      setTimeout(() => {
        console.log('[Firebase Facebook] Redirecting to game...');
        navigateToGame();
      }, 1500);
    } else {
      console.error('[Firebase Facebook] Login failed:', result.error);
      showNotification(`❌ ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('[Firebase Facebook] Unexpected error:', error);
    showNotification('❌ An unexpected error occurred. Please try again.', 'error');
  }
}

/**
 * Handle Google Login with Firebase
 */
async function handleFirebaseGoogleLogin() {
  console.log('[Firebase Google] Google login initiated');

  try {
    const result = await FirebaseAuth.signInWithGoogle();

    if (result.success) {
      console.log('[Firebase Google] Login successful:', result.user);
      showNotification(`✅ Welcome, ${result.user.displayName}!`, 'success');

      setTimeout(() => {
        console.log('[Firebase Google] Redirecting to game...');
        navigateToGame();
      }, 1500);
    } else {
      console.error('[Firebase Google] Login failed:', result.error);
      showNotification(`❌ ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('[Firebase Google] Unexpected error:', error);
    showNotification('❌ An unexpected error occurred. Please try again.', 'error');
  }
}

/**
 * Handle Password Reset
 */
async function handlePasswordReset() {
  const email = document.getElementById('loginEmail')?.value.trim().toLowerCase();

  if (!email) {
    showNotification('❌ Please enter your email address first.', 'error');
    return;
  }

  try {
    const result = await FirebaseAuth.resetPassword(email);

    if (result.success) {
      showNotification('✅ Password reset email sent! Check your inbox.', 'success');
    } else {
      showNotification(`❌ ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('[Firebase Reset] Error:', error);
    showNotification('❌ Failed to send reset email. Please try again.', 'error');
  }
}

/**
 * Handle Logout
 */
async function handleFirebaseLogout() {
  console.log('[Firebase Logout] Logging out user...');

  try {
    const result = await FirebaseAuth.signOut();

    if (result.success) {
      console.log('[Firebase Logout] Logout successful');
      showNotification('✅ Logged out successfully', 'success');

      // Redirect to login page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      console.error('[Firebase Logout] Logout failed:', result.error);
      showNotification('❌ Logout failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('[Firebase Logout] Unexpected error:', error);
    showNotification('❌ An unexpected error occurred.', 'error');
  }
}

// ============================================
// AUTH STATE MANAGEMENT
// ============================================

/**
 * Initialize Firebase Auth State Listener
 */
function initializeAuthStateListener() {
  console.log('[Firebase Auth] Initializing auth state listener...');

  FirebaseAuth.onAuthChange((user) => {
    if (user) {
      console.log('[Firebase Auth] User authenticated:', user.uid);

      // Cache user data in localStorage for offline access
      localStorage.setItem('currentUserId', user.uid);
      localStorage.setItem('currentUserEmail', user.email);
      localStorage.setItem('displayName', user.displayName || 'Detective');
      localStorage.setItem('userType', 'firebase');

      // If on login page, redirect to game
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        console.log('[Firebase Auth] User logged in, redirecting to game...');
        navigateToGame();
      }
    } else {
      console.log('[Firebase Auth] No user authenticated');

      // Clear localStorage
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('displayName');
      localStorage.removeItem('userType');

      // If on game page, redirect to login
      if (window.location.pathname.includes('game.html')) {
        console.log('[Firebase Auth] No user, redirecting to login...');
        window.location.href = 'index.html';
      }
    }
  });
}

/**
 * Check if user is authenticated
 */
function isUserAuthenticated() {
  const user = FirebaseAuth.getCurrentUser();
  return user !== null;
}

/**
 * Get current authenticated user
 */
function getAuthenticatedUser() {
  return FirebaseAuth.getCurrentUser();
}

// ============================================
// NAVIGATION HELPERS
// ============================================

/**
 * Navigate to game page
 */
function navigateToGame() {
  console.log('[Navigation] Navigating to game.html');
  window.location.href = 'game.html';
}

/**
 * Navigate to login page
 */
function navigateToLogin() {
  console.log('[Navigation] Navigating to index.html');
  window.location.href = 'index.html';
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize Firebase Authentication on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Firebase Handlers] Page loaded, initializing...');

  try {
    // Initialize Firebase
    FirebaseAuth.initialize();

    // Set up auth state listener
    initializeAuthStateListener();

    console.log('[Firebase Handlers] Initialization complete');
  } catch (error) {
    console.error('[Firebase Handlers] Initialization failed:', error);
    showNotification('❌ Failed to initialize authentication. Please refresh the page.', 'error');
  }
});

// ============================================
// EXPORTS
// ============================================

window.FirebaseHandlers = {
  // Email auth
  signUp: handleFirebaseEmailSignup,
  login: handleFirebaseEmailLogin,
  resetPassword: handlePasswordReset,

  // Social auth
  facebookLogin: handleFirebaseFacebookLogin,
  googleLogin: handleFirebaseGoogleLogin,

  // Session management
  logout: handleFirebaseLogout,
  isAuthenticated: isUserAuthenticated,
  getUser: getAuthenticatedUser,

  // Navigation
  navigateToGame,
  navigateToLogin
};

console.log('[Firebase Login Handlers] Loaded successfully');

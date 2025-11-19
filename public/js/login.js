// js/login.js

// ============================================
// EMAIL AUTHENTICATION - LOCAL STORAGE
// ============================================

/**
 * Handle Email Signup
 */
function handleEmailSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupPasswordConfirm').value;

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

  // Check if email already exists
  const users = getAllUsers();
  if (users[email]) {
    showNotification('❌ This email is already registered! Please login.', 'error');
    return;
  }

  // Create user account
  const userId = generateUserId();
  const userData = {
    userId: userId,
    email: email,
    password: hashPassword(password), // Simple hash (NOT secure, but works locally)
    displayName: name || 'Detective',
    userType: 'email',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  // Save user
  users[email] = userData;
  saveAllUsers(users);

  // Initialize game data
  initializeEmailUserGameData(userId, email, name);

  // Log user in
  loginUser(userData);

  console.log('Email account created:', email);
  showNotification('✅ Account created successfully!', 'success');

  // Close modal and navigate
  closeEmailSignupModal();
  setTimeout(() => {
    navigateToGame();
  }, 1000);
}

/**
 * Handle Email Login
 */
function handleEmailLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  // Validation
  if (!email || !password) {
    showNotification('❌ Email and password are required!', 'error');
    return;
  }

  // Get users
  const users = getAllUsers();
  const user = users[email];

  if (!user) {
    showNotification('❌ No account found with this email!', 'error');
    return;
  }

  // Check password
  if (user.password !== hashPassword(password)) {
    showNotification('❌ Incorrect password!', 'error');
    return;
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  users[email] = user;
  saveAllUsers(users);

  // Log user in
  loginUser(user);

  console.log('User logged in:', email);
  showNotification(`✅ Welcome back, ${user.displayName}!`, 'success');

  // Close modal and navigate
  closeEmailLoginModal();
  setTimeout(() => {
    navigateToGame();
  }, 1000);
}

/**
 * Log user in (save session)
 */
function loginUser(userData) {
  localStorage.setItem('currentUserId', userData.userId);
  localStorage.setItem('currentUserEmail', userData.email);
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('isGuestUser', 'false');
  localStorage.setItem('displayName', userData.displayName);
}

/**
 * Initialize game data for email user
 */
function initializeEmailUserGameData(userId, email, displayName) {
  const initialData = {
    userId: userId,
    userEmail: email,
    displayName: displayName || 'Detective',
    userType: 'email',
    rank: 'Detective',
    reputation: 0,
    casesSolved: 0,
    perfectCases: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyCasesRemaining: 5,
    bonusCasesRemaining: 3,
    caseFilesOwned: 0,
    hintTokensOwned: 0,
    createdAt: new Date().toISOString(),
    lastPlayed: new Date().toISOString()
  };

  // Save to localStorage
  Object.entries(initialData).forEach(([key, value]) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  console.log('Email user game data initialized');
}

/**
 * Get all users from localStorage
 */
function getAllUsers() {
  const usersJson = localStorage.getItem('allUsers');
  return usersJson ? JSON.parse(usersJson) : {};
}

/**
 * Save all users to localStorage
 */
function saveAllUsers(users) {
  localStorage.setItem('allUsers', JSON.stringify(users));
}

/**
 * Generate unique user ID
 */
function generateUserId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `user_${timestamp}_${random}`;
}

/**
 * Simple password hashing (NOT SECURE - only for local demo)
 * In production, use proper backend authentication
 */
function hashPassword(password) {
  // Simple hash for demo purposes only
  // DO NOT use in production without proper backend
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Handle Forgot Password
 */
function handleForgotPassword(event) {
  event.preventDefault();

  showNotification(
    '🔐 Password Recovery\n\n' +
    'Password recovery is not available in the local version.\n\n' +
    'To reset your password:\n' +
    '1. Contact support\n' +
    '2. Or create a new account\n\n' +
    'This feature will be available when using cloud authentication.',
    'info'
  );
}

// ============================================
// GUEST LOGIN - FULLY FUNCTIONAL
// ============================================

/**
 * Handle Guest Login
 */
function handleGuestLogin() {
  console.log('Guest login initiated');

  const existingGuestId = localStorage.getItem('guestUserId');

  if (existingGuestId) {
    console.log('Continuing as existing guest:', existingGuestId);
    showNotification('✅ Welcome back, Guest Detective!', 'success');
  } else {
    const guestId = generateGuestId();
    localStorage.setItem('guestUserId', guestId);
    localStorage.setItem('isGuestUser', 'true');
    localStorage.setItem('userType', 'guest');
    initializeGuestGameData(guestId);
    console.log('New guest user created:', guestId);
    showNotification('✅ Welcome, Guest Detective!', 'success');
  }

  setTimeout(() => {
    navigateToGame();
  }, 1000);
}

/**
 * Generate unique guest ID
 */
function generateGuestId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `guest_${timestamp}_${random}`;
}

/**
 * Initialize game data for guest user
 */
function initializeGuestGameData(guestId) {
  const initialData = {
    userId: guestId,
    userType: 'guest',
    rank: 'Detective',
    reputation: 0,
    casesSolved: 0,
    perfectCases: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyCasesRemaining: 5,
    bonusCasesRemaining: 3,
    caseFilesOwned: 0,
    hintTokensOwned: 0,
    createdAt: new Date().toISOString(),
    lastPlayed: new Date().toISOString()
  };

  Object.entries(initialData).forEach(([key, value]) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  console.log('Guest game data initialized');
}

/**
 * Navigate to main game
 */
function navigateToGame() {
  window.location.href = 'index.html';
}

// ============================================
// FACEBOOK LOGIN - FULLY FUNCTIONAL
// ============================================

/**
 * Handle Facebook Login
 */
function handleFacebookLogin() {
  console.log('Facebook login initiated');

  // Check if FB SDK is loaded
  if (typeof FB === 'undefined') {
    showNotification('⚠️ Facebook SDK not loaded yet. Please wait a moment and try again.', 'warning');
    return;
  }

  // Initiate Facebook Login
  FB.login(function(response) {
    if (response.authResponse) {
      console.log('Facebook login successful');
      console.log('Auth response:', response.authResponse);

      // Get user info from Facebook
      FB.api('/me', { fields: 'id,name,email' }, function(fbUser) {
        console.log('Facebook user data:', fbUser);

        // Create user data object
        const userData = {
          userId: `fb_${fbUser.id}`,
          email: fbUser.email || `${fbUser.id}@facebook.com`,
          displayName: fbUser.name,
          userType: 'facebook',
          facebookId: fbUser.id,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        // Check if user already exists
        const users = getAllUsers();
        const existingUser = users[userData.email];

        if (existingUser && existingUser.userType === 'facebook') {
          // Existing Facebook user - update last login
          existingUser.lastLogin = new Date().toISOString();
          users[userData.email] = existingUser;
          saveAllUsers(users);
          loginUser(existingUser);
          console.log('Existing Facebook user logged in:', userData.email);
          showNotification(`✅ Welcome back, ${fbUser.name}!`, 'success');
        } else if (existingUser && existingUser.userType !== 'facebook') {
          // Email already exists with different login method
          showNotification(`❌ This email is already registered with ${existingUser.userType} login.\nPlease use ${existingUser.userType} to sign in.`, 'error');
          return;
        } else {
          // New Facebook user - create account
          users[userData.email] = userData;
          saveAllUsers(users);
          loginUser(userData);
          initializeFacebookUserGameData(userData);
          console.log('New Facebook account created:', userData.email);
          showNotification(`✅ Welcome, ${fbUser.name}!`, 'success');
        }

        // Navigate to game
        setTimeout(() => {
          navigateToGame();
        }, 1000);
      });

    } else {
      console.log('Facebook login cancelled or failed');
      showNotification('ℹ️ Facebook login cancelled', 'info');
    }
  }, {
    scope: 'public_profile,email',
    return_scopes: true
  });
}

/**
 * Initialize game data for Facebook user
 */
function initializeFacebookUserGameData(userData) {
  const initialData = {
    userId: userData.userId,
    userEmail: userData.email,
    displayName: userData.displayName,
    userType: 'facebook',
    facebookId: userData.facebookId,
    rank: 'Detective',
    rankLevel: 1,
    reputation: 1500,
    casesSolved: 0,
    totalStars: 0,
    perfectCases: 0,
    wrongAccusations: 0,
    eliteRating: 0,
    currentStreak: 0,
    longestStreak: 0,
    legendaryCasesCompleted: 0,
    totalPlayTime: 0,
    dailyCasesRemaining: 5,
    bonusCasesRemaining: 3,
    caseFilesOwned: 0,
    hintTokensOwned: 0,
    createdAt: new Date().toISOString(),
    lastPlayed: new Date().toISOString()
  };

  // Save to localStorage
  Object.entries(initialData).forEach(([key, value]) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  console.log('Facebook user game data initialized');
}

// ============================================
// DUMMY BUTTONS - SHOW "COMING SOON"
// ============================================

/**
 * Handle dummy button clicks (Google, etc.)
 */
function handleDummyButton(buttonType) {
  let message = '';

  switch(buttonType) {
    case 'google':
      message = '🔵 Google Login coming soon!\n\nWe\'re integrating Google authentication.\nFor now, please use Email, Facebook, or Guest Login.';
      break;
    default:
      message = 'This feature is coming soon!';
  }

  showNotification(message, 'info');
}

// ============================================
// MODAL FUNCTIONS
// ============================================

/**
 * Open Email Login Modal
 */
function openEmailLoginModal() {
  document.getElementById('emailLoginModal').style.display = 'flex';
  document.getElementById('loginEmail').focus();
}

/**
 * Close Email Login Modal
 */
function closeEmailLoginModal() {
  document.getElementById('emailLoginModal').style.display = 'none';
  document.getElementById('loginForm').reset();
}

/**
 * Open Email Signup Modal
 */
function openEmailSignupModal() {
  document.getElementById('emailSignupModal').style.display = 'flex';
  document.getElementById('signupName').focus();
}

/**
 * Close Email Signup Modal
 */
function closeEmailSignupModal() {
  document.getElementById('emailSignupModal').style.display = 'none';
  document.getElementById('signupForm').reset();
}

/**
 * Switch from Login to Signup
 */
function switchToSignup(event) {
  event.preventDefault();
  closeEmailLoginModal();
  setTimeout(() => {
    openEmailSignupModal();
  }, 300);
}

/**
 * Switch from Signup to Login
 */
function switchToLogin(event) {
  event.preventDefault();
  closeEmailSignupModal();
  setTimeout(() => {
    openEmailLoginModal();
  }, 300);
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const container = document.getElementById('notificationContainer');

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 4000);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Login page loaded');

  // Guest Login Button - FUNCTIONAL
  const guestBtn = document.getElementById('guestLoginBtn');
  if (guestBtn) {
    guestBtn.addEventListener('click', handleGuestLogin);
  }

  // Email Login Button - FUNCTIONAL
  const emailBtn = document.getElementById('emailLoginBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', openEmailLoginModal);
  }

  // Show Signup Button
  const showSignupBtn = document.getElementById('showSignupBtn');
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openEmailSignupModal();
    });
  }

  // Facebook Login Button - FUNCTIONAL
  const facebookBtn = document.getElementById('facebookLoginBtn');
  if (facebookBtn) {
    facebookBtn.addEventListener('click', handleFacebookLogin);
  }

  // Google Login Button - DUMMY
  const googleBtn = document.getElementById('googleLoginBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => handleDummyButton('google'));
  }

  // Check if already logged in
  checkExistingSession();

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEmailLoginModal();
      closeEmailSignupModal();
    }
  });
});

/**
 * Check for existing session
 */
function checkExistingSession() {
  const guestId = localStorage.getItem('guestUserId');
  const isGuest = localStorage.getItem('isGuestUser') === 'true';
  const userEmail = localStorage.getItem('currentUserEmail');

  if (guestId && isGuest) {
    console.log('Existing guest session found');
    const guestBtn = document.getElementById('guestLoginBtn');
    if (guestBtn) {
      const label = guestBtn.querySelector('.btn-label');
      const sublabel = guestBtn.querySelector('.btn-sublabel');
      if (label) label.textContent = 'CONTINUE AS GUEST';
      if (sublabel) sublabel.textContent = 'Resume your investigation';
    }
  } else if (userEmail) {
    console.log('Existing email session found:', userEmail);
    // Auto-redirect disabled - user can manually click to continue
    // showNotification('🔍 Session found! Redirecting to game...', 'info');
    // setTimeout(() => {
    //   navigateToGame();
    // }, 1500);
  }
}

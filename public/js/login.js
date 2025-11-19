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

  console.log('[EMAIL SIGNUP] Signup attempt for:', email);

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
    password: hashPassword(password),
    displayName: name || 'Detective',
    userType: 'email',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  console.log('[EMAIL SIGNUP] Creating account:', email);

  // Save user
  users[email] = userData;
  saveAllUsers(users);

  // Initialize game data
  initializeEmailUserGameData(userId, email, name);

  // Log user in
  loginUser(userData);

  console.log('[EMAIL SIGNUP] Account created, verifying localStorage:', {
    currentUserId: localStorage.getItem('currentUserId'),
    currentUserEmail: localStorage.getItem('currentUserEmail'),
    userType: localStorage.getItem('userType')
  });

  showNotification('✅ Account created successfully!', 'success');

  // Close modal and navigate
  closeEmailSignupModal();
  console.log('[EMAIL SIGNUP] Navigating to game in 1.5 seconds...');
  setTimeout(() => {
    console.log('[EMAIL SIGNUP] Redirecting to game.html NOW');
    navigateToGame();
  }, 1500);
}

/**
 * Handle Email Login
 */
function handleEmailLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  console.log('[EMAIL LOGIN] Login attempt for:', email);

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

  console.log('[EMAIL LOGIN] Login successful for:', email);

  // Update last login
  user.lastLogin = new Date().toISOString();
  users[email] = user;
  saveAllUsers(users);

  // Log user in
  loginUser(user);

  console.log('[EMAIL LOGIN] User logged in, verifying localStorage:', {
    currentUserId: localStorage.getItem('currentUserId'),
    currentUserEmail: localStorage.getItem('currentUserEmail'),
    userType: localStorage.getItem('userType')
  });

  showNotification(`✅ Welcome back, ${user.displayName}!`, 'success');

  // Close modal and navigate
  closeEmailLoginModal();
  console.log('[EMAIL LOGIN] Navigating to game in 1.5 seconds...');
  setTimeout(() => {
    console.log('[EMAIL LOGIN] Redirecting to game.html NOW');
    navigateToGame();
  }, 1500);
}

/**
 * Log user in (save session)
 */
function loginUser(userData) {
  // Clear any conflicting guest session data first
  localStorage.removeItem('guestUserId');
  localStorage.removeItem('isGuestUser');

  localStorage.setItem('currentUserId', userData.userId);
  localStorage.setItem('currentUserEmail', userData.email);
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('displayName', userData.displayName);

  // Store Facebook ID if present
  if (userData.facebookId) {
    localStorage.setItem('facebookId', userData.facebookId);
  }
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
  console.log('[GUEST LOGIN] Guest login initiated');

  // Clear any conflicting session data first
  console.log('[GUEST LOGIN] Clearing conflicting session data...');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('currentUserEmail');
  localStorage.removeItem('facebookId');

  const existingGuestId = localStorage.getItem('guestUserId');

  if (existingGuestId) {
    console.log('[GUEST LOGIN] Continuing as existing guest:', existingGuestId);
    // Ensure userType is set
    localStorage.setItem('userType', 'guest');
    localStorage.setItem('isGuestUser', 'true');
    showNotification('✅ Welcome back, Guest Detective!', 'success');
  } else {
    const guestId = generateGuestId();
    console.log('[GUEST LOGIN] Creating new guest:', guestId);
    localStorage.setItem('guestUserId', guestId);
    localStorage.setItem('isGuestUser', 'true');
    localStorage.setItem('userType', 'guest');
    initializeGuestGameData(guestId);
    console.log('[GUEST LOGIN] New guest user created:', guestId);
    showNotification('✅ Welcome, Guest Detective!', 'success');
  }

  // Verify data was set
  console.log('[GUEST LOGIN] Verifying localStorage:', {
    guestUserId: localStorage.getItem('guestUserId'),
    userType: localStorage.getItem('userType'),
    isGuestUser: localStorage.getItem('isGuestUser')
  });

  // Navigate to game with longer delay
  console.log('[GUEST LOGIN] Navigating to game in 1.5 seconds...');
  setTimeout(() => {
    console.log('[GUEST LOGIN] Redirecting to game.html NOW');
    navigateToGame();
  }, 1500);
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
    isGuestUser: 'true',
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

  Object.entries(initialData).forEach(([key, value]) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  console.log('Guest game data initialized');
}

/**
 * Navigate to main game
 */
function navigateToGame() {
  window.location.href = 'game.html';
}

// ============================================
// FACEBOOK LOGIN - FULLY FUNCTIONAL
// ============================================

/**
 * Handle Facebook Login
 */
function handleFacebookLogin() {
  console.log('[FACEBOOK LOGIN] Facebook login initiated');

  // Check if FB SDK is loaded
  if (typeof FB === 'undefined') {
    console.error('[FACEBOOK LOGIN] Facebook SDK not loaded!');
    showNotification('⚠️ Facebook SDK not loaded yet. Please wait a moment and try again.', 'warning');
    return;
  }

  // HTTPS Requirement Check
  if (window.location.protocol !== 'https:') {
    console.error('[FACEBOOK LOGIN] Facebook requires HTTPS, current protocol:', window.location.protocol);
    showNotification('⚠️ Facebook Login requires HTTPS.\n\nFor localhost testing:\n1. Use ngrok: ngrok http 1234\n2. Or use localtunnel: lt --port 1234\n3. Add the HTTPS URL to Facebook app settings\n\nSee FACEBOOK_LOCALHOST_FIX.md for details.', 'error');
    return;
  }

  console.log('[FACEBOOK LOGIN] Starting Facebook OAuth flow...');

  // Initiate Facebook Login
  FB.login(function(response) {
    console.log('[FACEBOOK LOGIN] FB.login response:', response);

    if (response.authResponse) {
      console.log('[FACEBOOK LOGIN] Facebook login successful');
      console.log('[FACEBOOK LOGIN] Auth response:', response.authResponse);

      // Get user info from Facebook
      FB.api('/me', { fields: 'id,name,email' }, function(fbUser) {
        console.log('[FACEBOOK LOGIN] Facebook user data:', fbUser);

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

        console.log('[FACEBOOK LOGIN] Created user data:', userData);

        // Check if user already exists
        const users = getAllUsers();
        const existingUser = users[userData.email];

        if (existingUser && existingUser.userType === 'facebook') {
          console.log('[FACEBOOK LOGIN] Existing Facebook user found');
          // Existing Facebook user - update last login
          existingUser.lastLogin = new Date().toISOString();
          users[userData.email] = existingUser;
          saveAllUsers(users);
          loginUser(existingUser);
          console.log('[FACEBOOK LOGIN] Existing Facebook user logged in:', userData.email);
          showNotification(`✅ Welcome back, ${fbUser.name}!`, 'success');
        } else if (existingUser && existingUser.userType !== 'facebook') {
          console.log('[FACEBOOK LOGIN] Email already exists with different login method');
          // Email already exists with different login method
          showNotification(`❌ This email is already registered with ${existingUser.userType} login.\nPlease use ${existingUser.userType} to sign in.`, 'error');
          return;
        } else {
          console.log('[FACEBOOK LOGIN] New Facebook user - creating account');
          // New Facebook user - create account
          users[userData.email] = userData;
          saveAllUsers(users);
          loginUser(userData);
          initializeFacebookUserGameData(userData);
          console.log('[FACEBOOK LOGIN] New Facebook account created:', userData.email);
          showNotification(`✅ Welcome, ${fbUser.name}!`, 'success');
        }

        // Verify data was set
        console.log('[FACEBOOK LOGIN] Verifying localStorage:', {
          currentUserId: localStorage.getItem('currentUserId'),
          currentUserEmail: localStorage.getItem('currentUserEmail'),
          userType: localStorage.getItem('userType'),
          facebookId: localStorage.getItem('facebookId')
        });

        // Navigate to game
        console.log('[FACEBOOK LOGIN] Navigating to game in 1.5 seconds...');
        setTimeout(() => {
          console.log('[FACEBOOK LOGIN] Redirecting to game.html NOW');
          navigateToGame();
        }, 1500);
      });

    } else {
      console.log('[FACEBOOK LOGIN] Facebook login cancelled or failed');
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
  console.log('[INIT] Login page loaded - Attaching event listeners...');

  // Guest Login Button - FUNCTIONAL
  const guestBtn = document.getElementById('guestLoginBtn');
  console.log('[INIT] Guest button found:', !!guestBtn);
  if (guestBtn) {
    guestBtn.addEventListener('click', function(e) {
      console.log('[CLICK] Guest button clicked!');
      e.preventDefault();
      e.stopPropagation();
      handleGuestLogin();
    });
    console.log('[INIT] Guest button listener attached');
  } else {
    console.error('[INIT] Guest button NOT found!');
  }

  // Email Login Button - FUNCTIONAL
  const emailBtn = document.getElementById('emailLoginBtn');
  console.log('[INIT] Email button found:', !!emailBtn);
  if (emailBtn) {
    emailBtn.addEventListener('click', function(e) {
      console.log('[CLICK] Email button clicked!');
      e.preventDefault();
      e.stopPropagation();
      openEmailLoginModal();
    });
    console.log('[INIT] Email button listener attached');
  } else {
    console.error('[INIT] Email button NOT found!');
  }

  // Show Signup Button
  const showSignupBtn = document.getElementById('showSignupBtn');
  console.log('[INIT] Signup link found:', !!showSignupBtn);
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      console.log('[CLICK] Signup link clicked!');
      e.preventDefault();
      openEmailSignupModal();
    });
    console.log('[INIT] Signup link listener attached');
  }

  // Facebook Login Button - FUNCTIONAL
  const facebookBtn = document.getElementById('facebookLoginBtn');
  console.log('[INIT] Facebook button found:', !!facebookBtn);
  if (facebookBtn) {
    facebookBtn.addEventListener('click', function(e) {
      console.log('[CLICK] Facebook button clicked!');
      e.preventDefault();
      e.stopPropagation();
      handleFacebookLogin();
    });
    console.log('[INIT] Facebook button listener attached');
  } else {
    console.error('[INIT] Facebook button NOT found!');
  }

  // Google Login Button - DUMMY
  const googleBtn = document.getElementById('googleLoginBtn');
  console.log('[INIT] Google button found:', !!googleBtn);
  if (googleBtn) {
    googleBtn.addEventListener('click', function(e) {
      console.log('[CLICK] Google button clicked!');
      e.preventDefault();
      e.stopPropagation();
      handleDummyButton('google');
    });
    console.log('[INIT] Google button listener attached');
  }

  // Check if already logged in
  console.log('[INIT] Checking for existing session...');
  checkExistingSession();

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEmailLoginModal();
      closeEmailSignupModal();
    }
  });

  console.log('[INIT] All event listeners attached successfully!');
});

/**
 * Check for existing session
 */
function checkExistingSession() {
  const guestId = localStorage.getItem('guestUserId');
  const isGuest = localStorage.getItem('isGuestUser') === 'true';
  const userEmail = localStorage.getItem('currentUserEmail');
  const userType = localStorage.getItem('userType');

  console.log('[SESSION CHECK] Current session state:', {
    userType,
    guestId: !!guestId,
    isGuest,
    userEmail: !!userEmail
  });

  // Check for conflicting session data
  if (guestId && userEmail) {
    console.warn('[SESSION CHECK] ⚠️ Conflicting session data detected! Guest and Email data both present.');
    console.warn('[SESSION CHECK] Please click your preferred login method to clear conflicts.');
  }

  if (guestId && isGuest && userType === 'guest') {
    console.log('[SESSION CHECK] ✓ Valid guest session found');
    const guestBtn = document.getElementById('guestLoginBtn');
    if (guestBtn) {
      const label = guestBtn.querySelector('.btn-label');
      const sublabel = guestBtn.querySelector('.btn-sublabel');
      if (label) label.textContent = 'CONTINUE AS GUEST';
      if (sublabel) sublabel.textContent = 'Resume your investigation';
    }
  } else if (userEmail && (userType === 'email' || userType === 'facebook')) {
    console.log('[SESSION CHECK] ✓ Valid user session found:', userType);
    // Auto-redirect disabled - user can manually click to continue
    // showNotification('🔍 Session found! Redirecting to game...', 'info');
    // setTimeout(() => {
    //   navigateToGame();
    // }, 1500);
  } else if (userType) {
    console.warn('[SESSION CHECK] ⚠️ userType exists but session data incomplete:', userType);
  } else {
    console.log('[SESSION CHECK] No existing session');
  }
}

// firebaseAuth.js
// Firebase Authentication Module for AI Detective Game

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  FacebookAuthProvider,
  signInWithPopup,
  GoogleAuthProvider
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ============================================
// FIREBASE INITIALIZATION
// ============================================

let app;
let auth;
let db;
let isFirebaseInitialized = false;

/**
 * Initialize Firebase with config from AUTH_CONFIG
 */
function initializeFirebase() {
  if (isFirebaseInitialized) {
    console.log('[Firebase] Already initialized');
    return { auth, db };
  }

  try {
    // Get config from global AUTH_CONFIG
    if (typeof AUTH_CONFIG === 'undefined' || !AUTH_CONFIG.firebase) {
      console.error('[Firebase] AUTH_CONFIG not found or firebase config missing');
      throw new Error('Firebase configuration not found');
    }

    const firebaseConfig = AUTH_CONFIG.firebase;

    console.log('[Firebase] Initializing with project:', firebaseConfig.projectId);

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    isFirebaseInitialized = true;
    console.log('[Firebase] Successfully initialized');

    return { auth, db };
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    throw error;
  }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Sign up with email and password
 */
async function signUpWithEmail(email, password, displayName) {
  try {
    console.log('[Firebase Auth] Signing up:', email);

    const { auth, db } = initializeFirebase();

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName || 'Detective'
    });

    console.log('[Firebase Auth] User created:', user.uid);

    // Initialize user data in Firestore
    await initializeUserData(user.uid, email, displayName || 'Detective');

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || 'Detective'
      }
    };
  } catch (error) {
    console.error('[Firebase Auth] Signup error:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error)
    };
  }
}

/**
 * Sign in with email and password
 */
async function signInWithEmail(email, password) {
  try {
    console.log('[Firebase Auth] Signing in:', email);

    const { auth, db } = initializeFirebase();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('[Firebase Auth] User signed in:', user.uid);

    // Update last login in Firestore
    await updateLastLogin(user.uid);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Detective'
      }
    };
  } catch (error) {
    console.error('[Firebase Auth] Sign in error:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error)
    };
  }
}

/**
 * Sign in with Facebook
 */
async function signInWithFacebook() {
  try {
    console.log('[Firebase Auth] Facebook sign in initiated');

    const { auth, db } = initializeFirebase();

    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('[Firebase Auth] Facebook user signed in:', user.uid);

    // Check if this is a new user
    const userDoc = await getDoc(doc(db, 'players', user.uid));

    if (!userDoc.exists()) {
      // Initialize new user data
      await initializeUserData(user.uid, user.email, user.displayName || 'Detective');
    } else {
      // Update last login
      await updateLastLogin(user.uid);
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Detective',
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('[Firebase Auth] Facebook sign in error:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error)
    };
  }
}

/**
 * Sign in with Google
 */
async function signInWithGoogle() {
  try {
    console.log('[Firebase Auth] Google sign in initiated');

    const { auth, db } = initializeFirebase();

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('[Firebase Auth] Google user signed in:', user.uid);

    // Check if this is a new user
    const userDoc = await getDoc(doc(db, 'players', user.uid));

    if (!userDoc.exists()) {
      // Initialize new user data
      await initializeUserData(user.uid, user.email, user.displayName || 'Detective');
    } else {
      // Update last login
      await updateLastLogin(user.uid);
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Detective',
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('[Firebase Auth] Google sign in error:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error)
    };
  }
}

/**
 * Sign out current user
 */
async function signOutUser() {
  try {
    const { auth } = initializeFirebase();
    await signOut(auth);

    // Clear localStorage
    localStorage.clear();

    console.log('[Firebase Auth] User signed out');
    return { success: true };
  } catch (error) {
    console.error('[Firebase Auth] Sign out error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send password reset email
 */
async function resetPassword(email) {
  try {
    const { auth } = initializeFirebase();
    await sendPasswordResetEmail(auth, email);

    console.log('[Firebase Auth] Password reset email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('[Firebase Auth] Password reset error:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error)
    };
  }
}

/**
 * Listen to auth state changes
 */
function onAuthChange(callback) {
  const { auth } = initializeFirebase();
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('[Firebase Auth] User state changed:', user.uid);
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
      console.log('[Firebase Auth] User signed out');
      callback(null);
    }
  });
}

/**
 * Get current user
 */
function getCurrentUser() {
  const { auth } = initializeFirebase();
  const user = auth.currentUser;

  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  }

  return null;
}

// ============================================
// FIRESTORE FUNCTIONS
// ============================================

/**
 * Initialize user data in Firestore
 */
async function initializeUserData(userId, email, displayName) {
  try {
    const { db } = initializeFirebase();

    const initialData = {
      userId: userId,
      email: email,
      displayName: displayName,
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
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    await setDoc(doc(db, 'players', userId), initialData);

    console.log('[Firestore] User data initialized for:', userId);

    // Also cache in localStorage for offline access
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('userType', 'firebase');

    return { success: true };
  } catch (error) {
    console.error('[Firestore] Error initializing user data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update last login timestamp
 */
async function updateLastLogin(userId) {
  try {
    const { db } = initializeFirebase();

    await updateDoc(doc(db, 'players', userId), {
      lastLogin: serverTimestamp()
    });

    console.log('[Firestore] Last login updated for:', userId);
  } catch (error) {
    console.error('[Firestore] Error updating last login:', error);
  }
}

/**
 * Get user data from Firestore
 */
async function getUserData(userId) {
  try {
    const { db } = initializeFirebase();

    const docSnap = await getDoc(doc(db, 'players', userId));

    if (docSnap.exists()) {
      console.log('[Firestore] User data retrieved for:', userId);
      return {
        success: true,
        data: docSnap.data()
      };
    } else {
      console.warn('[Firestore] No data found for user:', userId);
      return {
        success: false,
        error: 'User data not found'
      };
    }
  } catch (error) {
    console.error('[Firestore] Error getting user data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update user data in Firestore
 */
async function updateUserData(userId, data) {
  try {
    const { db } = initializeFirebase();

    await updateDoc(doc(db, 'players', userId), data);

    console.log('[Firestore] User data updated for:', userId);
    return { success: true };
  } catch (error) {
    console.error('[Firestore] Error updating user data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get user-friendly error messages
 */
function getFirebaseErrorMessage(error) {
  const errorCode = error.code;

  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign in cancelled.',
    'auth/cancelled-popup-request': 'Sign in cancelled.'
  };

  return errorMessages[errorCode] || error.message || 'An error occurred. Please try again.';
}

// ============================================
// EXPORTS
// ============================================

window.FirebaseAuth = {
  // Initialization
  initialize: initializeFirebase,

  // Authentication
  signUpWithEmail,
  signInWithEmail,
  signInWithFacebook,
  signInWithGoogle,
  signOut: signOutUser,
  resetPassword,
  onAuthChange,
  getCurrentUser,

  // Firestore
  getUserData,
  updateUserData,
  initializeUserData
};

console.log('[Firebase Auth Module] Loaded successfully');

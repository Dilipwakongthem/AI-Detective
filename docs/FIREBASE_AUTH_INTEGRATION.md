# Firebase Authentication Integration Guide

This guide explains how to integrate Firebase Authentication into your AI Detective game, replacing the localStorage-based authentication system.

---

## Overview

Firebase Authentication provides:
- ✅ Secure email/password authentication
- ✅ Social login (Facebook, Google)
- ✅ Password reset functionality
- ✅ Session management
- ✅ Cloud-synced user data via Firestore

---

## Step 1: Configure Firebase Credentials

### Option A: Update config.js (Simple)

1. Open `public/js/config.js`
2. Replace the Firebase placeholder values with your actual credentials from Firebase Console:

```javascript
firebase: {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
}
```

### Option B: Use Environment Variables (Production)

1. Update `.env` file with your Firebase credentials
2. Use a build tool (like Webpack/Vite) to inject environment variables into config.js

---

## Step 2: Enable Authentication Methods in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable the following providers:

### Email/Password
- Click on "Email/Password"
- Toggle "Enable"
- Click "Save"

### Facebook (Optional)
- Click on "Facebook"
- Toggle "Enable"
- Enter your Facebook App ID and App Secret
- Copy the OAuth redirect URI and add it to your Facebook App settings

### Google (Optional)
- Click on "Google"
- Toggle "Enable"
- Select support email
- Click "Save"

---

## Step 3: Update HTML Files

### A. Update `public/index.html` (Login Page)

Add the Firebase scripts **before** your other scripts:

```html
<!-- Firebase CDN (Add before closing </body> tag) -->
<script type="module" src="js/config.js"></script>
<script type="module" src="js/firebaseAuth.js"></script>
<script type="module" src="js/loginHandlers.js"></script>

<!-- Keep existing login.js for fallback or remove if fully migrating -->
<!-- <script src="js/login.js"></script> -->
```

Update your button event handlers to use Firebase:

```html
<!-- Email Signup Button -->
<button onclick="FirebaseHandlers.signUp(event)">Sign Up</button>

<!-- Email Login Button -->
<button onclick="FirebaseHandlers.login(event)">Login</button>

<!-- Facebook Login Button -->
<button onclick="FirebaseHandlers.facebookLogin()">
  Continue with Facebook
</button>

<!-- Google Login Button -->
<button onclick="FirebaseHandlers.googleLogin()">
  Continue with Google
</button>

<!-- Password Reset Link -->
<a href="#" onclick="FirebaseHandlers.resetPassword()">Forgot Password?</a>
```

### B. Update `public/game.html` (Game Page)

Add Firebase scripts for session management:

```html
<!-- Firebase CDN (Add before closing </body> tag) -->
<script type="module" src="js/config.js"></script>
<script type="module" src="js/firebaseAuth.js"></script>
<script type="module" src="js/loginHandlers.js"></script>

<!-- Your game scripts -->
<script src="../src/index.jsx" type="module"></script>
```

Update logout button:

```html
<button onclick="FirebaseHandlers.logout()">Logout</button>
```

---

## Step 4: Configure Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Player profiles - users can only read/write their own data
    match /players/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Cases - users can only access their own cases
    match /cases/{userId}/cases/{caseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Leaderboard - read-only for authenticated users
    match /leaderboard/{entry} {
      allow read: if request.auth != null;
      allow write: if false; // Server-side only
    }
  }
}
```

Click **Publish** to save the rules.

---

## Step 5: Test Authentication Flow

### Test Email/Password Signup
1. Open `index.html` in your browser
2. Click "Sign Up"
3. Enter email, password, and name
4. Click "Create Account"
5. Verify you're redirected to `game.html`
6. Check Firebase Console → Authentication to see the new user

### Test Email/Password Login
1. Go back to `index.html`
2. Click "Login"
3. Enter your credentials
4. Verify successful login

### Test Social Login (if enabled)
1. Click "Continue with Facebook" or "Continue with Google"
2. Complete the OAuth flow
3. Verify user is created in Firebase Console

### Test Password Reset
1. On login page, click "Forgot Password?"
2. Enter your email
3. Check your inbox for reset email
4. Follow the link to reset password

### Test Logout
1. In game, click "Logout" button
2. Verify you're redirected to login page
3. Verify session is cleared

---

## Step 6: Migrate Existing Users (Optional)

If you have existing users with localStorage authentication:

### Create Migration Script

```javascript
// migrationScript.js
async function migrateLocalStorageUsers() {
  const users = getAllUsers(); // Your existing function

  for (const [email, userData] of Object.entries(users)) {
    try {
      // Create Firebase user
      const result = await FirebaseAuth.signUpWithEmail(
        email,
        'TEMP_PASSWORD_' + Math.random(), // Generate temp password
        userData.displayName
      );

      if (result.success) {
        // Migrate user data to Firestore
        await FirebaseAuth.updateUserData(result.user.uid, {
          rank: userData.rank,
          reputation: userData.reputation,
          casesSolved: userData.casesSolved,
          // ... other fields
        });

        console.log(`Migrated user: ${email}`);

        // Send password reset email so user can set new password
        await FirebaseAuth.resetPassword(email);
      }
    } catch (error) {
      console.error(`Failed to migrate ${email}:`, error);
    }
  }

  console.log('Migration complete!');
}
```

**Note:** Run this migration script once, then disable it.

---

## Step 7: Update Game Data Storage

### Replace localStorage with Firestore

Update your game save/load functions:

```javascript
// OLD: Save to localStorage
function saveGameData(data) {
  localStorage.setItem('gameData', JSON.stringify(data));
}

// NEW: Save to Firestore
async function saveGameData(data) {
  const user = FirebaseAuth.getCurrentUser();
  if (user) {
    await FirebaseAuth.updateUserData(user.uid, data);
  }
}

// OLD: Load from localStorage
function loadGameData() {
  return JSON.parse(localStorage.getItem('gameData'));
}

// NEW: Load from Firestore
async function loadGameData() {
  const user = FirebaseAuth.getCurrentUser();
  if (user) {
    const result = await FirebaseAuth.getUserData(user.uid);
    return result.success ? result.data : null;
  }
  return null;
}
```

---

## API Reference

### FirebaseAuth Module

#### Authentication Methods

```javascript
// Sign up with email/password
await FirebaseAuth.signUpWithEmail(email, password, displayName)
// Returns: { success: boolean, user: {...} | error: string }

// Sign in with email/password
await FirebaseAuth.signInWithEmail(email, password)
// Returns: { success: boolean, user: {...} | error: string }

// Sign in with Facebook
await FirebaseAuth.signInWithFacebook()
// Returns: { success: boolean, user: {...} | error: string }

// Sign in with Google
await FirebaseAuth.signInWithGoogle()
// Returns: { success: boolean, user: {...} | error: string }

// Sign out
await FirebaseAuth.signOut()
// Returns: { success: boolean, error?: string }

// Reset password
await FirebaseAuth.resetPassword(email)
// Returns: { success: boolean, error?: string }

// Get current user
const user = FirebaseAuth.getCurrentUser()
// Returns: { uid, email, displayName, photoURL } | null

// Listen to auth state changes
FirebaseAuth.onAuthChange((user) => {
  if (user) {
    console.log('User logged in:', user);
  } else {
    console.log('User logged out');
  }
});
```

#### Firestore Methods

```javascript
// Get user data from Firestore
await FirebaseAuth.getUserData(userId)
// Returns: { success: boolean, data: {...} | error: string }

// Update user data in Firestore
await FirebaseAuth.updateUserData(userId, { reputation: 2000, rank: 'Lieutenant' })
// Returns: { success: boolean, error?: string }

// Initialize new user data
await FirebaseAuth.initializeUserData(userId, email, displayName)
// Returns: { success: boolean, error?: string }
```

### FirebaseHandlers Module

```javascript
// Email signup
FirebaseHandlers.signUp(event)

// Email login
FirebaseHandlers.login(event)

// Facebook login
FirebaseHandlers.facebookLogin()

// Google login
FirebaseHandlers.googleLogin()

// Logout
FirebaseHandlers.logout()

// Password reset
FirebaseHandlers.resetPassword()

// Check if authenticated
const isAuth = FirebaseHandlers.isAuthenticated()

// Get current user
const user = FirebaseHandlers.getUser()
```

---

## Troubleshooting

### Issue: "Firebase not initialized"

**Solution:** Ensure `config.js` is loaded before `firebaseAuth.js`

### Issue: "Failed to sign in with Facebook"

**Solution:**
1. Verify Facebook App ID is correct in config.js
2. Check OAuth redirect URI in Facebook App settings
3. Ensure Facebook provider is enabled in Firebase Console

### Issue: "Permission denied" in Firestore

**Solution:** Check Firestore security rules allow user to access their own data

### Issue: "User not redirected after login"

**Solution:**
1. Check browser console for JavaScript errors
2. Verify `navigateToGame()` function is defined
3. Ensure `game.html` exists in the correct path

### Issue: "Module not found"

**Solution:** Use `type="module"` in script tags:
```html
<script type="module" src="js/firebaseAuth.js"></script>
```

---

## Security Best Practices

1. **Never commit credentials to Git**
   - Keep `.env` in `.gitignore`
   - Use placeholder values in `config.js` for version control

2. **Use HTTPS in production**
   - Firebase requires HTTPS for authentication
   - Use Firebase Hosting or another HTTPS-enabled host

3. **Implement Firestore security rules**
   - Never use test mode in production
   - Restrict read/write access to authenticated users only

4. **Enable email verification (optional)**
   ```javascript
   // After signup
   await user.sendEmailVerification();
   ```

5. **Set up App Check** (prevents API abuse)
   - Firebase Console → App Check
   - Enable reCAPTCHA for web apps

---

## Testing Checklist

- [ ] Email signup creates user in Firebase
- [ ] Email login works with correct credentials
- [ ] Email login fails with incorrect credentials
- [ ] Facebook login authenticates successfully
- [ ] Google login authenticates successfully
- [ ] Password reset email is sent
- [ ] Logout clears session and redirects
- [ ] User data is saved to Firestore
- [ ] User data persists across sessions
- [ ] Unauthorized users cannot access game page
- [ ] Authenticated users are redirected from login page

---

## Next Steps

After Firebase Auth is working:

1. **Add email verification** for new signups
2. **Implement profile updates** (change name, avatar)
3. **Add social features** (friends, leaderboards)
4. **Set up Cloud Functions** for server-side logic
5. **Enable Analytics** to track user behavior
6. **Add crash reporting** with Firebase Crashlytics

---

## Support

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com)

---

**Authentication setup complete!** 🔒 Your game now has secure, cloud-based authentication.

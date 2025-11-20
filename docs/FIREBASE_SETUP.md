# Firebase Setup Guide for AI Detective

This guide will walk you through setting up Firebase for the AI Detective game to enable authentication, database storage, and hosting.

---

## Prerequisites

- Node.js and npm installed
- AI Detective project cloned locally
- Google account for Firebase Console access

---

## Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `ai-detective-game`
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

---

## Step 2: Register Web App

1. In Firebase Console, click the **Web icon** (`</>`)
2. Enter app nickname: `AI Detective Web`
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. **Save the configuration object** (you'll need this later)

```javascript
// Example config (yours will be different)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

---

## Step 3: Install Firebase SDK

In your project directory:

```bash
npm install firebase
```

---

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Navigate to **Sign-in method** tab
4. Enable the following methods:
   - **Email/Password** - For player accounts
   - **Anonymous** - For guest players (optional)
   - **Google** - For social login (optional)
5. Click "Save"

---

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (we'll update rules later)
4. Choose your server location (closest to target users)
5. Click "Enable"

---

## Step 6: Configure Security Rules

### Firestore Rules

Go to **Firestore Database → Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Player profiles - users can only read/write their own
    match /players/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Case archives - users can only access their own cases
    match /cases/{userId}/{caseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Leaderboard - read-only for all authenticated users
    match /leaderboard/{entry} {
      allow read: if request.auth != null;
      allow write: if false; // Only server-side updates
    }
  }
}
```

### Storage Rules (if using Firebase Storage)

Go to **Storage → Rules** and use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /player-avatars/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Step 7: Initialize Firebase in Project

Create `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Paste your config from Step 2 here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## Step 8: Set Up Firebase Hosting (Optional)

Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

Login to Firebase:

```bash
firebase login
```

Initialize hosting:

```bash
firebase init hosting
```

Select:
- Use existing project: `ai-detective-game`
- Public directory: `dist` (Parcel build output)
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**

---

## Step 9: Create Environment Variables

Create `.env` file in project root (add to `.gitignore`):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

---

## Step 10: Verify Setup

Test Firebase connection in your app:

```javascript
import { auth, db } from './firebase/config';

// Test Firestore
console.log('Firestore initialized:', db);

// Test Auth
console.log('Auth initialized:', auth);
```

---

## Database Structure

Recommended Firestore collections:

```
/players/{userId}
  - username: string
  - rank: string
  - reputation: number
  - casesCompleted: number
  - achievements: array
  - createdAt: timestamp

/cases/{userId}/{caseId}
  - caseNumber: number
  - difficulty: string
  - status: string (active, completed, abandoned)
  - startedAt: timestamp
  - completedAt: timestamp
  - rating: number
  - evidence: array
  - suspects: array

/leaderboard/{entry}
  - userId: string
  - username: string
  - totalReputation: number
  - rank: number
  - updatedAt: timestamp
```

---

## Deployment

Build your app:

```bash
npm run build
```

Deploy to Firebase Hosting:

```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

---

## Testing Checklist

- [ ] Firebase config loads without errors
- [ ] User can sign up with email/password
- [ ] User can log in
- [ ] Firestore saves player data
- [ ] Firestore retrieves saved cases
- [ ] Security rules block unauthorized access
- [ ] App deploys successfully to Firebase Hosting

---

## Troubleshooting

### Issue: "Firebase not defined"
**Solution**: Ensure you've imported Firebase correctly and installed the package

### Issue: "Permission denied"
**Solution**: Check Firestore security rules and ensure user is authenticated

### Issue: "Quota exceeded"
**Solution**: Review Firebase usage in console, upgrade to Blaze plan if needed

### Issue: "CORS errors"
**Solution**: Add your domain to authorized domains in Firebase Console → Authentication → Settings

---

## Cost Considerations

Firebase free tier includes:
- **Authentication**: Unlimited users
- **Firestore**: 50K reads, 20K writes, 1GB storage per day
- **Hosting**: 10GB storage, 360MB/day transfer

For most indie games, free tier is sufficient. Monitor usage in Firebase Console.

---

## Security Best Practices

1. **Never commit** Firebase config with secrets to Git
2. Use **environment variables** for sensitive data
3. Enable **App Check** in production to prevent API abuse
4. Implement **rate limiting** on Firestore writes
5. Regularly **audit security rules**
6. Enable **2FA** on your Firebase account

---

## Next Steps

After setup:
1. Implement user authentication UI
2. Create save/load game functions
3. Set up cloud functions for leaderboard updates
4. Add analytics tracking
5. Configure backup strategy

---

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

**Setup complete! Your AI Detective game is now ready for cloud features.** 🔥

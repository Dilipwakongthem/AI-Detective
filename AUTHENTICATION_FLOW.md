# Authentication Flow - AI Detective Game

## 🔐 File Structure

```
public/
├── index.html      - LOGIN PAGE (Entry point)
├── game.html       - GAME PAGE (Requires authentication)
├── js/
│   ├── login.js    - Authentication logic
│   └── config.js   - Facebook credentials
└── styles/
    └── login.css   - Login page styling
```

## 🚀 User Flow

### First-Time User:
1. User visits the app → Loads `index.html` (login page)
2. User sees login options:
   - 👤 Play as Guest
   - 📧 Email Login / Sign Up
   - 📘 Facebook Login
   - 🔵 Google Login (coming soon)
3. User selects login method
4. Authentication completes → Redirects to `game.html`
5. Game loads with user profile

### Returning User:
1. User visits the app → Loads `index.html` (login page)
2. **If authenticated session exists:**
   - Guest: Button shows "CONTINUE AS GUEST"
   - Email/Facebook: Can click to continue
3. User clicks login button → Redirects to `game.html`
4. Game loads with saved progress

### Direct Game Access (Protected):
1. User tries to access `game.html` directly
2. `game.html` checks for authentication
3. **If not authenticated:**
   - Redirects back to `index.html` (login)
4. **If authenticated:**
   - Game loads normally

## 🔒 Authentication Check Logic

### In `game.html`:
```javascript
// Check for authentication
const guestId = localStorage.getItem('guestUserId');
const userType = localStorage.getItem('userType');
const userEmail = localStorage.getItem('currentUserEmail');

const isAuthenticated = (guestId && userType === 'guest') ||
                       (userEmail && (userType === 'email' || userType === 'facebook'));

if (!isAuthenticated) {
    // No session - redirect to login
    window.location.href = 'index.html';
}
```

## 📱 Authentication Methods

### 1. Guest Login
**Storage:**
- `guestUserId`: `guest_${timestamp}_${random}`
- `isGuestUser`: `'true'`
- `userType`: `'guest'`

**User Experience:**
- No email/password required
- Instant play
- Progress saved locally
- Can upgrade to full account later

---

### 2. Email Login/Signup
**Storage:**
- `currentUserId`: `user_${timestamp}_${random}`
- `currentUserEmail`: User's email
- `userType`: `'email'`
- `displayName`: Optional name
- `allUsers`: JSON with all user accounts

**User Data:**
```javascript
{
  userId: "user_...",
  email: "user@example.com",
  password: "hashed_password",
  displayName: "Detective Name",
  userType: "email",
  createdAt: ISO timestamp,
  lastLogin: ISO timestamp
}
```

---

### 3. Facebook Login
**Storage:**
- `currentUserId`: `fb_${facebook_id}`
- `currentUserEmail`: User's Facebook email
- `userType`: `'facebook'`
- `displayName`: Facebook name
- `facebookId`: Facebook user ID

**OAuth Flow:**
1. User clicks Facebook button
2. Facebook SDK popup opens
3. User authorizes app
4. App receives Facebook profile data
5. Account created/logged in
6. Redirected to game

---

## 🛠️ Development

### Start Development Server:
```bash
npm start
# Opens: http://localhost:1234/
# Entry point: public/index.html (login page)
```

### Build for Production:
```bash
npm run build
# Builds both:
# - public/index.html (login page)
# - public/game.html (game page)
```

### File Navigation:
- **Login page:** `http://localhost:1234/` or `http://localhost:1234/index.html`
- **Game page:** `http://localhost:1234/game.html` (auto-redirects to login if not authenticated)

---

## 🔄 Session Management

### Session Persistence:
All authentication uses `localStorage` for persistence:
- **Guest sessions:** Persist indefinitely until cleared
- **Email sessions:** Persist indefinitely until cleared
- **Facebook sessions:** Persist indefinitely until cleared

### Logout:
Currently no logout button implemented. To logout:
```javascript
// Clear all session data
localStorage.clear();
// Reload page - will redirect to login
window.location.reload();
```

### Session Validation:
- Checked on `game.html` load
- No expiration (persists forever)
- For production: Add token expiration and refresh

---

## 📝 Navigation Flow Diagram

```
┌─────────────────────────────────────────────┐
│         User Opens App                       │
│         (loads index.html)                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      LOGIN PAGE (index.html)                │
│                                              │
│  [👤 Play as Guest]                         │
│  [📧 Email Login]                           │
│  [📘 Facebook Login]                        │
│  [🔵 Google Login - Coming Soon]            │
└────────────────┬────────────────────────────┘
                 │
                 │ User selects login method
                 │
                 ▼
┌─────────────────────────────────────────────┐
│    Authentication Process                    │
│    - Guest: Auto-create session              │
│    - Email: Validate credentials             │
│    - Facebook: OAuth flow                    │
└────────────────┬────────────────────────────┘
                 │
                 │ Success → navigateToGame()
                 │
                 ▼
┌─────────────────────────────────────────────┐
│       GAME PAGE (game.html)                 │
│                                              │
│   1. Check authentication                    │
│   2. If not authenticated → redirect login   │
│   3. If authenticated → load game            │
│                                              │
│   [Main Menu]                                │
│   [Investigation]                            │
│   [Profile]                                  │
│   [Store]                                    │
└─────────────────────────────────────────────┘
```

---

## 🚨 Important Notes

### For Development:
- Entry point is `index.html` (login page)
- Game runs on `game.html` (protected)
- No authentication bypass in current implementation

### For Production:
1. **Configure Facebook App:**
   - Add production domain to OAuth redirect URIs
   - See `FACEBOOK_LOGIN_SETUP.md` for details

2. **Security Improvements:**
   - Add backend authentication server
   - Use JWT tokens instead of localStorage
   - Implement token expiration/refresh
   - Hash passwords server-side with bcrypt
   - Add HTTPS requirement

3. **Session Management:**
   - Implement logout functionality
   - Add session timeout
   - Add "Remember Me" option
   - Implement account linking (merge guest → full account)

### Testing:
```bash
# Test complete flow:
1. Clear localStorage: localStorage.clear()
2. Visit http://localhost:1234/
3. Should see login page
4. Try all login methods
5. Each should redirect to game
6. Direct access to game.html should redirect to login if not authenticated
```

---

## 📄 Related Documentation

- `FACEBOOK_LOGIN_SETUP.md` - Facebook OAuth configuration
- `BRANCH_STATUS.md` - Complete feature list
- `README.md` - Project overview

---

## ✅ Authentication Checklist

**Current Implementation:**
- ✅ Login page as entry point
- ✅ Guest login working
- ✅ Email signup/login working
- ✅ Facebook OAuth working
- ✅ Session persistence
- ✅ Protected game access
- ✅ Auto-redirect if not authenticated

**Future Enhancements:**
- ⏳ Logout button
- ⏳ Account management page
- ⏳ Password reset flow
- ⏳ Email verification
- ⏳ Google OAuth
- ⏳ Backend API integration
- ⏳ Token-based authentication
- ⏳ Multi-device sync

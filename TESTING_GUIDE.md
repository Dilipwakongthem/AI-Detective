# Testing Guide - Authentication Flow

## ⚠️ CRITICAL: Before Testing

### 1. Hard Refresh Browser (MANDATORY)
After pulling new code or making changes, you MUST hard refresh:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- **Or**: Open DevTools → Right-click reload button → "Empty Cache and Hard Reload"

**Why?** Browsers cache JavaScript files. Without hard refresh, you'll test OLD code!

### 2. Verify Correct Code Version
After hard refresh, open browser console and check:
```javascript
// You should see logs with [INIT], [CLICK], [SESSION CHECK] tags
// If you see plain "Login page loaded" without [INIT], you have OLD cached code!
```

### 3. Clear State Before Each Test
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

### 4. If Tests Still Fail
Try incognito/private window to bypass ALL cache.

---

## Test 1: Guest Login

### Steps:
1. Clear localStorage
2. Visit `http://localhost:1234/`
3. Click **"PLAY AS GUEST"**
4. Watch browser console

### Expected Console Output:
```
[GUEST LOGIN] Guest login initiated
[GUEST LOGIN] Creating new guest: guest_1234567890_abc123
[GUEST LOGIN] New guest user created: guest_1234567890_abc123
[GUEST LOGIN] Verifying localStorage: {
  guestUserId: "guest_1234567890_abc123",
  userType: "guest",
  isGuestUser: "true"
}
[GUEST LOGIN] Navigating to game in 1.5 seconds...
[GUEST LOGIN] Redirecting to game.html NOW
[AUTH CHECK] Starting authentication check...
[AUTH CHECK] Quick check - userType: guest
[AUTH CHECK] Detailed check: {
  guestId: "guest_1234567890_abc123",
  userType: "guest",
  ...
}
[AUTH CHECK] Auth status: {
  isGuest: true,
  isEmail: false,
  isFacebook: false,
  isAuthenticated: true
}
[AUTH CHECK] Authentication SUCCESS - Loading game for user type: guest
```

### Expected Behavior:
- ✅ Notification: "✅ Welcome, Guest Detective!"
- ✅ After 1.5 seconds: Redirects to game
- ✅ Game loads (React app starts)
- ✅ No redirect loop

### If It Fails:
Check console for:
- `[AUTH CHECK] No userType found` → localStorage not set
- `[AUTH CHECK] Authentication FAILED` → userType missing

---

## Test 2: Email Signup

### Steps:
1. Clear localStorage
2. Visit `http://localhost:1234/`
3. Click **"Sign Up"** link
4. Fill in form:
   - Name: Test Detective
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
5. Click **"CREATE ACCOUNT"**
6. Watch browser console

### Expected Console Output:
```
[EMAIL SIGNUP] Signup attempt for: test@example.com
[EMAIL SIGNUP] Creating account: test@example.com
[EMAIL SIGNUP] Account created, verifying localStorage: {
  currentUserId: "user_1234567890_abc123",
  currentUserEmail: "test@example.com",
  userType: "email"
}
[EMAIL SIGNUP] Navigating to game in 1.5 seconds...
[EMAIL SIGNUP] Redirecting to game.html NOW
[AUTH CHECK] Starting authentication check...
[AUTH CHECK] Quick check - userType: email
[AUTH CHECK] Authentication SUCCESS - Loading game for user type: email
```

### Expected Behavior:
- ✅ Notification: "✅ Account created successfully!"
- ✅ Modal closes
- ✅ After 1.5 seconds: Redirects to game
- ✅ Game loads with detective name: "Test Detective"

---

## Test 3: Email Login

### Steps:
1. Clear localStorage
2. Create account first (Test 2)
3. Clear localStorage again
4. Visit `http://localhost:1234/`
5. Click **"EMAIL LOGIN"**
6. Enter:
   - Email: test@example.com
   - Password: password123
7. Click **"LOGIN"**
8. Watch browser console

### Expected Console Output:
```
[EMAIL LOGIN] Login attempt for: test@example.com
[EMAIL LOGIN] Login successful for: test@example.com
[EMAIL LOGIN] User logged in, verifying localStorage: {
  currentUserId: "user_1234567890_abc123",
  currentUserEmail: "test@example.com",
  userType: "email"
}
[EMAIL LOGIN] Navigating to game in 1.5 seconds...
[EMAIL LOGIN] Redirecting to game.html NOW
[AUTH CHECK] Authentication SUCCESS - Loading game for user type: email
```

### Expected Behavior:
- ✅ Notification: "✅ Welcome back, Test Detective!"
- ✅ Modal closes
- ✅ Redirects to game
- ✅ Game loads with saved progress

---

## Test 4: Facebook Login

### Prerequisites:
- Facebook app configured (see FACEBOOK_LOCALHOST_FIX.md)
- Valid OAuth redirect URIs added
- Test user created OR you're added as Developer

### Steps:
1. Clear localStorage
2. Visit `http://localhost:1234/`
3. Click **"CONTINUE WITH FACEBOOK"**
4. Facebook popup opens
5. Login with Facebook
6. Authorize app
7. Watch browser console

### Expected Console Output:
```
[FACEBOOK LOGIN] Facebook login initiated
[FACEBOOK LOGIN] Facebook login successful
[FACEBOOK LOGIN] Facebook user data: {id: "...", name: "Your Name", email: "..."}
[FACEBOOK LOGIN] Created user data: {userId: "fb_...", ...}
[FACEBOOK LOGIN] New Facebook user - creating account
[FACEBOOK LOGIN] New Facebook account created: your@email.com
[FACEBOOK LOGIN] Verifying localStorage: {
  currentUserId: "fb_123456789",
  currentUserEmail: "your@email.com",
  userType: "facebook",
  facebookId: "123456789"
}
[FACEBOOK LOGIN] Navigating to game in 1.5 seconds...
[FACEBOOK LOGIN] Redirecting to game.html NOW
[AUTH CHECK] Authentication SUCCESS - Loading game for user type: facebook
```

### Expected Behavior:
- ✅ Facebook popup opens
- ✅ After authorization: popup closes
- ✅ Notification: "✅ Welcome, Your Name!"
- ✅ Redirects to game
- ✅ Game loads with Facebook name

### If Facebook Fails:
- Check `FACEBOOK_LOCALHOST_FIX.md`
- Verify OAuth redirect URIs include `http://localhost:1234/`
- Check you're added as Developer/Tester
- Look for error in console

---

## Common Issues & Solutions

### Issue: Running Old Cached Code
**Symptoms:**
```
login.js:597 Login page loaded
(No [INIT] or [CLICK] tags in logs)
```

**Solution:**
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or use incognito/private window
3. Verify you see `[INIT]` tags in console after refresh

---

### Issue: Conflicting Session Data
**Symptoms:**
```
[SESSION CHECK] ⚠️ Conflicting session data detected!
```

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Click your preferred login method
4. The system will automatically clear conflicts on login

---

### Issue: Redirect Loop (keeps going back to login)
**Symptoms:**
```
[AUTH CHECK] No userType found immediately, redirecting to login
```

**Solution:**
1. Check if localStorage.setItem('userType', ...) is being called
2. Verify userType is set BEFORE navigateToGame()
3. Check browser console for the verification logs

---

### Issue: localStorage Empty
**Symptoms:**
```
[AUTH CHECK] Detailed check: {
  guestId: null,
  userType: null,
  userEmail: null,
  userId: null
}
```

**Solution:**
1. Make sure initialization functions are called
2. Check if localStorage is enabled in browser
3. Try different browser or incognito mode

---

### Issue: Facebook Popup Blocked
**Symptoms:** Facebook popup doesn't open

**Solution:**
1. Check browser address bar for popup icon
2. Allow popups for localhost
3. Try clicking Facebook button again

---

### Issue: Game Loads but Shows Error
**Symptoms:** Game page loads but React app shows error

**Solution:**
1. Check if profile data is complete
2. Look for missing fields in initialization
3. Check browser console for React errors

---

## Verification Checklist

After each test, verify:

✅ **Console shows all expected logs**
✅ **No JavaScript errors**
✅ **localStorage contains correct data**
✅ **No redirect loops**
✅ **Game loads successfully**
✅ **User name/type displays correctly**

---

## Debug Commands

Run these in browser console to check state:

### Check Authentication:
```javascript
console.log({
  guestId: localStorage.getItem('guestUserId'),
  userId: localStorage.getItem('currentUserId'),
  userEmail: localStorage.getItem('currentUserEmail'),
  userType: localStorage.getItem('userType'),
  displayName: localStorage.getItem('displayName')
});
```

### Check Full Profile:
```javascript
console.log({
  rank: localStorage.getItem('rank'),
  rankLevel: localStorage.getItem('rankLevel'),
  reputation: localStorage.getItem('reputation'),
  casesSolved: localStorage.getItem('casesSolved')
});
```

### Force Navigation Test:
```javascript
// Set a test session
localStorage.setItem('userType', 'guest');
localStorage.setItem('guestUserId', 'test_123');

// Try loading game
window.location.href = 'game.html';
```

---

## Success Criteria

All tests should:
1. Show detailed console logs at each step
2. Display success notifications
3. Navigate to game after 1.5 seconds
4. Load game without errors
5. No redirect loops
6. User data persists in localStorage

---

## If All Tests Fail

1. **Clear browser cache completely**
   - Chrome: Settings → Privacy → Clear browsing data → All time
   - Or use incognito/private window

2. **Restart dev server**
   ```bash
   # Kill server (Ctrl+C)
   npm start
   ```

3. **Check for console errors**
   - Open DevTools before testing
   - Watch Network tab for failed requests
   - Check Console tab for JavaScript errors

4. **Verify file changes saved**
   ```bash
   git status
   git diff public/game.html
   git diff public/js/login.js
   ```

5. **Hard refresh browser**
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

---

**After fixing, all login methods should work perfectly! 🎉**

# Facebook Login Configuration Guide

## ⚠️ IMPORTANT: Development Mode Setup

The error **"This content isn't available at the moment"** means your Facebook app needs to be configured for localhost testing.

## 🔧 Quick Fix for Localhost

### Step 1: Go to Facebook App Dashboard
Visit: https://developers.facebook.com/apps/1541137253706088/

### Step 2: Configure Settings

#### A. Basic Settings
1. Click **Settings** → **Basic** (left sidebar)
2. Scroll to **App Domains**
3. Add: `localhost`
4. Click **Save Changes**

#### B. Facebook Login Settings
1. Click **Facebook Login** → **Settings** (left sidebar)
2. Find **Valid OAuth Redirect URIs**
3. Add these URIs (one per line):
   ```
   http://localhost:1234/
   http://localhost:1234/index.html
   http://localhost:1234/game.html
   ```
4. Click **Save Changes**

#### C. Add Test Users (Important!)
1. Click **Roles** → **Test Users** (left sidebar)
2. Click **Add Test Users**
3. Create 1-3 test users
4. Use these test accounts to login during development

**OR** Add yourself as a developer:
1. Click **Roles** → **Roles** (left sidebar)
2. Add your Facebook account as **Administrator** or **Developer**
3. Now you can test with your real Facebook account

### Step 3: Verify App Mode

**Check App Mode:**
1. Top right of dashboard - check the toggle
2. Should say **"Development"** or **"Live"**

**For Testing:**
- Keep in **Development** mode
- Only users with roles (Admin/Developer/Tester) can login
- This is normal and safe for testing

**For Production:**
- Switch to **Live** mode after testing
- Submit for App Review if needed
- Anyone can login once live

## 🧪 Testing After Configuration

### 1. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm start
```

### 2. Clear Browser Cache
- Open browser DevTools (F12)
- Go to **Application** → **Storage**
- Click **Clear site data**
- Or use incognito/private window

### 3. Test Login
1. Open: `http://localhost:1234/`
2. Click **"CONTINUE WITH FACEBOOK"**
3. Facebook popup should appear
4. Login with:
   - Your Facebook account (if you're added as Developer)
   - OR Test user account you created

### 4. Check Console
Open browser console (F12) and look for:
```
Facebook SDK initialized
Facebook login initiated
Facebook login successful
Facebook user data: {id, name, email}
```

## ❌ Common Errors & Solutions

### Error: "This content isn't available at the moment"
**Cause:** App not configured for localhost OR you're not a tester
**Fix:**
- Add localhost to Valid OAuth Redirect URIs
- Add yourself as Developer/Tester in Roles

### Error: "App Not Setup"
**Cause:** Wrong App ID or SDK not loaded
**Fix:**
- Verify App ID: `1541137253706088` in `public/js/config.js`
- Check Facebook SDK loaded in browser console

### Error: "Invalid redirect_uri"
**Cause:** Current URL not in Valid OAuth Redirect URIs
**Fix:**
- Add exact URL to Facebook Login settings
- Include trailing slash: `http://localhost:1234/`

### Error: "Can't Load URL"
**Cause:** Domain not in App Domains
**Fix:**
- Add `localhost` to App Domains in Basic Settings

### Popup Blocked
**Cause:** Browser blocking Facebook popup
**Fix:**
- Allow popups for localhost
- Check browser address bar for popup icon

## 📱 Mobile Testing

### Testing on Phone/Tablet

**Option A: Use ngrok or similar**
```bash
npm install -g ngrok
npm start  # In one terminal
ngrok http 1234  # In another terminal
```

Then add the ngrok URL to Facebook app settings:
- Example: `https://abc123.ngrok.io`

**Option B: Use localtunnel (already installed)**
```bash
npm start  # In one terminal
npx localtunnel --port 1234  # In another terminal
```

Add the localtunnel URL to Facebook settings.

## 🚀 Production Deployment

### Before Going Live:

1. **Add Production Domain**
   - Settings → Basic → App Domains
   - Add: `yourdomain.com`

2. **Add Production OAuth URIs**
   - Facebook Login → Settings
   - Add:
     ```
     https://yourdomain.com/
     https://yourdomain.com/index.html
     https://yourdomain.com/game.html
     ```

3. **Switch to Live Mode**
   - Top right toggle → Switch to **Live**

4. **Submit for Review (if needed)**
   - If requesting permissions beyond basic
   - App Review → Submit for Review
   - Provide test credentials and instructions

## 🔐 Security Notes

**App Secret:** `c73536716d52dc7eafc93f9db07ef1c3`
- ⚠️ Keep this SECRET
- Never expose in client-side code
- Only use for server-side validation
- Rotate if compromised

**Current Setup:**
- App ID is public (OK - it's meant to be)
- App Secret should stay private
- Current implementation is client-side only (OK for demo)
- For production: Add backend to validate tokens

## 📞 Need Help?

**Facebook Developer Support:**
- https://developers.facebook.com/support/

**Check Status:**
- https://developers.facebook.com/status/

**Documentation:**
- https://developers.facebook.com/docs/facebook-login/web

---

## ✅ Checklist for Facebook Login

- [ ] App Domains includes `localhost`
- [ ] Valid OAuth Redirect URIs includes `http://localhost:1234/`
- [ ] Added yourself as Developer/Tester in Roles
- [ ] App is in Development mode
- [ ] Dev server running on port 1234
- [ ] Browser allows popups for localhost
- [ ] Tested login and saw successful console logs
- [ ] User redirected to game after login

---

**After completing these steps, Facebook login should work perfectly! 🎉**

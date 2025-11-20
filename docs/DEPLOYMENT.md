# Firebase Hosting Deployment Guide

This guide covers deploying your AI Detective game to Firebase Hosting.

---

## Prerequisites

- Completed Firebase setup (Steps 1-7)
- Firebase CLI installed globally
- Project built successfully

---

## Quick Deploy Commands

### First Time Setup

1. **Login to Firebase:**
   ```bash
   firebase login
   ```

2. **Set your Firebase project ID:**

   Edit `.firebaserc` and replace `your-firebase-project-id` with your actual project ID from Firebase Console.

3. **Build your project:**
   ```bash
   npm run build
   ```

4. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

---

## Detailed Deployment Process

### 1. Build Production Version

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### 2. Test Locally (Optional)

Preview your site locally before deploying:

```bash
firebase serve
```

Your app will be available at `http://localhost:5000`

### 3. Deploy to Firebase Hosting

Deploy the entire project:

```bash
firebase deploy
```

Or deploy only hosting:

```bash
firebase deploy --only hosting
```

### 4. Access Your Live Site

After deployment, your app will be available at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

---

## Configuration Files

### firebase.json

Defines hosting behavior:
- **public**: `dist` - serves files from the Parcel build output
- **rewrites**: Routes all requests to index.html (for SPA routing)
- **headers**: Sets cache control for optimal performance

### .firebaserc

Stores your Firebase project ID:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

---

## Continuous Deployment

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## Deployment Environments

### Production

```bash
firebase deploy --only hosting
```

### Preview Channels (Testing)

Create a preview channel for testing:

```bash
firebase hosting:channel:deploy preview
```

This creates a temporary URL: `https://your-project-id--preview-xxxxx.web.app`

### Delete Preview Channel

```bash
firebase hosting:channel:delete preview
```

---

## Custom Domain Setup

### Add Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (can take 24 hours)

### DNS Configuration

Add these records to your DNS provider:

```
Type: A
Name: @
Value: [Firebase IP addresses provided]

Type: TXT
Name: @
Value: [Verification code provided]
```

---

## Performance Optimization

### Enable Compression

Firebase automatically compresses files, but you can optimize further:

1. **Minimize bundle size:**
   ```bash
   npm run build -- --no-source-maps
   ```

2. **Analyze bundle:**
   ```bash
   npx parcel build public/index.html --reporter @parcel/reporter-bundle-analyzer
   ```

### Cache Headers

Already configured in `firebase.json`:
- Static assets (JS/CSS/images): 1 year cache
- HTML: No cache (always fresh)

---

## Rollback Deployment

### View Deployment History

```bash
firebase hosting:history
```

### Rollback to Previous Version

```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL TARGET_SITE_ID:live
```

---

## Monitoring

### View Usage

```bash
firebase hosting:metrics
```

Or check Firebase Console → Hosting → Usage

### Check Deployment Status

```bash
firebase deploy --only hosting --debug
```

---

## Troubleshooting

### Issue: "Permission denied"

**Solution:**
```bash
firebase login --reauth
```

### Issue: "Build files not found"

**Solution:** Ensure you run `npm run build` before deploying

### Issue: "404 errors on refresh"

**Solution:** Check `firebase.json` has correct rewrites configuration (already configured)

### Issue: "Old version still showing"

**Solution:**
- Clear browser cache (Ctrl+Shift+R)
- Wait a few minutes for CDN propagation
- Check deployment was successful: `firebase hosting:history`

### Issue: "Environment variables not working"

**Solution:**
- Parcel bundles env vars at build time
- Rebuild after changing `.env` file
- For production, use Firebase Functions for sensitive data

---

## Security Headers

Add security headers in `firebase.json`:

```json
{
  "source": "**",
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    }
  ]
}
```

---

## Cost Management

Firebase Hosting free tier includes:
- **Storage:** 10 GB
- **Transfer:** 360 MB/day
- **Custom domains:** Unlimited

Monitor usage in Firebase Console to avoid overages.

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `firebase login` | Authenticate Firebase CLI |
| `firebase init` | Initialize Firebase project |
| `firebase deploy` | Deploy all Firebase services |
| `firebase deploy --only hosting` | Deploy hosting only |
| `firebase serve` | Test locally |
| `firebase hosting:channel:deploy CHANNEL` | Deploy to preview channel |
| `firebase hosting:history` | View deployment history |
| `firebase logout` | Sign out of Firebase CLI |

---

## Next Steps

After successful deployment:

1. Test all game features on the live URL
2. Set up custom domain (optional)
3. Configure GitHub Actions for auto-deployment
4. Monitor usage and performance
5. Set up Firebase Analytics

---

**Your AI Detective game is now live!** 🎉

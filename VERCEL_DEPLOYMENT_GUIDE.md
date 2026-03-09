# Vercel Deployment Guide - KIMCHIKH.com

## ✅ What's Fixed

- Added `vercel.json` configuration file for proper Vite/React deployment
- Configured build commands and output directory
- Set up SPA routing rewrites

## 🚀 How to Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Choose your preferred login method (GitHub, GitLab, email, etc.)

### Step 3: Link Project to Vercel

```bash
vercel link
```

This will:
- Create a new project on Vercel OR link to existing one
- Save project ID in `.vercel/project.json`

### Step 4: Deploy

**For development preview:**
```bash
vercel
```

**For production deployment:**
```bash
vercel --prod
```

### Step 5: Access Your Deployment

After deployment completes, you'll see URLs like:
- **Preview:** `https://kimchikh-com-xxxx.vercel.app`
- **Production:** `https://kimchikh.com` (if you added custom domain)

## 📋 Configuration Details

### vercel.json Settings

```json
{
  "buildCommand": "npm run build",     // Build command
  "outputDirectory": "dist",           // Vite outputs to 'dist'
  "devCommand": "npm run dev",         // Local dev server
  "framework": "vite",                 // Explicitly use Vite
  "rewrites": [                        // Handle SPA routing
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Why This Configuration?

1. **Vite Framework**: Tells Vercel to use Vite's optimized build process
2. **Build Command**: Runs `npm run build` which creates production bundle
3. **Output Directory**: Vite builds to `dist/` folder (not `public/` or `build/`)
4. **Rewrites**: Ensures React Router works correctly (all routes serve index.html)

## 🔍 Troubleshooting DEPLOYMENT_NOT_FOUND

### If you still get this error:

#### 1. Check Deployment Status

Visit: https://vercel.com/dashboard

Look for your project and check:
- ✅ Deployment exists
- ✅ Build completed successfully (green checkmark)
- ✅ You have access to the team/account

#### 2. Verify URL

Correct format:
```
https://{project-name}-{team-name}.vercel.app
https://{custom-domain}.com
```

Common mistakes:
```
❌ https://vercel.app/{project-name}
❌ https://{team-name}.vercel.app/{project-name}
✅ https://{project-name}.vercel.app
```

#### 3. Check Deployment Logs

In Vercel Dashboard:
1. Click on your project
2. Go to "Deployments" tab
3. Click on the deployment
4. Check "Build Logs" for errors

Common build errors:
- Missing dependencies
- TypeScript errors
- Environment variables not set

#### 4. Verify Permissions

If it's a team project:
- Ensure you're logged into correct account
- Check you have team member access
- Verify project hasn't been transferred/deleted

#### 5. Re-deploy if Needed

```bash
# Cancel current deployment (if running)
Ctrl+C

# Deploy again with verbose logging
vercel --debug
```

## 🛠️ Alternative: Connect via GitHub

### Automatic Deployments from Git

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select "Import Git Repository"
4. Choose `KIMCHIKH.com` from GitHub
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click "Deploy"

**Benefits:**
- Auto-deploy on every push to `master` branch
- Preview deployments for pull requests
- No need for Vercel CLI

## 📊 Environment Variables

If your app needs environment variables:

### Local Development (.env)
```env
VITE_API_URL=https://api.example.com
VITE_TELEGRAM_BOT_TOKEN=your_token
```

### Vercel Deployment
```bash
vercel env add VITE_API_URL production
```

Or add in Vercel Dashboard → Project Settings → Environment Variables

## 🎯 Quick Reference Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Remove a deployment
vercel rm <deployment-url>

# List all deployments
vercel ls -A

# Switch between teams/scopes
vercel switch

# Get help
vercel help
```

## 🆘 Common Issues & Solutions

### Issue: Build fails with "command not found"
**Solution:** Ensure all dependencies are in `package.json`
```bash
npm install --save <missing-package>
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

### Issue: Blank page after deployment
**Solution:** Check browser console for errors, likely routing issue
- Verify `vercel.json` rewrites are correct
- Ensure base path is correct in `vite.config.ts`

### Issue: API endpoints return 404
**Solution:** For backend integration (like ABA payment server):
- Deploy backend separately (e.g., Railway, Render)
- Update frontend API URLs in environment variables
- Or use Vercel Serverless Functions

## 📞 Getting Help

1. **Vercel Documentation:** https://vercel.com/docs
2. **Community Forum:** https://community.vercel.com
3. **Support:** https://vercel.com/help
4. **Debugging 404 Errors:** https://community.vercel.com/t/debugging-404-errors/437

---

**Last Updated:** March 9, 2026
**Project:** KIMCHIKH.com
**Framework:** Vite + React
**Status:** Ready for deployment ✅

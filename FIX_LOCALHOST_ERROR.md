# 🛠️ Fix Mixed Content Error - localhost Reference in Production

## ❌ The Problem

Your Vercel deployment shows this error:
```
Mixed Content: The page was loaded over HTTPS, but requested an insecure 
element 'http://localhost:5174/vite.svg'
```

**Why this happens:**
- The `dist` folder contains references to your local development server
- This happens when building in development mode or not cleaning old builds
- These localhost references accidentally made it into production

---

## ✅ Solution: Clean Rebuild for Production

### **Step 1: Delete the Old dist Folder**

```bash
# In your project folder
rmdir /s /q dist
```

Or manually:
- Go to: `d:\code new\Website clone request (1)`
- Delete the entire `dist` folder

### **Step 2: Clean Install Dependencies**

```bash
# Remove node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Fresh install
npm install
```

### **Step 3: Build for Production**

```bash
# This creates a clean production build
npm run build
```

**Important:** Do NOT run `npm run dev` before building!

### **Step 4: Verify the Build**

Check the newly created `dist` folder:
```bash
# Search for any localhost references
findstr /s /i "localhost" dist\*.*
```

If nothing shows up, you're good! ✅

### **Step 5: Commit and Push**

```bash
git add dist/
git commit -m "Rebuild for production - remove localhost references"
git push origin master
```

---

## 🚀 Redeploy to Vercel

### **Option A: Automatic (GitHub Integration)**

If you connected Vercel to GitHub:
- Just push to master (already done above)
- Vercel will auto-redeploy in 2-5 minutes

### **Option B: Manual Deploy**

```bash
# Install Vercel CLI (if not already done)
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## 🔍 Why This Happened

### **Common Causes:**

1. **Built while dev server was running**
   ```bash
   # ❌ Wrong: Running build while dev server is active
   npm run dev  # Still running...
   npm run build  # Picks up dev references
   ```

2. **Old dist folder not cleaned**
   ```bash
   # ❌ Wrong: Building without cleaning first
   npm run build  # Old files still have localhost refs
   ```

3. **Development environment variables**
   ```env
   # ❌ Wrong: Using .env.development instead of .env.production
   VITE_API_URL=http://localhost:5174/api
   ```

---

## 📋 Best Practices

### **Always Before Building:**

```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clean old build
rmdir /s /q dist

# 3. Build fresh
npm run build

# 4. Check for localhost references
findstr /s /i "localhost" dist\*.*

# Should return nothing!
```

### **Environment-Specific Builds:**

Create `.env.production`:
```env
VITE_API_URL=https://kimchikh.shop/api
VITE_BASE_URL=https://kimchikh.shop
```

Create `.env.development`:
```env
VITE_API_URL=http://localhost:5174/api
VITE_BASE_URL=http://localhost:5174
```

Vite automatically uses the correct one based on:
- `npm run dev` → `.env.development`
- `npm run build` → `.env.production`

---

## 🎯 Quick Fix Script

Save this as `fix-build.bat`:

```batch
@echo off
echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Cleaning old build files...
rmdir /s /q dist
rmdir /s /q node_modules
del package-lock.json

echo.
echo Installing dependencies...
call npm install

echo.
echo Building for production...
call npm run build

echo.
echo Checking for localhost references...
findstr /s /i "localhost" dist\*.* > nul
if %errorlevel% equ 0 (
    echo ❌ ERROR: Found localhost references!
    findstr /s /i "localhost" dist\*.*
) else (
    echo ✅ SUCCESS: No localhost references found!
)

echo.
echo Ready to deploy! 🚀
pause
```

Run it:
```bash
fix-build.bat
```

---

## ✅ Verification Checklist

After fixing:

- [ ] Deleted old `dist` folder
- [ ] Ran `npm install`
- [ ] Ran `npm run build` (NOT `npm run dev`)
- [ ] Checked `dist` folder for localhost references
- [ ] Committed and pushed changes
- [ ] Vercel redeployed successfully
- [ ] Website loads without mixed content errors
- [ ] HTTPS padlock shows in browser 🔒

---

## 🆘 If Error Persists

### **Check Your Code for Hardcoded URLs:**

Search your source files:
```bash
# Look for localhost in source code
findstr /s /i "localhost:5174" src\*.*
```

If found, replace with environment variables:
```typescript
// ❌ Bad
const API_URL = 'http://localhost:5174/api';

// ✅ Good
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';
```

### **Clear Browser Cache:**

1. Press `Ctrl + Shift + Delete`
2. Clear cached images and files
3. Reload page (`Ctrl + F5`)

### **Force Vercel Redeploy:**

In Vercel Dashboard:
1. Go to your project
2. Deployments tab
3. Click menu (•••) on latest deployment
4. Select **"Redeploy"**

---

## 🎉 Success!

When fixed, you should see:
- ✅ No mixed content warnings
- ✅ All resources load over HTTPS
- ✅ Padlock icon in address bar
- ✅ Website works perfectly on `https://kimchikh.shop`

---

**Last Updated:** March 9, 2026  
**Issue:** Mixed Content / localhost reference  
**Status:** Fix ready ✅

# 🔐 Google Authentication Implementation Guide

## ⚠️ Feature Request Status

**Requested Feature:** "មុនទិញត្រូវភ្ជាប់ជាមួយ acc google សិន"  
**Translation:** "Must connect Google account before buying"  
**Current Status:** ❌ NOT IMPLEMENTED - Requires development

---

## 📋 What Needs to Be Implemented

The KIMCHI shop currently allows guest checkout. To add Google authentication as a prerequisite for purchasing, you need to implement OAuth 2.0 authentication flow.

---

## 🛠️ Implementation Steps

### Step 1: Set Up Google Cloud Project (15 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:5175` (for development)
   - Copy your **Client ID** and **Client Secret**

4. **Configure OAuth Consent Screen**
   - Fill in app name: "KIMCHI Shop"
   - Add user support email
   - Add developer contact information
   - Add scopes (email, profile)
   - Save and continue

---

### Step 2: Install Required Packages (2 minutes)

```bash
npm install @react-oauth/google
```

---

### Step 3: Update Application Structure

#### A. Wrap App with GoogleOAuthProvider

**File:** `src/main.tsx` or `src/app/Root.tsx`

```typescript
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      {/* Your existing app */}
    </GoogleOAuthProvider>
  );
}
```

#### B. Create Auth Context

**File:** `src/app/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, ReactNode } from "react";
import { useGoogleLogin } from '@react-oauth/google';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      // Fetch user info
      fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`)
        .then(res => res.json())
        .then(data => setUser(data));
    },
    onError: () => console.error('Login Failed'),
  });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

#### C. Update Root Component

**File:** `src/app/Root.tsx`

```typescript
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Root() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          {/* Your existing app */}
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
```

---

### Step 4: Add Google Sign-In to Checkout

#### Option A: Block Checkout Until Logged In

**File:** `src/app/components/CartDrawer.tsx`

```typescript
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* ... existing cart items ... */}
      
      {!isAuthenticated ? (
        <div className="p-6 text-center">
          <p className="text-white/60 mb-4">
            Please sign in with Google to continue
          </p>
          <GoogleLogin
            onSuccess={() => console.log('Login Success')}
            onError={() => console.log('Login Failed')}
            text="signin_with"
            theme="filled_black"
            size="large"
            width="100%"
          />
        </div>
      ) : (
        <button onClick={() => setCheckoutOpen(true)}>
          CHECKOUT
        </button>
      )}
    </div>
  );
}
```

#### Option B: Show Login in Checkout Modal

**File:** `src/app/components/CheckoutModal.tsx`

```typescript
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { isAuthenticated, user, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl text-white mb-4">
          Sign In Required
        </h2>
        <p className="text-white/60 mb-6">
          Please sign in with Google to complete your order
        </p>
        <GoogleLogin
          onSuccess={() => console.log('Login Success')}
          onError={() => console.log('Login Failed')}
          text="signin_with"
          theme="filled_black"
          size="large"
        />
      </div>
    );
  }

  // Show normal checkout form for authenticated users
  return (
    <form onSubmit={handleSubmit}>
      {/* Pre-fill user info from Google */}
      <input 
        type="text" 
        value={user?.name || ''} 
        readOnly 
      />
      <input 
        type="email" 
        value={user?.email || ''} 
        readOnly 
      />
      {/* ... rest of checkout form ... */}
    </form>
  );
}
```

---

### Step 5: Add Environment Variables

**File:** `.env` (create if doesn't exist)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

**Usage in code:**
```typescript
clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
```

---

### Step 6: Update UI Components

#### Add User Profile Display

**File:** `src/app/components/Navbar.tsx`

```typescript
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {/* ... existing nav ... */}
      
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <img 
            src={user?.picture} 
            alt={user?.name} 
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white text-sm">{user?.name}</span>
          <button onClick={logout} className="text-white/60 hover:text-white">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={login} className="text-white hover:text-red-500">
          Sign In
        </button>
      )}
    </nav>
  );
}
```

---

## 🎨 Design Considerations

### User Flow Options

**Option 1: Auth Before Browse**
- Users must sign in before viewing products
- Most restrictive, not recommended for e-commerce

**Option 2: Auth Before Checkout** ⭐ RECOMMENDED
- Users can browse and add to cart freely
- Must sign in when proceeding to checkout
- Best balance of UX and security

**Option 3: Auth Optional**
- Allow guest checkout
- Offer account creation after purchase
- Most flexible for customers

---

## 🔐 Security Best Practices

1. **Never expose Client Secret**
   - Only Client ID goes in frontend code
   - Keep secret on backend if you have one

2. **Validate tokens on backend**
   - For production, verify tokens server-side
   - Don't trust frontend authentication alone

3. **Use HTTPS in production**
   - OAuth requires secure contexts
   - Never use HTTP for authentication

4. **Implement token refresh**
   - Access tokens expire
   - Handle refresh automatically

5. **Secure user data**
   - Store minimal user information
   - Follow GDPR/privacy regulations

---

## 🧪 Testing Checklist

After implementation:

- [ ] Google Sign-In button appears
- [ ] Clicking opens Google login popup
- [ ] Successful login shows user info
- [ ] User data pre-fills in checkout
- [ ] Checkout blocked until logged in
- [ ] Logout functionality works
- [ ] Cart persists through login
- [ ] Order completes successfully
- [ ] Telegram notification includes user email

---

## ⏱️ Estimated Implementation Time

| Task | Time |
|------|------|
| Google Cloud Setup | 15 min |
| Package Installation | 2 min |
| Auth Context Creation | 30 min |
| Component Updates | 45 min |
| Testing & Debugging | 30 min |
| **TOTAL** | **~2 hours** |

---

## 📦 Alternative Solutions

### If You Want Faster Implementation:

**Option 1: Use Auth Provider Service**
- Firebase Authentication (free tier available)
- Auth0 (has free plan)
- Supabase Auth (built-in, free)

**Option 2: Simplified Email Login**
- Magic link authentication
- No passwords to manage
- Services: Magic.link, Clerk, Supabase

**Option 3: Guest Checkout + Optional Account**
- Don't require authentication
- Let users create account after purchase
- Most conversion-friendly

---

## 🆘 Common Issues & Solutions

### Issue: "Access blocked" error

**Solution:** 
- App is in testing mode
- Add your test email to authorized test users
- Or publish the app in Google Cloud Console

### Issue: Redirect URI mismatch

**Solution:**
- Verify redirect URI exactly matches
- Include http:// or https://
- Match port numbers exactly

### Issue: CORS errors

**Solution:**
- Google OAuth should handle CORS automatically
- Make sure using official library
- Check browser console for details

---

## 📞 Need Help?

**Official Documentation:**
- [Google Identity Services](https://developers.google.com/identity)
- [@react-oauth/google](https://github.com/codex-team/react-oauth)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

**Current Status:**
- Server: ✅ Running (http://localhost:5175)
- Checkout: ✅ Working (without auth)
- Google Auth: ❌ Not implemented yet

**Next Step:** Follow this guide to implement Google authentication, or proceed with current guest checkout system.

---

**Your KIMCHI shop is operational without Google auth!** 
Customers can browse, add to cart, and checkout right now. The Google authentication is an optional enhancement that adds a login step before purchase.

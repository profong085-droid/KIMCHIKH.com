# Custom Domain Setup Guide - kimchikh.shop

## 🎯 Goal
Change from: `https://kimchikhcom.vercel.app`  
To: `https://kimchikh.shop`

## 📋 Prerequisites

1. **Purchase the domain** `kimchikh.shop` from a domain registrar
2. **Access to DNS settings** for the domain
3. **Vercel account** with project deployed

---

## 🛒 Step 1: Purchase Domain

### Recommended Domain Registrars:

| Registrar | Price (.shop) | Link |
|-----------|--------------|------|
| **Namecheap** | ~$2-5/year (first year) | [namecheap.com](https://namecheap.com) |
| **Porkbun** | ~$3/year | [porkbun.com](https://porkbun.com) |
| **Cloudflare** | At-cost pricing | [cloudflare.com](https://cloudflare.com) |
| **Google Domains** | ~$12/year | [domains.google](https://domains.google) |

💡 **Recommendation:** Use **Namecheap** or **Porkbun** for affordable `.shop` domains

### Purchase Steps:

1. Go to registrar website
2. Search for `kimchikh.shop`
3. Add to cart and checkout
4. Verify ownership via email

---

## ⚙️ Step 2: Configure Domain in Vercel

### Option A: Buy Domain Through Vercel (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: **KIMCHIKH.com**
3. Go to **Settings** → **Domains**
4. Click **"Buy Domain"**
5. Search for `kimchikh.shop`
6. Complete purchase (~$20-40/year)
7. Vercel auto-configures everything! ✅

**Pros:** Automatic setup, no DNS configuration needed  
**Cons:** Slightly more expensive than some registrars

---

### Option B: Connect Existing Domain (Recommended)

If you already purchased `kimchikh.shop`:

#### 1. Add Domain to Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project: **KIMCHIKH.com**
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter: `kimchikh.shop`
6. Click **"Add"**

Vercel will show DNS configuration instructions.

#### 2. Configure DNS Records

Login to your domain registrar (where you bought `kimchikh.shop`) and add these DNS records:

**Record Type: A**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto or 3600
```

**Record Type: CNAME** (for www subdomain)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

#### 3. Where to Add DNS Records:

**If using Namecheap:**
1. Login → Domain List → Manage
2. Advanced DNS tab
3. Add new records as shown above

**If using Porkbun:**
1. Login → Domains → DNS
2. Add records under "Records"

**If using Cloudflare:**
1. Login → DNS → Records
2. Click "Add record"
3. Add both A and CNAME records

#### 4. Verify in Vercel

Back in Vercel Dashboard:
1. Settings → Domains
2. Click **"Check Configuration"**
3. Wait for verification (can take 5-10 minutes)
4. Once verified, you'll see ✅ green checkmark

---

## 🔒 Step 3: Enable HTTPS (Automatic)

Vercel automatically provisions SSL certificates:

1. After DNS verification, Vercel issues Let's Encrypt certificate
2. HTTPS is enabled automatically
3. No manual configuration needed! 🔐

**Wait time:** Usually 5-15 minutes after DNS propagation

---

## 🌐 Step 4: Configure Redirects

### Set Default Domain

In Vercel Dashboard → Settings → Domains:

1. Choose primary domain: `kimchikh.shop`
2. Toggle **"Redirect to Primary Domain"**
3. This ensures:
   - `www.kimchikh.shop` → `kimchikh.shop`
   - `kimchikhcom.vercel.app` → `kimchikh.shop`

### Update Production Alias

```bash
# In terminal, navigate to project folder
cd "d:\code new\Website clone request (1)"

# Assign custom domain as production alias
vercel alias set kimchikhcom.vercel.app kimchikh.shop
```

Or do it in Vercel Dashboard:
1. Deployments tab
2. Click menu (•••) on latest deployment
3. **Assign Custom Domain**
4. Select `kimchikh.shop`

---

## ⏱️ Step 5: Wait for DNS Propagation

DNS changes can take time to propagate globally:

| Time | What to Expect |
|------|----------------|
| **5-10 min** | Some users can access via custom domain |
| **30 min - 1 hour** | Most users worldwide can access |
| **24-48 hours** | Full global propagation complete |

💡 **Tip:** DNS propagation is usually much faster nowadays (often < 30 minutes)

### Check Propagation Status:

Visit: [whatsmydns.net](https://whatsmydns.net)
- Enter: `kimchikh.shop`
- See if DNS records have propagated globally

---

## ✅ Step 6: Test Your Custom Domain

Once DNS is propagated:

1. **Test in browser:**
   - `https://kimchikh.shop`
   - `https://www.kimchikh.shop`

2. **Verify HTTPS:**
   - Look for padlock icon 🔒
   - Click to verify SSL certificate is valid

3. **Test all features:**
   - Background music ✅
   - Shopping cart ✅
   - Checkout with ABA payment ✅
   - Telegram notifications ✅

---

## 🔄 Update All References

### Update Environment Variables

If you have any hardcoded URLs, update them:

```env
# .env or Vercel Environment Variables
VITE_API_URL=https://kimchikh.shop/api
VITE_BASE_URL=https://kimchikh.shop
```

### Update Payment Server Callback URLs

In your ABA payment server configuration:

```javascript
// aba-payment-server/.env
FRONTEND_URL=https://kimchikh.shop
```

### Update Telegram Bot Webhook

If using webhooks:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://kimchikh.shop/api/telegram"
```

---

## 🛠️ Troubleshooting

### Issue: "Invalid Domain Configuration"

**Solution:**
1. Double-check DNS records
2. Ensure no typos in domain name
3. Remove any conflicting records (old A or CNAME records)
4. Wait longer for propagation

### Issue: SSL Certificate Not Working

**Solution:**
1. Wait 15-30 minutes after domain verification
2. Clear browser cache
3. Try incognito mode
4. Check Vercel dashboard for SSL status

### Issue: Domain Shows "Parking Page"

**Solution:**
- This means DNS isn't fully propagated yet
- Wait up to 48 hours
- Or use nameservers method (see below)

---

## 🚀 Alternative Method: Use Vercel Nameservers

For simpler management, transfer DNS to Vercel:

### Steps:

1. **In Vercel Dashboard:**
   - Settings → Domains
   - Click on `kimchikh.shop`
   - Choose **"Use Vercel Nameservers"**

2. **At Domain Registrar:**
   - Change nameservers to:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```

3. **Wait for propagation** (usually < 1 hour)

**Benefits:**
- ✅ All DNS managed in one place (Vercel)
- ✅ Automatic SSL renewal
- ✅ Easier subdomain management

**Drawbacks:**
- Less control over advanced DNS features

---

## 💰 Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| **Domain (.shop)** | $2-15/year | Annual |
| **Vercel Hosting** | FREE (Hobby plan) | Monthly |
| **SSL Certificate** | FREE (Let's Encrypt) | Lifetime |
| **Total** | **~$2-15/year** | Annual |

💡 **Note:** Vercel Hobby plan is free for personal projects!

---

## 📊 Quick Comparison

| Method | Speed | Difficulty | Cost |
|--------|-------|------------|------|
| **Buy in Vercel** | ⚡ Fastest | 😊 Easiest | $$ |
| **Connect External** | ⏱️ 30min-48hrs | 😐 Moderate | $ |
| **Nameservers** | ⏱️ 1-24hrs | 😐 Moderate | $ |

---

## 🎯 Summary Checklist

- [ ] Purchase `kimchikh.shop` domain
- [ ] Add domain to Vercel project
- [ ] Configure DNS records (A + CNAME)
- [ ] Wait for DNS propagation
- [ ] Verify HTTPS is working
- [ ] Set primary domain redirect
- [ ] Test all website features
- [ ] Update environment variables
- [ ] Update payment server URLs
- [ ] Celebrate! 🎉

---

## 🔗 Useful Links

- **Vercel Custom Domains Docs:** https://vercel.com/docs/custom-domains
- **DNS Propagation Checker:** https://whatsmydns.net
- **SSL Checker:** https://sslshopper.com/ssl-checker.html
- **Namecheap:** https://namecheap.com
- **Porkbun:** https://porkbun.com

---

## 🆘 Need Help?

1. **Vercel Support:** https://vercel.com/help
2. **Community Forum:** https://community.vercel.com
3. **Live Chat:** Available in Vercel Dashboard

---

**Ready to get started?** Head to [vercel.com/dashboard](https://vercel.com/dashboard) and add your custom domain! 🚀

**Last Updated:** March 9, 2026  
**Target Domain:** kimchikh.shop  
**Current Status:** Ready for configuration ⏳

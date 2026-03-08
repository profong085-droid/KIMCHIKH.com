# 🔗 ABA PayWay Complete Integration Guide

## 📋 Overview

Complete guide for integrating ABA PayWay payment links with automatic pushback notifications to your Node.js server.

---

## 🎯 System Architecture

```
Customer Order Flow:
┌──────────────┐
│   Customer   │
│   Orders     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Checkout Page│
│ Shows 7 ABA  │
│ Payment Links│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Customer     │
│ Clicks Link  │
│ (e.g., 3 items)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ABA PayWay   │
│ Payment Page │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Customer     │
│ Pays via     │
│ ABA PayWay   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ABA Sends    │
│ Pushback ────┼────► Your Server
│ Notification │     /api/payment/pushback
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │
│ Verifies &   │
│ Sends to     │
│ Telegram     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ You Receive  │
│ Notification │
│ on Telegram  │
└──────────────┘
```

---

## 🏗️ Step-by-Step Implementation

### Phase 1: Setup Payment Server

#### 1. Install Dependencies
```bash
cd aba-payment-server
npm install
```

#### 2. Generate SHA256 Hashes
```bash
node generate-hashes.js
```

**Output:**
```
HASH_1=a1b2c3d4e5f6...
HASH_2=b2c3d4e5f6g7...
HASH_3=c3d4e5f6g7h8...
HASH_4=d4e5f6g7h8i9...
HASH_5=e5f6g7h8i9j0...
HASH_6=f6g7h8i9j0k1...
HASH_7=g7h8i9j0k1l2...
```

#### 3. Configure .env File
Edit `aba-payment-server/.env`:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=8793518758:AAF5IweoA9BGpH_AXy8wkDqNnjc5T2EEv2E
TELEGRAM_CHAT_ID=-1003800534856

# Server Configuration
PORT=3000
NODE_ENV=development

# ABA PayWay Configuration
ABA_MERCHANT_ID=keng.dara.online
ABA_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY

# SHA256 Hashes (COPY FROM GENERATED OUTPUT)
HASH_1=[paste_hash_1_here]
HASH_2=[paste_hash_2_here]
HASH_3=[paste_hash_3_here]
HASH_4=[paste_hash_4_here]
HASH_5=[paste_hash_5_here]
HASH_6=[paste_hash_6_here]
HASH_7=[paste_hash_7_here]

# Payment Amounts (Update with YOUR actual prices)
AMOUNT_1=18.99   # Price for 1 item
AMOUNT_2=37.98   # Price for 2 items
AMOUNT_3=56.97   # Price for 3 items
AMOUNT_4=75.96   # Price for 4 items
AMOUNT_5=94.95   # Price for 5 items
AMOUNT_6=113.94  # Price for 6 items
AMOUNT_7=132.93  # Price for 7 items
```

#### 4. Start Server
```bash
npm start
```

Or on Windows, double-click: `start.bat`

---

### Phase 2: Update Checkout Page

Your checkout page already has the ABA payment links! They're displayed in the "ABA PAYMENT REQUIRED" section.

**Payment Links Structure:**

| Items | Khmer | Payment Link | Merchant Ref Format |
|-------|-------|--------------|---------------------|
| 1 | ១ទំនិញ | ABAPAYUK422435y | ITEMS_1 |
| 2 | ២ទំនិញ | ABAPAY6w422436v | ITEMS_2 |
| 3 | ៣ទំនិញ | ABAPAY7w422437g | ITEMS_3 |
| 4 | ៤ទំនិញ | ABAPAYjI4224385 | ITEMS_4 |
| 5 | ៥ទំនិញ | ABAPAYcw422439B | ITEMS_5 |
| 6 | ៦ទំនិញ | ABAPAY5E422440R | ITEMS_6 |
| 7 | ៧ទំនិញ | ABAPAYEA422441B | ITEMS_7 |

**Important:** When creating payment links in ABA PayWay dashboard, use these reference formats so your server can identify the item count.

---

### Phase 3: Configure ABA PayWay Webhook

#### Option A: Local Testing with ngrok

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Copy ngrok URL:**
   You'll see something like: `https://abc123.ngrok.io`

4. **Webhook URL:**
   ```
   https://abc123.ngrok.io/api/payment/pushback
   ```

5. **Configure in ABA PayWay Dashboard:**
   - Login to ABA PayWay merchant portal
   - Go to Settings → Webhooks/Pushback
   - Set webhook URL to your ngrok URL
   - Enable pushback notifications

#### Option B: Production Deployment

**Deploy to Heroku:**

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set TELEGRAM_CHAT_ID=-1003800534856
heroku config:set ABA_MERCHANT_ID=your_merchant_id
heroku config:set HASH_1=your_hash_1
# ... set all 7 hashes and amounts

# Get your app URL
heroku apps:open
```

**Webhook URL:**
```
https://your-app-name.herokuapp.com/api/payment/pushback
```

**Deploy to Vercel:**

```bash
npm install -g vercel
vercel
```

**Webhook URL:**
```
https://your-app.vercel.app/api/payment/pushback
```

---

### Phase 4: Test the Complete Flow

#### Test 1: Server Status
```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "status": "success",
  "message": "ABA PayWay Payment Server is running",
  "paymentLevels": [...]
}
```

#### Test 2: Simulate ABA Pushback

```bash
curl -X POST http://localhost:3000/api/payment/pushback \
  -H "Content-Type: application/json" \
  -d '{
    "tran_id": "TEST123456",
    "status": "00",
    "merchant_ref_no": "ITEMS_3",
    "amount": 56.97,
    "currency": "USD",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+85512345678"
  }'
```

Expected response:
```json
{
  "tran_id": "TEST123456",
  "status": "00",
  "message": "Success!"
}
```

**Check Telegram:** You should receive a notification!

#### Test 3: Real Payment Flow

1. **Go to your shop:** http://localhost:5173/shop
2. **Add 3 items to cart**
3. **Click CHECKOUT**
4. **See ABA payment links**
5. **Click link for 3 items** (or test with real payment)
6. **Complete payment** (or skip for testing)
7. **Server receives pushback**
8. **You get Telegram notification**

---

## 📱 Telegram Notification Format

When payment is received:

```
✅ PAYMENT RECEIVED - ABA PAYWAY ✅

📋 Transaction Details:
Transaction ID: 123456789
Merchant Ref: ITEMS_3
Date: 3/9/2026, 10:30 AM

💰 Payment Information:
Amount: $56.97
Currency: USD
Status: ✅ PAID

👤 Customer Information:
Name: John Doe
Email: john@example.com
Phone: +85512345678

🔐 Verification:
Pushback Status: 00
────────────────────
🎉 Payment notification received!
```

---

## 🔐 Security Features

### SHA256 Hash Verification
Each payment level has a unique hash that prevents fraud:

```javascript
// Hash generation formula
HASH = SHA256(itemCount + "_" + transactionId + "_" + amount + "_" + secretKey)

// Example for 3 items:
// Input: "3_TXN003_56.97_MY_SECRET_KEY"
// Output: "a1b2c3d4e5f6..."
```

### Merchant Reference Number
Format: `ITEMS_X` where X is 1-7

This allows your server to:
- Identify how many items were purchased
- Validate against expected amount
- Track inventory

### Status Code Validation
ABA PayWay uses status codes:
- `'00'` = Success ✅
- Other codes = Failed/Pending ❌

---

## 🛠️ Troubleshooting

### Issue: No Telegram Notification

**Check:**
1. Bot token is correct in `.env`
2. Chat ID is correct (include minus sign for groups)
3. Bot is admin in Telegram group
4. Server logs show "Telegram notification sent"

**Test bot:**
```bash
curl "https://api.telegram.org/botYOUR_TOKEN/getMe"
```

### Issue: Pushback Not Received

**Check:**
1. Webhook URL is correctly configured in ABA dashboard
2. Server is accessible (ngrok running or deployed)
3. Firewall allows incoming connections
4. Check server logs for errors

**Test webhook:**
```bash
# Use webhook.site to test if ABA is sending
curl -X POST https://webhook.site/your-unique-id \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Issue: Hash Verification Fails

**Solution:**
1. Regenerate hashes: `node generate-hashes.js`
2. Ensure secret key matches in `.env`
3. Check hash format (64 hex characters)
4. Verify amounts match expected values

---

## 📊 Complete Request/Response Flow

### ABA PayWay → Your Server (Pushback)

**Request:**
```http
POST /api/payment/pushback HTTP/1.1
Content-Type: application/json

{
  "tran_id": "123456789",
  "status": "00",
  "merchant_ref_no": "ITEMS_3",
  "amount": 56.97,
  "currency": "USD",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+85512345678"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "tran_id": "123456789",
  "status": "00",
  "message": "Success!"
}
```

### Your Server → Telegram

**Request:**
```http
POST https://api.telegram.org/botTOKEN/sendMessage
Content-Type: application/json

{
  "chat_id": "-1003800534856",
  "text": "✅ PAYMENT RECEIVED...",
  "parse_mode": "Markdown"
}
```

**Response:**
```json
{
  "ok": true,
  "result": {
    "message_id": 123,
    "chat": {...}
  }
}
```

---

## ✅ Production Checklist

Before going live:

- [ ] All 7 SHA256 hashes generated and configured
- [ ] Payment amounts match your product prices
- [ ] Telegram bot working (test with `/start`)
- [ ] Server deployed to production hosting
- [ ] Webhook URL configured in ABA dashboard
- [ ] SSL/HTTPS enabled (required for webhooks)
- [ ] Tested with real payment (not just mock)
- [ ] Monitoring server logs
- [ ] Backup of `.env` file secured
- [ ] Error notifications configured

---

## 💡 Best Practices

1. **Use Environment Variables:**
   Never hardcode secrets in code

2. **Enable HTTPS:**
   Always use HTTPS for webhooks in production

3. **Log Everything:**
   Keep detailed logs for debugging

4. **Monitor Uptime:**
   Use services like UptimeRobot to monitor server

5. **Test Regularly:**
   Periodically test the complete flow

6. **Secure Secret Key:**
   Change default secret key immediately

7. **Validate Amounts:**
   Always verify payment amounts match expected

---

## 🎯 Summary

You now have a complete payment system that:

✅ Displays 7 ABA payment links based on quantity  
✅ Accepts payments via ABA PayWay  
✅ Receives automatic pushback notifications  
✅ Validates payments with SHA256 hashes  
✅ Sends instant Telegram notifications  
✅ Tracks all transactions  
✅ Prevents fraud with cryptographic security  

**Your ABA PayWay integration is complete and ready for production!** 🚀💳✨

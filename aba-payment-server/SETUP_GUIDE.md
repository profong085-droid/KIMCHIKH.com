# 🔐 ABA PayWay Payment Server Setup Guide

## 📋 Overview

This server handles ABA PayWay payment pushback notifications with SHA256 hash verification for 7 payment levels (1-7 items).

---

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
cd aba-payment-server
npm install
```

**Dependencies installed:**
- `express` - Web server framework
- `crypto-js` - SHA256 hash generation/verification
- `body-parser` - Parse POST request data
- `dotenv` - Environment variable management
- `axios` - HTTP client for Telegram API

---

## 🔑 Step 2: Generate SHA256 Hashes for 7 Payment Levels

You need to generate unique SHA256 hashes for each payment level. Use this formula:

```
HASH = SHA256(itemCount + "_" + transactionId + "_" + amount + "_" + secretKey)
```

### Option A: Use the Built-in Generator

Start the server first, then use the endpoint:

```bash
npm start
```

Generate hashes for all 7 levels:

```bash
# For 1 item
curl "http://localhost:3000/api/generate-hash?itemCount=1&transactionId=TXN001&amount=10.00"

# For 2 items
curl "http://localhost:3000/api/generate-hash?itemCount=2&transactionId=TXN002&amount=20.00"

# Continue for 3-7 items...
```

### Option B: Use Online SHA256 Generator

Go to: https://www.sha256online.com/

**Example for 1 item:**
```
Input: 1_TXN001_10.00_yourSecretKey
Output: [SHA256 hash]
```

### Option C: Use Node.js Script

Create `generate-hashes.js`:

```javascript
const CryptoJS = require('crypto-js');

const secretKey = 'YOUR_SECRET_KEY_HERE';
const payments = [
  { count: 1, txId: 'TXN001', amount: 10.00 },
  { count: 2, txId: 'TXN002', amount: 20.00 },
  { count: 3, txId: 'TXN003', amount: 30.00 },
  { count: 4, txId: 'TXN004', amount: 40.00 },
  { count: 5, txId: 'TXN005', amount: 50.00 },
  { count: 6, txId: 'TXN006', amount: 60.00 },
  { count: 7, txId: 'TXN007', amount: 70.00 }
];

console.log('\n=== SHA256 HASHES FOR 7 PAYMENT LEVELS ===\n');

payments.forEach(payment => {
  const hashData = `${payment.count}_${payment.txId}_${payment.amount}_${secretKey}`;
  const hash = CryptoJS.SHA256(hashData).toString(CryptoJS.enc.Hex);
  
  console.log(`HASH_${payment.count}=${hash}`);
  console.log(`  Items: ${payment.count}`);
  console.log(`  Amount: $${payment.amount}`);
  console.log(`  Data: ${hashData}\n`);
});
```

Run it:
```bash
node generate-hashes.js
```

---

## ⚙️ Step 3: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` file with your values:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8793518758:AAF5IweoA9BGpH_AXy8wkDqNnjc5T2EEv2E
TELEGRAM_CHAT_ID=-1003800534856

# Server Configuration
PORT=3000
NODE_ENV=development

# ABA PayWay Configuration
ABA_MERCHANT_ID=your_actual_merchant_id
ABA_SECRET_KEY=your_actual_secret_key

# SHA256 Hashes (Replace with your generated hashes)
HASH_1=[generated_hash_for_1_item]
HASH_2=[generated_hash_for_2_items]
HASH_3=[generated_hash_for_3_items]
HASH_4=[generated_hash_for_4_items]
HASH_5=[generated_hash_for_5_items]
HASH_6=[generated_hash_for_6_items]
HASH_7=[generated_hash_for_7_items]

# Payment Amounts
AMOUNT_1=10.00
AMOUNT_2=20.00
AMOUNT_3=30.00
AMOUNT_4=40.00
AMOUNT_5=50.00
AMOUNT_6=60.00
AMOUNT_7=70.00
```

---

## 🎯 Step 4: Set Payment Amounts

Update the amounts in `.env` to match your actual product prices:

```env
AMOUNT_1=18.99   # Price for 1 item
AMOUNT_2=37.98   # Price for 2 items
AMOUNT_3=56.97   # Price for 3 items
AMOUNT_4=75.96   # Price for 4 items
AMOUNT_5=94.95   # Price for 5 items
AMOUNT_6=113.94  # Price for 6 items
AMOUNT_7=132.93  # Price for 7 items
```

---

## 🚀 Step 5: Start the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════════════╗
║   ABA PAYWAY PAYMENT SERVER STARTED              ║
╚════════════════════════════════════════════════════╝

🚀 Server running on port 3000
📝 Environment: development
🔗 Local URL: http://localhost:3000
🌐 Payment Levels: 7 (1-7 items)
💰 Total Amount Range: $10.00 - $70.00
📬 Telegram Notifications: ✅ Enabled

📡 Available Endpoints:
  GET  /                          - Server status
  GET  /api/test                  - Test endpoint
  GET  /api/payment/levels        - Get all payment levels
  GET  /api/generate-hash         - Generate test hash
  POST /api/payment/pushback      - ABA PayWay webhook
  POST /api/payment/verify        - Manual verification

✨ Server ready to accept payments!
```

---

## 🧪 Step 6: Test the Server

### Test 1: Check Server Status
```bash
curl http://localhost:3000
```

### Test 2: Get Payment Levels
```bash
curl http://localhost:3000/api/payment/levels
```

### Test 3: Send Test Pushback
```bash
curl -X POST http://localhost:3000/api/payment/pushback \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TEST001",
    "itemCount": 3,
    "amount": 30.00,
    "hash": "[YOUR_HASH_3]",
    "paymentStatus": "SUCCESS",
    "customerName": "Test Customer",
    "customerPhone": "+85512345678",
    "timestamp": "2026-03-09T10:30:00Z"
  }'
```

---

## 🔗 Step 7: Configure ABA PayWay Pushback URL

### For Testing (Localhost):
Use ngrok to expose your local server:

```bash
# Install ngrok globally
npm install -g ngrok

# Run ngrok
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

**Pushback URL:** `https://abc123.ngrok.io/api/payment/pushback`

### For Production:
Deploy to a hosting service:

**Options:**
- Heroku: `https://your-app.herokuapp.com/api/payment/pushback`
- Vercel: `https://your-app.vercel.app/api/payment/pushback`
- DigitalOcean: `https://your-domain.com/api/payment/pushback`

Configure this URL in your ABA PayWay merchant dashboard.

---

## 📊 Payment Flow Diagram

```
Customer Order Flow:
┌─────────────┐
│ 1. Customer │
│ adds items  │
│ to cart     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 2. Checkout │
│ page shows  │
│ 7 payment   │
│ links       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 3. Customer │
│ clicks link │
│ based on    │
│ quantity    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 4. ABA      │
│ PayWay      │
│ payment     │
│ page        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 5. Customer │
│ completes   │
│ payment     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 6. ABA      │
│ sends       │
│ pushback ───┼────► Your Server
│ to webhook  │     (Verifies hash)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 7. Server   │
│ verifies    │
│ hash & sends│
│ to Telegram │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 8. You      │
│ receive     │
│ notification│
│ on Telegram │
└─────────────┘
```

---

## 🔐 Hash Verification System

### How It Works:

1. **Hash Generation (Before Payment):**
   ```
   Hash = SHA256(itemCount + "_" + transactionId + "_" + amount + "_" + secretKey)
   ```

2. **Hash Storage:**
   - Store generated hashes in `.env` file
   - One hash per payment level (7 total)

3. **Hash Verification (After Payment):**
   - ABA PayWay sends payment data with hash
   - Server compares received hash with stored hash
   - If match → Payment verified ✓
   - If no match → Payment rejected ✗

### Example Hash Data:

For 3 items with transaction ID `TXN003` and amount `$30.00`:
```
Hash Input: "3_TXN003_30.00_MySecretKey123"
SHA256 Output: "a1b2c3d4e5f6..."
```

---

## 📱 Telegram Notification Format

When payment is received, you'll get:

```
✅ PAYMENT RECEIVED - ABA PAYWAY ✅

📋 Transaction Details:
Transaction ID: TXN001
Date: 3/9/2026, 10:30 AM

💰 Payment Information:
Items: 3 (៣ទំនិញ)
Amount: $30.00
Status: ✅ PAID

👤 Customer Information:
Name: John Doe
Phone: +85512345678

🔐 Security:
Hash Verification: ✅ VALID
Payment Level: 3 of 7

━━━━━━━━━━━━━━━━━━━━
🎉 Payment verified successfully!
```

---

## 🛠️ Troubleshooting

### Issue: Hash Verification Fails

**Solution:**
1. Check that hash in `.env` matches generated hash
2. Verify hash generation formula is correct
3. Ensure secret key matches

### Issue: Telegram Notifications Not Working

**Solution:**
1. Verify `TELEGRAM_BOT_TOKEN` in `.env`
2. Verify `TELEGRAM_CHAT_ID` in `.env`
3. Check bot is added to Telegram group
4. Test bot token: `https://api.telegram.org/bot<YOUR_TOKEN>/getMe`

### Issue: Server Won't Start

**Solution:**
1. Check all dependencies installed: `npm install`
2. Check `.env` file exists
3. Check port 3000 is not in use
4. Try different port: `PORT=3001` in `.env`

---

## 📝 Testing Checklist

- [ ] Server starts successfully
- [ ] All 7 hashes generated and stored in `.env`
- [ ] Payment levels display correctly at `/api/payment/levels`
- [ ] Test pushback sends successfully
- [ ] Telegram notification received
- [ ] Hash verification works
- [ ] Amount validation works
- [ ] Ngrok tunnel working (for testing)

---

## 🎯 Next Steps

1. ✅ Complete setup following this guide
2. ✅ Generate all 7 SHA256 hashes
3. ✅ Update `.env` with your hashes and amounts
4. ✅ Test locally with ngrok
5. ✅ Deploy to production hosting
6. ✅ Configure ABA PayWay webhook URL
7. ✅ Test with real payment

---

## 📞 Support

If you need help:
1. Check server logs for error messages
2. Verify all environment variables are set
3. Test each endpoint individually
4. Review hash generation formula

**Your ABA PayWay payment server is ready!** 🎉💳✨

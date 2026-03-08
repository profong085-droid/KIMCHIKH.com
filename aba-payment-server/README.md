# 🏦 ABA PayWay Payment Server with SHA256 Hash Verification

## 📋 Overview

Complete Node.js server for receiving ABA PayWay payment pushback notifications with **7-level SHA256 hash verification** for automatic payment validation.

---

## ✨ Features

✅ **7 Payment Levels** - One for each item quantity (1-7 items)  
✅ **SHA256 Hash Verification** - Secure payment validation  
✅ **Automatic Telegram Notifications** - Instant alerts when payment received  
✅ **Pushback/Webhook Support** - ABA PayWay integration ready  
✅ **Hash Generator Script** - Easy setup with included generator  
✅ **Amount Validation** - Verify payment matches expected amount  
✅ **Transaction Logging** - Complete audit trail  
✅ **Test Endpoints** - Built-in testing tools  

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd aba-payment-server
npm install
```

### 2. Generate SHA256 Hashes

```bash
node generate-hashes.js
```

Copy the generated hashes to `.env` file.

### 3. Configure Environment

Edit `.env` file with your:
- Generated SHA256 hashes (HASH_1 through HASH_7)
- Actual payment amounts
- Telegram bot credentials

### 4. Start Server

```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## 🔐 SHA256 Hash System

### Hash Generation Formula

```
HASH = SHA256(itemCount + "_" + transactionId + "_" + amount + "_" + secretKey)
```

### Example Hash Data

For 3 items, Transaction ID "TXN003", Amount $30.00:
```
Input: "3_TXN003_30.00_KIMCHI_SHOP_2026_SECRET"
Output: "a1b2c3d4e5f6g7h8i9j0..." (64 character hex string)
```

### 7 Payment Levels

| Level | Items | Khmer | Amount | Hash Variable |
|-------|-------|-------|--------|---------------|
| 1 | ១ទំនិញ | 1 item | $10.00 | HASH_1 |
| 2 | ២ទំនិញ | 2 items | $20.00 | HASH_2 |
| 3 | ៣ទំនិញ | 3 items | $30.00 | HASH_3 |
| 4 | ៤ទំនិញ | 4 items | $40.00 | HASH_4 |
| 5 | ៥ទំនិញ | 5 items | $50.00 | HASH_5 |
| 6 | ៦ទំនិញ | 6 items | $60.00 | HASH_6 |
| 7 | ៧ទំនិញ | 7 items | $70.00 | HASH_7 |

---

## 📡 API Endpoints

### GET `/`
Server status and payment levels overview.

### GET `/api/test`
Test endpoint to verify server is running.

### GET `/api/payment/levels`
Get all 7 payment levels with configuration status.

**Response:**
```json
{
  "status": "success",
  "totalLevels": 7,
  "levels": [
    {
      "itemCount": 1,
      "amount": 10.00,
      "khmer": "១ទំនិញ",
      "link": "https://link.payway.com.kh/ABAPAYUK422435y",
      "hashConfigured": true
    },
    // ... levels 2-7
  ]
}
```

### GET `/api/generate-hash`
Generate SHA256 hash for testing.

**Parameters:**
- `itemCount` - Number of items (1-7)
- `transactionId` - Transaction identifier
- `amount` - Payment amount

**Example:**
```bash
curl "http://localhost:3000/api/generate-hash?itemCount=3&transactionId=TXN003&amount=30.00"
```

**Response:**
```json
{
  "status": "success",
  "itemCount": 3,
  "transactionId": "TXN003",
  "amount": 30.00,
  "hash": "a1b2c3d4e5f6...",
  "hashData": "3_TXN003_30.00_KIMCHI_SHOP_2026_SECRET"
}
```

### POST `/api/payment/pushback` ⭐ **MAIN ENDPOINT**
ABA PayWay webhook endpoint for payment notifications.

**Request Body:**
```json
{
  "transactionId": "TXN003",
  "itemCount": 3,
  "amount": 30.00,
  "hash": "[SHA256_HASH]",
  "paymentStatus": "SUCCESS",
  "customerName": "John Doe",
  "customerPhone": "+85512345678",
  "timestamp": "2026-03-09T10:30:00Z"
}
```

**Validation Process:**
1. ✅ Verify hash matches stored HASH_3
2. ✅ Verify amount matches expected $30.00
3. ✅ Verify itemCount is between 1-7
4. ✅ Check payment status
5. ✅ Send Telegram notification

**Success Response:**
```json
{
  "status": "success",
  "message": "Payment verified and notification sent",
  "transactionId": "TXN003",
  "itemCount": 3,
  "amount": 30.00,
  "verified": true
}
```

### POST `/api/payment/verify`
Manual payment verification endpoint.

**Request Body:**
```json
{
  "transactionId": "TXN003",
  "itemCount": 3,
  "amount": 30.00,
  "hash": "[SHA256_HASH]"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "verification": {
    "transactionId": "TXN003",
    "itemCount": 3,
    "amount": 30.00,
    "expectedAmount": 30.00,
    "hashValid": true,
    "amountValid": true,
    "levelValid": true,
    "overall": true
  }
}
```

---

## 🔗 Payment Flow

```
┌──────────────┐
│   Customer   │
│   Orders     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Select Link  │◄─── Based on item quantity
│ (1-7 items)  │
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
│ Pays         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ABA Sends    │
│ Pushback ────┼────► Your Server
│ with Hash    │     (Port 3000)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │
│ Verifies:    │
│ ✓ Hash       │
│ ✓ Amount     │
│ ✓ Level      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Send to      │
│ Telegram ────┼────► You Get Notified
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Payment      │
│ Complete!    │
└──────────────┘
```

---

## 📱 Telegram Notification Example

When payment is received and verified:

```
✅ PAYMENT RECEIVED - ABA PAYWAY ✅

📋 Transaction Details:
Transaction ID: TXN003
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

## 🛠️ Installation & Setup

### Step-by-Step Guide

See **SETUP_GUIDE.md** for complete installation instructions.

**Quick version:**

1. **Install:**
   ```bash
   npm install
   ```

2. **Generate Hashes:**
   ```bash
   node generate-hashes.js
   ```

3. **Configure .env:**
   - Copy generated hashes
   - Set your amounts
   - Add Telegram credentials

4. **Start:**
   ```bash
   npm start
   ```

5. **Test:**
   ```bash
   curl http://localhost:3000
   ```

---

## 🧪 Testing

### Test Server Status
```bash
curl http://localhost:3000
```

### Test Payment Levels
```bash
curl http://localhost:3000/api/payment/levels
```

### Test Pushback (Replace HASH with actual)
```bash
curl -X POST http://localhost:3000/api/payment/pushback \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TEST003",
    "itemCount": 3,
    "amount": 30.00,
    "hash": "[YOUR_HASH_3]",
    "paymentStatus": "SUCCESS",
    "customerName": "Test User",
    "customerPhone": "+85512345678"
  }'
```

---

## 🌐 Deployment

### Local Testing (ngrok)

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000
```

Use the ngrok URL as your ABA PayWay webhook:
```
https://abc123.ngrok.io/api/payment/pushback
```

### Production Hosting

**Recommended Services:**
- Heroku
- Vercel
- DigitalOcean
- AWS EC2

**Example for Heroku:**
```bash
# Deploy to Heroku
heroku create your-app-name
git push heroku main
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set HASH_1=your_hash_1
# ... set all env variables
```

---

## 📊 Files Structure

```
aba-payment-server/
├── server.js              # Main server code
├── generate-hashes.js     # Hash generator script
├── package.json           # Dependencies
├── .env                   # Environment variables (CONFIGURE THIS)
├── .env.example          # Environment template
├── SETUP_GUIDE.md        # Detailed setup guide
└── README.md             # This file
```

---

## 🔒 Security Features

✅ **SHA256 Hash Verification** - Cryptographic security  
✅ **Amount Validation** - Prevents underpayment  
✅ **Level Validation** - Ensures 1-7 items only  
✅ **Transaction ID Tracking** - Audit trail  
✅ **Secret Key Protection** - Environment variables  
✅ **Telegram Bot Authentication** - Secure notifications  

---

## 🎯 Configuration Checklist

- [ ] Install Node.js dependencies
- [ ] Run hash generator script
- [ ] Copy 7 hashes to `.env`
- [ ] Set correct payment amounts
- [ ] Configure Telegram bot token
- [ ] Configure Telegram chat ID
- [ ] Set secret key in `.env`
- [ ] Start server
- [ ] Test endpoints
- [ ] Set up ngrok or deploy
- [ ] Configure ABA PayWay webhook URL

---

## 💡 Tips

1. **Keep Secret Key Secret** - Never share your `ABA_SECRET_KEY`
2. **Backup .env File** - Contains all your configuration
3. **Test Thoroughly** - Use test endpoint before going live
4. **Monitor Logs** - Server logs show all payment attempts
5. **Update Amounts** - Match `.env` amounts to your product prices
6. **Use HTTPS** - Always use HTTPS in production
7. **Change Default Secret** - Replace default secret key immediately

---

## 🆘 Troubleshooting

**Hash verification fails:**
- Regenerate hashes with `node generate-hashes.js`
- Ensure secret key matches in `.env`
- Check hash format (64 characters, hex)

**Server won't start:**
- Check port 3000 is available
- Verify `.env` file exists
- Run `npm install` again

**No Telegram notification:**
- Verify bot token is correct
- Verify chat ID is correct (include minus sign for groups)
- Check bot is admin in group

---

## 📞 Support

For issues or questions:
1. Check `SETUP_GUIDE.md`
2. Review server logs
3. Test endpoints individually
4. Verify all environment variables

---

## 🎉 Success!

Your ABA PayWay payment server with SHA256 hash verification is ready! 🚀

**Features Implemented:**
✅ 7-level payment system  
✅ SHA256 hash verification  
✅ Automatic Telegram notifications  
✅ Pushback webhook support  
✅ Hash generator script  
✅ Complete documentation  

**Next:** Follow SETUP_GUIDE.md to configure and start accepting payments! 💳✨

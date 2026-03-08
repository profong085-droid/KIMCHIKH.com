# 📡 ABA PayWay Pushback Notification Format

## Standard ABA PayWay Pushback

### Request Format from ABA

```json
{
  "tran_id": "123456789",
  "status": "00",
  "merchant_ref_no": "ITEMS_3"
}
```

### Full Pushback with Optional Fields

```json
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

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tran_id` | string | ✅ Yes | ABA transaction ID (unique) |
| `status` | string | ✅ Yes | Payment status code |
| `merchant_ref_no` | string | ⚠️ Usually | Your merchant reference number |
| `amount` | number | ❌ No | Payment amount |
| `currency` | string | ❌ No | Currency code (USD, KHR) |
| `first_name` | string | ❌ No | Customer first name |
| `last_name` | string | ❌ No | Customer last name |
| `email` | string | ❌ No | Customer email |
| `phone` | string | ❌ No | Customer phone |

---

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `00` | ✅ Success | Payment completed successfully |
| `01` | ❌ Failed | Payment failed |
| `02` | ⏳ Pending | Payment pending verification |
| Other | ❌ Invalid | Unknown status |

---

## Your Server's Response

### Success Response
```json
{
  "tran_id": "123456789",
  "status": "00",
  "message": "Success!"
}
```

### Error Response
```json
{
  "status": "99",
  "message": "Internal server error",
  "error": "Error details here"
}
```

---

## Merchant Reference Number Format

Your system uses this format: `ITEMS_X`

| Format | Items | Example |
|--------|-------|---------|
| `ITEMS_1` | 1 item | ១ទំនិញ |
| `ITEMS_2` | 2 items | ២ទំនិញ |
| `ITEMS_3` | 3 items | ៣ទំនិញ |
| `ITEMS_4` | 4 items | ៤ទំនិញ |
| `ITEMS_5` | 5 items | ៥ទំនិញ |
| `ITEMS_6` | 6 items | ៦ទំនិញ |
| `ITEMS_7` | 7 items | ៧ទំនិញ |

**Server extracts item count:**
```javascript
const match = merchant_ref_no.match(/ITEMS_(\d+)/);
const itemCount = parseInt(match[1]); // 1-7
```

---

## Sample cURL Test Commands

### Test Successful Payment
```bash
curl -X POST http://localhost:3000/api/payment/pushback \
  -H "Content-Type: application/json" \
  -d '{
    "tran_id": "TEST001",
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

### Test Failed Payment
```bash
curl -X POST http://localhost:3000/api/payment/pushback \
  -H "Content-Type: application/json" \
  -d '{
    "tran_id": "TEST002",
    "status": "01",
    "merchant_ref_no": "ITEMS_2"
  }'
```

### Test Minimal Payload
```bash
curl -X POST http://localhost:3000/api/payment/pushback \
  -H "Content-Type: application/json" \
  -d '{
    "tran_id": "TEST003",
    "status": "00"
  }'
```

---

## Webhook URL Configuration

### For Local Testing (ngrok)
```
https://abc123.ngrok.io/api/payment/pushback
```

### For Production

**Heroku:**
```
https://your-app.herokuapp.com/api/payment/pushback
```

**Vercel:**
```
https://your-app.vercel.app/api/payment/pushback
```

**DigitalOcean/VPS:**
```
https://your-domain.com/api/payment/pushback
```

---

## What Happens When Pushback is Received

```
1. ABA PayWay sends POST request
   ↓
2. Server receives at /api/payment/pushback
   ↓
3. Extract fields: tran_id, status, merchant_ref_no
   ↓
4. Validate required fields present
   ↓
5. Check status code ('00' = success)
   ↓
6. Extract item count from merchant_ref_no
   ↓
7. Get amount if provided
   ↓
8. Format Telegram message
   ↓
9. Send to Telegram bot API
   ↓
10. Respond to ABA with success acknowledgment
```

---

## Telegram Message Format

When pushback received:

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

## Error Handling

### Missing Required Fields
```json
{
  "status": "error",
  "message": "Missing required fields: tran_id and status"
}
```

### Invalid Status Code
Server still acknowledges but notes non-success status:
```json
{
  "tran_id": "TEST002",
  "status": "00",
  "message": "Notification received but payment status: 01"
}
```

### Server Error
```json
{
  "status": "99",
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## Logging Format

Server logs show:
```
========== ABA PAYWAY PUSHBACK NOTIFICATION ==========
Timestamp: 2026-03-09T10:30:00Z
Request Body: {
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

📥 Received pushback:
   Transaction ID: 123456789
   Status Code: 00
   Merchant Ref: ITEMS_3
💰 Payment Status: ✅ SUCCESS
📦 Extracted item count from merchant_ref_no: 3
💵 Amount: $56.97
✅ Payment notification sent to Telegram
```

---

## Quick Reference Table

| Action | Endpoint | Method |
|--------|----------|--------|
| Receive pushback | `/api/payment/pushback` | POST |
| Test server | `/` | GET |
| Get payment levels | `/api/payment/levels` | GET |
| Generate hash | `/api/generate-hash` | GET |
| Manual verify | `/api/payment/verify` | POST |

---

## Important Notes

⚠️ **Always respond with HTTP 200** to ABA even if processing fails  
⚠️ **Log everything** for debugging payment disputes  
⚠️ **Validate status code** before considering payment successful  
⚠️ **Use HTTPS** in production for webhook security  
⚠️ **Monitor webhook uptime** to ensure you receive all notifications  

---

**This is your complete reference for ABA PayWay pushback notifications!** 📡✅

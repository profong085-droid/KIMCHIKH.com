# 🎯 របៀបកំណត់ Telegram Group សម្រាប់ទទួល Order - KIMCHI Shop

## ⚠️ បញ្ហា និង ដំណោះស្រាយ

**បញ្ហា:** Bot មិនអាចផ្ញើសារទៅ Bot ផ្សេងទៀតបានទេ (Forbidden: bots can't send messages to bots)

**ដំណោះស្រាយ:** ប្រើ **Group Chat** ដែលងាយស្រួលបំផុត!

---

## 📋 ជំហានលម្អិត (៥ ជំហាន)

### ជំហានទី ១: បង្កើត Telegram Group

1. **បើក Telegram** នៅលើទូរសព្ទ ឬកុំព្យូទ័រ
2. **ចុច Menu** → **New Group**
3. **ដាក់ឈ្មោះ Group:** `KIMCHI Shop Orders` (ឬឈ្មោះណាដែលអ្នកចង់បាន)
4. **បន្ថែមសមាជិក:** 
   - ចុច "Add Members"
   - ស្វែងរក **Bot របស់អ្នក** (ស្វែងរកតាម username)
   - ជ្រើសរើស Bot → ចុច Done

✅ **សម្រេច:** អ្នកមាន Group ហើយ Bot របស់អ្នកនៅក្នុង Group!

---

### ជំហានទី ២: កំណត់ Bot ជា Admin

1. **ចូលទៅកាន់ Group** ដែលទើបបង្កើត
2. **ចុចលើឈ្មោះ Group** (ខាងលើ)
3. **ចុច Edit** (រូបតំណាងដើមប៊ិច ✏️)
4. **ចុច "Administrators"** → **"Add Admin"**
5. **ជ្រើសរើស Bot** របស់អ្នក
6. **ផ្តល់សិទ្ធិ:**
   - ✅ Send Messages
   - ✅ Read Messages  
   - ✅ Send Media
   - ❌ មិនចាំបាច់ផ្តល់សិទ្ធិផ្សេងទៀតទេ
7. **ចុច Save** (✓)

✅ **សម្រេច:** Bot របស់អ្នកជា Admin ហើយ!

---

### ជំហានទី ៣: ផ្ញើសារសាកល្បង

1. **ចូលទៅកាន់ Group**
2. **ផ្ញើសារណាមួយ:** `Test Order` ឬ `សាកល្បង`
3. **រង់ចាំ ៥-១០ វិនាទី**

✅ **សម្រេច:** សាររបស់អ្នកត្រូវបានផ្ញើ!

---

### ជំហានទី ៤: ទាញយក Group Chat ID

#### វិធីទី ១: ប្រើ Browser (ងាយស្រួលបំផុត)

1. **បើក URL នេះ** នៅក្នុង Chrome ឬ Browser ផ្សេង:
   ```
   https://api.telegram.org/bot8793518758:AAF5IweoA9BGpH_AXy8wkDqNnjc5T2EEv2E/getUpdates
   ```

2. **អ្នកនឹងឃើញ JSON Response** បែបនេះ:
   ```json
   {
     "ok": true,
     "result": [
       {
         "update_id": 123456789,
         "message": {
           "message_id": 1,
           "from": {
             "id": 123456789,
             "is_bot": false,
             "first_name": "Your Name"
           },
           "chat": {
             "id": -1001234567890,  ← នេះជា Group Chat ID!
             "title": "KIMCHI Shop Orders",
             "type": "supergroup"
           },
           "date": 1234567890,
           "text": "Test Order"
         }
       }
     ]
   }
   ```

3. **រកមើល `"chat":{"id":...}`**
   - Copy លេខក្រោយ `"id":` 
   - **ឧទាហរណ៍:** `-1001234567890`
   - ⚠️ **សំខាន់ណាស់:** Group ID តែងតែមានសញ្ញា **`-`** (អវិជ្ជមាន) នៅពីមុខ!

4. **Copy លេខនេះ** (ទាំងសញ្ញា `-`)

#### វិធីទី ២: ប្រើ @RawDataBot (ជំរើសផ្សេង)

1. **ស្វែងរក:** `@RawDataBot` នៅលើ Telegram
2. **ចុច Start**
3. **Forward** សារពី Group របស់អ្នកទៅ @RawDataBot
4. **វានឹងផ្ញើ JSON** មកវិញ
5. **រកមើល `"chat":{"id":-1001234567890}`**
6. **Copy លេខ ID**

✅ **សម្រេច:** អ្នកមាន Group Chat ID ហើយ!

---

### ជំហានទី ៥: អាប់ដេតកូដ

1. **បើក File:** `src/app/components/CheckoutModal.tsx`
2. **រក Line ១៨** (ជិតខាងលើ):
   ```typescript
   const TELEGRAM_CHAT_ID = ""; // TODO: Paste your Group Chat ID here
   ```

3. **Replace ជាមួយ Group ID** របស់អ្នក:
   ```typescript
   const TELEGRAM_CHAT_ID = "-1001234567890"; // Group Chat ID
   ```

   **ឧទាហរណ៍:** បើ Group ID របស់អ្នកគឺ `-100987654321`:
   ```typescript
   const TELEGRAM_CHAT_ID = "-100987654321";
   ```

4. **Save File** (Ctrl+S)

✅ **សម្រេច:** កូដរបស់អ្នកត្រៀមរួចរាល់!

---

## 🧪 ធ្វើតេស្ត

### ជំហានទី ១: ចូល Website

1. **បើក:** http://localhost:5175/
2. **ទៅកាន់:** `/shop`
3. **ជ្រើសរើស Product** ណាមួយ
4. **ចុច QUICK VIEW**
5. **ជ្រើសរើស Size, Color, Quantity**
6. **ចុច ADD TO CART**

### ជំហានទី ២: ធ្វើ Checkout

1. **ចុច Cart Icon** (រូបថង់ទំនិញ)
2. **ពិនិត្យមើល Items** នៅក្នុង Cart Drawer
3. **ចុច CHECKOUT**
4. **បំពេញ Form:**
   - Name: `Test Customer`
   - Email: `test@example.com`
   - Phone: `+85512345678`
   - Address: `123 Test Street`
   - City: `Phnom Penh`
   - Postal Code: `12000`
   - Country: `Cambodia`
5. **ចុច COMPLETE ORDER**

### ជំហានទី ៣: ពិនិត្យ Telegram

1. **បើក Telegram**
2. **ចូលទៅកាន់ Group** `KIMCHI Shop Orders`
3. **អ្នកនឹងឃើញសារ Order** ក្នុងពេល ១-២ វិនាទី!

✅ **សម្រេច:** Order របស់អ្នកចូល Group ហើយ!

---

## 📨 ឧទាហរណ៍សារនឹងចូល Group

```
🛍️ NEW ORDER - KIMCHI SHOP 🛍️

📋 Order Details:
Order Number: ORD-1709234567890
Date: 3/9/2026, 2:00 AM

🛒 Items:
• KIMCHI RACING JERSEY - Size: L, Color: Red
  Quantity: 2 × $89.99 = $179.98

💰 Payment Summary:
Subtotal: $179.98
Total: $179.98

👤 Customer Information:
Name: Test Customer
Email: test@example.com
Phone: +85512345678

📍 Shipping Address:
123 Test Street
Phnom Penh, 12000
Cambodia

━━━━━━━━━━━━━━━━━━━━
Thank you for your order!
```

---

## ❓ បញ្ហាដែលជួបប្រទះញឹកញាប់

### ❌ មិនឃើញសារចូល Group?

**មូលហេតុ:**
1. Bot មិនមែនជា Admin
2. Bot មិនអាចអានសារបាន (Privacy Mode)
3. Chat ID មិនត្រឹមត្រូវ

**ដំណោះស្រាយ:**
1. ✅ ពិនិត្យមើល Bot ជា Admin ឬនៅ?
2. ✅ ពិនិត្យមើល Chat ID មានសញ្ញា `-` ឬនៅ?
3. ✅ ផ្ញើសារចូល Group ម្តងទៀត
4. ✅ ចូលទៅ `getUpdates` URL ដើម្បីមើល ID ថ្មី

### ❌ ឃើញ Error "Chat not found"?

**មូលហេតុ:** Chat ID មិនត្រឹមត្រូវ

**ដំណោះស្រាយ:**
1. ✅ ពិនិត្យមើល ID មានសញ្ញា `-` នៅពីមុខ
2. ✅ Copy ID ឱ្យបានត្រឹមត្រូវ (កុំឱ្យលើស ឬខ្វះលេខ)
3. ✅ ពិនិត្យមើល ID ម្តងទៀតពី `getUpdates`

### ❌ ឃើញ Error "Unauthorized"?

**មូលហេតុ:** Bot ត្រូវបាន Remove ឬ Block

**ដំណោះស្រាយ:**
1. ✅ ពិនិត្យមើល Bot នៅក្នុង Group ឬនៅ?
2. ✅ បើ Bot ត្រូវបាន Remove → Add វាម្តងទៀត
3. ✅ កំណត់ Bot ជា Admin ម្តងទៀត

---

## 🎯 គន្លឹះសំខាន់ៗ

### ✅ អ្វីដែលត្រូវធ្វើ:

- ✅ បង្កើត Group ហើយ Add Bot ចូល
- ✅ កំណត់ Bot ជា Admin (Send Messages + Read Messages)
- ✅ ផ្ញើសារសាកល្បងចូល Group
- ✅ Copy Group ID ពី `getUpdates` (មានសញ្ញា `-`)
- ✅ Paste ID ចូលក្នុងកូដ
- ✅ ធ្វើតេស្ត Order

### ❌ អ្វីដែលមិនត្រូវធ្វើ:

- ❌ ប្រើ Bot ID (`8793518758`) ← នេះជា Bot មិនមែន Group!
- ❌ ភ្លេចសញ្ញា `-` នៅពីមុខ Group ID
- ❌ កំណត់ Bot មិនមែនជា Admin
- ❌ មិនផ្ញើសារសាកល្បងមុននឹង Copy ID

---

## 🔧 ជម្រើសផ្សេងទៀត (សម្រាប់អ្នកជំនាញ)

### វិធីទី ២: ប្រើ Personal Chat ID

បើអ្នកមិនចង់ប្រើ Group ទេ អ្នកអាច:

1. **ទាញយក Personal Chat ID** ពី `@userinfobot`
2. **ផ្ញើសារទៅ Bot** របស់អ្នកផ្ទាល់
3. **ប្រើ ID នោះ** (វិជ្ជមាន គ្មានសញ្ញា `-`)

**គុណសម្បត្តិ:** ងាយស្រួល រក្សា Order ជាឯកជន  
**គុណវិបត្តិ:** មិនល្អសម្រាប់ក្រុមហ៊ុន (មិនមាន Team access)

### វិធីទី ៣: ប្រើ Channel

1. **បង្កើត Channel** (មិនមែន Group)
2. **Add Bot ជា Admin**
3. **ប្រើ Channel Username** (ឧទាហរណ៍: `@kimchishop_orders`)

**គុណសម្បត្តិ:** សាធារណជនមើលបាន  
**គុណវិបត្តិ:** ត្រូវកំណត់ Channel ជា Public

---

## 📞 ត្រូវការជំនួយ?

បើអ្នកនៅតែមានបញ្ហា:

1. **ពិនិត្យមើល Browser Console** (F12)
2. **រកមើល Error Message**
3. **ថតរូប Screenshot** នៃ Error
4. **ពិនិត្យមើល** `getUpdates` URL ម្តងទៀត

**ឯកសារជំនួយ:**
- `FIX_TELEGRAM_CHAT_ID.md` - ការណែនាំលម្អិត
- `TELEGRAM_ERROR_FIXED.md` - ដំណោះស្រាយកំហុស
- `QUICK_START_TELEGRAM.md` - ចាប់ផ្តើមរហ័ស

---

## ✨ សង្ខេប

**៥ ជំហានសំខាន់ៗ:**

1. ✅ បង្កើត Group
2. ✅ Add Bot ចូល Group
3. ✅ កំណត់ Bot ជា Admin
4. ✅ ផ្ញើសារ → Copy Group ID (មាន `-`)
5. ✅ អាប់ដេតកូដ → ធ្វើតេស្ត Order

**រយៈពេលសរុប:** ៥-១០ នាទី  
**កម្រិត:** ងាយស្រួល ⭐⭐⭐⭐⭐

**លទ្ធផល:** Order នីមួយៗនឹងចូល Telegram Group ភ្លាមៗ! 🎉

---

**KIMCHI Shop របស់អ្នកនឹងទទួលបាន Order តាម Telegram ហើយ!** 🛍️🚀

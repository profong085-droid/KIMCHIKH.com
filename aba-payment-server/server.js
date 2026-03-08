require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Payment Configuration - 7 Levels
const PAYMENT_LEVELS = {
  1: {
    hash: process.env.HASH_1,
    amount: parseFloat(process.env.AMOUNT_1) || 10.00,
    link: 'https://link.payway.com.kh/ABAPAYUK422435y',
    khmer: '១ទំនិញ'
  },
  2: {
    hash: process.env.HASH_2,
    amount: parseFloat(process.env.AMOUNT_2) || 20.00,
    link: 'https://link.payway.com.kh/ABAPAY6w422436v',
    khmer: '២ទំនិញ'
  },
  3: {
    hash: process.env.HASH_3,
    amount: parseFloat(process.env.AMOUNT_3) || 30.00,
    link: 'https://link.payway.com.kh/ABAPAY7w422437g',
    khmer: '៣ទំនិញ'
  },
  4: {
    hash: process.env.HASH_4,
    amount: parseFloat(process.env.AMOUNT_4) || 40.00,
    link: 'https://link.payway.com.kh/ABAPAYjI4224385',
    khmer: '៤ទំនិញ'
  },
  5: {
    hash: process.env.HASH_5,
    amount: parseFloat(process.env.AMOUNT_5) || 50.00,
    link: 'https://link.payway.com.kh/ABAPAYcw422439B',
    khmer: '៥ទំនិញ'
  },
  6: {
    hash: process.env.HASH_6,
    amount: parseFloat(process.env.AMOUNT_6) || 60.00,
    link: 'https://link.payway.com.kh/ABAPAY5E422440R',
    khmer: '៦ទំនិញ'
  },
  7: {
    hash: process.env.HASH_7,
    amount: parseFloat(process.env.AMOUNT_7) || 70.00,
    link: 'https://link.payway.com.kh/ABAPAYEA422441B',
    khmer: '៧ទំនិញ'
  }
};

// Generate SHA256 Hash for payment verification
function generateHash(data) {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

// Verify payment hash
function verifyHash(itemCount, receivedHash) {
  const paymentLevel = PAYMENT_LEVELS[itemCount];
  if (!paymentLevel) {
    return false;
  }
  
  // Compare with stored hash
  return paymentLevel.hash === receivedHash;
}

// Escape markdown for Telegram (prevent parsing errors)
function escapeMarkdown(text) {
  if (!text) return '';
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

// Send notification to Telegram
async function sendTelegramNotification(message) {
  try {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!telegramBotToken || !telegramChatId) {
      console.log('⚠️ Telegram not configured, skipping notification');
      return;
    }
    
    const response = await axios.post(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown'
      }
    );
    
    console.log('✅ Telegram notification sent');
    return response.data;
  } catch (error) {
    console.error('❌ Telegram notification failed:', error.message);
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'ABA PayWay Payment Server is running',
    timestamp: new Date().toISOString(),
    paymentLevels: Object.keys(PAYMENT_LEVELS).map(count => ({
      itemCount: parseInt(count),
      amount: PAYMENT_LEVELS[count].amount,
      khmer: PAYMENT_LEVELS[count].khmer,
      link: PAYMENT_LEVELS[count].link
    }))
  });
});

// Generate hash endpoint (for testing/setup)
app.get('/api/generate-hash', (req, res) => {
  const { itemCount, transactionId, amount } = req.query;
  
  if (!itemCount || !transactionId || !amount) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required parameters: itemCount, transactionId, amount'
    });
  }
  
  // Create hash data
  const hashData = `${itemCount}_${transactionId}_${amount}_${process.env.ABA_SECRET_KEY || 'secret'}`;
  const hash = generateHash(hashData);
  
  res.json({
    status: 'success',
    itemCount: parseInt(itemCount),
    transactionId,
    amount: parseFloat(amount),
    hash: hash,
    hashData: hashData
  });
});

// ABA PayWay Pushback/Webhook endpoint
// Based on ABA PayWay documentation: POST with tran_id, status, merchant_ref_no
app.post('/api/payment/pushback', async (req, res) => {
  console.log('\n========== ABA PAYWAY PUSHBACK NOTIFICATION ==========');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // ABA PayWay standard pushback format
    const {
      tran_id,           // Transaction ID from ABA
      status,            // Payment status code ('00' = success)
      merchant_ref_no,   // Your merchant reference number
      // Additional fields that might be sent
      amount,
      currency,
      first_name,
      last_name,
      email,
      phone
    } = req.body;
    
    console.log(`📥 Received pushback:`);
    console.log(`   Transaction ID: ${tran_id || 'N/A'}`);
    console.log(`   Status Code: ${status || 'N/A'}`);
    console.log(`   Merchant Ref: ${merchant_ref_no || 'N/A'}`);
    
    // Validate basic fields
    if (!tran_id || !status) {
      console.log('❌ Missing required fields from ABA PayWay');
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: tran_id and status'
      });
    }
    
    // Check if payment was successful (ABA uses '00' for success)
    const isPaymentSuccessful = status === '00' || status === 'SUCCESS' || status === 'COMPLETED';
    
    console.log(`💰 Payment Status: ${isPaymentSuccessful ? '✅ SUCCESS' : '❌ FAILED/INVALID'}`);
    
    // Try to extract item count from merchant_ref_no
    // Format expected: "ITEMS_X" where X is 1-7
    let itemCountNum = 0;
    let amountNum = 0;
    
    if (merchant_ref_no) {
      const match = merchant_ref_no.match(/ITEMS_(\d+)/);
      if (match && match[1]) {
        itemCountNum = parseInt(match[1]);
        console.log(`📦 Extracted item count from merchant_ref_no: ${itemCountNum}`);
      }
    }
    
    // Get amount if provided
    if (amount) {
      amountNum = parseFloat(amount);
      console.log(`💵 Amount: $${amountNum.toFixed(2)}`);
    }
    
    // Send Telegram notification
    if (isPaymentSuccessful) {
      const customerName = [first_name, last_name].filter(Boolean).join(' ') || 'Not provided';
      
      const telegramMessage = 
        '✅ *PAYMENT RECEIVED - ABA PAYWAY* ✅\n\n' +
        '📋 *Transaction Details:*\n' +
        'Transaction ID: `' + tran_id + '`\n' +
        'Merchant Ref: `' + (merchant_ref_no || 'N/A') + '`\n' +
        'Date: ' + new Date().toLocaleString() + '\n\n' +
        '💰 *Payment Information:*\n' +
        'Amount: $' + (amountNum > 0 ? amountNum.toFixed(2) : 'N/A') + '\n' +
        'Currency: ' + (currency || 'USD') + '\n' +
        'Status: ✅ PAID\n\n' +
        '👤 *Customer Information:*\n' +
        'Name: ' + escapeMarkdown(customerName) + '\n' +
        'Email: ' + (email || 'Not provided') + '\n' +
        'Phone: ' + (phone || 'Not provided') + '\n\n' +
        '🔐 *Verification:*\n' +
        'Pushback Status: ' + status + '\n' +
        '────────────────────\n' +
        '🎉 Payment notification received!';
      
      await sendTelegramNotification(telegramMessage);
      
      console.log('✅ Payment notification sent to Telegram');
      
      // Respond with success to ABA PayWay
      res.json({
        tran_id: tran_id,
        status: '00',
        message: 'Success!'
      });
    } else {
      console.log('⏳ Payment status not successful');
      
      // Still acknowledge receipt
      res.json({
        tran_id: tran_id,
        status: '00',
        message: 'Notification received but payment status: ' + status
      });
    }
    
  } catch (error) {
    console.error('❌ Error processing pushback:', error.message);
    console.error(error.stack);
    
    res.status(500).json({
      status: '99',
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Verify payment endpoint (manual verification)
app.post('/api/payment/verify', async (req, res) => {
  console.log('\n========== PAYMENT VERIFICATION REQUEST ==========');
  
  try {
    const { transactionId, itemCount, amount, hash } = req.body;
    
    if (!transactionId || !itemCount || !amount || !hash) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    const itemCountNum = parseInt(itemCount);
    const amountNum = parseFloat(amount);
    
    // Verify hash
    const isValidHash = verifyHash(itemCountNum, hash);
    
    // Get expected amount
    const expectedAmount = PAYMENT_LEVELS[itemCountNum]?.amount || 0;
    const amountMatches = Math.abs(amountNum - expectedAmount) < 0.01;
    
    const verification = {
      transactionId,
      itemCount: itemCountNum,
      amount: amountNum,
      expectedAmount: expectedAmount,
      hashValid: isValidHash,
      amountValid: amountMatches,
      levelValid: itemCountNum >= 1 && itemCountNum <= 7,
      overall: isValidHash && amountMatches
    };
    
    console.log('Verification Result:', verification);
    
    res.json({
      status: verification.overall ? 'success' : 'error',
      message: verification.overall ? 'Payment verified successfully' : 'Payment verification failed',
      verification: verification
    });
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Verification failed',
      error: error.message
    });
  }
});

// Get all payment levels endpoint
app.get('/api/payment/levels', (req, res) => {
  const levels = Object.keys(PAYMENT_LEVELS).map(count => ({
    itemCount: parseInt(count),
    amount: PAYMENT_LEVELS[count].amount,
    khmer: PAYMENT_LEVELS[count].khmer,
    link: PAYMENT_LEVELS[count].link,
    hashConfigured: !!PAYMENT_LEVELS[count].hash
  }));
  
  res.json({
    status: 'success',
    totalLevels: levels.length,
    levels: levels
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is working correctly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   ABA PAYWAY PAYMENT SERVER STARTED              ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🌐 Payment Levels: 7 (1-7 items)`);
  console.log(`💰 Total Amount Range: $${PAYMENT_LEVELS[1].amount} - $${PAYMENT_LEVELS[7].amount}`);
  console.log(`📬 Telegram Notifications: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Enabled' : '❌ Disabled'}`);
  console.log('\n📡 Available Endpoints:');
  console.log('  GET  /                          - Server status');
  console.log('  GET  /api/test                  - Test endpoint');
  console.log('  GET  /api/payment/levels        - Get all payment levels');
  console.log('  GET  /api/generate-hash         - Generate test hash');
  console.log('  POST /api/payment/pushback      - ABA PayWay webhook');
  console.log('  POST /api/payment/verify        - Manual verification');
  console.log('\n✨ Server ready to accept payments!\n');
});

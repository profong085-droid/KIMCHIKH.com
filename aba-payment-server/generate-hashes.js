const CryptoJS = require('crypto-js');
require('dotenv').config();

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║   ABA PAYWAY SHA256 HASH GENERATOR               ║');
console.log('╚════════════════════════════════════════════════════╝\n');

// Configuration - Update these with your actual values
const SECRET_KEY = process.env.ABA_SECRET_KEY || 'KIMCHI_SHOP_2026_SECRET';

// Payment levels with your actual amounts
const payments = [
  { count: 1, txId: 'TXN001', amount: parseFloat(process.env.AMOUNT_1) || 10.00 },
  { count: 2, txId: 'TXN002', amount: parseFloat(process.env.AMOUNT_2) || 20.00 },
  { count: 3, txId: 'TXN003', amount: parseFloat(process.env.AMOUNT_3) || 30.00 },
  { count: 4, txId: 'TXN004', amount: parseFloat(process.env.AMOUNT_4) || 40.00 },
  { count: 5, txId: 'TXN005', amount: parseFloat(process.env.AMOUNT_5) || 50.00 },
  { count: 6, txId: 'TXN006', amount: parseFloat(process.env.AMOUNT_6) || 60.00 },
  { count: 7, txId: 'TXN007', amount: parseFloat(process.env.AMOUNT_7) || 70.00 }
];

console.log('📋 Generating SHA256 hashes for 7 payment levels...\n');
console.log(`🔐 Secret Key: ${SECRET_KEY}\n`);

console.log('═══════════════════════════════════════════════════════\n');

payments.forEach(payment => {
  // Create hash data string
  const hashData = `${payment.count}_${payment.txId}_${payment.amount.toFixed(2)}_${SECRET_KEY}`;
  
  // Generate SHA256 hash
  const hash = CryptoJS.SHA256(hashData).toString(CryptoJS.enc.Hex);
  
  console.log(`HASH_${payment.count}=${hash}`);
  console.log(`  Items: ${payment.count} (${getKhmerNumber(payment.count)}ទំនិញ)`);
  console.log(`  Amount: $${payment.amount.toFixed(2)}`);
  console.log(`  Transaction ID: ${payment.txId}`);
  console.log(`  Hash Data: ${hashData}`);
  console.log(`  Link: ${getPaymentLink(payment.count)}`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════\n');

console.log('✅ Copy these hashes to your .env file:\n');
console.log('# SHA256 Hashes for Payment Verification');
payments.forEach(payment => {
  const hashData = `${payment.count}_${payment.txId}_${payment.amount.toFixed(2)}_${SECRET_KEY}`;
  const hash = CryptoJS.SHA256(hashData).toString(CryptoJS.enc.Hex);
  console.log(`HASH_${payment.count}=${hash}`);
});

console.log('\n\n🎯 Next Steps:');
console.log('1. Copy the HASH_1 through HASH_7 values above');
console.log('2. Paste them into your .env file');
console.log('3. Restart the server: npm start');
console.log('4. Test with: curl http://localhost:3000/api/payment/levels\n');

// Helper function to get Khmer number
function getKhmerNumber(num) {
  const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
}

// Helper function to get payment link
function getPaymentLink(count) {
  const links = {
    1: 'https://link.payway.com.kh/ABAPAYUK422435y',
    2: 'https://link.payway.com.kh/ABAPAY6w422436v',
    3: 'https://link.payway.com.kh/ABAPAY7w422437g',
    4: 'https://link.payway.com.kh/ABAPAYjI4224385',
    5: 'https://link.payway.com.kh/ABAPAYcw422439B',
    6: 'https://link.payway.com.kh/ABAPAY5E422440R',
    7: 'https://link.payway.com.kh/ABAPAYEA422441B'
  };
  return links[count] || 'N/A';
}

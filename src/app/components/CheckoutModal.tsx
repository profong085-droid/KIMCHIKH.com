import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import html2canvas from 'html2canvas';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TELEGRAM_BOT_TOKEN = "8793518758:AAF5IweoA9BGpH_AXy8wkDqNnjc5T2EEv2E";
// Group Chat ID configured for KIMCHI Shop
// Group: "kec" (ID: -1003800534856)
// Bot added as administrator on 3/9/2026
const TELEGRAM_CHAT_ID = "-1003800534856";

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    telegramPhone: "",
    notes: ""
  });
  const [error, setError] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);
  const [orderNumber, setOrderNumber] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadReceiptAsImage = async () => {
    if (receiptRef.current) {
      try {
        // Create canvas from receipt element
        const canvas = await html2canvas(receiptRef.current, {
          backgroundColor: '#1a1a1a',
          scale: 2, // Higher quality
          useCORS: true,
          logging: false
        });

        // Convert to blob and download
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Receipt_${orderNumber}_${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Failed to download receipt:', error);
        setError('Failed to generate receipt image. Please take a screenshot instead.');
      }
    }
  };

  const sendToTelegram = async () => {
    if (!TELEGRAM_CHAT_ID || String(TELEGRAM_CHAT_ID).trim() === "") {
      setError(
        "⚠️ Telegram Chat ID not configured!\n\n" +
        "Please open src/app/components/CheckoutModal.tsx and set your Telegram Chat ID.\n\n" +
        "To get your Chat ID:\n" +
        "1. Message @userinfobot on Telegram\n" +
        "2. Copy the 'Id' number it sends back\n" +
        "3. Paste it in CheckoutModal.tsx line 14\n\n" +
        "See FIX_TELEGRAM_CHAT_ID.md for detailed instructions."
      );
      return;
    }

    if (String(TELEGRAM_CHAT_ID) === "8793518758") {
      setError(
        "❌ Invalid Chat ID!\n\n" +
        "You're using the BOT'S ID instead of YOUR user ID.\n\n" +
        "To fix:\n" +
        "1. Open @userinfobot on Telegram\n" +
        "2. Get YOUR personal Chat ID\n" +
        "3. Replace '8793518758' with YOUR ID in CheckoutModal.tsx\n\n" +
        "See FIX_TELEGRAM_CHAT_ID.md for step-by-step guide."
      );
      return;
    }

   const orderNum = `ORD-${Date.now()}`;
   const date = new Date().toLocaleString();

    // First, send text notification
   const escapeMarkdown = (text: string) => {
      return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

   const message = 
      '🛍️ *KIMCHI SHOP - NEW ORDER* 🛍️\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '*ORDER DETAILS*\n' +
      '┌──────────────────────────────┐\n' +
      '│ 🏷️ ID: `' + orderNum + '`\n' +
      '│ 📅 ' + date + '\n' +
      '└──────────────────────────────┘\n\n' +
      '*WHAT THEY BOUGHT*';

   const itemsListFormatted = items.map((item, index) => 
      '\n*' + (index +1) + '. ' + item.name + '*\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '   Quantity: ' + item.quantity + '\n' +
      '   Unit Price: $' + item.price.toFixed(2) + '\n' +
      '   ───────────────────────────\n' +
      '   *Subtotal: $' + (item.price * item.quantity).toFixed(2) + '*'
    ).join('\n');

   const paymentSection= 
      '\n\n*PAYMENT BREAKDOWN*\n' +
      '┌──────────────────────────────┐\n' +
      '│ 💵 Subtotal: $' + totalPrice.toFixed(2) + '\n' +
      '│ ────────────────────────────\n' +
      '│ *💳 TOTAL: $' + totalPrice.toFixed(2) + '*\n' +
      '└──────────────────────────────┘\n\n';

   const customerSection = 
      '*CUSTOMER INFORMATION*\n' +
      '┌──────────────────────────────┐\n' +
      '│ 👤 *Name:* ' + escapeMarkdown(formData.fullName) + '\n' +
      '│ 📧 *Email:* ' + escapeMarkdown(formData.email) + '\n' +
      '│ 📱 *Phone:* ' + escapeMarkdown(formData.phone) + '\n' +
      '│ ✈️ *Telegram:* ' + escapeMarkdown(formData.telegramPhone) + '\n' +
      '└──────────────────────────────┘\n\n';

   const notesSection = 
      '*ADDITIONAL NOTES*\n' +
      '┌──────────────────────────────┐\n' +
      '│ ' + (escapeMarkdown(formData.notes || 'No additional notes')) + '\n' +
      '└──────────────────────────────┘\n\n';

   const footer= 
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '✅ *Thank you for shopping with us!*\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

   const fullMessage = message + itemsListFormatted + paymentSection + customerSection + notesSection + footer;

    try {
      // Step 1: Send text message first
     const textResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: fullMessage,
            parse_mode: "Markdown",
          }),
        }
      );

     const textData = await textResponse.json();

      if (!textData.ok) {
        setError(`Failed to send order: ${textData.description}`);
        setStep("form");
        return;
      }

      // Step 2: Generate and send receipt image
      if (receiptRef.current) {
        try {
         const canvas = await html2canvas(receiptRef.current, {
            backgroundColor: '#1a1a1a',
            scale: 2,
            useCORS: true,
            logging: false,
            width: 600,
            height: 800
          });

          // Convert canvas to blob
          canvas.toBlob(async (blob: Blob | null) => {
            if (blob) {
              // Create FormData for photo upload
             const formDataImage = new FormData();
              formDataImage.append('chat_id', TELEGRAM_CHAT_ID.toString());
              formDataImage.append('photo', blob, 'receipt.png');
              formDataImage.append('caption', `🧾 Order Receipt - ${orderNum}\n\n✅ Payment Confirmed\n💰 Total: $${totalPrice.toFixed(2)}`);

              // Send photo to Telegram
             const photoResponse = await fetch(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
                {
                  method: "POST",
                  body: formDataImage,
                }
              );

             const photoData = await photoResponse.json();
              
              if (!photoData.ok) {
               console.error('Failed to send receipt image:', photoData.description);
              }
            }
          }, 'image/png');
        } catch (error) {
         console.error('Failed to generate receipt image:', error);
        }
      }

      // Success!
     const generatedOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(generatedOrderNumber);
      setStep("success");
      clearCart();
      setTimeout(() => {
        setStep("form");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          telegramPhone: "",
          notes: ""
        });
        setOrderNumber("");
      }, 60000);
    } catch (err) {
      setError("Failed to connect to Telegram. Please try again.");
      setStep("form");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - Check all required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.telegramPhone) {
      setError("Please fill in all required contact information fields");
      return;
    }

    setError("");
    setStep("processing");
    
    // Simulate processing delay then send to Telegram
    setTimeout(() => {
      sendToTelegram();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[80]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gradient-to-br from-gray-900 to-black z-10">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={24} className="text-red-500" />
                  <h2 className="text-xl text-white tracking-widest"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    CHECKOUT
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              {step === "form" && (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white/5 border border-white/10 rounded p-4">
                    <h3 className="text-white text-sm tracking-widest mb-3"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      ORDER SUMMARY
                    </h3>
                    <div className="space-y-2 mb-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-white/70">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-red-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="text-white font-bold">TOTAL:</span>
                      <span className="text-red-500 font-bold text-lg">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* ABA Payment Instructions - Only show if 2 or more items */}
                  {items.length >= 2 && (
                    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded p-4">
                      <h3 className="text-white text-sm tracking-widest mb-3 flex items-center gap-2"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        <span className="text-2xl">🏦</span>
                        ABA PAYMENT REQUIRED
                      </h3>
                      <div className="space-y-3 mb-4">
                        <p className="text-blue-300 text-xs mb-2">
                          ⚠️ សូមទូទាត់ប្រាក់តាម ABA PayWay មុនពេលបញ្ចប់ការកម្មង់ (Please pay via ABA PayWay before checkout)
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                          <p className="text-white/80 text-xs font-semibold mb-2">
                            📋 ជ្រើសរើសតំណភ្ជាប់ទូទាត់តាមចំនួនទំនិញ (Select Payment Link by Item Quantity):
                          </p>
                          <div className="space-y-2 text-xs">
                            {[
                              { count: 2, url: "https://link.payway.com.kh/ABAPAY6w422436v", khmer: "២ទំនិញ", amount: (18.99 * 2).toFixed(2) },
                              { count: 3, url: "https://link.payway.com.kh/ABAPAY7w422437g", khmer: "៣ទំនិញ", amount: (18.99 * 3).toFixed(2) },
                              { count: 4, url: "https://link.payway.com.kh/ABAPAYjI4224385", khmer: "៤ទំនិញ", amount: (18.99 * 4).toFixed(2) },
                              { count: 5, url: "https://link.payway.com.kh/ABAPAYcw422439B", khmer: "៥ទំនិញ", amount: (18.99 * 5).toFixed(2) },
                              { count: 6, url: "https://link.payway.com.kh/ABAPAY5E422440R", khmer: "៦ទំនិញ", amount: (18.99 * 6).toFixed(2) },
                              { count: 7, url: "https://link.payway.com.kh/ABAPAYEA422441B", khmer: "៧ទំនិញ", amount: (18.99 * 7).toFixed(2) }
                            ].map((payment, index) => (
                              <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2 hover:bg-white/10 transition-colors">
                                <span className="text-white/70">{payment.khmer} (${payment.amount})</span>
                                <a
                                  href={payment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline text-xs truncate max-w-[200px]"
                                >
                                  {payment.url}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                        <p className="text-yellow-300 text-xs">
                          💡 ជំហានទូទាត់ (Payment Steps):
                        </p>
                        <ol className="text-white/60 text-xs space-y-1 list-decimal list-inside mt-2">
                          <li>ចុចលើតំណភ្ជាប់ទូទាត់ខាងលើតាមចំនួនទំនិញ (Click payment link above based on item quantity)</li>
                          <li>ទូទាត់ប្រាក់តាម ABA PayWay (Complete payment via ABA PayWay)</li>
                          <li>ថតរូបវិក្កយបត្រ ឬស្គ្រីនសត (Take photo or screenshot of receipt)</li>
                          <li>បង្ហោះរូបភាពទូទាត់នៅខាងក្រោម (Upload payment image below)</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-white text-sm tracking-widest mb-4"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      CONTACT INFORMATION
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-xs mb-2">
                          FULL NAME *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-2">
                          EMAIL *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-2">
                          PHONE NUMBER *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-2">
                          TELEGRAM PHONE NUMBER *
                        </label>
                        <input
                          type="tel"
                          name="telegramPhone"
                          value={formData.telegramPhone}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-white/60 text-xs mb-2">
                      ORDER NOTES (OPTIONAL)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors resize-none"
                      placeholder="Special instructions for your order..."
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 text-white text-sm tracking-widest hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                  >
                    <CreditCard size={18} />
                    COMPLETE ORDER — ${totalPrice.toFixed(2)}
                  </button>

                  <p className="text-white/40 text-xs text-center">
                    By completing this order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              )}

              {step === "processing" && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6" />
                  <h3 className="text-white text-xl tracking-widest mb-2"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                    PROCESSING YOUR ORDER
                  </h3>
                  <p className="text-white/60 text-sm">
                    Please wait while we send your order to Telegram...
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="p-8">
                  {/* Success Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-white text-2xl tracking-widest mb-2"
                      style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                      ORDER SUCCESSFUL!
                    </h3>
                    <p className="text-green-400 text-sm">
                      ✅ ការកម្មង់របស់លោកអ្នកបានជោគជ័យ
                    </p>
                  </div>

                  {/* Receipt Card */}
                  <div ref={receiptRef} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg p-6 mb-6">
                    <div className="text-center mb-4 pb-4 border-b border-white/10">
                      <h4 className="text-white text-lg font-bold mb-1"
                        style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
                        🧾 PAYMENT RECEIPT
                      </h4>
                      <p className="text-white/60 text-xs">វិក្កយបត្រទូទាត់ប្រាក់</p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Order Number:</span>
                        <span className="text-white font-mono">{orderNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Date & Time:</span>
                        <span className="text-white">{new Date().toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-white/60 text-xs mb-2">Items Purchased:</p>
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between text-white/80 mb-1">
                            <span>{item.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 pt-3 mt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-white">TOTAL PAID:</span>
                          <span className="text-green-400">${totalPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-white/40 text-xs mt-1">ចំនួនទឹកប្រាក់សរុប</p>
                      </div>

                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-white/60 text-xs mb-2">Customer Information:</p>
                        <div className="space-y-1 text-white/80">
                          <div className="flex justify-between">
                            <span>Name:</span>
                            <span>{formData.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Phone:</span>
                            <span>{formData.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Telegram:</span>
                            <span>{formData.telegramPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-3 mt-3">
                        <div className="flex items-center gap-2 text-green-400 text-xs">
                          <span>✅</span>
                          <span>Payment Status: PAID via ABA PayWay</span>
                        </div>
                        <p className="text-white/40 text-xs mt-1">ស្ថានភាពទូទាត់: បានទូទាត់ជោគជ័យ</p>
                      </div>
                    </div>
                  </div>

                  {/* Download Receipt Button */}
                  <button
                    onClick={() => downloadReceiptAsImage()}
                    className="w-full py-4 bg-blue-600 text-white text-sm tracking-widest hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 mb-3"
                    style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    DOWNLOAD RECEIPT (Save as Image)
                  </button>

                  {/* Instructions */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mb-4">
                    <p className="text-blue-300 text-xs text-center">
                      💡 Click the button above to save your receipt as an image
                    </p>
                    <p className="text-white/40 text-xs text-center mt-1">
                      ចុចប៊ូតុងខាងលើដើម្បីរក្សាទុកវិក្កយបត្រជារូបភាព
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-2">
                      We will contact you shortly to confirm your order
                    </p>
                    <p className="text-white/40 text-xs">
                      យើងនឹងទាក់ទងលោកអ្នកក្នុងពេលឆាប់ៗនេះ
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

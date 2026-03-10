import {useState, useEffect } from 'react';
import { X, Ticket, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { createPaymentRequest, pollPaymentStatus, generateQRImage, cancelPayment, type PaymentStatus } from '../services/khqrPaymentService';
import {PaymentVerificationModal} from './PaymentVerificationModal';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentConfirm: () => void;
}

export function PaymentPopup({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentConfirm,
}: PaymentPopupProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus['status']>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);

  // Initialize payment when popup opens
  useEffect(() => {
   if (isOpen) {
      initializePayment();
    }

    // Cleanup on close
   return () => {
     if (transactionId) {
        cancelPayment(transactionId);
      }
    };
  }, [isOpen]);

  const initializePayment = async () => {
   try {
      setIsLoading(true);
      setError('');
      
      // Generate order ID
     const orderId = `ORD-${Date.now()}`;
      
      // Create payment request to ABA Bank
     const response = await createPaymentRequest(orderId, amount/ 4000); // Convert back to USD for API
      
      setTransactionId(response.transactionId);
      
      // Generate QR code image from KHQR string
     const qrImageUrl = generateQRImage(response.qrString);
      setQrCodeUrl(qrImageUrl);
      
      // Start polling for payment status
      pollPaymentStatus(
       response.transactionId,
        (status) => {
          setPaymentStatus(status.status);
          
         if (status.status === 'PAID') {
            // Payment completed! Show verification modal
           setTimeout(() => {
            setShowVerification(true);
            }, 1000);
          }
        }
      );
    } catch (err) {
     console.error('Failed to initialize payment:', err);
      setError('Failed to load KHQR. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (value: number) => {
   return value.toLocaleString('kh-KH') + '៛';
  };

  const handleVerificationConfirm = (screenshotUrl: string) => {
   // Send screenshot to backend/Telegram
  console.log('Screenshot uploaded:', screenshotUrl);
   // TODO: Upload to server and send to Telegram
  setShowVerification(false);
  onPaymentConfirm();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Pop-up container- Optimized for mobile */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* KHQR Header Section - Mobile responsive */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white rounded-lg px-4 py-2 sm:px-5 sm:py-2.5 shadow-md">
                <span className="text-red-600 font-bold text-xl sm:text-2xl tracking-widest">
                  KHQR
                </span>
              </div>
            </div>
          </div>

          {/* Payment Content - Mobile responsive */}
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            {/* Amount Display - Mobile friendly */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 uppercase tracking-wide">
                ចំនួនទឹកប្រាក់
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {formatAmount(amount)}
              </p>
            </div>

            {/* QR Code Section- Mobile optimized */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8 shadow-inner border border-gray-200">
              <div className="aspect-square bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg relative">
                {/* Dynamic QR Code - Mobile size */}
                {isLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 animate-spin mb-3 sm:mb-4" />
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      កំពុងបង្កើត KHQR...
                    </p>
                  </div>
                ) : error ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
                    <p className="text-red-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                      ⚠️ {error}
                    </p>
                    <Button
                      onClick={initializePayment}
                      variant="outline"
                      className="text-xs sm:text-sm"
                    >
                      ព្យាយាមម្តងទៀត
                    </Button>
                  </div>
                ) : qrCodeUrl ? (
                  <>
                    <img
                      src={qrCodeUrl}
                      alt="KHQR Code"
                      className="w-full h-full object-contain"
                    />
                    {/* Center Khmer Riel Symbol Overlay - Mobile responsive */}
                    <div className="absolute bg-gradient-to-br from-green-400 to-green-600 rounded-full p-2.5 sm:p-3.5 shadow-xl border-2 sm:border-4 border-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="text-white font-bold text-2xl sm:text-3xl drop-shadow-md">
                        ៛
                      </span>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Scan Instruction- Mobile text sizes */}
              <div className="text-center space-y-2">
                {paymentStatus === "PENDING" && (
                  <>
                    <p className="text-gray-800 font-semibold text-base sm:text-lg">
                      សូមស្កែន QR code នេះដើម្បីទូទាត់ប្រាក់
                    </p>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Scan this QR code to pay
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 animate-spin" />
                      <p className="text-xs text-gray-500">
                        កំពុងរង់ចាំការទូទាត់...
                      </p>
                    </div>
                  </>
                )}
                {paymentStatus === "PAID" && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="font-bold text-base sm:text-lg">
                      បានទូទាត់ជោគជ័យ!
                    </p>
                  </div>
                )}
                {paymentStatus === "FAILED" && (
                  <p className="text-red-600 font-semibold text-sm sm:text-base">
                    ការទូទាត់បានបរាជ័យ
                  </p>
                )}
              </div>
            </div>

            {/* Payment Confirmation Button- Touch-friendly mobile button */}
            <Button
              onClick={onPaymentConfirm}
              disabled={paymentStatus !== "PAID"}
              className={`w-full py-4 sm:py-5 rounded-xl text-base sm:text-lg font-bold transition-all duration-300 ${
                paymentStatus === "PAID"
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-2xl active:scale-95"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600 to-red-800 text-white shadow-lg opacity-50 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              {paymentStatus === "PAID"
                ? "ទូទាត់ប្រាក់"
                : "រង់ចាំការទូទាត់..."}
            </Button>

            {/* Security Notice- Mobile text */}
            <p className="text-center text-xs text-gray-400 mt-3 sm:mt-4">
              🔒 ការទូទាត់មានសុវត្ថិភាព 100%
            </p>
          </div>
        </div>
      </div>

      {/* Payment Verification Modal */}
      <PaymentVerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onConfirm={handleVerificationConfirm}
        amount={amount}
      />
    </>
  );
}

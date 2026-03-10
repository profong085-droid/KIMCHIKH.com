import { useState } from 'react';
import { X, Ticket, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentConfirm: () => void;
  onPromoCodeClick: () => void;
}

export function PaymentPopup({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentConfirm,
  onPromoCodeClick 
}: PaymentPopupProps) {
  const [promoCode, setPromoCode] = useState('');

  if (!isOpen) return null;

  const formatAmount = (value: number) => {
    return value.toLocaleString('kh-KH') + '៛';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Pop-up container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* KHQR Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-white rounded-lg px-5 py-2.5 shadow-md">
              <span className="text-red-600 font-bold text-2xl tracking-widest">KHQR</span>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="px-6 py-8">
          {/* Amount Display */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm mb-2 uppercase tracking-wide">ចំនួនទឹកប្រាក់</p>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formatAmount(amount)}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 shadow-inner border border-gray-200">
            <div className="aspect-square bg-white rounded-2xl p-6 mb-6 shadow-lg">
              {/* Placeholder for actual QR code */}
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Simulated QR Code Pattern with higher detail */}
                <div className="absolute inset-6 grid grid-cols-8 gap-1.5">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    // Create corner markers and random pattern
                    const isCornerMarker = 
                      (row < 3 && col < 3) || 
                      (row < 3 && col > 4) || 
                      (row > 4 && col < 3);
                    return (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          isCornerMarker ? 'bg-gray-900' : 
                          Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
                
                {/* Center Khmer Riel Symbol */}
                <div className="absolute bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3.5 shadow-xl border-4 border-white">
                  <span className="text-white font-bold text-3xl drop-shadow-md">៛</span>
                </div>
                
                {/* Corner markers for QR scanner */}
                <div className="absolute top-3 left-3 w-10 h-10 border-l-[6px] border-t-[6px] border-gray-900 rounded-tl-xl" />
                <div className="absolute top-3 right-3 w-10 h-10 border-r-[6px] border-t-[6px] border-gray-900 rounded-tr-xl" />
                <div className="absolute bottom-3 left-3 w-10 h-10 border-l-[6px] border-b-[6px] border-gray-900 rounded-bl-xl" />
                <div className="absolute bottom-3 right-3 w-10 h-10 border-r-[6px] border-b-[6px] border-gray-900 rounded-br-xl" />
              </div>
            </div>
            
            {/* Scan Instruction */}
            <div className="text-center space-y-2">
              <p className="text-gray-800 font-semibold text-lg">
                សូមស្កែន QR code នេះដើម្បីទូទាត់ប្រាក់
              </p>
              <p className="text-gray-500 text-base">
                Scan this QR code to pay
              </p>
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="mb-6">
            <Button
              onClick={onPromoCodeClick}
              variant="outline"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white border-2 border-gray-700 py-4 text-base font-semibold transition-all duration-300"
            >
              <Ticket className="w-5 h-5 mr-2" />
              បញ្ចូលលេខកូដប្រូម៉ូសិន
            </Button>
          </div>

          {/* Payment Confirmation Button */}
          <Button
            onClick={onPaymentConfirm}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            ទូទាត់ប្រាក់
          </Button>

          {/* Security Notice */}
          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 ការទូទាត់មានសុវត្ថិភាព 100%
          </p>
        </div>
      </div>
    </div>
  );
}

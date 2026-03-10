import {useState, useRef } from 'react';
import { X, Upload, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (screenshotUrl: string) => void;
  amount: number;
}

export function PaymentVerificationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  amount 
}: PaymentVerificationModalProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatAmount = (value: number) => {
   return value.toLocaleString('kh-KH') + '៛';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;

    // Validate file type
   if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG)');
     return;
    }

    // Validate file size (max 5MB)
   if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
     return;
    }

    setIsUploading(true);

    // Convert to base64 for preview
   const reader = new FileReader();
   reader.onload = (e) => {
      setScreenshot(e.target?.result as string);
      setIsUploading(false);
    };
   reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
   if (screenshot) {
     onConfirm(screenshot);
    }
  };

  if (!isOpen) return null;

 return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
       onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
         onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-xl tracking-widest">PAYMENT VERIFICATION</span>
          </div>
          <p className="text-white/90 text-center mt-2 text-sm">
            បញ្ជាក់ការទូទាត់របស់អ្នក
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-2 uppercase tracking-wide">ចំនួនទឹកប្រាក់ដែលបានទូទាត់</p>
            <p className="text-3xl font-extrabold text-green-600">
              {formatAmount(amount)}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              សូមផ្ទុករូបភាពវិក្កយបត្រ
            </h4>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>ថតរូប ឬស្គ្រីនសតវិក្កយបត្រពី ABA App</li>
              <li>ចុចប៊ូតុង "Upload Screenshot" ខាងក្រោម</li>
              <li>ជ្រើសរើសរូបភាពពីឧបករណ៍របស់អ្នក</li>
              <li>ចុច "បញ្ជាក់ការទូទាត់" ដើម្បីផ្ញើ</li>
            </ol>
          </div>

          {/* Upload Area */}
          <div className="mb-6">
            {!screenshot ? (
              <div 
               onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">
                  {isUploading ? 'កំពុងផ្ទុក...' : 'ចុចដើម្បី Upload Screenshot'}
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-green-500">
                  <img 
                   src={screenshot} 
                    alt="Payment screenshot" 
                    className="w-full h-64 object-cover"
                  />
                  <button
                   onClick={() => setScreenshot(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-green-600 text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  រូបភាពត្រូវបានផ្ទុកជោគជ័យ
                </p>
              </div>
            )}

            {/* Hidden file input */}
            <input
             ref={fileInputRef}
              type="file"
             accept="image/*"
             onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
             onClick={handleConfirm}
              disabled={!screenshot}
              className={`w-full py-4 text-base font-bold transition-all ${
                screenshot
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              បញ្ជាក់ការទូទាត់
            </Button>

            <Button
             onClick={onClose}
              variant="outline"
              className="w-full py-4 text-base font-semibold border-2 border-gray-300 hover:border-gray-400"
            >
              បោះបង់
            </Button>
          </div>

          {/* Security Notice */}
          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 រូបភាពរបស់អ្នកនឹងត្រូវបានផ្ញើទៅអ្នកគ្រប់គ្រងដើម្បីផ្ទៀងផ្ទាត់
          </p>
        </div>
      </div>
    </div>
  );
}

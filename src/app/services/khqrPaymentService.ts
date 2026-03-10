export interface KHQRResponse {
  qrString: string;
  transactionId: string;
  amount: number;
}

export interface PaymentStatus {
 status: 'PENDING' | 'PAID' | 'FAILED';
  transactionId: string;
  paidAt?: string;
}

const API_BASE_URL = 'http://localhost:3000'; // Your ABA payment server

/**
 * Create Payment Request to ABA Bank
 * This generates a dynamic KHQR with embedded amount
 */
export async function createPaymentRequest(
  orderId: string,
  amountUSD: number
): Promise<KHQRResponse> {
  try {
   const amountKHR = amountUSD * 4000; // Convert to KHR
    
    // Call your backend to create payment request
   const response = await fetch(`${API_BASE_URL}/api/khqr/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       orderId,
       amount: amountKHR,
       currency: 'KHR'
      })
    });

   const data = await response.json();
    
   if (data.status === 'success') {
     return {
        qrString: data.qrString,
       transactionId: data.transactionId,
       amount: amountKHR
      };
    } else {
      throw new Error('Failed to create payment request');
    }
  } catch (error) {
   console.error('❌ Error creating payment request:', error);
    throw error;
  }
}

/**
 * Check Payment Status (Polling)
 * Poll every 2-3 seconds to check if payment is completed
 */
export async function checkPaymentStatus(
  transactionId: string
): Promise<PaymentStatus> {
  try {
   const response = await fetch(`${API_BASE_URL}/api/khqr/status/${transactionId}`);
   const data = await response.json();
    
   return {
     status: data.status, // 'PENDING', 'PAID', or 'FAILED'
     transactionId: data.transactionId,
      paidAt: data.paidAt
    };
  } catch (error) {
   console.error('❌ Error checking payment status:', error);
   return {
     status: 'PENDING',
     transactionId
    };
  }
}

/**
 * Poll payment status until it's PAID or FAILED
 * @param transactionId - The transaction to monitor
 * @param onStatusChange - Callback when status changes
 * @param timeout - Maximum time to poll (default: 5 minutes)
 */
export function pollPaymentStatus(
  transactionId: string,
  onStatusChange: (status: PaymentStatus) => void,
  timeout: number= 300000 // 5 minutes
): () => void {
  let pollingInterval: ReturnType<typeof setInterval>;
  let elapsedTime = 0;
  const pollIntervalMs = 2000; // Check every 2 seconds

  const startPolling = () => {
    pollingInterval = setInterval(async () => {
      elapsedTime += pollIntervalMs;
      
      // Check timeout
     if (elapsedTime >= timeout) {
       stopPolling();
       onStatusChange({
         status: 'FAILED',
         transactionId,
          paidAt: undefined
        });
       return;
      }

     const status = await checkPaymentStatus(transactionId);
     onStatusChange(status);

      // Stop polling if payment is completed
     if (status.status === 'PAID' || status.status === 'FAILED') {
       stopPolling();
      }
    }, pollIntervalMs);
  };

  const stopPolling = () => {
   if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };

  // Start polling
 startPolling();

  // Return cleanup function
 return stopPolling;
}

/**
 * Generate QR Code Image from KHQR String
 * Using Google Charts API for simplicity
 */
export function generateQRImage(qrString: string): string {
  const encodedQR = encodeURIComponent(qrString);
 return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedQR}&choe=UTF-8`;
}

/**
 * Cancel Payment (if user closes modal before paying)
 */
export async function cancelPayment(transactionId: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/khqr/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId })
    });
   console.log('✅ Payment cancelled:', transactionId);
  } catch (error) {
   console.error('❌ Error cancelling payment:', error);
  }
}

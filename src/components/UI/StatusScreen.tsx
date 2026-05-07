// src/components/UI/StatusScreen.tsx
import { useEffect, useRef } from 'react';
import { usePaymentStore } from '../../store/usePaymentStore';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function StatusScreen({ onRetry, onNewPayment }: { onRetry: () => void, onNewPayment: () => void }) {
  const { status, errorMessage, attemptCount } = usePaymentStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Manage focus for accessibility when status changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [status]);

  if (status === 'Idle') return null;

  return (
    <div 
      ref={containerRef} 
      tabIndex={-1} 
      className="flex flex-col items-center justify-center p-8 space-y-6 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
      aria-live="polite"
    >
      {status === 'Processing' && (
        <>
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">Processing Payment...</h2>
          <p className="text-gray-500">Please do not close this window.</p>
        </>
      )}

      {status === 'Success' && (
        <div className="flex flex-col items-center justify-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <button onClick={onNewPayment} className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Make Another Payment
          </button>
        </div>
      )}

      {(status === 'Failed' || status === 'Timeout') && (
        <>
          {status === 'Timeout' ? (
            <AlertCircle className="w-16 h-16 text-amber-500" />
          ) : (
            <XCircle className="w-16 h-16 text-rose-500" />
          )}
          <h2 className="text-2xl font-bold text-gray-900">
            {status === 'Timeout' ? 'Connection Timeout' : 'Payment Failed'}
          </h2>
          <p className="text-gray-600 text-center max-w-sm">{errorMessage}</p>
          
          <div className="w-full max-w-xs mt-4">
            {attemptCount < 3 ? (
              <div className="flex flex-col space-y-3">
                <button onClick={onRetry} className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Retry Payment
                </button>
                <p className="text-sm text-center text-gray-500">
                  Attempt {attemptCount} of 3
                </p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 text-center">
                  Maximum retry attempts reached.
                </div>
                <button onClick={onNewPayment} className="w-full py-3 px-4 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Start Over
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
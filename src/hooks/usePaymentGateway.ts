// src/hooks/usePaymentGateway.ts
import { usePaymentStore } from '../store/usePaymentStore';
import { PaymentPayload, Transaction } from '../types/payment';

export function usePaymentGateway() {
  const { 
    status, 
    setStatus, 
    attemptCount, 
    incrementAttempt, 
    saveTransaction, 
    initializeTransaction, 
    currentTransactionId 
  } = usePaymentStore();

  const processPayment = async (payload: Omit<PaymentPayload, 'transactionId'>) => {
    // Generate ID on first attempt, reuse on retries
    const isRetry = attemptCount > 0 && currentTransactionId;
    const transactionId = isRetry ? currentTransactionId : crypto.randomUUID();

    if (!isRetry) {
      initializeTransaction(transactionId);
    } else {
      incrementAttempt();
    }

    setStatus('Processing');

    // 2. Setup AbortController for the 6-second  timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let finalStatus: Transaction['status'] = 'Failed';
    let errorMessage = 'An unknown error occurred';

    // call api to process payment
    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, transactionId }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        finalStatus = 'Success';
        errorMessage = ''; // No error
      } else {
        finalStatus = 'Failed';
        errorMessage = data.message || 'Payment declined by gateway';
      }

    } catch (error: unknown) {
      if ((error as Error).name === 'AbortError') {
        finalStatus = 'Timeout';
        errorMessage = 'Connection timed out. Please try again.';
      } else {
        finalStatus = 'Failed';
        errorMessage = 'Network error. Please check your connection.';
      }
    } finally {
      clearTimeout(timeoutId); // Clean up the timeout
      
      // Update global status
      setStatus(finalStatus, errorMessage);

      // 3. Save to transaction history (persists to localStorage via Zustand)
      saveTransaction({
        id: transactionId,
        amount: payload.amout,
        currency: payload.currency,
        status: finalStatus,
        timestamp: new Date().toISOString(),
        attemptCount: isRetry ? attemptCount + 1 : 1,
        errorMessage: finalStatus !== 'Success' ? errorMessage : undefined,
      });
    }
  };

  return { processPayment, status, attemptCount };
}
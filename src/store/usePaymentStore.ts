// src/store/usePaymentStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentStatus, Transaction } from '../types/payment';

interface PaymentState {
  // Current Payment State
  status: PaymentStatus;
  currentTransactionId: string | null;
  attemptCount: number;
  errorMessage: string | undefined;

  // Transaction History State
  transactions: Transaction[];

  // Actions
  setStatus: (status: PaymentStatus, errorMessage?: string) => void;
  initializeTransaction: (id: string) => void;
  incrementAttempt: () => void;
  saveTransaction: (transaction: Transaction) => void;
  resetCurrentPayment: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      // Initial State
      status: 'Idle',
      currentTransactionId: null,
      attemptCount: 0,
      errorMessage: undefined,
      transactions: [],

      // Actions
      setStatus: (status, errorMessage) => set({ status, errorMessage }),

      initializeTransaction: (id) =>
        set({
          currentTransactionId: id,
          attemptCount: 1,
          status: 'Idle',
          errorMessage: undefined,
        }),

      incrementAttempt: () =>
        set((state) => ({
          attemptCount: state.attemptCount + 1,
          status: 'Idle', // Reset to idle for the retry attempt
          errorMessage: undefined,
        })),

      saveTransaction: (newTransaction) =>
        set((state) => {
          // Check if transaction already exists (for retries) to prevent duplicates
          const existingIndex = state.transactions.findIndex(
            (t) => t.id === newTransaction.id
          );

          if (existingIndex >= 0) {
            const updatedTransactions = [...state.transactions];
            updatedTransactions[existingIndex] = newTransaction;
            return { transactions: updatedTransactions };
          }

          // If it's new, add it to the beginning of the history
          return { transactions: [newTransaction, ...state.transactions] };
        }),

      resetCurrentPayment: () =>
        set({
          status: 'Idle',
          currentTransactionId: null,
          attemptCount: 0,
          errorMessage: undefined,
        }),
    }),
    {
      name: 'payment-gateway-storage', // The key used in localStorage
      // We only want to persist the history, not the active form state
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);
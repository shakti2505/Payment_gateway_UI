'use client';

import { useState, useEffect } from 'react';
import { usePaymentStore } from '../../store/usePaymentStore';
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { PaymentStatus } from '../../types/payment';

export default function TransactionHistory() {
  const { transactions } = usePaymentStore();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Prevent Next.js hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="animate-pulse h-32 bg-gray-100 rounded-xl w-full max-w-5xl mx-auto mt-12"></div>;

  if (transactions.length === 0) return null;

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Failed': return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'Timeout': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return null;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {transactions.map((tx) => (
          <div key={tx.id} className="border-b border-gray-100 last:border-0">
            {/* Header / Clickable Area */}
            <button 
              onClick={() => toggleExpand(tx.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 text-left"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(tx.status)}
                <div>
                  <p className="font-semibold text-gray-900">
                    {tx.currency === 'USD' ? '$' : '₹'}{tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                  tx.status === 'Success' ? 'bg-emerald-100 text-emerald-700' :
                  tx.status === 'Timeout' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {tx.status}
                </span>
                {expandedId === tx.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === tx.id && (
              <div className="p-5 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</span>
                  <span className="font-mono text-xs">{tx.id}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Attempts</span>
                  <span>{tx.attemptCount}</span>
                </div>
                {tx.errorMessage && (
                  <div className="md:col-span-2">
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Failure Reason</span>
                    <span className="text-rose-600">{tx.errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
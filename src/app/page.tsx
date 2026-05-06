'use client';
import PaymentForm from '../components/PaymentForm/PaymentForm';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">PayGateway</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Secure Checkout</h2>
          <p className="text-gray-500 mt-2">Complete your transaction below.</p>
        </div>

        {/* The Payment Flow */}
        <PaymentForm />

        {/* The Persisted History */}
        <TransactionHistory />
      </div>
    </main>
  );
}
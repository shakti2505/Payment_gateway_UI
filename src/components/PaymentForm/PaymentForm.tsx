// src/components/PaymentForm/PaymentForm.tsx
import { usePaymentForm } from '../../hooks/usePaymentForm';
import { usePaymentGateway } from '../../hooks/usePaymentGateway';
import CardPreview from '../CardPreview/CardPreview';
import StatusScreen from '../UI/StatusScreen';
import { usePaymentStore } from '../../store/usePaymentStore';

export default function PaymentForm() {
  const { values, actions, cardType, errors, isValid, getPayload } = usePaymentForm();
  const { processPayment, status } = usePaymentGateway();
  const { resetCurrentPayment } = usePaymentStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) processPayment(getPayload());
  };

  const handleNewPayment = () => {
    // clear the zustand store
    resetCurrentPayment(); 
    // clear the local states too.
    actions.resetForm();
  }

  // If we are not idle, show the feedback screen instead of the form
  if (status !== 'Idle') {

    return (
      <StatusScreen 
        onRetry={() => processPayment(getPayload())}
        onNewPayment={handleNewPayment}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full max-w-5xl mx-auto items-start">
      {/* Left Column: Visuals */}
      <div className="w-full lg:w-1/2 flex justify-center lg:sticky lg:top-8">
        <CardPreview 
          cardNumber={values.cardNumber}
          cardholderName={values.cardHolderName}
          expiryDate={values.expiryDate}
          cardType={cardType}
        />
      </div>

      {/* Right Column: Form */}
      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-5 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Name on Card */}
        <div className="space-y-1">
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">Name on Card</label>
          <input
            id="cardholderName"
            type="text"
            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${errors.cardholderName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            value={values.cardHolderName}
            onChange={(e) => actions.setCardHolderName(e.target.value.toUpperCase())}
            onBlur={() => actions.handleBlur('cardHolderName')}
            aria-invalid={!!errors.cardHolderName}
            aria-describedby={errors.cardHolderName ? "name-error" : undefined}
          />
          {errors.cardHolderName && <p id="name-error" className="text-sm text-red-500">{errors.cardHolderName}</p>}
        </div>

        {/* Card Number */}
        <div className="space-y-1">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 font-mono ${errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            value={values.cardNumber}
            onChange={(e) => actions.handleCardNumberChange(e.target.value)}
            onBlur={() => actions.handleBlur('cardNumber')}
            aria-invalid={!!errors.cardNumber}
            aria-describedby={errors.cardNumber ? "number-error" : undefined}
          />
          {errors.cardNumber && <p id="number-error" className="text-sm text-red-500">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry */}
          <div className="space-y-1">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 font-mono ${errors.expiryDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              value={values.expiryDate}
              onChange={(e) => actions.handleExpiryChange(e.target.value)}
              onBlur={() => actions.handleBlur('expiryDate')}
              aria-invalid={!!errors.expiryDate}
              aria-describedby={errors.expiryDate ? "expiry-error" : undefined}
            />
            {errors.expiryDate && <p id="expiry-error" className="text-sm text-red-500">{errors.expiryDate}</p>}
          </div>

          {/* CVV */}
          <div className="space-y-1">
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              id="cvv"
              type="password"
              inputMode="numeric"
              maxLength={cardType === 'Amex' ? 4 : 3}
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 font-mono tracking-widest ${errors.cvv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              value={values.cvv}
              onChange={(e) => actions.setCvv(e.target.value.replace(/\D/g, ''))}
              onBlur={() => actions.handleBlur('cvv')}
              aria-invalid={!!errors.cvv}
              aria-describedby={errors.cvv ? "cvv-error" : undefined}
            />
            {errors.cvv && <p id="cvv-error" className="text-sm text-red-500">{errors.cvv}</p>}
          </div>
        </div>

        {/* Amount and Currency */}
        <div className="flex gap-4">
          <div className="w-1/3 space-y-1">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="currency"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              value={values.currency}
              onChange={(e) => actions.setCurrency(e.target.value as any)}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div className="w-2/3 space-y-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              value={values.amount || ""}
              onChange={(e) => actions.handleAmountChange(Number(e.target.value))}
              onBlur={() => actions.handleBlur('amount')}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
            {errors.amount && <p id="amount-error" className="text-sm text-red-500">{errors.amount}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-4 mt-6 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
        >
          Pay {values.currency === 'USD' ? '$' : '₹'}{values.amount || '0.00'}
        </button>
      </form>
    </div>
  );
}
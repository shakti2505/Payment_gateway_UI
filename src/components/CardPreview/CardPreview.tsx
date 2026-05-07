// src/components/CardPreview/CardPreview.tsx
import { CreditCard } from 'lucide-react';
import { CardType } from '../../types/payment';
import mastercardLogo from '../../../public/card.png';
import visaLogo from '../../../public/visa.png';
import amexLogo from '../../../public/amex.png';

interface CardPreviewProps {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cardType: CardType;
}

export default function CardPreview({ cardNumber, cardholderName, expiryDate, cardType }: CardPreviewProps) {

    return (
        <div className="relative w-full max-w-sm aspect-[1.586/1] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 sm:p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white opacity-5 blur-2xl"></div>

            <div className="flex justify-between items-start relative z-10">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 transition-all duration-300" />
                <div className="flex items-center justify-center">
                    {cardType === 'Visa' ? (
                        <img src={visaLogo.src} className="h-6 sm:h-10 w-auto object-contain transition-all duration-300" alt="Visa" />
                    ) : cardType === 'Mastercard' ? (
                        <img src={mastercardLogo.src} className="h-6 sm:h-10 w-auto object-contain transition-all duration-300" alt="Mastercard" />
                    ) : cardType === 'Amex' ? (
                        <img src={amexLogo.src} className="h-6 sm:h-10 w-auto object-contain transition-all duration-300" alt="Amex" />
                    ) : (
                        <span className="px-2 py-1 sm:px-3 rounded-md text-[10px] sm:text-xs font-bold tracking-wider uppercase text-gray-400">
                            Card
                        </span>
                    )}
                </div>
            </div>

            <div className="relative z-10 space-y-2 sm:space-y-4">
                {/* Card Number */}
                <div className="font-mono text-base sm:text-xl tracking-widest sm:tracking-[0.15em] flex items-center min-h-[1.5rem] sm:min-h-[2.25rem] transition-all duration-300">
                    {cardNumber || '•••• •••• •••• ••••'}
                </div>

                {/* Footer Data */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col max-w-[70%]">
                        <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                            Cardholder
                        </span>
                        <span className="font-medium truncate text-sm sm:text-base leading-tight h-4 sm:h-6 transition-all duration-300">
                            {cardholderName || 'YOUR NAME'}
                        </span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                            Expires
                        </span>
                        <span className="font-mono text-sm sm:text-base leading-tight h-4 sm:h-6 transition-all duration-300">
                            {expiryDate || 'MM/YY'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
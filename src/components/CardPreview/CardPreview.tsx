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
        <div className="relative w-full max-w-sm aspect-[1.586/1] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 blur-2xl"></div>

            <div className="flex justify-between items-start relative z-10">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase`}>
                    {cardType === 'Visa' ? <img src={visaLogo.src} className="w-16 h-16" /> : cardType === 'Mastercard' ? <img src={mastercardLogo.src} className="w-16 h-16" /> : cardType === 'Amex' ? <img src={amexLogo.src} className="w-16 h-16" /> : <span className="text-gray-400">Card</span>}
                </span>
            </div>

            <div className="relative z-10 space-y-4">
                <div className="font-mono text-xl tracking-[0.15em] h-7">
                    {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between">
                    <div className="flex flex-col max-w-[70%]">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Cardholder</span>
                        <span className="font-medium truncate h-6">
                            {cardholderName || 'YOUR NAME'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Expires</span>
                        <span className="font-mono h-6">{expiryDate || 'MM/YY'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useState, useMemo } from "react";
import { CardType, Currency, PaymentPayload } from '../types/payment'

export const usePaymentForm = () => {
    const [cardHolderName, setCardHolderName] = useState<string>("");
    const [cardNumber, setCardNumber] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");
    const [amount, setAmount] = useState<number | null>(null);
    const [currency, setCurrency] = useState<Currency>("USD");
    const [touchecd, setTouched] = useState<Record<string, boolean>>({});


    // 1. formatters
    const handleCardNumberChange = (value: string) => {
        // add space after 4 digits
        const cleaned = value.replace(/\D/g, '').slice(0, 16);
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(formatted);
    }

    const handleExpiryChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 4);
        if (cleaned.length >= 3) {
            setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
        } else {
            setExpiryDate(cleaned);
        }
    };

    const cardType = useMemo<CardType>(() => {
        const cleanNum = cardNumber.replace(/\D/g, '');
        if (cleanNum.startsWith('4')) return 'Visa';
        if (/^5[1-5]/.test(cleanNum)) return 'Mastercard';
        if (/^3[47]/.test(cleanNum)) return 'Amex';
        return 'Unknown' as CardType;
    }, [cardNumber]);

    const errors = useMemo(() => {
        const newErrors: Record<string, string> = {};
        if (touchecd.cardHolderName && !cardHolderName.trim()) {
            newErrors.cardHolderName = "Name is required";
        }

        const clearCardNumber = cardNumber.replace(/\D/g, '').trim();
        if (touchecd.cardNumber && clearCardNumber.length < 15) {
            newErrors.cardNumber = "Invalid card number";
        }

        if (touchecd.expiryDate) {
            if (expiryDate.length < 5) {
                newErrors.expiryDate = "Format must be MM/YY";
            } else {
                const [month, year] = expiryDate.split('/');
                const numMonth = Number(month);
                const numYear = Number(year)
                const fullYear = 2000 + numYear;
                //creating date object for expiry from month and year
                const expiry = new Date(fullYear, numMonth - 1, 1);
                const now = new Date();
                now.setDate(1); // compare against first day of the month
                now.setHours(0, 0, 0, 0)
                if (parseInt(month) < 1 || parseInt(month) > 12) {
                    newErrors.expiryDate = "Invalid month";
                } else if (expiry.getTime() < now.getTime()) {
                    newErrors.expiryDate = "Card has expired";
                }
            }
        }

        const expectedCvvLength = cardType === 'Amex' ? 4 : 3;
        if (touchecd.cvv && cvv.length !== expectedCvvLength) {
            newErrors.cvv = `CVV must be ${expectedCvvLength} digits`;
        }

        if (touchecd.amount && (isNaN(Number(amount)) || Number(amount) <= 0)) {
            newErrors.amount = 'Enter a valid amount';
        }
        return newErrors;

    }, [cardHolderName, cardNumber, expiryDate, cvv, amount, cardType, touchecd]);


    const isValid =
        Object.keys(errors).length === 0 &&
        cardHolderName &&
        cardNumber.replace(/\D/g, '').length >= 15 &&
        expiryDate.length === 5 &&
        cvv.length >= 3 &&
        Number(amount) > 0;

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleAmountChange = (value: number) => {
        if (value > 0) {
            setAmount(value);
        } else {
            setAmount(null);
        }
    }

    const getPayload = (): Omit<PaymentPayload, 'transactionId'> => ({
        cardHolderName,
        cardNumber: cardNumber.replace(/\D/g, ''), // Send to API without spaces
        expirationDate: expiryDate,
        cvv,
        amout: Number(amount),
        currency,
    });

    const resetForm = () => {
        setCardHolderName("");
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setAmount(null);
        setCurrency("USD");
        setTouched({});
    }

    return {
        values: { cardHolderName, cardNumber, expiryDate, cvv, amount, currency },
        actions: {
            setCardHolderName, handleCardNumberChange, handleExpiryChange,
            setCvv, handleAmountChange, setCurrency, handleBlur, resetForm
        },
        cardType,
        errors,
        isValid,
        getPayload
    };
}


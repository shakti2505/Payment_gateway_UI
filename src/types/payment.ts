export type CardType = "Visa" | "Mastercard" | "Amex";
export type PaymentStatus = "Idle" | "Processing" | "Success" | "Failed" | "Timeout"
export type Currency = "USD" | "INR"

export interface PaymentPayload {
    cardHolderName:string;
    cardNumber:string;
    expirationDate:string;
    cvv:string;
    amout:number;
    currency:Currency;
    transactionId:string; 
}

export interface Transaction {
    id:string;
    amount:number;
    currency:Currency;
    status:PaymentStatus;
    timestamp:string; // ISO string
    attemptCount:number;
    errorMessage?:string;
}

export interface ApiResponse {
    success:boolean;
    message:string;
    transactionId:string;
}
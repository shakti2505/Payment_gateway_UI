// src/app/api/pay/route.ts
import { NextResponse } from 'next/server';
import { PaymentPayload } from '../../../types/payment';

// Helper function to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    // Parse the incoming request body and enforce our TypeScript interface
    const body = (await request.json()) as PaymentPayload;
    
    if (!body.transactionId) {
      return NextResponse.json(
        { success: false, message: 'Missing transaction ID' },
        { status: 400 }
      );
    }

    // Generate a random number between 0 and 1 to determine the outcome
    const probability = Math.random();

    // 1. Success Scenario (60% of the time)
    if (probability < 0.60) {
      await delay(2000); // Simulate normal processing time (2 seconds)
      return NextResponse.json(
        {
          success: true,
          message: 'Payment processed successfully',
          transactionId: body.transactionId,
        },
        { status: 200 }
      );
    } 
    
    // 2. Failure Scenario (~25% of the time)
    else if (probability < 0.85) {
      await delay(2000); // Simulate normal processing time (2 seconds)
      
      // Randomize the failure reason for realism
      const failureReasons = ['Insufficient funds', 'Card declined by issuer', 'Suspected fraud'];
      const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      
      return NextResponse.json(
        {
          success: false,
          message: randomReason,
          transactionId: body.transactionId,
        },
        { status: 400 } // Bad Request / Payment Required
      );
    } 
    
    // 3. Timeout Scenario (~15% of the time)
    else {
      // 8-second delay here so the AbortController is forced to trigger.
      await delay(8000);
      return NextResponse.json(
        {
          success: false,
          message: 'Gateway timeout',
          transactionId: body.transactionId,
        },
        { status: 504 } // Gateway Timeout
      );
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
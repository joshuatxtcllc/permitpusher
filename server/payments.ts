
// Payment processing system for permit applications
import Stripe from 'stripe';

// Mock Stripe for demo purposes - would use real Stripe API key in production
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  apiVersion: '2024-12-18.acacia',
});

export interface PaymentRecord {
  id: string;
  applicationId: string;
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  paymentIntentId?: string;
  stripeSessionId?: string;
  permitType: string;
  feeBreakdown: {
    baseFee: number;
    processingFee: number;
    expediteFee?: number;
    inspectionFee?: number;
    total: number;
  };
  paymentMethod?: string;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory payment records (would be in database in production)
const paymentRecords = new Map<string, PaymentRecord>();

// Permit fee structure
export const PERMIT_FEES = {
  residential: {
    building: { base: 15000, processing: 2500, inspection: 5000 }, // $150 + $25 + $50
    electrical: { base: 8000, processing: 2000, inspection: 3000 },
    plumbing: { base: 7500, processing: 2000, inspection: 3000 },
    mechanical: { base: 9000, processing: 2000, inspection: 3500 },
    demolition: { base: 5000, processing: 1500, inspection: 2500 },
    zoning: { base: 12000, processing: 3000, inspection: 0 }
  },
  commercial: {
    building: { base: 50000, processing: 7500, inspection: 15000 }, // $500 + $75 + $150
    electrical: { base: 25000, processing: 5000, inspection: 7500 },
    plumbing: { base: 22500, processing: 4500, inspection: 7500 },
    mechanical: { base: 30000, processing: 5500, inspection: 10000 },
    demolition: { base: 18000, processing: 4000, inspection: 8000 },
    zoning: { base: 35000, processing: 8000, inspection: 0 }
  }
};

// Calculate permit fees
export function calculatePermitFees(
  permitType: string, 
  projectType: string, 
  estimatedCost: number,
  expedited: boolean = false
): PaymentRecord['feeBreakdown'] {
  const feeStructure = PERMIT_FEES[projectType as keyof typeof PERMIT_FEES]?.[permitType as keyof typeof PERMIT_FEES.residential];
  
  if (!feeStructure) {
    // Default fees for unknown permit types
    const baseFee = projectType === 'commercial' ? 25000 : 10000;
    const processingFee = Math.floor(baseFee * 0.3);
    const inspectionFee = Math.floor(baseFee * 0.4);
    
    const breakdown = {
      baseFee,
      processingFee,
      inspectionFee,
      total: baseFee + processingFee + inspectionFee
    };
    
    if (expedited) {
      breakdown.expediteFee = Math.floor(breakdown.total * 0.5); // 50% expedite fee
      breakdown.total += breakdown.expediteFee;
    }
    
    return breakdown;
  }
  
  let baseFee = feeStructure.base;
  
  // Adjust base fee based on project cost for building permits
  if (permitType === 'building' && estimatedCost > 0) {
    const costMultiplier = Math.max(1, Math.floor(estimatedCost / 10000)); // $100 per $10k of project cost
    baseFee += costMultiplier * 100; // Convert to cents
  }
  
  const breakdown = {
    baseFee,
    processingFee: feeStructure.processing,
    inspectionFee: feeStructure.inspection,
    total: baseFee + feeStructure.processing + feeStructure.inspection
  };
  
  if (expedited) {
    breakdown.expediteFee = Math.floor(breakdown.total * 0.5); // 50% expedite fee
    breakdown.total += breakdown.expediteFee;
  }
  
  return breakdown;
}

// Create payment record
export function createPaymentRecord(
  applicationId: string,
  permitType: string,
  projectType: string,
  estimatedCost: number,
  expedited: boolean = false
): PaymentRecord {
  const id = `PAY-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  
  const feeBreakdown = calculatePermitFees(permitType, projectType, estimatedCost, expedited);
  
  const payment: PaymentRecord = {
    id,
    applicationId,
    amount: feeBreakdown.total,
    currency: 'usd',
    status: 'pending',
    permitType,
    feeBreakdown,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  paymentRecords.set(id, payment);
  return payment;
}

// Create Stripe payment session
export async function createStripePaymentSession(
  paymentRecord: PaymentRecord,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  try {
    // In a real implementation, you would create actual Stripe session
    // For demo purposes, we'll simulate this
    
    const sessionId = `cs_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`;
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}#fidkdWxOYHwnPyd1blpxYHZxWjA0VWpuaXRGd2FSNnFGM2ZtNjNqbWtPR0xQdXI1RHZ%2FXypud2BmaWlhYHdqaWpxYHZxWg%3D%3D`;
    
    // Update payment record with session info
    paymentRecord.stripeSessionId = sessionId;
    paymentRecord.status = 'processing';
    paymentRecord.updatedAt = new Date();
    paymentRecords.set(paymentRecord.id, paymentRecord);
    
    return {
      sessionId,
      url: checkoutUrl
    };
  } catch (error) {
    throw new Error(`Failed to create payment session: ${error}`);
  }
}

// Process payment completion
export function completePayment(paymentId: string, paymentIntentId?: string): PaymentRecord | null {
  const payment = paymentRecords.get(paymentId);
  if (!payment) return null;
  
  payment.status = 'succeeded';
  payment.paymentIntentId = paymentIntentId;
  payment.paidAt = new Date();
  payment.updatedAt = new Date();
  
  paymentRecords.set(paymentId, payment);
  return payment;
}

// Process payment failure
export function failPayment(paymentId: string): PaymentRecord | null {
  const payment = paymentRecords.get(paymentId);
  if (!payment) return null;
  
  payment.status = 'failed';
  payment.updatedAt = new Date();
  
  paymentRecords.set(paymentId, payment);
  return payment;
}

// Get payment by ID
export function getPaymentRecord(paymentId: string): PaymentRecord | null {
  return paymentRecords.get(paymentId) || null;
}

// Get payment by application ID
export function getPaymentByApplicationId(applicationId: string): PaymentRecord | null {
  for (const payment of paymentRecords.values()) {
    if (payment.applicationId === applicationId) {
      return payment;
    }
  }
  return null;
}

// Get all payments
export function getAllPayments(): PaymentRecord[] {
  return Array.from(paymentRecords.values());
}

// Process refund
export async function processRefund(paymentId: string, amount?: number): Promise<PaymentRecord | null> {
  const payment = paymentRecords.get(paymentId);
  if (!payment || payment.status !== 'succeeded') return null;
  
  try {
    // In real implementation, process Stripe refund
    // For demo, we'll simulate it
    
    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.updatedAt = new Date();
    
    paymentRecords.set(paymentId, payment);
    return payment;
  } catch (error) {
    throw new Error(`Failed to process refund: ${error}`);
  }
}

// Get payment analytics
export function getPaymentAnalytics() {
  const payments = Array.from(paymentRecords.values());
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const totalRevenue = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const monthlyRevenue = payments
    .filter(p => p.status === 'succeeded' && new Date(p.paidAt!) >= thisMonth)
    .reduce((sum, p) => sum + p.amount, 0);
  
  const successfulPayments = payments.filter(p => p.status === 'succeeded').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'processing').length;
  
  const successRate = payments.length > 0 
    ? (successfulPayments / (successfulPayments + failedPayments)) * 100 
    : 0;
  
  return {
    totalRevenue,
    monthlyRevenue,
    totalTransactions: payments.length,
    successfulPayments,
    failedPayments,
    pendingPayments,
    successRate: Math.round(successRate * 10) / 10,
    averageTransactionValue: successfulPayments > 0 ? Math.round(totalRevenue / successfulPayments) : 0
  };
}

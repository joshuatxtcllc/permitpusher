
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Clock, Shield, CheckCircle2, AlertTriangle } from "lucide-react";

interface FeeBreakdown {
  baseFee: number;
  processingFee: number;
  inspectionFee: number;
  expediteFee?: number;
  total: number;
}

interface PaymentRecord {
  id: string;
  applicationId: string;
  amount: number;
  status: string;
  feeBreakdown: FeeBreakdown;
  createdAt: string;
}

interface PaymentFormProps {
  applicationId: string;
  permitType: string;
  projectType: string;
  estimatedCost: string;
  onPaymentComplete?: () => void;
}

export default function PaymentForm({ 
  applicationId, 
  permitType, 
  projectType, 
  estimatedCost,
  onPaymentComplete 
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [expedited, setExpedited] = useState(false);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate fees when component mounts or expedited changes
  useEffect(() => {
    calculateFees();
  }, [permitType, projectType, estimatedCost, expedited]);

  // Check for existing payment
  useEffect(() => {
    checkExistingPayment();
  }, [applicationId]);

  const calculateFees = async () => {
    try {
      const response = await fetch('/api/permit-fees/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permitType,
          projectType,
          estimatedCost,
          expedited
        })
      });

      const data = await response.json();
      if (data.success) {
        setFeeBreakdown(data.fees);
      }
    } catch (error) {
      console.error('Failed to calculate fees:', error);
    }
  };

  const checkExistingPayment = async () => {
    try {
      const response = await fetch(`/api/permit-applications/${applicationId}/payment`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPayment(data.payment);
        }
      }
    } catch (error) {
      // No existing payment found, which is fine
    }
  };

  const createPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/permit-applications/${applicationId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expedited })
      });

      const data = await response.json();
      if (data.success) {
        setPayment(data.payment);
        return data.payment;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async () => {
    let paymentRecord = payment;
    
    if (!paymentRecord) {
      paymentRecord = await createPayment();
      if (!paymentRecord) return;
    }

    try {
      setIsLoading(true);
      
      // Create Stripe checkout session
      const response = await fetch(`/api/payments/${paymentRecord.id}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        // Simulate payment processing for demo
        setTimeout(async () => {
          const successResponse = await fetch(`/api/payments/${paymentRecord.id}/success`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: `pi_${Date.now()}` })
          });

          if (successResponse.ok) {
            const updatedPayment = await successResponse.json();
            setPayment(updatedPayment.payment);
            onPaymentComplete?.();
          }
          setIsLoading(false);
        }, 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError((error as Error).message);
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  if (payment?.status === 'succeeded') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
            Payment Completed
          </CardTitle>
          <CardDescription>Your permit fees have been successfully processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Payment Status:</span>
              {getStatusBadge(payment.status)}
            </div>
            <div className="flex justify-between items-center">
              <span>Total Paid:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Payment ID: {payment.id}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Permit Fees & Payment
        </CardTitle>
        <CardDescription>
          Complete your payment to process your permit application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Expedited Processing Option */}
        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox 
            id="expedited" 
            checked={expedited}
            onCheckedChange={(checked) => setExpedited(checked as boolean)}
            disabled={!!payment}
          />
          <div className="space-y-1">
            <label 
              htmlFor="expedited" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Expedited Processing (+50% fee)
              </div>
            </label>
            <p className="text-xs text-gray-500">
              Process your application in 1-2 business days instead of standard 5-7 days
            </p>
          </div>
        </div>

        {/* Fee Breakdown */}
        {feeBreakdown && (
          <div className="space-y-3">
            <h3 className="font-medium">Fee Breakdown</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Permit Fee:</span>
                <span>{formatCurrency(feeBreakdown.baseFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee:</span>
                <span>{formatCurrency(feeBreakdown.processingFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inspection Fee:</span>
                <span>{formatCurrency(feeBreakdown.inspectionFee)}</span>
              </div>
              {feeBreakdown.expediteFee && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Expedite Fee:</span>
                  <span>{formatCurrency(feeBreakdown.expediteFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(feeBreakdown.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Security Info */}
        <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900">Secure Payment</p>
            <p className="text-xs text-blue-700">
              Payments are processed securely through Stripe. We don't store your payment information.
            </p>
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={processPayment}
          disabled={isLoading || !feeBreakdown}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>Processing...</>
          ) : payment ? (
            <>Complete Payment - {formatCurrency(payment.amount)}</>
          ) : (
            <>Pay Permit Fees - {feeBreakdown ? formatCurrency(feeBreakdown.total) : 'Calculating...'}</>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your application will not be processed until payment is completed.
        </p>
      </CardContent>
    </Card>
  );
}

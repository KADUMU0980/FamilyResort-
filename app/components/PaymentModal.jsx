"use client";

import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  X,
  Lock,
  CheckCircle,
  Loader2
} from "lucide-react";

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "netbanking", name: "Net Banking", icon: Building },
    { id: "wallet", name: "Wallet", icon: Wallet },
  ];

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const initiateResponse = await fetch("/api/bookings/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          paymentMethod: selectedMethod
        })
      });

      const initiateData = await initiateResponse.json();

      if (!initiateResponse.ok) {
        alert(initiateData.message || "Failed to initiate payment");
        setProcessing(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      const verifyResponse = await fetch("/api/bookings/payment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          paymentId: initiateData.orderId,
          paymentMethod: selectedMethod,
          transactionId: `TXN_${Date.now()}`
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        alert(verifyData.message || "Payment verification failed");
      }

    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment");
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 text-center shadow-luxury">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-luxury-gold/15 ring-1 ring-luxury-gold/40">
            <CheckCircle className="h-12 w-12 text-luxury-gold-dark" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-semibold text-luxury-black">
            Payment Successful!
          </h2>
          <p className="mb-4 text-luxury-charcoal/75">Your booking is now confirmed and paid.</p>
          <p className="text-sm text-luxury-charcoal/55">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-luxury-stone/80 bg-white/95 shadow-luxury">
        <div className="sticky top-0 flex items-center justify-between border-b border-luxury-stone/80 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <h2 className="font-display text-2xl font-semibold text-luxury-black">Complete Payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-luxury-sand"
          >
            <X className="h-6 w-6 text-luxury-charcoal" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 rounded-2xl border border-luxury-gold/30 bg-luxury-sand/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-luxury-gold-dark" />
              <p className="text-sm font-semibold text-luxury-black">Secure Payment</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-luxury-charcoal/90">{booking.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-luxury-charcoal/70">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-luxury-stone/80 pt-2">
                <span className="font-bold text-luxury-black">Total Amount</span>
                <span className="text-xl font-bold text-luxury-black">₹{booking.price}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-luxury-black">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`rounded-2xl border-2 p-4 transition-all ${
                      selectedMethod === method.id
                        ? "border-luxury-gold bg-luxury-gold/10 shadow-luxury-gold"
                        : "border-luxury-stone hover:border-luxury-gold/40"
                    }`}
                  >
                    <Icon className={`mx-auto mb-2 h-8 w-8 ${
                      selectedMethod === method.id ? "text-luxury-gold-dark" : "text-luxury-charcoal/70"
                    }`} />
                    <p className={`font-medium ${
                      selectedMethod === method.id ? "text-luxury-black" : "text-luxury-charcoal/85"
                    }`}>
                      {method.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-luxury-gold py-4 text-lg font-bold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${booking.price}`
            )}
          </button>

          <p className="mt-4 text-center text-xs text-luxury-charcoal/55">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

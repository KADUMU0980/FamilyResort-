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
      // Step 1: Initiate payment
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

      // Step 2: Simulate payment processing (In real app, call Razorpay/Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Verify payment
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking is now confirmed and paid.</p>
          <p className="text-sm text-gray-500">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">{booking.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-gray-900 text-xl">₹{booking.price}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      selectedMethod === method.id ? "text-blue-600" : "text-gray-600"
                    }`} />
                    <p className={`font-medium ${
                      selectedMethod === method.id ? "text-blue-900" : "text-gray-700"
                    }`}>
                      {method.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${booking.price}`
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

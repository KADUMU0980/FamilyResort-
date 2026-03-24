"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  DollarSign, 
  Tag, 
  Home, 
  X, 
  Clock, 
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  CalendarDays,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Lock,
  ArrowBigLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BookingStatusCard = ({ booking }) => {
  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50",
        border: "border-green-300",
        badgeBg: "bg-green-500",
        badgeText: "text-white",
        icon: CheckCircle,
        iconColor: "text-green-600",
        title: "Booking Confirmed",
        message: "Your reservation is confirmed! Get ready for an amazing stay.",
        actionText: "View Details",
        actionColor: "bg-green-600 hover:bg-green-700"
      },
      pending: {
        bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
        border: "border-yellow-300",
        badgeBg: "bg-yellow-500",
        badgeText: "text-white",
        icon: Clock,
        iconColor: "text-yellow-600",
        title: "Awaiting Approval",
        message: "Your booking request is under review. We'll notify you soon!",
        actionText: "Track Status",
        actionColor: "bg-yellow-600 hover:bg-yellow-700"
      },
      rejected: {
        bg: "bg-gradient-to-br from-red-50 to-rose-50",
        border: "border-red-300",
        badgeBg: "bg-red-500",
        badgeText: "text-white",
        icon: XCircle,
        iconColor: "text-red-600",
        title: "Booking Not Approved",
        message: "Unfortunately, this booking couldn't be processed. Try different dates.",
        actionText: "Book Again",
        actionColor: "bg-red-600 hover:bg-red-700"
      },
      cancelled: {
        bg: "bg-gradient-to-br from-gray-50 to-slate-50",
        border: "border-gray-300",
        badgeBg: "bg-gray-500",
        badgeText: "text-white",
        icon: X,
        iconColor: "text-gray-600",
        title: "Booking Cancelled",
        message: "This booking has been cancelled.",
        actionText: "Book Again",
        actionColor: "bg-gray-600 hover:bg-gray-700"
      }
    };
    return configs[status] || configs.pending;
  };

  const config = getStatusConfig(booking.status);
  const StatusIcon = config.icon;

  const calculateNights = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      {/* Header */}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 bg-white rounded-xl shadow-md`}>
            <StatusIcon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.productName}</h3>
            <p className="text-sm text-gray-600 mb-2">{config.message}</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Luxury Resort</span>
            </div>
          </div>
        </div>
        
        <span className={`${config.badgeBg} ${config.badgeText} px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2`}>
          <StatusIcon className="w-4 h-4" />
          {config.title}
        </span>
      </div>

      {/* Image */}
      {booking.image && (
        <div className="mb-4 rounded-xl overflow-hidden shadow-md relative h-48">
          <Image 
            src={booking.image} 
            alt={booking.productName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Check-in */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase">Check-in</p>
          </div>
          <p className="font-bold text-gray-900">
            {new Date(booking.startDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Check-out */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-purple-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase">Check-out</p>
          </div>
          <p className="font-bold text-gray-900">
            {new Date(booking.endDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Nights */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-indigo-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase">Duration</p>
          </div>
          <p className="font-bold text-gray-900">{calculateNights()} Night{calculateNights() > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Price & Offer */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">₹{booking.price}</p>
          </div>
        </div>
        
        {booking.offer && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-md">
            <Tag className="w-4 h-4" />
            <span className="font-bold">{booking.offer}</span>
          </div>
        )}
      </div>

      {/* Booking ID & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Booking ID: <span className="font-mono font-semibold text-gray-700">{booking._id}</span>
        </p>
        
      </div>

      {/* Booked Date */}
      <p className="text-xs text-gray-400 mt-2">
        Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  );
};

const MyReservations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/bookings");
      
      if (!response.ok) {
        console.log("Failed to fetch bookings");
      }
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedBooking(null);
    refreshBookings();
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <button
        onClick={() => window.history.back()}
        className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center gap-2"
      >
        <ArrowBigLeft className="w-5 h-5" />
        Back to Home
      </button>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">Track and manage all your resort reservations</p>
              </div>
            </div>

            <button
              onClick={refreshBookings}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-900">{statusCounts.all}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-green-700 font-medium">Confirmed</p>
              <p className="text-3xl font-bold text-green-900">{statusCounts.approved}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-900">{statusCounts.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-red-700 font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-900">{statusCounts.rejected}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All Bookings", count: statusCounts.all, color: "blue" },
              { key: "pending", label: "Pending", count: statusCounts.pending, color: "yellow" },
              { key: "approved", label: "Confirmed", count: statusCounts.approved, color: "green" },
              { key: "rejected", label: "Rejected", count: statusCounts.rejected, color: "red" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  filter === tab.key
                    ? `bg-${tab.color}-600 text-white shadow-lg scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">
              {filter !== "all" 
                ? `You don't have any ${filter} bookings yet.` 
                : "Start exploring our amazing resorts and make your first booking!"}
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Resorts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingStatusCard key={booking._id} booking={booking} onPaymentClick={handlePaymentClick} />
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedBooking && (
          <PaymentModal
            booking={selectedBooking}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedBooking(null);
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking is now confirmed and paid.</p>
          <p className="text-sm text-gray-500">Refreshing your bookings...</p>
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
                <span className="text-gray-700 font-medium">{booking.productName}</span>
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
                    <p className={`font-medium text-sm ${
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
              <>
                <Lock className="w-5 h-5" />
                Pay ₹{booking.price}
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            ðŸ”’ Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyReservations;

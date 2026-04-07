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
  ArrowBigLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PaymentModal from "./PaymentModal";

const BookingStatusCard = ({ booking }) => {
  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        bg: "bg-gradient-to-br from-luxury-sand/90 to-emerald-50/40",
        border: "border-emerald-200/80",
        badgeBg: "bg-luxury-black",
        badgeText: "text-luxury-gold-light",
        icon: CheckCircle,
        iconColor: "text-emerald-700",
        title: "Booking Confirmed",
        message: "Your reservation is confirmed! Get ready for an amazing stay.",
        actionText: "View Details",
        actionColor: "bg-luxury-black hover:bg-luxury-charcoal"
      },
      pending: {
        bg: "bg-gradient-to-br from-luxury-sand to-amber-50/50",
        border: "border-amber-200/90",
        badgeBg: "bg-luxury-gold",
        badgeText: "text-luxury-black",
        icon: Clock,
        iconColor: "text-amber-800",
        title: "Awaiting Approval",
        message: "Your booking request is under review. We'll notify you soon!",
        actionText: "Track Status",
        actionColor: "bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light"
      },
      rejected: {
        bg: "bg-gradient-to-br from-luxury-sand/80 to-red-50/40",
        border: "border-red-200",
        badgeBg: "bg-red-600",
        badgeText: "text-white",
        icon: XCircle,
        iconColor: "text-red-600",
        title: "Booking Not Approved",
        message: "Unfortunately, this booking couldn't be processed. Try different dates.",
        actionText: "Book Again",
        actionColor: "bg-red-700 hover:bg-red-800"
      },
      cancelled: {
        bg: "bg-gradient-to-br from-luxury-sand to-luxury-stone/50",
        border: "border-luxury-stone",
        badgeBg: "bg-luxury-charcoal",
        badgeText: "text-luxury-sand",
        icon: X,
        iconColor: "text-luxury-charcoal",
        title: "Booking Cancelled",
        message: "This booking has been cancelled.",
        actionText: "Book Again",
        actionColor: "bg-luxury-charcoal hover:bg-luxury-black"
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
    <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-6 shadow-glass transition-all duration-300 hover:shadow-luxury`}>
      {/* Header */}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-luxury-stone/60">
            <StatusIcon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 font-display text-xl font-semibold text-luxury-black">{booking.productName}</h3>
            <p className="mb-2 text-sm text-luxury-charcoal/80">{config.message}</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-luxury-gold-dark" />
              <span className="text-sm text-luxury-charcoal/70">Luxury Resort</span>
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
        <div className="rounded-xl border border-luxury-stone/60 bg-white/90 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-luxury-gold-dark" />
            <p className="text-xs font-semibold uppercase text-luxury-charcoal/60">Check-in</p>
          </div>
          <p className="font-bold text-luxury-black">
            {new Date(booking.startDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Check-out */}
        <div className="rounded-xl border border-luxury-stone/60 bg-white/90 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-luxury-gold-dark" />
            <p className="text-xs font-semibold uppercase text-luxury-charcoal/60">Check-out</p>
          </div>
          <p className="font-bold text-luxury-black">
            {new Date(booking.endDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Nights */}
        <div className="rounded-xl border border-luxury-stone/60 bg-white/90 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Home className="h-5 w-5 text-luxury-gold-dark" />
            <p className="text-xs font-semibold uppercase text-luxury-charcoal/60">Duration</p>
          </div>
          <p className="font-bold text-luxury-black">{calculateNights()} Night{calculateNights() > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Price & Offer */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-luxury-stone/60 bg-white/90 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-luxury-gold-dark" />
          <div>
            <p className="text-xs text-luxury-charcoal/60">Total Amount</p>
            <p className="text-2xl font-bold text-luxury-black">₹{booking.price}</p>
          </div>
        </div>
        
        {booking.offer && (
          <div className="flex items-center gap-2 rounded-xl bg-luxury-black px-4 py-2 text-white shadow-luxury">
            <Tag className="w-4 h-4" />
            <span className="font-bold">{booking.offer}</span>
          </div>
        )}
      </div>

      {/* Booking ID & Actions */}
      <div className="flex items-center justify-between border-t border-luxury-stone/60 pt-4">
        <p className="text-xs text-luxury-charcoal/55">
          Booking ID: <span className="font-mono font-semibold text-luxury-black">{booking._id}</span>
        </p>
        
      </div>

      {/* Booked Date */}
      <p className="mt-2 text-xs text-luxury-charcoal/45">
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
      <div className="flex min-h-[50vh] items-center justify-center bg-luxury-cream p-4">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-luxury-gold-dark" />
          <p className="text-lg font-medium text-luxury-charcoal/75">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-cream via-luxury-sand/40 to-luxury-cream px-4 py-8">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 flex items-center gap-2 font-medium text-luxury-gold-dark transition hover:text-luxury-black"
      >
        <ArrowBigLeft className="w-5 h-5" />
        Back to Home
      </button>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 shadow-luxury">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-luxury-black shadow-luxury">
                <Calendar className="h-8 w-8 text-luxury-gold-light" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-semibold text-luxury-black">My Bookings</h1>
                <p className="mt-1 text-luxury-charcoal/70">Track and manage all your resort reservations</p>
              </div>
            </div>

            <button
              type="button"
              onClick={refreshBookings}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-2xl border border-luxury-stone bg-white px-4 py-2 text-luxury-black transition hover:border-luxury-gold/50 disabled:opacity-50"
            >
              <Loader2 className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-luxury-stone/80 bg-luxury-sand/60 p-4">
              <p className="text-sm font-medium text-luxury-charcoal/70">Total Bookings</p>
              <p className="font-display text-3xl font-semibold text-luxury-black">{statusCounts.all}</p>
            </div>
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
              <p className="text-sm font-medium text-emerald-800/90">Confirmed</p>
              <p className="font-display text-3xl font-semibold text-emerald-900">{statusCounts.approved}</p>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
              <p className="text-sm font-medium text-amber-900/80">Pending</p>
              <p className="font-display text-3xl font-semibold text-amber-950">{statusCounts.pending}</p>
            </div>
            <div className="rounded-xl border border-red-200/80 bg-red-50/50 p-4">
              <p className="text-sm font-medium text-red-800/90">Rejected</p>
              <p className="font-display text-3xl font-semibold text-red-900">{statusCounts.rejected}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 rounded-2xl border border-luxury-stone/80 bg-white/95 p-4 shadow-glass">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Bookings", count: statusCounts.all },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              { key: "approved", label: "Confirmed", count: statusCounts.approved },
              { key: "rejected", label: "Rejected", count: statusCounts.rejected },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`rounded-xl px-5 py-3 font-semibold transition-all ${
                  filter === tab.key
                    ? "scale-[1.02] bg-luxury-black text-luxury-gold-light shadow-luxury"
                    : "bg-luxury-sand/80 text-luxury-charcoal hover:bg-luxury-stone/80"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-luxury-stone/80 bg-white/95 p-12 text-center shadow-luxury">
            <Home className="mx-auto mb-4 h-20 w-20 text-luxury-stone" />
            <h3 className="mb-2 font-display text-2xl font-semibold text-luxury-black">No Bookings Found</h3>
            <p className="mb-6 text-luxury-charcoal/75">
              {filter !== "all" 
                ? `You don't have any ${filter} bookings yet.` 
                : "Start exploring our amazing resorts and make your first booking!"}
            </p>
            <Link 
              href="/"
              className="inline-block rounded-2xl bg-luxury-gold px-6 py-3 font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
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

export default MyReservations;

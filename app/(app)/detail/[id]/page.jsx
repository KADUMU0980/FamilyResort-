"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  MapPin,
  Wifi,
  Tv,
  Coffee,
  Wind,
  Droplet,
  Check,
  Calendar,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { bookingAction } from "../../../serverActions/bookingAction";
import { addReviewAction } from "../../../serverActions/reviewAction";
import CalendarComponent from "../../../components/Calender";
import { sendBookingEmail } from "../../../utils/sendEmail/sendEmail";

const DynamicProduct = () => {
  const [resortRoom, setResortRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

  // Review Fields
  const [reviews, setReviews] = useState([]);
  const [ratingInput, setRatingInput] = useState(0);
  const [reviewTextInput, setReviewTextInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking Fields
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [occasion, setOccasion] = useState("");
  const [durationType, setDurationType] = useState("12hr");

  const { id } = useParams();

  useEffect(() => {
    dynamicProductHandler();
  }, [id]);

  const dynamicProductHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/product/${id}`);
      if (!response.ok) throw new Error("Could not fetch product.");
      const data = await response.json();
      setResortRoom(data.product);
      setReviews(data.product.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (dates, type, room) => {
    if (!dates?.startDate || !dates?.endDate || !room) return 0;

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const sameDayBooking = start.toDateString() === end.toDateString();

    if (sameDayBooking) {
      return type === "12hr" ? room.price / 2 : room.price;
    }

    // +1 because both check-in and check-out days count
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return nights * room.price;
  };

  const getNights = (dates) => {
    if (!dates?.startDate || !dates?.endDate) return 0;
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    if (start.toDateString() === end.toDateString()) return 1;
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleDateChange = (range) => {
    setSelectedDates(range);
    setTotalAmount(calculateTotal(range, durationType, resortRoom));
  };

  // Recalculate price whenever duration type changes (only matters for same-day)
  const handleDurationChange = (type) => {
    setDurationType(type);
    setTotalAmount(calculateTotal(selectedDates, type, resortRoom));
  };

  const isSameDay =
    selectedDates?.startDate &&
    selectedDates?.endDate &&
    new Date(selectedDates.startDate).toDateString() ===
    new Date(selectedDates.endDate).toDateString();

  const bookingHandler = async () => {
    if (!selectedDates?.startDate || !selectedDates?.endDate) {
      alert("Please select start and end dates before booking.");
      return;
    }

    try {
      const bookingData = {
        resortRoom: resortRoom._id,
        startDate: new Date(selectedDates.startDate),
        endDate: new Date(selectedDates.endDate),
        productName: resortRoom.title,
        price: totalAmount,
        offer: resortRoom.offer || null,
        image: resortRoom.images?.[0] || resortRoom.image,
        numberOfPeople,
        occasion,
        durationType: isSameDay ? durationType : undefined,
      };

      const result = await bookingAction(bookingData);

      if (result.success) {
        const phoneNumber = "9849660462";
        const nights = getNights(selectedDates);

        const message = `
Booking Request

Resort: ${resortRoom.title}
People: ${numberOfPeople}
Occasion: ${occasion}
Start Date: ${new Date(selectedDates.startDate).toDateString()}
End Date: ${new Date(selectedDates.endDate).toDateString()}
${isSameDay ? `Duration: ${durationType}` : `Nights: ${nights}`}
Total Price: ₹${totalAmount}
        `;

        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");

        // Send Email Request concurrently via Server Action
        sendBookingEmail({
          productName: resortRoom.title,
          numberOfPeople,
          occasion,
          startDate: new Date(selectedDates.startDate).toDateString(),
          endDate: new Date(selectedDates.endDate).toDateString(),
          price: totalAmount
        }).catch(err => console.error("Email API Error:", err));

        alert("Booking request submitted successfully!");

        setSelectedDates(null);
        setTotalAmount(0);
        setShowCalendar(false);
        setDurationType("12hr");
      } else {
        alert(result.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      alert("An error occurred during booking");
    }
  };

  const getAmenityIcon = (amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-5 h-5" />;
    if (lowerAmenity.includes("tv")) return <Tv className="w-5 h-5" />;
    if (lowerAmenity.includes("breakfast")) return <Coffee className="w-5 h-5" />;
    if (lowerAmenity.includes("ac")) return <Wind className="w-5 h-5" />;
    if (lowerAmenity.includes("geyser")) return <Droplet className="w-5 h-5" />;
    return <Check className="w-5 h-5" />;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (ratingInput < 1 || ratingInput > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (!reviewTextInput.trim()) {
      alert("Please write a review.");
      return;
    }

    setSubmittingReview(true);
    try {
      const result = await addReviewAction(id, ratingInput, reviewTextInput);
      if (result.success) {
        setReviews(result.product.reviews || []);
        setRatingInput(0);
        setReviewTextInput("");
      } else {
        alert(result.message || "Failed to submit review. Are you logged in?");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!resortRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">No product found</p>
        </div>
      </div>
    );
  }

  const displayImages = resortRoom?.images?.length > 0 ? resortRoom.images : [resortRoom?.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Listings
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            {resortRoom.title}

            {getAverageRating() && (
              <span className="flex items-center gap-1 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {getAverageRating()}
                <span className="text-gray-600 font-medium">
                  ({reviews.length} reviews)
                </span>
              </span>
            )}
          </h1>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>Premium Resort Room</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 order-1 bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="aspect-video w-full bg-black relative group">
              {displayImages.length > 0 ? (
                <>
                  <img
                    src={displayImages[currentImageIndex]}
                    alt={`${resortRoom.title} image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {displayImages.length > 1 && (
                    <>
                      {/* Left Button */}
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      {/* Right Button */}
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {displayImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                              }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  No images available
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 lg:row-span-2 space-y-6 lg:sticky lg:top-8 order-2">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-indigo-600">
                  ₹{resortRoom.price}
                </div>
                <div className="text-gray-500">per night</div>
              </div>

              {/* Calendar Toggle */}
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-indigo-200 transition-colors mb-4"
              >
                <Calendar size={18} />
                {showCalendar ? "Hide Calendar" : "Select Dates"}
              </button>

              {/* Calendar */}
              {showCalendar && (
                <div className="mb-4 border rounded-xl p-4 shadow-sm bg-gray-50 space-y-4">
                  <CalendarComponent onDateChange={handleDateChange} />

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of People
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="" disabled>Select an occasion</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Business Meeting">Business Meeting</option>
                        <option value="Party">Party</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Duration type — only shown for same-day bookings */}
                    {isSameDay && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration Type (Same Day)
                        </label>
                        <select
                          value={durationType}
                          onChange={(e) => handleDurationChange(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="12hr">12hr (₹{resortRoom.price / 2})</option>
                          <option value="24hr">24hr (₹{resortRoom.price})</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Price summary — totalAmount is always the final correct price */}
                  {totalAmount > 0 && (
                    <div className="mt-3 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 font-semibold text-center">
                      Total: ₹{totalAmount}
                      <p className="text-xs text-green-600 mt-1">
                        {isSameDay
                          ? `Same day — ${durationType}`
                          : `${getNights(selectedDates)} night${getNights(selectedDates) > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Book Button */}
              <button
                className={`w-full py-4 rounded-2xl font-bold transition-all ${totalAmount > 0 && occasion
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                onClick={bookingHandler}
                disabled={totalAmount === 0 || !occasion}
              >
                {totalAmount > 0
                  ? occasion
                    ? "Request Booking"
                    : "Select Occasion"
                  : "Select Dates First"}
              </button>

              {totalAmount === 0 && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Choose your check-in and check-out dates
                </p>
              )}

              {/* Offer Display */}
              {resortRoom.offer && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <p className="text-sm text-orange-800 font-semibold">
                    🎉 Special Offer: {resortRoom.offer}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hidden lg:block">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Important Information
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Free cancellation up to 24 hours before check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Payment required after admin approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Valid ID proof required at check-in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 order-3">

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4">About This Room</h2>
              <p className="text-gray-700 text-lg">{resortRoom.desc}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Amenities</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {resortRoom.amen?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-800 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Booking Process
                  </h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Submit your booking request with your preferred dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Admin will review and approve your request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Track your booking status in "My Reservations"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Complete payment after approval</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">
              <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

              {/* Review Form */}
              <div className="bg-gray-50 border rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className={`p-1 transition-colors ${ratingInput >= star ? 'text-amber-400' : 'text-gray-300 hover:text-amber-200'}`}
                        >
                          <Star className="w-8 h-8" fill={ratingInput >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Text</label>
                    <textarea
                      value={reviewTextInput}
                      onChange={(e) => setReviewTextInput(e.target.value)}
                      placeholder="Write your review about this resort..."
                      className="w-full p-3 border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                  >
                    {submittingReview ? "Posting..." : "Post Review"}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                  [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review, index) => (
                    <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{review.username}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? "⭐" : <Star className="w-4 h-4 text-gray-300 inline" />}</span>
                        ))}
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this resort!</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DynamicProduct;
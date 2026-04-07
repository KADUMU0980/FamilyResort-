"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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
  Navigation,
} from "lucide-react";
import { bookingAction } from "../../../serverActions/bookingAction";
import { addReviewAction } from "../../../serverActions/reviewAction";
import CalendarComponent from "../../../components/Calender";
import { sendBookingEmail } from "../../../utils/sendEmail/sendEmail";
import { getSession } from "next-auth/react";
import LoginModal from "../../../components/LoginModal";

const DynamicProduct = () => {
  const [resortRoom, setResortRoom] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
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

  const dynamicProductHandler = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    dynamicProductHandler();
  }, [dynamicProductHandler]);

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
    const session = await getSession();
    if (!session) {
      setShowLoginModal(true);
      return;
    }

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
        const supportPhone = "9849660462";
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

        const whatsappURL = `https://wa.me/${supportPhone}?text=${encodeURIComponent(message)}`;
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

    const session = await getSession();
    if (!session) {
      setShowLoginModal(true);
      return;
    }

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
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream p-4">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream p-4">
        <div className="w-full max-w-md rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 text-center shadow-luxury">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
          <h2 className="mb-2 font-display text-2xl font-semibold text-luxury-black">Oops!</h2>
          <p className="text-luxury-charcoal/75">{error}</p>
        </div>
      </div>
    );
  }

  if (!resortRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream p-4">
        <div className="w-full max-w-md rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 text-center shadow-luxury">
          <p className="text-luxury-charcoal/75">No product found</p>
        </div>
      </div>
    );
  }

  const displayImages = resortRoom 
    ? [...(resortRoom.profileImages || []), ...(resortRoom.carouselImages || [])].length > 0 
      ? [...(resortRoom.profileImages || []), ...(resortRoom.carouselImages || [])]
      : (resortRoom.images?.length > 0 ? resortRoom.images : [resortRoom?.image].filter(Boolean))
    : [];

  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setShowGallery(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-cream via-luxury-sand/40 to-luxury-cream">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-4 flex items-center gap-2 font-medium text-luxury-gold-dark transition hover:text-luxury-black"
          >
            ← Back to listings
          </button>

          <h1 className="mb-2 flex flex-wrap items-center gap-3 font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            {resortRoom.title}

            {getAverageRating() && (
              <span className="flex items-center gap-1 rounded-full bg-luxury-black px-3 py-1 text-sm font-semibold text-luxury-gold-light">
                <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                {getAverageRating()}
                <span className="font-medium text-luxury-sand/90">
                  ({reviews.length} reviews)
                </span>
              </span>
            )}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Address — clickable to open Google Maps location */}
            {resortRoom.address || (resortRoom.latitude && resortRoom.longitude) ? (
              <a
                href={
                  resortRoom.latitude && resortRoom.longitude
                    ? `https://www.google.com/maps?q=${resortRoom.latitude},${resortRoom.longitude}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(resortRoom.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-luxury-charcoal/75 hover:text-luxury-gold-dark transition-colors group"
              >
                <MapPin className="h-5 w-5 text-luxury-gold-dark shrink-0 group-hover:scale-110 transition-transform" />
                <span className="underline-offset-2 group-hover:underline">
                  {resortRoom.address || `${resortRoom.latitude}, ${resortRoom.longitude}`}
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-luxury-charcoal/75">
                <MapPin className="h-5 w-5 text-luxury-gold-dark" />
                <span>Location not specified</span>
              </div>
            )}

            {/* Directions Button */}
            {resortRoom.latitude && resortRoom.longitude && (
              <button
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) {
                    alert("Geolocation is not supported by your browser.");
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude: userLat, longitude: userLng } = position.coords;
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${resortRoom.latitude},${resortRoom.longitude}`;
                      window.open(url, "_blank");
                    },
                    () => {
                      // Fallback: open directions without origin
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${resortRoom.latitude},${resortRoom.longitude}`;
                      window.open(url, "_blank");
                    }
                  );
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 px-4 py-1.5 text-sm font-medium text-luxury-gold-dark hover:bg-luxury-gold/25 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Directions
              </button>
            )}
          </div>
        </div>

        {/* Fullscreen Gallery Modal */}
        {showGallery && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col">
            <div className="absolute top-16 right-6 z-[200] flex gap-4">
              <button 
                onClick={() => setShowGallery(false)}
                className="bg-white hover:bg-white/10 text-luxury-gold-dark rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Close Gallery"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-4">
              {displayImages.length > 0 && (
                <div className="relative w-full max-w-5xl aspect-video">
                  <Image
                    src={displayImages[galleryIndex]}
                    alt={`Gallery image ${galleryIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              )}

              {/* Controls */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                    className="absolute left-4 md:left-10 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => setGalleryIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 md:right-10 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="h-24 md:h-32 bg-black/50 overflow-x-auto flex items-center gap-2 p-4 snap-x hide-scrollbar">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setGalleryIndex(idx)}
                  className={`relative h-full aspect-video flex-shrink-0 rounded overflow-hidden opacity-50 transition-all ${galleryIndex === idx ? 'opacity-100 ring-2 ring-white scale-105' : 'hover:opacity-75'}`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill sizes="128px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">

          <div className="lg:col-span-2 order-1 space-y-8">
            {/* --- GALLERY DESKTOP --- */}
            <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-[450px] rounded-3xl overflow-hidden shadow-xl">
              {displayImages.length === 1 && (
                <div className="col-span-4 row-span-2 relative cursor-pointer" onClick={() => openGallery(0)}>
                  <Image src={displayImages[0]} alt="main" fill sizes="100vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              {displayImages.length === 2 && (
                <>
                  <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => openGallery(0)}>
                    <Image src={displayImages[0]} alt="main" fill sizes="50vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => openGallery(1)}>
                    <Image src={displayImages[1]} alt="main" fill sizes="50vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </>
              )}
              {displayImages.length >= 3 && (
                <>
                  <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group" onClick={() => openGallery(0)}>
                    <Image src={displayImages[0]} alt="main" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  {displayImages.slice(1, 5).map((img, idx) => {
                    // Decide grid placement based on number of images
                    const totalImgs = displayImages.length;
                    const isLastShown = idx === 3 || (totalImgs === 3 && idx === 1) || (totalImgs === 4 && idx === 2);
                    
                    let classes = "relative cursor-pointer overflow-hidden group";
                    if (totalImgs === 3) classes += " col-span-2 row-span-1";
                    else if (totalImgs === 4) {
                       if (idx === 0) classes += " col-span-2 row-span-1"; // Top right takes full width
                       else classes += " col-span-1 row-span-1"; // Bottom 2 take half width
                    }
                    else classes += " col-span-1 row-span-1"; // 5+ images
                    
                    return (
                      <div key={idx} className={classes} onClick={() => openGallery(idx + 1)}>
                        <Image src={img} alt={`grid-${idx}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* Overlay for additional images */}
                        {isLastShown && displayImages.length > 5 && (
                           <div className="absolute inset-0 bg-black/60 hover:bg-black/70 flex items-center justify-center text-white text-xl font-bold transition-colors">
                             +{displayImages.length - 5}
                           </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
              {displayImages.length === 0 && (
                 <div className="col-span-4 row-span-2 bg-gray-200 flex items-center justify-center text-gray-500">
                   No images available
                 </div>
              )}
            </div>

            {/* --- GALLERY MOBILE (Swipeable Carousel) --- */}
            <div className="lg:hidden relative rounded-2xl overflow-hidden shadow-lg group">
              <div 
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-[350px] relative scroll-smooth"
                id="mobile-carousel"
                onScroll={(e) => {
                  const width = e.currentTarget.clientWidth;
                  const newIndex = Math.round(e.currentTarget.scrollLeft / width);
                  if (currentImageIndex !== newIndex) setCurrentImageIndex(newIndex);
                }}
              >
                {displayImages.map((img, idx) => (
                  <div key={idx} className="min-w-full h-full snap-start relative cursor-pointer" onClick={() => openGallery(idx)}>
                    <Image src={img} alt={`mobile-${idx}`} fill sizes="100vw" className="object-cover" />
                  </div>
                ))}
                {displayImages.length === 0 && (
                   <div className="min-w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                     No images available
                   </div>
                )}
              </div>
              
              {/* Image counter indicator */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 lg:row-span-2 space-y-6 lg:sticky lg:top-8 order-2">
            <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury backdrop-blur-sm">
              <div className="mb-6 text-center">
                <div className="text-5xl font-bold text-luxury-black">
                  ₹{resortRoom.price}
                </div>
                <div className="text-luxury-charcoal/60">per night</div>
              </div>

              {/* Calendar Toggle */}
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-luxury-stone bg-luxury-sand/80 px-4 py-3 font-medium text-luxury-black transition hover:border-luxury-gold/50 hover:bg-luxury-sand"
              >
                <Calendar size={18} />
                {showCalendar ? "Hide Calendar" : "Select Dates"}
              </button>

              {/* Calendar */}
              {showCalendar && (
                <div className="mb-4 space-y-4 rounded-xl border border-luxury-stone/80 bg-luxury-sand/40 p-4 shadow-sm">
                  <CalendarComponent onDateChange={handleDateChange} />

                  <div className="space-y-3 border-t border-luxury-stone/60 pt-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                        Number of People
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                        className="w-full rounded-lg border border-luxury-stone p-2 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                        Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full rounded-lg border border-luxury-stone p-2 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
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
                        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                          Duration Type (Same Day)
                        </label>
                        <select
                          value={durationType}
                          onChange={(e) => handleDurationChange(e.target.value)}
                          className="w-full rounded-lg border border-luxury-stone p-2 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
                        >
                          <option value="12hr">12hr (₹{resortRoom.price / 2})</option>
                          <option value="24hr">24hr (₹{resortRoom.price})</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Price summary — totalAmount is always the final correct price */}
                  {totalAmount > 0 && (
                    <div className="mt-3 rounded-lg border border-luxury-gold/40 bg-luxury-gold/10 p-4 text-center font-semibold text-luxury-black">
                      Total: ₹{totalAmount}
                      <p className="mt-1 text-xs text-luxury-charcoal/70">
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
                type="button"
                className={`w-full rounded-2xl py-4 font-bold transition-all ${totalAmount > 0 && occasion
                  ? "bg-luxury-gold text-luxury-black shadow-luxury-gold hover:bg-luxury-gold-light"
                  : "cursor-not-allowed bg-luxury-stone text-luxury-charcoal/60"
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
                <p className="mt-2 text-center text-sm text-luxury-charcoal/60">
                  Choose your check-in and check-out dates
                </p>
              )}

              {/* Offer Display */}
              {/* {resortRoom.offer && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <p className="text-sm text-orange-800 font-semibold">
                    🎉 Special Offer: {resortRoom.offer}
                  </p>
                </div>
              )} */}
            </div>

            {/* Additional Info */}
            <div className="hidden rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury lg:block">
              <h3 className="mb-4 text-lg font-bold text-luxury-black">
                Important Information
              </h3>
              <ul className="space-y-3 text-sm text-luxury-charcoal/80">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-luxury-gold-dark" />
                  <span>Free cancellation up to 24 hours before check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-luxury-gold-dark" />
                  <span>Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-luxury-gold-dark" />
                  <span>Payment required after admin approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-luxury-gold-dark" />
                  <span>Valid ID proof required at check-in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 order-3">

            {/* Description */}
            <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury">
              <h2 className="mb-4 font-display text-2xl font-bold text-luxury-black">About This Room</h2>
              <p className="text-lg text-luxury-charcoal/90">{resortRoom.desc}</p>
            </div>

            {/* Amenities */}
            <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury">
              <h2 className="mb-6 font-display text-2xl font-bold text-luxury-black">Amenities</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {resortRoom.amen?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-luxury-stone/60 bg-luxury-sand/50 p-4"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="font-medium text-luxury-black">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Notice */}
            <div className="rounded-2xl border border-luxury-gold/30 bg-luxury-sand/60 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-luxury-gold/20 p-3 ring-1 ring-luxury-gold/30">
                  <AlertCircle className="h-6 w-6 text-luxury-gold-dark" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-luxury-black">
                    Booking Process
                  </h3>
                  <ul className="space-y-2 text-sm text-luxury-charcoal/85">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-luxury-gold-dark">•</span>
                      <span>Submit your booking request with your preferred dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-luxury-gold-dark">•</span>
                      <span>Admin will review and approve your request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-luxury-gold-dark">•</span>
                      <span>Track your booking status in &quot;My Reservations&quot;</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-luxury-gold-dark">•</span>
                      <span>Complete payment after approval</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury">
              <h2 className="mb-6 font-display text-2xl font-bold text-luxury-black">Reviews & Ratings</h2>

              {/* Review Form */}
              <div className="mb-8 rounded-2xl border border-luxury-stone/80 bg-luxury-sand/40 p-6">
                <h3 className="mb-4 text-lg font-semibold text-luxury-black">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-luxury-charcoal">Rating</label>
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
                    <label className="mb-2 block text-sm font-medium text-luxury-charcoal">Review Text</label>
                    <textarea
                      value={reviewTextInput}
                      onChange={(e) => setReviewTextInput(e.target.value)}
                      placeholder="Write your review about this resort..."
                      className="h-24 w-full resize-none rounded-xl border border-luxury-stone p-3 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="rounded-lg bg-luxury-black px-6 py-2 font-medium text-white transition hover:bg-luxury-charcoal disabled:bg-luxury-stone"
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
                        <div className="font-semibold text-luxury-black">{review.username}</div>
                        <div className="text-sm text-luxury-charcoal/60">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? "⭐" : <Star className="w-4 h-4 text-gray-300 inline" />}</span>
                        ))}
                      </div>
                      <p className="text-luxury-charcoal/90">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-luxury-charcoal/60">No reviews yet. Be the first to review this resort!</p>
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
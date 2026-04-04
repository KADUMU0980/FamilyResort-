"use client";

import { motion } from "framer-motion";
import { MapPin, Search, Users, CalendarRange } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const HERO_BG =
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2400&auto=format&fit=crop";

export default function HeroSearch({
  locationQuery,
  onLocationChange,
  onSearch,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests,
  onGuestsChange,
}) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/20 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:justify-center lg:pb-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-luxury-gold-light/90">
            Luxury collection
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Find Your Perfect Luxury Escape
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Handpicked resorts, intuitive booking, and service that anticipates every detail.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 w-full max-w-5xl"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-luxury backdrop-blur-md sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
              <label className="group lg:col-span-4">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/70">
                  <MapPin className="h-3.5 w-3.5 text-luxury-gold-light" />
                  Location
                </span>
                <div className="relative">
                  <Input
                    value={locationQuery}
                    onChange={(e) => onLocationChange(e.target.value)}
                    placeholder="Beach, city, resort name..."
                    className="border-white/30 bg-white/95 pl-4"
                  />
                </div>
              </label>
              <label className="lg:col-span-2">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/70">
                  <CalendarRange className="h-3.5 w-3.5 text-luxury-gold-light" />
                  Check-in
                </span>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => onCheckInChange(e.target.value)}
                  className="border-white/30 bg-white/95"
                />
              </label>
              <label className="lg:col-span-2">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/70">
                  <CalendarRange className="h-3.5 w-3.5 text-luxury-gold-light" />
                  Check-out
                </span>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => onCheckOutChange(e.target.value)}
                  className="border-white/30 bg-white/95"
                />
              </label>
              <label className="lg:col-span-2">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/70">
                  <Users className="h-3.5 w-3.5 text-luxury-gold-light" />
                  Guests
                </span>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={(e) => onGuestsChange(Number(e.target.value))}
                  className="border-white/30 bg-white/95"
                />
              </label>
              <div className="sm:col-span-2 lg:col-span-2">
                <Button
                  type="button"
                  variant="primary"
                  className="h-12 w-full shadow-luxury-gold"
                  onClick={onSearch}
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

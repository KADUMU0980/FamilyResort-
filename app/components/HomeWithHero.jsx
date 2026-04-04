"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroSearch from "./HeroSearch";
import ProductCollection from "./ProductCollection";

const destinations = [
  { label: "Goa", sub: "Coastal villas", href: "/resorts" },
  { label: "Kerala", sub: "Backwaters", href: "/resorts" },
  { label: "Rajasthan", sub: "Palace stays", href: "/resorts" },
  { label: "Himachal", sub: "Mountain retreats", href: "/resorts" },
];

export default function HomeWithHero() {
  const [locationQuery, setLocationQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = useCallback(() => {
    setHeroSearch(locationQuery.trim());
    const el = document.getElementById("resorts-explore");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [locationQuery]);

  return (
    <>
      <HeroSearch
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
        onSearch={handleHeroSearch}
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        guests={guests}
        onGuestsChange={setGuests}
      />

      <section className="border-b border-luxury-stone/60 bg-luxury-sand/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="font-display text-2xl font-semibold text-luxury-black">
              Popular destinations
            </h2>
            <p className="mt-2 text-sm text-luxury-charcoal/70">
              Start with iconic regions guests love — same trusted booking flow.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={d.href}
                  className="group flex h-full flex-col rounded-2xl border border-luxury-stone/80 bg-white/90 p-5 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury"
                >
                  <span className="text-lg font-semibold text-luxury-black group-hover:text-luxury-gold-dark">
                    {d.label}
                  </span>
                  <span className="mt-1 text-sm text-luxury-charcoal/65">{d.sub}</span>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-luxury-gold-dark">
                    Explore →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div id="resorts-explore">
        <ProductCollection
          variant="home"
          searchQuery={heroSearch}
          setSearchQuery={setHeroSearch}
        />
      </div>
    </>
  );
}

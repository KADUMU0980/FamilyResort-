"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  AlertCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { ResortCardSkeleton } from "./ui/Skeleton";
import Button from "./ui/Button";

function averageRating(item) {
  if (!item.reviews?.length) return null;
  const sum = item.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return sum / item.reviews.length;
}

const ResortCard = ({ item, featured = false }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages =
    item.profileImages && item.profileImages.length > 0
      ? item.profileImages
      : item.image
        ? [item.image]
        : ["https://images.unsplash.com/photo-1566073771259-6a8506099945"];

  const hasMultipleImages = displayImages.length > 1;
  const avg = averageRating(item);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToImage = (e, idx) => {
    e.stopPropagation();
    setCurrentImageIndex(idx);
  };

  const imageHeight = featured ? "h-72 md:h-[420px]" : "h-56";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`group h-full cursor-pointer ${featured ? "md:col-span-2" : ""}`}
      onClick={() => router.push(`/detail/${item._id}`)}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury">
        <div
          className={`relative ${imageHeight} overflow-hidden bg-luxury-charcoal group/slider`}
        >
          {displayImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                idx === currentImageIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`${item.title} - Image ${idx + 1}`}
                fill
                sizes={
                  featured
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}

          {avg != null && (
            <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-luxury-black/70 px-2.5 py-1 text-xs font-semibold text-luxury-gold-light backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-luxury-gold text-luxury-gold" />
              {avg.toFixed(1)}
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-luxury-black/40 text-white opacity-0 transition-opacity hover:bg-luxury-black/70 group-hover/slider:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-luxury-black/40 text-white opacity-0 transition-opacity hover:bg-luxury-black/70 group-hover/slider:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => goToImage(e, idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex
                        ? "w-4 bg-luxury-gold-light"
                        : "w-1.5 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col divide-y divide-luxury-stone/60 p-5">
          <div className="flex-1 pb-4">
            <h2 className="mb-2 line-clamp-1 bg-gradient-to-br font-display text-xl font-semibold text-luxury-black group-hover:text-luxury-gold-dark">
              {item.title}
            </h2>

            <div className="mb-3 flex items-center gap-1 text-sm text-luxury-charcoal/70">
              <MapPin className="h-4 w-4 text-luxury-gold-dark" />
              <span>Premium Location</span>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-luxury-charcoal/80">
              {item.desc}
            </p>

            {item.amen && item.amen.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.amen.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-luxury-sand px-2 py-1 text-xs font-medium text-luxury-charcoal"
                  >
                    {amenity}
                  </span>
                ))}
                {item.amen.length > 3 && (
                  <span className="rounded-full bg-luxury-stone/80 px-2 py-1 text-xs font-medium text-luxury-charcoal/80">
                    +{item.amen.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <div>
              <p className="text-2xl font-bold text-luxury-black">
                ₹{item.price.toLocaleString()}
              </p>
              <p className="text-xs text-luxury-charcoal/60">per night</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="primary"
                className="px-5 py-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/detail/${item._id}`);
                }}
              >
                Book Now
              </Button>
              <a
                href="tel:+919849660462"
                className="relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="inline-flex items-center gap-2 rounded-2xl border border-luxury-stone bg-luxury-sand/90 px-3 py-2 text-sm font-medium text-luxury-black transition hover:bg-luxury-stone">
                  <Phone className="h-4 w-4 text-luxury-gold-dark" />
                  <span className="hidden sm:inline">Call</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCollection = ({
  searchQuery: controlledSearch,
  setSearchQuery: setControlledSearch,
  variant = "default",
}) => {
  const [internalSearch, setInternalSearch] = useState("");
  const controlled = typeof setControlledSearch === "function";
  const searchQuery = controlled ? controlledSearch ?? "" : internalSearch;
  const setSearchQuery = controlled ? setControlledSearch : setInternalSearch;

  const [collection, setCollection] = useState([]);
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQueryLocal, setSearchQueryLocal] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showAmenitiesFilter, setShowAmenitiesFilter] = useState(true);
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    setSearchQueryLocal(searchQuery);
  }, [searchQuery]);

  const allAmenities = [
    ...new Set(collection.flatMap((item) => item.amen || [])),
  ];

  const collectionHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/add-product", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const newdata = await response.json();
      setCollection(newdata.products || []);
      setFilteredCollection(newdata.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    collectionHandler();
  }, []);

  useEffect(() => {
    let filtered = [...collection];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAmenities.every((amenity) => item.amen?.includes(amenity))
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter((item) => {
        const a = averageRating(item);
        return a != null && a >= minRating;
      });
    }

    if (onlyAvailable) {
      filtered = filtered.filter((item) => item.available !== false);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredCollection(filtered);
  }, [
    searchQuery,
    priceRange,
    selectedAmenities,
    sortBy,
    collection,
    minRating,
    onlyAvailable,
  ]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchQueryLocal("");
    setPriceRange({ min: 0, max: 150000 });
    setSelectedAmenities([]);
    setSortBy("featured");
    setMinRating(0);
    setOnlyAvailable(false);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < 150000 ? 1 : 0) +
    selectedAmenities.length +
    (minRating > 0 ? 1 : 0) +
    (onlyAvailable ? 1 : 0);

  const featuredStrip = variant === "home" ? collection.slice(0, 4) : [];

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-luxury-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-luxury-sand" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ResortCardSkeleton />
            <ResortCardSkeleton />
            <ResortCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-luxury-cream px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 text-center shadow-luxury"
        >
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
          <h2 className="mb-2 font-display text-2xl font-semibold text-luxury-black">
            Error Loading Resorts
          </h2>
          <p className="mb-6 text-luxury-charcoal/75">{error}</p>
          <Button type="button" variant="primary" onClick={collectionHandler}>
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const featuredItem =
    filteredCollection.length > 0 ? filteredCollection[0] : null;
  const gridItems =
    filteredCollection.length > 1 ? filteredCollection.slice(1) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-cream via-luxury-sand/40 to-luxury-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {featuredStrip.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-semibold text-luxury-black">
              Featured resorts
            </h2>
            <p className="mt-2 text-sm text-luxury-charcoal/70">
              Handpicked properties from our collection.
            </p>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2 hide-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
              {featuredStrip.map((item) => (
                <div key={item._id} className="min-w-[260px] shrink-0 sm:min-w-0">
                  <ResortCard item={item} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            Available Resorts
          </h1>
          <p className="text-luxury-charcoal/70">
            Refine your search — filters apply instantly.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="relative min-w-[250px] flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/40" />
              <input
                type="text"
                placeholder="Search resorts..."
                value={searchQueryLocal}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchQueryLocal(v);
                  setSearchQuery(v);
                }}
                className="w-full rounded-2xl border border-luxury-stone bg-white/95 py-3 pl-10 pr-4 text-sm shadow-sm outline-none ring-0 transition focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-2xl border border-luxury-stone bg-white/95 px-4 py-3 text-sm font-medium shadow-sm transition hover:border-luxury-gold/40 lg:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-luxury-gold px-2 py-0.5 text-xs font-bold text-luxury-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-luxury-stone bg-white/95 px-4 py-3 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-luxury-gold/30"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-luxury-charcoal/70">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                active
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-luxury-gold-dark hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <aside
            className={`
            ${showFilters ? "block" : "hidden"} lg:block
            fixed lg:sticky top-0 left-0 lg:left-auto
            w-[min(100vw-2rem,20rem)] lg:w-72 h-screen lg:h-auto
            rounded-2xl border border-luxury-stone/80 bg-white/90 p-6 shadow-luxury backdrop-blur-md
            z-50 lg:z-auto
            overflow-y-auto
            lg:top-24
          `}
          >
            <div className="mb-4 flex items-center justify-between border-b border-luxury-stone/60 pb-4 lg:hidden">
              <h2 className="font-display text-lg font-semibold text-luxury-black">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-xl p-2 hover:bg-luxury-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 hidden items-center justify-between lg:flex">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-luxury-black">
                <Filter className="h-5 w-5 text-luxury-gold-dark" />
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-luxury-gold-dark hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mb-6 space-y-4 border-b border-luxury-stone/60 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-luxury-black">
                  Minimum rating
                </h3>
                <span className="text-xs text-luxury-charcoal/60">
                  {minRating}+ stars
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-luxury-gold"
              />
              <div className="flex justify-between text-xs text-luxury-charcoal/50">
                <span>Any</span>
                <span>5★</span>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-luxury-stone/60 pb-6">
              <div>
                <h3 className="text-sm font-semibold text-luxury-black">
                  Availability
                </h3>
                <p className="text-xs text-luxury-charcoal/60">
                  Show only available resorts
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={onlyAvailable}
                onClick={() => setOnlyAvailable((v) => !v)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  onlyAvailable ? "bg-luxury-gold" : "bg-luxury-stone"
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    onlyAvailable ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="mb-6 border-b border-luxury-stone/60 pb-6">
              <button
                type="button"
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="mb-3 flex w-full items-center justify-between"
              >
                <h3 className="font-semibold text-luxury-black">Price range</h3>
                {showPriceFilter ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showPriceFilter && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm text-luxury-charcoal/70">
                      Min: ₹{priceRange.min.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-luxury-charcoal/70">
                      Max: ₹{priceRange.max.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-luxury-gold"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAmenitiesFilter(!showAmenitiesFilter)}
                className="mb-3 flex w-full items-center justify-between"
              >
                <h3 className="font-semibold text-luxury-black">Amenities</h3>
                {showAmenitiesFilter ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showAmenitiesFilter && (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex cursor-pointer items-center gap-2 rounded-xl p-2 hover:bg-luxury-sand/80"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="h-4 w-4 rounded border-luxury-stone text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="text-sm text-luxury-charcoal">{amenity}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              className="mt-6 w-full lg:hidden"
              onClick={() => setShowFilters(false)}
            >
              Show {filteredCollection.length} results
            </Button>
          </aside>

          {showFilters && (
            <div
              role="presentation"
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-40 bg-luxury-black/40 backdrop-blur-sm lg:hidden"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="mb-6 text-sm text-luxury-charcoal/75">
              Showing {filteredCollection.length} of {collection.length}{" "}
              resorts
            </p>

            <AnimatePresence mode="wait">
              {filteredCollection.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-luxury-stone/80 bg-white/95 p-12 text-center shadow-luxury"
                >
                  <Home className="mx-auto mb-4 h-16 w-16 text-luxury-stone" />
                  <h3 className="font-display text-2xl font-semibold text-luxury-black">
                    No resorts found
                  </h3>
                  <p className="mt-2 text-luxury-charcoal/70">
                    Try adjusting filters or search to see more results.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    className="mt-6"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  {featuredItem && (
                    <div>
                      <h3 className="mb-4 font-display text-lg font-semibold text-luxury-black">
                        Top match
                      </h3>
                      <div className="grid gap-6 lg:grid-cols-2">
                        <ResortCard item={featuredItem} featured />
                      </div>
                    </div>
                  )}

                  {gridItems.length > 0 && (
                    <div>
                      <h3 className="mb-4 font-display text-lg font-semibold text-luxury-black">
                        More stays
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
                        {gridItems.map((item) => (
                          <ResortCard key={item._id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCollection;

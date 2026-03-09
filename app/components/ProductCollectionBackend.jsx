"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Home, Tag, DollarSign, Loader2, AlertCircle, MapPin, Star,
  Search, SlidersHorizontal, X, Filter, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { debounce } from "lodash";

const ProductCollectionBackend = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showAmenitiesFilter, setShowAmenitiesFilter] = useState(true);

  // Fetch products with filters
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice < 50000) params.append('maxPrice', filters.maxPrice);
      if (filters.amenities?.length) params.append('amenities', filters.amenities.join(','));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await fetch(`/api/admin/add-product?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      setCollection(data.products || []);
      
      // Extract all unique amenities for the filter
      const amenities = [...new Set(data.products.flatMap(p => p.amen || []))];
      setAllAmenities(amenities);
      
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((filters) => fetchProducts(filters), 500),
    []
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    debouncedFetch({
      search: searchQuery,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      amenities: selectedAmenities,
      sortBy
    });
  }, [searchQuery, priceRange, selectedAmenities, sortBy]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: 0, max: 150000 });
    setSelectedAmenities([]);
    setSortBy("featured");
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < 150000 ? 1 : 0) +
    selectedAmenities.length;

  if (loading && collection.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading resorts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Resorts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Search */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Resorts</h1>
          
          {/* Search Bar */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 animate-spin" />
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Same as before */}
          <aside className={`
            ${showFilters ? 'block' : 'hidden'} lg:block
            fixed lg:sticky top-0 left-0 lg:left-auto
            w-80 lg:w-72 h-screen lg:h-auto
            bg-white rounded-2xl shadow-lg p-6
            z-50 lg:z-auto
            overflow-y-auto
            lg:top-8
          `}>
            <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden lg:flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="font-semibold text-gray-900">Price Range</h3>
                {showPriceFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showPriceFilter && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Min: ₹{priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Max: ₹{priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <button
                onClick={() => setShowAmenitiesFilter(!showAmenitiesFilter)}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="font-semibold text-gray-900">Amenities</h3>
                {showAmenitiesFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showAmenitiesFilter && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              Show {collection.length} Results
            </button>
          </aside>

          {showFilters && (
            <div
              onClick={() => setShowFilters(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
          )}

          {/* Products Grid - Same as before */}
          <div className="flex-1">
            <p className="text-gray-600 mb-6">
              Showing {collection.length} resort{collection.length !== 1 ? 's' : ''}
            </p>

            {collection.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Resorts Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {collection.map((item) => (
                  <Link key={item._id} href={`/detail/${item._id}`} className="group">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {item.offer && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {item.offer}
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h2>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>Premium Location</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.desc}</p>
                        {item.amen && item.amen.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.amen.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                {amenity}
                              </span>
                            ))}
                            {item.amen.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                +{item.amen.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors group-hover:shadow-lg">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCollectionBackend;
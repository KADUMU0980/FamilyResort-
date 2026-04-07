"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Edit, Trash2, Eye, EyeOff, 
  Search, Filter, CheckSquare, Square, X 
} from "lucide-react";

const ManageResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all");
  const [selectedResorts, setSelectedResorts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingResort, setEditingResort] = useState(null);

  // Fetch resorts
  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      const response = await fetch("/api/admin/add-product");
      const data = await response.json();
      if (data.success) {
        setResorts(data.products);
      }
    } catch (error) {
      console.error("Error fetching resorts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete single resort
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resort?")) return;

    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Resort deleted successfully!");
        fetchResorts();
      } else {
        alert("Failed to delete resort");
      }
    } catch (error) {
      console.error("Error deleting resort:", error);
      alert("Error deleting resort");
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      const data = await response.json();
      
      if (data.success) {
        fetchResorts();
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedResorts.length} resorts?`)) return;

    try {
      const response = await fetch("/api/admin/product/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedResorts }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`${data.deletedCount} resorts deleted!`);
        setSelectedResorts([]);
        fetchResorts();
      }
    } catch (error) {
      console.error("Error bulk deleting:", error);
    }
  };

  // Bulk price update
  const handleBulkPriceUpdate = async () => {
    const percentage = prompt("Enter percentage to increase/decrease price (e.g., 10 or -10):");
    if (!percentage) return;

    try {
      const response = await fetch("/api/admin/product/bulk-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ids: selectedResorts, 
          percentage: parseFloat(percentage) 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Prices updated successfully!");
        fetchResorts();
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  };

  // Select/deselect resort
  const toggleSelectResort = (id) => {
    setSelectedResorts(prev => 
      prev.includes(id) 
        ? prev.filter(resortId => resortId !== id)
        : [...prev, id]
    );
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedResorts.length === filteredResorts.length) {
      setSelectedResorts([]);
    } else {
      setSelectedResorts(filteredResorts.map(r => r._id));
    }
  };

  // Filter resorts
  const filteredResorts = resorts.filter(resort => {
    const matchesSearch = resort.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = 
      filterAvailable === "all" ? true :
      filterAvailable === "available" ? resort.available !== false :
      resort.available === false;
    return matchesSearch && matchesAvailability;
  });

  useEffect(() => {
    setShowBulkActions(selectedResorts.length > 0);
  }, [selectedResorts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream">
        <div className="text-lg text-luxury-charcoal/70">Loading resorts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-luxury-black">Manage Resorts</h1>
            <p className="mt-1 text-luxury-charcoal/70">{resorts.length} total resorts</p>
          </div>
          <a
            href="/admin"
            className="rounded-2xl border border-luxury-stone bg-white px-4 py-2 font-medium text-luxury-black shadow-sm transition-all hover:border-luxury-gold/40 hover:bg-luxury-sand/50"
          >
            Back to Admin
          </a>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 rounded-2xl border border-luxury-stone/80 bg-white/95 p-6 shadow-glass">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/45" />
              <input
                type="text"
                placeholder="Search resorts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="luxury-input pl-10"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-luxury-gold-dark" />
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value)}
                className="luxury-input py-2"
              >
                <option value="all">All Resorts</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Select All */}
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2 rounded-2xl border border-luxury-stone bg-luxury-sand/80 px-4 py-2 text-luxury-black transition hover:bg-luxury-stone/80"
            >
              {selectedResorts.length === filteredResorts.length ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              Select All
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-luxury-gold/40 bg-luxury-black p-4 text-white shadow-luxury">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5" />
              <span className="font-medium">{selectedResorts.length} selected</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkPriceUpdate}
                className="rounded-xl bg-luxury-gold px-4 py-2 font-medium text-luxury-black transition hover:bg-luxury-gold-light"
              >
                Update Prices
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedResorts([])}
                className="rounded-lg p-2 transition hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Resort Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.map((resort) => (
            <ResortCard
              key={resort._id}
              resort={resort}
              isSelected={selectedResorts.includes(resort._id)}
              onToggleSelect={() => toggleSelectResort(resort._id)}
              onDelete={() => handleDelete(resort._id)}
              onToggleAvailability={() => handleToggleAvailability(resort._id, resort.available)}
              onEdit={() => setEditingResort(resort)}
            />
          ))}
        </div>

        {filteredResorts.length === 0 && (
          <div className="rounded-2xl border border-luxury-stone/80 bg-white/95 p-12 text-center shadow-glass">
            <p className="text-lg text-luxury-charcoal/65">No resorts found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingResort && (
        <EditResortModal
          resort={editingResort}
          onClose={() => setEditingResort(null)}
          onSave={() => {
            setEditingResort(null);
            fetchResorts();
          }}
        />
      )}
    </div>
  );
};

// Resort Card Component
const ResortCard = ({ resort, isSelected, onToggleSelect, onDelete, onToggleAvailability, onEdit }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border border-luxury-stone/80 bg-white/95 shadow-glass transition-all duration-200 hover:shadow-luxury ${isSelected ? 'ring-2 ring-luxury-gold' : ''}`}>
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={resort.image || '/placeholder.jpg'}
          alt={resort.title}
          fill
          className="object-cover"
        />
        
        {/* Select Checkbox */}
        <button
          onClick={onToggleSelect}
          className="absolute left-3 top-3 rounded-lg bg-white/95 p-2 shadow-md transition hover:bg-luxury-sand"
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-luxury-gold-dark" />
          ) : (
            <Square className="h-5 w-5 text-luxury-charcoal/40" />
          )}
        </button>

        {/* Availability Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
          resort.available !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {resort.available !== false ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 truncate font-display text-lg font-semibold text-luxury-black">{resort.title}</h3>
        
        <div className="mb-4 space-y-2">
          <p className="text-2xl font-bold text-luxury-black">₹{resort.price}</p>
          {resort.offer && (
            <p className="text-sm font-medium text-emerald-700">{resort.offer}</p>
          )}
          <p className="line-clamp-2 text-sm text-luxury-charcoal/75">{resort.desc}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-luxury-black px-3 py-2 text-white transition hover:bg-luxury-charcoal"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          
          <button
            type="button"
            onClick={onToggleAvailability}
            className="rounded-xl border border-luxury-stone bg-luxury-sand/80 px-3 py-2 text-luxury-black transition hover:bg-luxury-stone/80"
            title={resort.available !== false ? "Mark Unavailable" : "Mark Available"}
          >
            {resort.available !== false ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-red-50 px-3 py-2 text-red-700 transition hover:bg-red-100"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditResortModal = ({ resort, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: resort.title,
    price: resort.price,
    offer: resort.offer || "",
    desc: resort.desc || "",
    amen: Array.isArray(resort.amen) ? resort.amen.join(", ") : resort.amen || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/product/${resort._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        alert("Resort updated successfully!");
        onSave();
      } else {
        alert("Failed to update resort");
      }
    } catch (error) {
      console.error("Error updating resort:", error);
      alert("Error updating resort");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-luxury-stone/80 bg-white/95 shadow-luxury">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-luxury-black">Edit Resort</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 transition hover:bg-luxury-sand"
            >
              <X className="h-6 w-6 text-luxury-charcoal" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="luxury-label">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="luxury-input"
                required
              />
            </div>

            <div>
              <label className="luxury-label">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="luxury-input"
                required
              />
            </div>

            <div>
              <label className="luxury-label">Offer</label>
              <input
                type="text"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                className="luxury-input"
              />
            </div>

            <div>
              <label className="luxury-label">Amenities</label>
              <input
                type="text"
                value={formData.amen}
                onChange={(e) => setFormData({ ...formData, amen: e.target.value })}
                className="luxury-input"
                placeholder="WiFi, AC, TV (comma separated)"
              />
            </div>

            <div>
              <label className="luxury-label">Description</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="luxury-input min-h-[120px]"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-luxury-gold py-3 font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-luxury-stone bg-luxury-sand/80 px-6 py-3 font-semibold text-luxury-black transition hover:bg-luxury-stone/80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageResorts;

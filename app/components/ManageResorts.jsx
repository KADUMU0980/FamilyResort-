"use client";

import { useState, useEffect } from "react";
import { 
  Edit, Trash2, Eye, EyeOff, Image as ImageIcon, 
  Search, Filter, Plus, CheckSquare, Square, X 
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading resorts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Resorts</h1>
            <p className="text-gray-600 mt-1">{resorts.length} total resorts</p>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 transition-all"
          >
            Back to Admin
          </a>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resorts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Resorts</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Select All */}
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
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
          <div className="bg-blue-600 text-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5" />
              <span className="font-medium">{selectedResorts.length} selected</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkPriceUpdate}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Update Prices
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedResorts([])}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
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
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No resorts found</p>
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
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}>
      {/* Image */}
      <div className="relative h-48">
        <img
          src={resort.image || '/placeholder.jpg'}
          alt={resort.title}
          className="w-full h-full object-cover"
        />
        
        {/* Select Checkbox */}
        <button
          onClick={onToggleSelect}
          className="absolute top-3 left-3 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
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
        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{resort.title}</h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-2xl font-bold text-blue-600">₹{resort.price}</p>
          {resort.offer && (
            <p className="text-sm text-green-600 font-medium">{resort.offer}</p>
          )}
          <p className="text-sm text-gray-600 line-clamp-2">{resort.desc}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          
          <button
            onClick={onToggleAvailability}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title={resort.available !== false ? "Mark Unavailable" : "Mark Available"}
          >
            {resort.available !== false ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Resort</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer</label>
              <input
                type="text"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <input
                type="text"
                value={formData.amen}
                onChange={(e) => setFormData({ ...formData, amen: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="WiFi, AC, TV (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-blue-400"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
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
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [amen, setAmen] = useState("");
  const [desc, setDesc] = useState("");

  const [profileImages, setProfileImages] = useState([]); // { file, preview }
  const [carouselImages, setCarouselImages] = useState([]); // { file, preview }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (profileImages.length + files.length > 5) {
      alert("You can only upload up to 5 profile images.");
      return;
    }

    const newEntries = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setProfileImages((prev) => [...prev, ...newEntries]);

    setTimeout(() => {
      e.target.value = "";
    }, 0);
  };

  const removeProfileImage = (index) => {
    setProfileImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCarouselChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newEntries = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Capture files before clearing input
    setCarouselImages((prev) => [...prev, ...newEntries]);

    // Reset input AFTER capturing files
    setTimeout(() => {
      e.target.value = "";
    }, 0);
  };

  const removeCarouselImage = (index) => {
    setCarouselImages((prev) => {
      URL.revokeObjectURL(prev[index].preview); // cleanup memory
      return prev.filter((_, i) => i !== index);
    });
  };

  const recordHandler = async (e) => {
    e.preventDefault();

    if (profileImages.length === 0) {
      alert("Please select at least one profile image before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Profile Images individually to avoid payload size limits
      const uploadedProfileUrls = await Promise.all(
        profileImages.map(async ({ file }) => {
          const fd = new FormData();
          fd.append("images", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!data.success) throw new Error("Profile image upload failed: " + (data.error || data.message));
          return data.images[0];
        })
      );

      // 2. Upload Carousel Images individually to avoid payload size limits
      let uploadedCarouselUrls = [];
      if (carouselImages.length > 0) {
        uploadedCarouselUrls = await Promise.all(
          carouselImages.map(async ({ file }) => {
            const fd = new FormData();
            fd.append("images", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!data.success) throw new Error("Carousel image upload failed: " + (data.error || data.message));
            return data.images[0];
          })
        );
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("offer", offer);
      formData.append("amen", amen);
      formData.append("desc", desc);

      uploadedProfileUrls.forEach((url) => {
        formData.append("profileImages", url);
      });

      uploadedCarouselUrls.forEach((url) => {
        formData.append("carouselImages", url);
      });

      const response = await fetch("/api/admin/add-product", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON:", text);
        alert("Server error: Check terminal for details.");
        return;
      }

      if (result.success) {
        alert("Product added successfully!");
        setTitle("");
        setPrice("");
        setOffer("");
        setAmen("");
        setDesc("");
        setCarouselImages([]);
        setProfileImages([]);
      } else {
        alert("Failed to add product: " + result.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message || "Network error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

      <form onSubmit={recordHandler} encType="multipart/form-data" className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-semibold text-gray-700">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded" placeholder="Product title" required />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold text-gray-700">Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-4 py-2 rounded" placeholder="Enter price" required />
        </div>

        {/* Offer */}
        <div>
          <label className="block font-semibold text-gray-700">Offer</label>
          <input type="text" value={offer} onChange={(e) => setOffer(e.target.value)}
            className="w-full border px-4 py-2 rounded" placeholder="Offer details (optional)" />
        </div>

        {/* Amenities */}
        <div>
          <label className="block font-semibold text-gray-700">Amenities</label>
          <input type="text" value={amen} onChange={(e) => setAmen(e.target.value)}
            className="w-full border px-4 py-2 rounded" placeholder="Ex: WiFi, AC, TV" />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
            className="w-full border px-4 py-2 rounded" rows="3"
            placeholder="Enter product description" />
        </div>

        {/* Profile Images */}
        <div>
          <label className="block font-semibold text-gray-700">
            Upload Profile Images (Max 5)
          </label>
          <input type="file" onChange={handleProfileChange}
            className="w-full border px-3 py-2 rounded bg-gray-50" accept="image/*" multiple />
          <p className="text-xs text-gray-500 mt-1 mb-2">Shown on the main listings page.</p>

          {profileImages.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <span className="text-sm font-semibold block mb-2">
                {profileImages.length} image(s) staged:
              </span>
              <div className="flex flex-wrap gap-3">
                {profileImages.map(({ file, preview }, index) => (
                  <div key={index} className="relative group">
                    <Image src={preview} alt={file.name} width={80} height={80}
                      className="h-20 w-20 object-cover rounded border" />
                    <button type="button" onClick={() => removeProfileImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full
                                 w-5 h-5 text-xs flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity">
                      âœ•
                    </button>
                    <p className="text-xs text-gray-500 truncate w-20 mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carousel Images */}
        <div>
          <label className="block font-semibold text-gray-700">
            Upload Carousel Images (Multiple)
          </label>
          <input type="file" onChange={handleCarouselChange}
            className="w-full border px-3 py-2 rounded bg-gray-50" accept="image/*" multiple />
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Select multiple files at once, or pick files one by one â€” they&apos;ll all be added below.
          </p>

          {carouselImages.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <span className="text-sm font-semibold block mb-2">
                {carouselImages.length} image(s) staged:
              </span>
              <div className="flex flex-wrap gap-3">
                {carouselImages.map(({ file, preview }, index) => (
                  <div key={index} className="relative group">
                    <Image src={preview} alt={file.name} width={80} height={80}
                      className="h-20 w-20 object-cover rounded border" />
                    <button type="button" onClick={() => removeCarouselImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full
                                 w-5 h-5 text-xs flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity">
                      âœ•
                    </button>
                    <p className="text-xs text-gray-500 truncate w-20 mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {isSubmitting ? "Uploading & Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

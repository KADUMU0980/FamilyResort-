"use client";

import React, { useState, useRef } from "react";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [amen, setAmen] = useState("");
  const [desc, setDesc] = useState("");

  const profileImageRef = useRef(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]); // { file, preview }

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
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

    const profileImageFile = profileImageRef.current?.files[0];
    if (!profileImageFile) {
      alert("Please select a profile image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("offer", offer);
    formData.append("amen", amen);
    formData.append("desc", desc);
    formData.append("profileImage", profileImageFile);

    // ✅ Use the same key "carouselImages" for all — standard multi-file pattern
    carouselImages.forEach(({ file }) => {
      formData.append("carouselImages", file);
    });

    try {
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
        setProfilePreview(null);
        if (profileImageRef.current) profileImageRef.current.value = "";
      } else {
        alert("Failed to add product: " + result.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Network error. Try again.");
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

        {/* Profile Image */}
        <div>
          <label className="block font-semibold text-gray-700">
            Upload Profile Image (Single)
          </label>
          <input type="file" ref={profileImageRef} onChange={handleProfileChange}
            className="w-full border px-3 py-2 rounded bg-gray-50" accept="image/*" required />
          <p className="text-xs text-gray-500 mt-1">Shown on the main listings page.</p>
          {profilePreview && (
            <img src={profilePreview} alt="Profile preview"
              className="mt-2 h-24 w-24 object-cover rounded border" />
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
            Select multiple files at once, or pick files one by one — they'll all be added below.
          </p>

          {carouselImages.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <span className="text-sm font-semibold block mb-2">
                {carouselImages.length} image(s) staged:
              </span>
              <div className="flex flex-wrap gap-3">
                {carouselImages.map(({ file, preview }, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={file.name}
                      className="h-20 w-20 object-cover rounded border" />
                    <button type="button" onClick={() => removeCarouselImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full
                                 w-5 h-5 text-xs flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity">
                      ✕
                    </button>
                    <p className="text-xs text-gray-500 truncate w-20 mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
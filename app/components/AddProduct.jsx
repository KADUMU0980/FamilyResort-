"use client";

import React, { useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [amen, setAmen] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [profileImages, setProfileImages] = useState([]); // { file, preview }
  const [carouselImages, setCarouselImages] = useState([]); // { file, preview }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleProfileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (profileImages.length + files.length > 5) {
      alert("You can only upload up to 5 profile images.");
      return;
    }

    setIsCompressing(true);
    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const newEntries = [];
    for (const file of files) {
      try {
        let processedFile = file;
        
        // Compress if larger than 1.5MB
        if (file.size > 1.5 * 1024 * 1024) {
          processedFile = await imageCompression(file, options);
        }

        // Check if size is still over Cloudinary 10MB limit
        if (processedFile.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is still over 10MB after compression. Please choose a smaller image.`);
          continue;
        }

        newEntries.push({
          file: processedFile,
          preview: URL.createObjectURL(processedFile),
        });
      } catch (error) {
        console.error("Error compressing profile image:", error);
        alert(`Failed to process ${file.name}.`);
      }
    }

    setProfileImages((prev) => [...prev, ...newEntries]);
    setTimeout(() => {
      e.target.value = "";
    }, 0);
    setIsCompressing(false);
  };

  const removeProfileImage = (index) => {
    setProfileImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCarouselChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsCompressing(true);
    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const newEntries = [];
    for (const file of files) {
      try {
        let processedFile = file;
        
        if (file.size > 1.5 * 1024 * 1024) {
          processedFile = await imageCompression(file, options);
        }

        if (processedFile.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is still over 10MB after compression. Please choose a smaller image.`);
          continue;
        }

        newEntries.push({
          file: processedFile,
          preview: URL.createObjectURL(processedFile),
        });
      } catch (error) {
        console.error("Error compressing carousel image:", error);
        alert(`Failed to process ${file.name}.`);
      }
    }

    setCarouselImages((prev) => [...prev, ...newEntries]);
    setTimeout(() => {
      e.target.value = "";
    }, 0);
    setIsCompressing(false);
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
      // Get Cloudinary upload signature to bypass Vercel 4.5MB body limit
      const sigRes = await fetch("/api/upload/signature");
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();

      const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "resorts");
        formData.append("file", file);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed");
        return data.secure_url;
      };

      // 1. Upload Profile Images directly to Cloudinary
      const uploadedProfileUrls = await Promise.all(
        profileImages.map(({ file }) => uploadToCloudinary(file))
      );

      // 2. Upload Carousel Images directly to Cloudinary
      let uploadedCarouselUrls = [];
      if (carouselImages.length > 0) {
        uploadedCarouselUrls = await Promise.all(
          carouselImages.map(({ file }) => uploadToCloudinary(file))
        );
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("offer", offer);
      formData.append("amen", amen);
      formData.append("desc", desc);
      if (address) formData.append("address", address);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);

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
        setAddress("");
        setLatitude("");
        setLongitude("");
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
    <div className="mx-auto mt-6 max-w-3xl p-6">
      <div className="luxury-surface p-6 sm:p-8">
        <h1 className="mb-6 font-display text-3xl font-semibold text-luxury-black">
          Add New Product
        </h1>

        <form onSubmit={recordHandler} encType="multipart/form-data" className="space-y-5">
          <div>
            <label className="luxury-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="luxury-input"
              placeholder="Product title"
              required
            />
          </div>

          <div>
            <label className="luxury-label">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="luxury-input"
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className="luxury-label">Offer</label>
            <input
              type="text"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="luxury-input"
              placeholder="Offer details (optional)"
            />
          </div>

          <div>
            <label className="luxury-label">Amenities</label>
            <input
              type="text"
              value={amen}
              onChange={(e) => setAmen(e.target.value)}
              className="luxury-input"
              placeholder="Ex: WiFi, AC, TV"
            />
          </div>

          <div>
            <label className="luxury-label">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="luxury-input min-h-[96px] resize-y"
              rows={3}
              placeholder="Enter product description"
            />
          </div>

          {/* Location Section */}
          <div className="rounded-2xl border border-luxury-stone/80 bg-luxury-sand/30 p-5 space-y-4">
            <h3 className="text-base font-semibold text-luxury-black flex items-center gap-2">
              <span>📍</span> Location Details
            </h3>
            <div>
              <label className="luxury-label">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="luxury-input"
                placeholder="Enter resort address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="luxury-label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="luxury-input"
                  placeholder="e.g. 15.4909"
                />
              </div>
              <div>
                <label className="luxury-label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="luxury-input"
                  placeholder="e.g. 73.8278"
                />
              </div>
            </div>
            <p className="text-xs text-luxury-charcoal/55">Latitude &amp; longitude are used to show the resort location on Google Maps.</p>
          </div>

          <div>
            <label className="luxury-label">Upload Profile Images (Max 5)</label>
            <input
              type="file"
              onChange={handleProfileChange}
              className="luxury-input cursor-pointer bg-luxury-sand/40 file:mr-4 file:rounded-xl file:border-0 file:bg-luxury-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-luxury-gold-light"
              accept="image/*"
              multiple
            />
            <p className="mb-2 mt-1 text-xs text-luxury-charcoal/60">
              Shown on the main listings page.
            </p>

            {profileImages.length > 0 && (
              <div className="rounded-2xl border border-luxury-stone/80 bg-luxury-sand/40 p-3">
                <span className="mb-2 block text-sm font-semibold text-luxury-black">
                  {profileImages.length} image(s) staged:
                </span>
                <div className="flex flex-wrap gap-3">
                  {profileImages.map(({ file, preview }, index) => (
                    <div key={index} className="group relative">
                      <Image
                        src={preview}
                        alt={file.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-xl border border-luxury-stone object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeProfileImage(index)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                      <p className="mt-1 w-20 truncate text-xs text-luxury-charcoal/60">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="luxury-label">Upload Carousel Images (Multiple)</label>
            <input
              type="file"
              onChange={handleCarouselChange}
              className="luxury-input cursor-pointer bg-luxury-sand/40 file:mr-4 file:rounded-xl file:border-0 file:bg-luxury-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-luxury-gold-light"
              accept="image/*"
              multiple
            />
            <p className="mb-2 mt-1 text-xs text-luxury-charcoal/60">
              Select multiple files at once, or pick files one by one — they&apos;ll all be added below.
            </p>

            {carouselImages.length > 0 && (
              <div className="rounded-2xl border border-luxury-stone/80 bg-luxury-sand/40 p-3">
                <span className="mb-2 block text-sm font-semibold text-luxury-black">
                  {carouselImages.length} image(s) staged:
                </span>
                <div className="flex flex-wrap gap-3">
                  {carouselImages.map(({ file, preview }, index) => (
                    <div key={index} className="group relative">
                      <Image
                        src={preview}
                        alt={file.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-xl border border-luxury-stone object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeCarouselImage(index)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                      <p className="mt-1 w-20 truncate text-xs text-luxury-charcoal/60">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className={`w-full rounded-2xl py-3 font-semibold text-luxury-black shadow-luxury-gold transition ${
              isSubmitting || isCompressing
                ? "cursor-not-allowed bg-luxury-stone opacity-70"
                : "bg-luxury-gold hover:bg-luxury-gold-light"
            }`}
          >
            {isSubmitting
              ? "Uploading & Adding Product..."
              : isCompressing
                ? "Compressing Images..."
                : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

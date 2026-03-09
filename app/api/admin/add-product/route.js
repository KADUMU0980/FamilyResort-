// app/api/admin/add-product/route.js
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import { Buffer } from "buffer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectToDatabase();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const amenities = searchParams.get('amenities'); // Comma-separated
    const sortBy = searchParams.get('sortBy');

    // Build query
    let query = {};

    // Search filter (title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Amenities filter (works with both string and array storage)
    if (amenities) {
      const amenitiesArray = amenities.split(',').filter(a => a.trim());
      if (amenitiesArray.length > 0) {
        // First, let's check if amen is an array or string by fetching one product
        const sampleProduct = await productModel.findOne().limit(1);

        if (sampleProduct && Array.isArray(sampleProduct.amen)) {
          // Amenities stored as array - use $all operator
          query.amen = { $all: amenitiesArray };
        } else {
          // Amenities stored as string - use regex
          query.$and = amenitiesArray.map(amenity => ({
            amen: { $regex: amenity, $options: 'i' }
          }));
        }
      }
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'name':
        sort = { title: 1 };
        break;
      default:
        sort = { createdAt: -1 }; // Featured/newest first
    }

    console.log("Query:", JSON.stringify(query));
    console.log("Sort:", JSON.stringify(sort));

    // Fetch products
    const products = await productModel
      .find(query)
      .sort(sort)
      .lean();

    return NextResponse.json({
      success: true,
      products,
      count: products.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const title = data.get("title");
    const price = Number(data.get("price"));
    const offer = data.get("offer");
    const amen = data.get("amen");
    const desc = data.get("desc");
    const profileImage = data.get("profileImage");

    // ✅ Use getAll() to grab all carousel images under the same key
    const carouselImages = data.getAll("carouselImages");
    console.log("Profile Image:", profileImage?.name, "Carousel Count:", carouselImages.length);

    if (!profileImage || typeof profileImage.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, message: "No profile image uploaded" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Handle Profile Image
    const profileBuffer = Buffer.from(await profileImage.arrayBuffer());
    await writeFile(path.join(uploadDir, profileImage.name), profileBuffer);
    const profileImageUrl = `/uploads/${profileImage.name}`;

    // Handle Carousel Images
    const uploadedImageUrls = [];
    for (const img of carouselImages) {
      if (typeof img.arrayBuffer === "function") {
        const buffer = Buffer.from(await img.arrayBuffer());
        await writeFile(path.join(uploadDir, img.name), buffer);
        uploadedImageUrls.push(`/uploads/${img.name}`);
      }
    }

    await connectToDatabase();

    const newProduct = await productModel.create({
      title,
      price,
      offer,
      amen,
      desc,
      image: profileImageUrl,
      images: uploadedImageUrls,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 200 });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Image upload failed", error: error.message },
      { status: 500 }
    );
  }
}





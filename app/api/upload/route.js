import { NextResponse } from "next/server";
import cloudinary from "@/app/utils/cloudinary";

export async function POST(request) {
  try {
    const data = await request.formData();
    const images = data.getAll("images"); // Array of files

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images provided" },
        { status: 400 }
      );
    }

    const uploadedUrls = [];

    for (const img of images) {
      if (typeof img.arrayBuffer === "function") {
        const buffer = Buffer.from(await img.arrayBuffer());
        
        // Upload to Cloudinary using buffer stream
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "resorts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        uploadedUrls.push(uploadResult.secure_url);
      }
    }

    return NextResponse.json({ success: true, images: uploadedUrls }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, message: "Cloudinary upload failed", error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import cloudinary from "@/app/utils/cloudinary";

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "resorts",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

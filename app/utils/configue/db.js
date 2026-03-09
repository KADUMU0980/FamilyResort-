import mongoose from "mongoose";

export default async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
  return;
}

if (mongoose.connection.readyState === 2) {
  // wait until connected
  await new Promise(resolve => setTimeout(resolve, 500));
  return;
}

  if (!process.env.MONGO_URL) {
    throw new Error("❌ MONGO_URL is missing in .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
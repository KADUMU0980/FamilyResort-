"use server";
import connectToDatabase from "@/app/utils/configue/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import userModel from "../utils/models/userModel";
import bookingModel from "../utils/models/bookingModel";

export async function bookingAction(bookingDetails) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }

  const user = await userModel.findById(session.user.id);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  try {
    const userId = user._id.toString();
    console.log("User Details:", bookingDetails);
    const userBookingDetails = await new bookingModel({
      startDate: bookingDetails.startDate,
      endDate: bookingDetails.endDate,
      price: bookingDetails.price,
      productName: bookingDetails.productName,
      offer: bookingDetails.offer,
      image: bookingDetails.image,
      resortRoom: bookingDetails.resortRoom,
      user: userId,
      status: "pending",
      numberOfPeople: bookingDetails.numberOfPeople,
      occasion: bookingDetails.occasion,
      durationType: bookingDetails.durationType
    });
    await userBookingDetails.save();
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { bookings: userBookingDetails } },
      { new: true }
    );

    console.log("User Booking Details:", userBookingDetails);

    return { success: true, message: "Booking successful" };
  } catch (err) {
    console.error("Booking Ac tion Error:", err);
    return { success: false, message: "Server error during booking" };
  }
}

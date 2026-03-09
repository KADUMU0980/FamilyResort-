// app/api/user/bookings/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bookingModel from "@/app/utils/models/bookingModel";

// GET - Fetch current user's bookings
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find user by email
    const user = await userModel
      .findOne({ email: session.user.email })
      .populate({
        path: "bookings",
        model: "booking",
        populate: {
          path: "resortRoom",
          model: "Product"
        },
        options: { sort: { createdAt: -1 } } // Sort by newest first
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Serialize bookings
    const bookings = JSON.parse(JSON.stringify(user.bookings || []));

    return NextResponse.json({ 
      success: true,
      bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new booking (alternative to server action)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await userModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { resortRoom, startDate, endDate, price, productName, offer, image } = body;

    // Validate required fields
    if (!resortRoom || !startDate || !endDate || !price || !productName) {
      return NextResponse.json(
        { message: "Missing required booking information" },
        { status: 400 }
      );
    }

    // Check availability
    const isAvailable = await bookingModel.checkAvailability(
      resortRoom,
      new Date(startDate),
      new Date(endDate)
    );

    if (!isAvailable) {
      return NextResponse.json(
        { 
          success: false,
          message: "Selected dates are not available. Please choose different dates." 
        },
        { status: 409 }
      );
    }

    // Create booking
    const booking = new bookingModel({
      user: user._id,
      resortRoom,
      productName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price,
      offer: offer || null,
      image,
      status: "pending"
    });

    await booking.save();

    // Add booking to user's bookings array
    await userModel.findByIdAndUpdate(
      user._id,
      { $push: { bookings: booking._id } }
    );

    return NextResponse.json({
      success: true,
      message: "Booking request submitted successfully! Awaiting admin approval.",
      booking: JSON.parse(JSON.stringify(booking))
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to create booking",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PATCH - Update a booking (for user to cancel)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { bookingId, action } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Find booking and verify it belongs to user
    const booking = await bookingModel.findOne({
      _id: bookingId,
      user: user._id
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found or you don't have permission to modify it" },
        { status: 404 }
      );
    }

    // Handle cancellation
    if (action === "cancel") {
      // Only allow cancelling pending or approved bookings
      if (booking.status === "cancelled" || booking.status === "rejected") {
        return NextResponse.json(
          { message: "This booking is already cancelled or rejected" },
          { status: 400 }
        );
      }

      booking.status = "cancelled";
      await booking.save();

      return NextResponse.json({
        success: true,
        message: "Booking cancelled successfully",
        booking: JSON.parse(JSON.stringify(booking))
      });
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to update booking",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
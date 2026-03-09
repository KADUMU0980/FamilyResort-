// app/api/users/bookings/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bookingModel from "@/app/utils/models/bookingModel"; // Import booking model

export async function GET() {
  try {
    console.log("=== Bookings API Called ===");
    
    const session = await getServerSession(authOptions);
    console.log("Session found:", !!session);

    if (!session?.user?.email) {
      console.log("No session or email");
      return Response.json(
        { message: "Unauthorized - Please login", success: false },
        { status: 401 }
      );
    }

    console.log("User email:", session.user.email);

    await connectToDatabase();
    console.log("Database connected");

    // Find user first
    const user = await userModel
      .findOne({ email: session.user.email })
      .select('_id email bookings')
      .lean();

    console.log("User found:", !!user);

    if (!user) {
      console.log("User not found in database");
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    console.log("User bookings array length:", user.bookings?.length || 0);

    // If user has no bookings, return empty array
    if (!user.bookings || user.bookings.length === 0) {
      console.log("User has no bookings");
      return Response.json({ 
        success: true,
        bookings: [],
        count: 0
      });
    }

    // Fetch bookings directly from booking collection
    const bookings = await bookingModel
      .find({ 
        _id: { $in: user.bookings }
      })
      .populate({
        path: "resortRoom",
        model: "Product",
        select: "title image offer price" // Only select needed fields
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Bookings fetched:", bookings.length);

    // Transform bookings to ensure all required fields exist
    const transformedBookings = bookings.map(booking => {
      const transformed = {
        _id: booking._id?.toString() || booking._id,
        productName: booking.productName || booking.resortRoom?.title || "Resort Booking",
        image: booking.image || booking.resortRoom?.image || "/placeholder-resort.jpg",
        price: booking.price || booking.resortRoom?.price || 0,
        offer: booking.offer || booking.resortRoom?.offer || null,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status || "pending",
        paymentStatus: booking.paymentStatus || "unpaid",
        paymentMethod: booking.paymentMethod || null,
        paymentId: booking.paymentId || null,
        paymentDate: booking.paymentDate || null,
        transactionId: booking.transactionId || null,
        guestCount: booking.guestCount || 1,
        specialRequests: booking.specialRequests || null,
        resortRoom: booking.resortRoom?._id?.toString() || booking.resortRoom,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      };
      
      console.log("Transformed booking:", transformed._id);
      return transformed;
    });

    console.log("Returning", transformedBookings.length, "bookings");

    return Response.json({ 
      success: true,
      bookings: transformedBookings,
      count: transformedBookings.length
    });

  } catch (error) {
    console.error("=== ERROR in Bookings API ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return Response.json(
      { 
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred",
        errorDetails: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          stack: error.stack
        } : undefined
      },
      { status: 500 }
    );
  }
}
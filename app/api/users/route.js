import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bookingModel from "@/app/utils/models/bookingModel";

// GET - Fetch all users with their bookings (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ message: "Unauthorized - Please log in" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({ message: "Access Denied - Admin only" }),
        { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    await connectToDatabase();

    const users = await userModel
      .find({ role: "user" })
      .select("-password")
      .populate({
        path: "bookings",
        model: "booking",
        populate: {
          path: "resortRoom",
          model: "Product"
        }
      })
      .lean();

    const serializedUsers = JSON.parse(JSON.stringify(users));

    return new Response(
      JSON.stringify({ 
        success: true,
        users: serializedUsers,
        count: serializedUsers.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Internal server error",
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// POST - Update booking status (Approve/Reject)
export async function POST(req) {
  try {
    console.log("🔵 POST /api/users called");
    
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      console.log("❌ No session found");
      return new Response(
        JSON.stringify({ message: "Unauthorized - Please log in" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (session.user.role !== "admin") {
      console.log("❌ User is not admin");
      return new Response(
        JSON.stringify({ message: "Access Denied - Admin only" }),
        { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await req.json();
    console.log("📦 Request body:", body);
    
    const { bookingId, status } = body;

    if (!bookingId) {
      console.log("❌ No bookingId provided");
      return new Response(
        JSON.stringify({ message: "Booking ID is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      console.log("❌ Invalid status:", status);
      return new Response(
        JSON.stringify({ message: "Invalid status. Must be 'approved', 'rejected', or 'pending'" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("Connecting to database...");
    await connectToDatabase();

    console.log("Updating booking:", bookingId, "to status:", status);
    const booking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("resortRoom");

    if (!booking) {
      console.log("❌ Booking not found");
      return new Response(
        JSON.stringify({ message: "Booking not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("✅ Booking updated successfully");
    return new Response(
      JSON.stringify({
        success: true,
        message: `Booking ${status} successfully`,
        booking: JSON.parse(JSON.stringify(booking))
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Internal server error",
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// DELETE - Cancel/Delete a booking (Admin only)
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ message: "Unauthorized - Please log in" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({ message: "Access Denied - Admin only" }),
        { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return new Response(
        JSON.stringify({ message: "Booking ID is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    await connectToDatabase();

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return new Response(
        JSON.stringify({ message: "Booking not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    await userModel.findByIdAndUpdate(
      booking.user,
      { $pull: { bookings: bookingId } }
    );

    await bookingModel.findByIdAndDelete(bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking deleted successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error deleting booking:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Internal server error",
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}



























// import connectToDatabase from "../../utils/configue/db";
// import userModel from "../../utils/models/userModel";
// import { NextResponse } from "next/server";
// export async function GET(request) {
//    await connectToDatabase();
//    try {
//    const user = await userModel.find({role:{$ne:"admin"}}, { password: 0 }); //database should hide password and role:admin ..
//    if (!user){
//     return NextResponse.json({ success: false, message: "No users found" }, { status: 404 });
//    }
//     return NextResponse.json({ success: true, users: user }, { status: 200 });
//    } catch (error) {
//     return NextResponse.json({ success: false, message: "Error fetching users" }, { status: 500 });
//    }
// }
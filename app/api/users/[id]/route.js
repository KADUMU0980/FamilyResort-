import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bookingModel from "@/app/utils/models/bookingModel";

// GET - Fetch all users with their bookings (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return Response.json(
        { message: "Access Denied - Admin only" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Fetch all regular users with populated bookings
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

    // Serialize data
    const serializedUsers = JSON.parse(JSON.stringify(users));

    return Response.json({ 
      success: true,
      users: serializedUsers,
      count: serializedUsers.length 
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Update booking status (Approve/Reject)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ message: "Unauthorized - Please log in" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({ message: "Access Denied - Admin only" }),
        { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { bookingId, status } = await req.json();

    // Validate inputs
    if (!bookingId) {
      return new Response(
        JSON.stringify({ message: "Booking ID is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return new Response(
        JSON.stringify({ message: "Invalid status. Must be 'approved', 'rejected', or 'pending'" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    await connectToDatabase();

    // Update booking status
    const booking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("resortRoom");

    if (!booking) {
      return new Response(
        JSON.stringify({ message: "Booking not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

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
    console.error("Error updating booking status:", error);
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

// PATCH - Batch update multiple bookings
export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return Response.json(
        { message: "Access Denied - Admin only" },
        { status: 403 }
      );
    }

    const { bookingIds, status } = await req.json();

    // Validate inputs
    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      return Response.json(
        { message: "bookingIds must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return Response.json(
        { message: "Invalid status. Must be 'approved', 'rejected', or 'pending'" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Batch update bookings
    const result = await bookingModel.updateMany(
      { _id: { $in: bookingIds } },
      { 
        status,
        updatedAt: new Date()
      }
    );

    return Response.json({
      success: true,
      message: `${result.modifiedCount} booking(s) ${status} successfully`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("Error batch updating bookings:", error);
    return Response.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/Delete a booking (Admin only)
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return Response.json(
        { message: "Access Denied - Admin only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return Response.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the booking first
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return Response.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Remove booking from user's bookings array
    await userModel.findByIdAndUpdate(
      booking.user,
      { $pull: { bookings: bookingId } }
    );

    // Delete the booking
    await bookingModel.findByIdAndDelete(bookingId);

    return Response.json({
      success: true,
      message: "Booking deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting booking:", error);
    return Response.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}




































// import connectToDatabase from "../../../utils/configue/db";
// import userModel from "../../../utils/models/userModel";
// import { NextResponse } from "next/server";

// export async function GET(request,context) {
//   try {
//     await connectToDatabase();

//     const { id } = context.params;
//     console.log("Dynamic Id:", id);

//    const user = await userModel
//   .findById(id)
//   .populate({
//     path: "booking",
//     populate: {
//       path: "resortRoom",
//       model: "product"
//     }
//   });
//    console.log(user)


//     if (!user) {
//       return NextResponse.json(
//         { message: "User Not Found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "User fetched successfully", user },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

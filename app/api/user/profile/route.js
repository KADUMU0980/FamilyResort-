import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { name, currentPassword, newPassword } = await request.json();

    const user = await userModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update name if provided
    if (name && name !== user.name) {
      user.name = name;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required" },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
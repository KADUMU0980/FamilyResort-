"use server";

import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bcrypt from "bcrypt";

export async function loginAction(credentials) {
  try {
    const { email, password } = credentials;
    const emailNormalized = email.trim().toLowerCase();

    console.log("Login attempt for:", emailNormalized);

    await connectToDatabase();

    const user = await userModel.findOne({ email: emailNormalized });
    console.log("User found:", !!user);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.provider === "google" || !user.password) {
      return {
        success: false,
        message: "This account uses Google sign-in. Please sign in with Google.",
      };
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", valid);

    if (!valid) {
      return { success: false, message: "Invalid password" };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

  } catch (err) {
    console.error("Login Action Error:", err);
    return {
      success: false,
      message: "Server error during login",
    };
  }
}

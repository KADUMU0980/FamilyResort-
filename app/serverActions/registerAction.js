"use server";

import bcrypt from "bcrypt";
import userModel from "@/app/utils/models/userModel";
import connectToDatabase from "@/app/utils/configue/db";

export async function registerAction(formData) {
  await connectToDatabase();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");

  const emailNormalized = email.trim().toLowerCase();
  const exists = await userModel.findOne({ email: emailNormalized });
  if (exists) return { success: false, message: "Email already exists" };
  const hashed = await bcrypt.hash(password, 10);
  const phoneVal = (phone || "").trim();
  await userModel.create({
    name,
    email: emailNormalized,
    password: hashed,
    phone: phoneVal,
    provider: "credentials",
  });

  return { success: true };
}

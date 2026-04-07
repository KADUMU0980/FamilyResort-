"use server";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import userModel from "@/app/utils/models/userModel";
import connectToDatabase from "@/app/utils/configue/db";

export const sendBookingEmail = async (booking) => {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  let userEmail = booking.userEmail || "Unknown";
  let phone = booking.phone || "Unknown";

  if (session?.user?.id) {
    const user = await userModel.findById(session.user.id);
    if (user) {
      userEmail = user.email || userEmail;
      const p = (user.phone || "").trim();
      if (p) phone = p;
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "New Booking Request",
    text: `
New Booking Request

Resort: ${booking.productName}
User Email: ${userEmail}
Phone: ${phone}
People: ${booking.numberOfPeople}
Occasion: ${booking.occasion}
Start Date: ${booking.startDate}
End Date: ${booking.endDate}
Price: ₹${booking.price}
`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email failed to send:", err);
  }
};

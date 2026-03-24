"use server";
import connectToDatabase from "@/app/utils/configue/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import userModel from "../utils/models/userModel";
import productModel from "../utils/models/productModel";

export async function addReviewAction(productId, rating, reviewText) {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: "User not authenticated" };
    }

    const user = await userModel.findOne({ email: session.user.email });

    if (!user) {
        return { success: false, message: "User not found" };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, message: "Rating must be between 1 and 5" };
    }

    if (!reviewText || reviewText.trim() === "") {
        return { success: false, message: "Review text is required" };
    }

    try {
        const userId = user._id;

        const newReview = {
            userId: userId,
            username: user.name || "Anonymous",
            rating: Number(rating),
            review: reviewText.trim(),
            createdAt: new Date(),
        };

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { $push: { reviews: newReview } },
            { new: true }
        );

        if (!updatedProduct) {
            return { success: false, message: "Resort not found" };
        }

        // Convert updatedProduct to a plain object so it can be passed back to the client
        const productData = JSON.parse(JSON.stringify(updatedProduct));

        return {
            success: true,
            message: "Review added successfully",
            product: productData
        };
    } catch (err) {
        console.error("Add Review Action Error:", err);
        return { success: false, message: "Server error during review submission" };
    }
}

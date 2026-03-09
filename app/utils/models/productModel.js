import { title } from "process";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  offer: { type: String },

  desc: { type: String },
  image: { type: String },
  images: { type: [String], default: [] },
  amen: {
    type: [String],
    required: true,
    default: ["AC", "Geyser", "WiFi", "TV"],
    set: function (amenities) {
      const defaultValues = ["AC", "Geyser", "WiFi", "TV", "Breakfast"];

      if (typeof amenities === "string") {
        amenities = amenities.split(",").map(item => item.trim());
      }


      if (!Array.isArray(amenities)) {
        return defaultValues;
      }
      return [...new Set([...defaultValues, ...amenities])];
    },
  },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      review: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});
delete mongoose.models.Product;
const productModel = mongoose.model("Product", productSchema);
export default productModel;



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    required: true,
    default: "credentials",
  },
  role: { type: String, default: "user" },
  image: { type: String, default: "" },
  phone: { type: String, default: "" },

  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
    },
  ],
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;

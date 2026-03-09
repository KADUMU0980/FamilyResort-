import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  phoneNumber: { type: String, required: true },

  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
    },
  ],
});

delete mongoose.models.User;
const userModel = mongoose.model("User", userSchema);

export default userModel;

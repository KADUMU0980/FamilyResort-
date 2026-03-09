import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    resortRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offer: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    occasion: {
      type: String,
      required: true,
    },
    durationType: {
      type: String,
      enum: ["12hr", "24hr"],
      required: false,
    },
    // NEW PAYMENT FIELDS
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", null],
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    guestCount: {
      type: Number,
      default: 1,
    },
    specialRequests: {
      type: String,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
bookingSchema.index({ resortRoom: 1, startDate: 1, endDate: 1, status: 1 });
bookingSchema.index({ user: 1, paymentStatus: 1 });

delete mongoose.models.booking;
const bookingModel = mongoose.model("booking", bookingSchema);

export default bookingModel;
















// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     resortRoom: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     productName: {
//       type: String,
//       required: true,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     offer: {
//       type: String,
//       default: null,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//   },
//   { 
//     timestamps: true 
//   }
// );

// const bookingModel = mongoose.models.booking || mongoose.model("booking", bookingSchema);

// export default bookingModel;
// Model/Bookingmodel.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    eventDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // ✅ FIX (was PostCategories)
    },

    userName: {
      type: String,
      required: true,
    },

    mobile: String,
    email: String,

    tickets: {
      type: Number,
      required: true,
    },

    // 🔥 ADD THIS
    price: Number,

    totalPrice: Number,
    eventName: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
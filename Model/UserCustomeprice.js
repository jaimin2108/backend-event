import mongoose from "mongoose";

const userCustomPriceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  customPrice: Number,
});

export default mongoose.model("UserCustomPrice", userCustomPriceSchema);
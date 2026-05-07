import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: String,
    time: String,
    place: String,
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

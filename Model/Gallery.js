import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  name: String,
  image: String,
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);
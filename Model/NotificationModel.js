// Model/NotificationModel.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
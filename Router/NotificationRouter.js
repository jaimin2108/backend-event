import express from "express";
import Notification from "../Model/NotificationModel.js";

const router = express.Router();

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Mark as read
router.put("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

export default router;
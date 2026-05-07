import express from "express";
import upload from "../Middleware/multer.js";

import {
  createEvent,
  getAllEvents,
  getParentEvents,
  getChildEvents,
  deleteEvent,
  toggleActiveEvent,
  toggleEventStatus,
} from "../Controller/Eventcontroller.js";

const router = express.Router();

// ================= CREATE EVENT =================
router.post("/create-event", upload.single("image"), createEvent);

// ================= GET EVENTS =================
router.get("/all-events", getAllEvents);

// 👉 IMPORTANT (THIS FIX YOUR ERROR)
router.get("/parent-events", getParentEvents);

router.get("/child-events/:parentId", getChildEvents);

// ================= DELETE =================
router.delete("/delete-event/:id", deleteEvent);

// ================= STATUS =================
router.put("/toggle-active/:id", toggleActiveEvent);
router.put("/toggle-status/:id", toggleEventStatus);

export default router;
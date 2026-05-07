import express from "express";
import {
  createBooking,
  getBookings,
  deleteBooking,
  getMyBookings,
  downloadTicket,
} from "../Controller/Bookingcontroller.js";

// ✅ FIXED HERE
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 CREATE BOOKING (Protected)
router.post("/create-booking", protect, createBooking);

// 🔓 GET ALL BOOKINGS (Admin or public)
router.get("/all-bookings", getBookings);

// 🔓 DELETE BOOKING
router.delete("/delete-booking/:id", deleteBooking);

// 🔒 USER BOOKINGS
router.get("/my-bookings", protect, getMyBookings);

// 🔒 DOWNLOAD TICKET
router.get("/download-ticket/:id", protect, downloadTicket);

export default router;
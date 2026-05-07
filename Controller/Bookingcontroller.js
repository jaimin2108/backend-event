// Controller/Bookingcontroller.js

import Booking from "../Model/Bookingmodel.js";
import Post from "../Model/Post.js";

// ✅ CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const {
      userName,
      tickets,
      email,
      mobile,
      eventName,
      eventDetail,
    } = req.body;

    if (!userName || !tickets || !eventDetail) {
      return res.status(400).json({
        success: false,
        message: "userName, tickets, eventDetail required",
      });
    }

    // 🔥 GET EVENT
    const post = await Post.findById(eventDetail);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 🔥 GET USER CUSTOM PRICE
    const userPrice = post.userPrices?.get(req.userId);

    // ✅ FINAL PRICE
    const finalPrice =
      userPrice !== undefined && userPrice !== null
        ? userPrice
        : post.realPrice;

    // ✅ TOTAL PRICE
    const totalPrice = finalPrice * Number(tickets);

    const booking = new Booking({
      user: req.userId,
      userName,
      tickets: Number(tickets),
      email,
      mobile,
      eventName,
      eventDetail,
      price: finalPrice,
      totalPrice,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.log("BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL BOOKINGS (ADMIN)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("eventDetail", "title");

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET MY BOOKINGS (USER)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("eventDetail", "title date");

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DOWNLOAD TICKET (BASIC JSON)
export const downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
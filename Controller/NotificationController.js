import Booking from "../Model/Bookingmodel.js";

export const getNotifications = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("eventDetail").sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

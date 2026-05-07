import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../Model/Adminmodel.js";

import User from "../Model/Usermodel.js";
import Event from "../Model/Eventmodel.js";
import Contact from "../Model/Contactmodel.js";

// 🔐 LOGIN
export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Data:", email, password); // DEBUG

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 DASHBOARD
export const AdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const contactCount = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        users: userCount,
        events: eventCount,
        contacts: contactCount,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
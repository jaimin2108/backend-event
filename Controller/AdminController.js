import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Admin from "../Model/Adminmodel.js";
import User from "../Model/Usermodel.js";
import Event from "../Model/Eventmodel.js";
import Contact from "../Model/Contactmodel.js";

// 🔐 ADMIN LOGIN
export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check empty fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    console.log("Login Request:", email);

    // ✅ Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // ✅ Check JWT Secret
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET_KEY missing in .env",
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // ✅ Success response
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.log("Admin Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// 📊 ADMIN DASHBOARD
export const AdminDashboard = async (req, res) => {
  try {
    // ✅ Count data
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const contactCount = await Contact.countDocuments();

    // ✅ Response
    res.status(200).json({
      success: true,
      stats: {
        users: userCount,
        events: eventCount,
        contacts: contactCount,
      },
    });

  } catch (error) {
    console.log("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
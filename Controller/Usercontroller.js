import User from "../Model/Usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile_number,
      gender,
    } = req.body;

    // ===== CHECK REQUIRED FIELDS =====
    if (
      !name ||
      !email ||
      !password ||
      !mobile_number ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ===== CHECK EMAIL EXISTS =====
    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ===== CHECK MOBILE EXISTS =====
    const existingMobile =
      await User.findOne({
        mobile_number,
      });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile number already registered",
      });
    }

    // ===== HASH PASSWORD =====
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ===== CREATE USER =====
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile_number,
      gender,
    });

    // ===== REMOVE PASSWORD =====
    const userData = user.toObject();
    delete userData.password;

    // ===== RESPONSE =====
    res.status(201).json({
      success: true,
      message:
        "User Registered Successfully ✅",
      user: userData,
    });
  } catch (error) {
    console.log(
      "REGISTER ERROR 👉",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== CHECK REQUIRED FIELDS =====
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ===== FIND USER =====
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    // ===== BLOCK CHECK =====
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is blocked 🚫",
      });
    }

    // ===== PASSWORD CHECK =====
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password ❌",
      });
    }

    // ===== JWT TOKEN =====
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===== REMOVE PASSWORD =====
    const userData = user.toObject();
    delete userData.password;

    // ===== RESPONSE =====
    res.status(200).json({
      success: true,
      message: "Login successful ✅",
      token,
      user: userData,
    });
  } catch (error) {
    console.log("LOGIN ERROR 👉", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ================= GET ALL USERS =================
export const getAllUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find().select(
      "-password"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.log(
      "GET USERS ERROR 👉",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ================= GET SINGLE USER =================
export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(
      id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(
      "GET USER ERROR 👉",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ================= UPDATE USER =================
export const updateUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ===== HASH PASSWORD =====
    if (req.body.password) {
      req.body.password =
        await bcrypt.hash(
          req.body.password,
          10
        );
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User updated successfully ✅",
      user: updatedUser,
    });
  } catch (error) {
    console.log(
      "UPDATE USER ERROR 👉",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user =
      await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully 🗑️",
    });
  } catch (error) {
    console.log(
      "DELETE USER ERROR 👉",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ================= BLOCK / UNBLOCK USER =================
export const toggleBlockUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===== TOGGLE BLOCK =====
    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked 🚫"
        : "User unblocked ✅",
      user,
    });
  } catch (error) {
    console.log(
      "BLOCK USER ERROR 👉",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
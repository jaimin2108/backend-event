import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "./Model/Adminmodel.js";

dotenv.config({ path: "./Config/Config.env" });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: "admin@gmail.com" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash("123456", 10);

    await Admin.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
    });

    console.log("Admin Created ✅");
    process.exit();

  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

createAdmin();
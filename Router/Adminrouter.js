import express from "express";

import {
  AdminLogin,
  AdminDashboard,
} from "../Controller/AdminController.js";

import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ ADMIN LOGIN
router.post("/login", AdminLogin);

// ✅ ADMIN DASHBOARD
router.get("/dashboard", protect, AdminDashboard);

export default router;
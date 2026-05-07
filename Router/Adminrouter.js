import express from "express";
import { AdminLogin, AdminDashboard } from "../Controller/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", AdminLogin);
router.get("/dashboard", protect, AdminDashboard);

export default router;
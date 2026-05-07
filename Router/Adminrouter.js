import express from "express";
import { AdminLogin, AdminDashboard } from "../Controller/AdminController.js";

const router = express.Router();

router.post("/login", AdminLogin);
router.get("/admindashboard", AdminDashboard);

export default router;

export default router;
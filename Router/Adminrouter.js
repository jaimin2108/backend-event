import express from "express";
import { AdminLogin } from "../Controller/AdminController.js";

const router = express.Router();

router.post("/adminlogin", AdminLogin);

export default router;

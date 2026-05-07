import express from "express";
import { adminLogin } from "../Controller/AdminController.js";

const router = express.Router();

router.post("/adminlogin", adminLogin);

export default router;

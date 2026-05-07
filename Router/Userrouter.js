import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
  toggleBlockUser
} from "../Controller/Usercontroller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/all", getAllUsers);
router.get("/:id", getCurrentUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.put("/block/:id", toggleBlockUser);

export default router;
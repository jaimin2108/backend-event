import express from "express";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  setUserPrice, // ✅ ADD THIS
} from "../Controller/Postcategoriescontroller.js";

const router = express.Router();

// ❌ NO protect middleware
router.post("/create-post", createPost);
router.get("/all-posts", getAllPosts);
router.put("/update-post/:id", updatePost);
router.delete("/delete-post/:id", deletePost);

// ✅ ADD THIS ROUTE
router.post("/set-price", setUserPrice);

export default router;
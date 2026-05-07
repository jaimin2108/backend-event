import express from "express";
import multer from "multer";
import { deleteGallery, getGallery, uploadGallery } from "../Controller/Gallerycontroller.js";


const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadGallery);
router.get("/all", getGallery);
router.delete("/delete/:id", deleteGallery);

export default router;
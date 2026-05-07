import express from "express";
import Contact from "../Model/Contactmodel.js";

const router = express.Router();

// SAVE CONTACT
router.post("/", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL CONTACT (ADMIN)
router.get("/", async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
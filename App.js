import dotenv from "dotenv";
dotenv.config({ path: "./Config/Config.env" });

import express from "express";
import cors from "cors";

import Dbconnection from "./DB/Dbconnection.js";

// ================= ROUTES =================
import Userrouter from "./Router/Userrouter.js";
import GalleryRouter from "./Router/Galleryroute.js";
import Adminrouter from "./Router/Adminrouter.js";
import Eventrouter from "./Router/Eventrouter.js";
import PostRoute from "./Router/Postcategoriesroute.js";
import Bookingrouter from "./Router/Bookingroute.js";
import Contactrouter from "./Router/ContactRouter.js";
import NotificationRouter from "./Router/NotificationRouter.js";

// ================= APP =================
const app = express();

// ================= CORS (PRODUCTION + LOCAL) =================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-frontend-domain.com" // 🔴 CHANGE THIS TO YOUR REAL FRONTEND URL
    ],
    credentials: true,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= STATIC FILES =================
// for images / uploads
app.use("/upload", express.static("upload"));
app.use("/uploads", express.static("uploads"));

// ================= DATABASE =================
Dbconnection();

// ================= ROUTES =================
app.use("/api/v1/user", Userrouter);
app.use("/api/gallery", GalleryRouter);
app.use("/api/v1/admin", Adminrouter);
app.use("/api/v1/event", Eventrouter);
app.use("/api/v1/postcategories", PostRoute);
app.use("/api/v1/booking", Bookingrouter);
app.use("/api/contact", Contactrouter);
app.use("/api/v1/notification", NotificationRouter);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ================= ERROR HANDLING (OPTIONAL BUT GOOD) =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on server",
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
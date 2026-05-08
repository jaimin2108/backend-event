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

// ================= DATABASE =================
Dbconnection();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= CORS =================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://event-app-eosin-rho.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ================= STATIC FILES =================
app.use("/upload", express.static("upload"));
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
app.use("/api/v1/user", Userrouter);
app.use("/api/gallery", GalleryRouter);
app.use("/api/v1/admin", Adminrouter);
app.use("/api/v1/event", Eventrouter);
app.use("/api/v1/postcategories", PostRoute);
app.use("/api/v1/booking", Bookingrouter);
app.use("/api/contact", Contactrouter);
app.use("/api/v1/notification", NotificationRouter);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
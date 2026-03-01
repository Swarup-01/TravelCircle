require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("TravelCircle API is running...");
});

// Protected Test Route
const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    userId: req.user.id,
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// 🚀 IMPORTANT: Export app for Vercel
module.exports = app;

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("../routes/authRoutes");
const tripRoutes = require("../routes/tripRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("TravelCircle API is running...");
});

// Connect MongoDB (without app.listen)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

module.exports = app;

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("TravelCircle API is running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

module.exports = app;

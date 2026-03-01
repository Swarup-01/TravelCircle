require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const tripRoutes = require("./routes/tripRoutes");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");
const { protect } = require("./middleware/authMiddleware");
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("TravelCircle API is running...");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    userId: req.user.id,
  });
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    // Start Server ONLY after DB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB Error:", err));

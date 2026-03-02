import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// IMPORTANT: adjust paths correctly
import tripRoutes from "../server/routes/tripRoutes.js";
import authRoutes from "../server/routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("TravelCircle API is running...");
});

// 🔥 Serverless Mongo Connection (very important)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected (Vercel)");

  isConnected = true;
};

// 🚀 This is required for Vercel
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}

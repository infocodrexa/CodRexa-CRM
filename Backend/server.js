import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import Property from "./routes/propertyRoutes.js";
import Notepad from "./routes/notepadRoutes.js";
import FollowUp from "./routes/followUpRoutes.js"
import Lead from "./routes/leadRoutes.js"
import { initSocket } from "./socket.js"; 
import notificationRoutes from "./routes/notificationRoutes.js";
import Payment from "./routes/paymentRoutes.js"

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));


// Static folder for uploaded images
app.use("/uploads", express.static("uploads"));


// Test route
app.get("/", (req, res) => res.send("CRM Backend Running"));

// --------------------
// OTP Email Function Placeholder
// --------------------
export const sendOTPEmail = async (userEmail, username, otp) => {
  // Yaha tum apna email service (Nodemailer, SendGrid) integrate kar sakte ho
  console.log(`Sending OTP ${otp} to ${userEmail} for user ${username}`);
};

// --------------------
// Role-based Middleware Example
// --------------------
export const checkRole = (roles) => (req, res, next) => {
  const userRole = req.user?.role; // assume req.user set after auth
  if (!roles.includes(userRole)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Auth routes
app.use("/api/auth", authRoutes);

// property routes
app.use("/api/property",Property);

// Notepad routes
app.use("/api/notes",Notepad);

// followUp routes
app.use("/api/followups",FollowUp);

//notification routes
app.use("/api/notifications", notificationRoutes);

// Payment routes
app.use("/api/payment",Payment);

//Lead routes
app.use("/api/leads",Lead);

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
export const io = initSocket(server);

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

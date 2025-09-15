import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../Controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Admin check middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access only" });
  }
};

// 🔹 CREATE Payment (any logged-in user)
router.post("/", protect, createPayment);

// 🔹 READ All Payments (admin only)
router.get("/", protect, adminOnly, getAllPayments);

// 🔹 READ Single Payment (any logged-in user)
router.get("/:id", protect, getPaymentById);

// 🔹 UPDATE Payment (any logged-in user, can customize to restrict later)
router.put("/:id", protect, updatePayment);

// 🔹 DELETE Payment (admin only)
router.delete("/:id", protect, adminOnly, deletePayment);

export default router;

import express from "express";
import { 
//   createNotification, 
  createSimpleNotification,
  getUserNotifications, 
  markAsRead, 
  deleteNotification 
} from "../Controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a notification
router.post("/", protect, createSimpleNotification,);

// Get logged-in user's notifications
router.get("/", protect, getUserNotifications);

// Mark a notification as read
router.put("/:id/read", protect, markAsRead);

// Delete a notification
router.delete("/:id", protect, deleteNotification);

export default router;

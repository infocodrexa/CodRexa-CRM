import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../Controllers/EventController.js";
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { isEventOwnerOrAdmin } from "../Middleware/eventPermission.js";


const router = express.Router();

// Create Event → Any authenticated user can create
router.post("/", protect, createEvent);

// Get All Events → Any authenticated user
router.get("/", protect, getAllEvents);

// Get Event by ID → Any authenticated user
router.get("/:id", protect, getEventById);

// Update Event → Only owner or admin
router.put("/:id", protect, isEventOwnerOrAdmin, updateEvent);

// Delete Event → Only admin
router.delete("/:id", protect, authorizeRoles(["admin"]), deleteEvent);

export default router;

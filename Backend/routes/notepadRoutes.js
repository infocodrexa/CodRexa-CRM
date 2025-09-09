import express from "express";
import { protect } from "../Middleware/authMiddleware.js"; // authentication middleware
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} from "../Controllers/notepadController.js";

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.get("/:id", protect, getNoteById);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router;

import express from "express";
import multer from "multer";
import fs from "fs"; 

import {
  createFollowUp,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
  exportFollowUps,
} from "../Controllers/FollowUpController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { followUpPermission } from "../Middleware/followUpPermission.js";

const router = express.Router();




const uploadDir = "uploads/followups";

// Folder exist check
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });



// ➕ Create FollowUp
router.post("/", protect, followUpPermission("create"), upload.array("attachments", 5), createFollowUp);

// 📖 Read FollowUps
router.get("/", protect, followUpPermission("read"), getAllFollowUps);
router.get("/:id", protect, followUpPermission("read"), getFollowUpById);

// ✏️ Update FollowUp
router.put("/:id", protect, followUpPermission("update"), updateFollowUp);

// ❌ Delete FollowUp
router.delete("/:id", protect, followUpPermission("delete"), deleteFollowUp);

// 📤 Export FollowUps to Excel
router.get("/export/excel", protect, followUpPermission("export"), exportFollowUps);

export default router;

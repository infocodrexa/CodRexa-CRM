import express from "express";
import {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  addPlotToProperty,
  updatePlotInProperty,
  deletePlotInProperty,     // ✅ import
} from "../Controllers/propertyController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { propertyPermission } from "../Middleware/propertyPermission.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ➕ Add new property (sab logged-in user kar sakte hain)
router.post("/add", protect, upload.array("images", 5), addProperty);

// ➕ Add plot (sab logged-in user kar sakte hain)
router.post("/:id/plots", protect, addPlotToProperty);

// ✏ Update plot (sirf Admin/Developer)
router.put("/:id/plots/:plotId", protect, propertyPermission("canUpdate"), updatePlotInProperty);

router.delete("/:id/plots/:plotId", protect, propertyPermission("canDelete"), deletePlotInProperty);

// 📋 Get all properties (sab logged-in user kar sakte hain)
router.get("/", protect, getAllProperties);

// 🔍 Get single property by ID (sab logged-in user kar sakte hain)
router.get("/:id", protect, getPropertyById);

// ✏ Update property (sirf Admin/Developer)
router.put("/:id", protect, propertyPermission("canUpdate"), updateProperty);

// ❌ Delete property (sirf Admin/Developer)
router.delete("/:id", protect, propertyPermission("canDelete"), deleteProperty);

export default router;
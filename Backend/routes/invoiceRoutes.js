import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../Middleware/roleMiddleware.js";
import {
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  approveInvoice,
  rejectInvoice,
  getInvoicesByLead
} from "../Controllers/invoiceController.js";

const router = express.Router();

// Admin only endpoints
router.get("/", protect, roleMiddleware(["admin"]), getAllInvoices);
router.get("/:id", protect, roleMiddleware(["admin"]), getInvoiceById);
router.put("/:id", protect, roleMiddleware(["admin"]), updateInvoice);
router.post("/approve", protect, roleMiddleware(["admin"]), approveInvoice);
router.post("/reject", protect, roleMiddleware(["admin"]), rejectInvoice);

// Lead-specific endpoint (all logged-in users)
router.get("/lead/:leadId", protect, getInvoicesByLead);

export default router;

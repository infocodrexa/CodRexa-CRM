import express from "express";
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from "../Controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkLeadPermission, onlyAssignedLead } from "../Middleware/leadPermission.js";

const router = express.Router();

// 🔹 CRUD & List with filter
router.route("/")
  .get(protect, getAllLeads) // list all leads (RBAC filtered inside controller)
  .post(protect, checkLeadPermission("canCreate"), createLead); // create lead with RBAC

// 🔹 Export leads
router.route("/export")
  .get(protect, checkLeadPermission("canCreate"), exportLeads); // export with RBAC

// 🔹 Lead by ID
router.route("/:id")
  .get(protect, onlyAssignedLead, getLeadById)             // get lead by ID (assigned or full access)
  .put(protect, onlyAssignedLead, checkLeadPermission("canUpdate"), updateLead)  // update lead with RBAC
  .delete(protect, onlyAssignedLead, checkLeadPermission("canDelete"), deleteLead); // delete lead with RBAC

export default router;

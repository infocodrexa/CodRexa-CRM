import Lead from "../Models/Lead.js";
import { rolePermissions, ROLES } from "../config/roles.js";

// Check if logged-in user has permission to perform an action (create, update, delete, export)
// export const checkLeadPermission = (action) => {
//   return (req, res, next) => {
//     const userRole = req.user.role;

//     const permissions = rolePermissions[userRole];
//     if (!permissions) {
//       return res.status(403).json({ message: "Your role is not allowed to perform any action" });
//     }

//     const actionPermission = permissions[action];
//     if (!actionPermission || (actionPermission.length === 0 && actionPermission !== "*")) {
//       return res.status(403).json({ message: `You do not have permission to ${action} leads` });
//     }

//     next();
//   };
// };

export const checkLeadPermission = (action) => {
  return (req, res, next) => {
    // console.log(`⚡ checkLeadPermission called for action: ${action}`);
    console.log("Logged-in user role:", req.user?.role);


    const userRole = req.user.role;
    const permissions = rolePermissions[userRole];

    if (!permissions) {
      console.log("❌ No permissions found for this role");
      return res.status(403).json({ message: "Your role is not allowed to perform any action" });
    }

    const actionPermission = permissions[action];
    console.log(`Permissions for ${action}:`, actionPermission);

    if (!actionPermission || (actionPermission.length === 0 && actionPermission !== "*")) {
      console.log("❌ Action not allowed");
      return res.status(403).json({ message: `You do not have permission to ${action} leads` });
    }

    console.log("✅ Permission granted");
    next();
  };
};


// Restrict access to leads only assigned to user (Admin / Developer / Manager bypass)
// export const onlyAssignedLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
//     if (!lead) return res.status(404).json({ message: "Lead not found" });

//     const userRole = req.user.role;
//     const userId = req.user._id.toString();

//     // Admin / Developer / Manager → full access
//     if ([ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MANAGER].includes(userRole)) {
//       req.lead = lead;
//       return next();
//     }

//     // Lower roles → check if user assigned or in group
//     const assignedUsers = [
//       lead.assignedTo?.toString(),
//       ...lead.assignedGroup.map(a => a.user.toString())
//     ];

//     if (!assignedUsers.includes(userId)) {
//       return res.status(403).json({ message: "You can only access leads assigned to you" });
//     }

//     req.lead = lead;
//     next();
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const onlyAssignedLead = async (req, res, next) => {
  try {
    console.log("🔹 onlyAssignedLead middleware called for leadId:", req.params.id);

    const lead = await Lead.findById(req.params.id);
    console.log("Fetched lead from DB:", lead);

    if (!lead) {
      console.log("❌ Lead not found");
      return res.status(404).json({ message: "Lead not found" });
    }

    const userRole = req.user.role;
    const userId = req.user._id.toString();

    // Admin / Developer / Manager → full access
    if ([ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MANAGER].includes(userRole)) {
      console.log("✅ Full access granted for role:", userRole);
      req.lead = lead;
      return next();
    }

    // Lower roles → check if user assigned or in group
    const assignedUsers = [
      lead.assignedTo?.toString(),
      ...lead.assignedGroup.map(a => a.user.toString())
    ];
    console.log("Assigned users:", assignedUsers);

    if (!assignedUsers.includes(userId)) {
      console.log("❌ Access denied: user not assigned");
      return res.status(403).json({ message: "You can only access leads assigned to you" });
    }

    console.log("✅ Access granted to assigned user");
    req.lead = lead;
    next();
  } catch (error) {
    console.error("❌ onlyAssignedLead error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


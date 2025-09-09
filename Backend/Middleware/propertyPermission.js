import { rolePermissions } from "../config/roles.js";

/**
 * Middleware to check if logged-in user can perform action on property
 * action: "canCreate" | "canUpdate" | "canDelete"
 */
export const propertyPermission = (action = "canCreate") => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) 
      return res.status(403).json({ message: "User role is required" });

    const permissions = rolePermissions[userRole];
    if (!permissions) 
      return res.status(403).json({ message: "No permissions configured for this role" });

    // ✅ Check if action is allowed for property
    const allowed = permissions[action]; // array of roles or "*"

    if (!allowed.includes("*") && !allowed.includes("property")) {
      return res.status(403).json({ message: `Not authorized to ${action} property` });
    }

    next();
  };
};


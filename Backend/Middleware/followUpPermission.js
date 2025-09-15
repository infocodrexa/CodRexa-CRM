import { rolePermissions } from "../config/roles.js";

/**
 * Middleware to check if logged-in user can perform action on FollowUps
 * action: "create" | "update" | "delete"
 */
export const followUpPermission = (action = "create") => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const userRole = req.user.role.toLowerCase(); // lowercase
    const permissions = rolePermissions[userRole];

    if (!permissions) {
      return res.status(403).json({ message: "No permissions configured for this role" });
    }

    // Map action to rolePermissions key
    let permissionKey;
    switch (action.toLowerCase()) {
      case "create":
        permissionKey = "canCreate";
        break;
      case "update":
        permissionKey = "canUpdate";
        break;
      case "delete":
        permissionKey = "canDelete";
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    const allowed = permissions[permissionKey]; // now this will be defined

    if (!allowed || !Array.isArray(allowed)) {
      return res.status(403).json({ message: `Not authorized to ${action} followups` });
    }

    // ✅ check "*" or userRole or "followups"
    if (allowed.includes("*") || allowed.includes(userRole) || allowed.includes("followups")) {
      return next();
    }

    return res.status(403).json({ message: `Not authorized to ${action} followups` });
  };
};

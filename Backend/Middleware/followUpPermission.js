import { rolePermissions, ROLES } from "../config/roles.js"; // path adjust करो

export const followUpPermission = (action) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const userRole = req.user.role.toLowerCase();

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
      case "read":
      case "export":
        // For read/export, allow roles that can create or update followups (customize if needed)
        permissionKey = "canReadExport";
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    // Read/Export: dynamic check from rolePermissions
    if (permissionKey === "canReadExport") {
      const allowedRoles = Object.keys(rolePermissions).filter(
        (r) =>
          rolePermissions[r].canCreate.includes("*") ||
          rolePermissions[r].canCreate.length > 0 ||
          rolePermissions[r].canUpdate.includes("*") ||
          rolePermissions[r].canUpdate.length > 0
      );
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: `Not authorized to ${action} followups` });
      }
      return next();
    }

    const rolePerm = rolePermissions[userRole];
    if (!rolePerm) {
      return res.status(403).json({ message: `Role '${userRole}' not found in permissions` });
    }

    const allowed = rolePerm[permissionKey];
    if (!allowed || allowed.length === 0) {
      return res.status(403).json({ message: `Not authorized to ${action} followups` });
    }

    if (allowed.includes("*") || allowed.includes(userRole)) return next();

    return res.status(403).json({ message: `Not authorized to ${action} followups` });
  };
};

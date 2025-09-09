import { rolePermissions } from "../config/roles.js";

/**
 * action: "canCreate" | "canDelete" | "canUpdate"
 * targetRoleSource: optional string - where to read target role: "body.role" (default) or "params.role"
 */
export const checkPermission = (action = "canCreate", targetRoleSource = "body.role") => {
  return (req, res, next) => {
    const actorRole = req.user.role;
    const permissions = rolePermissions[actorRole];
    if (!permissions) return res.status(403).json({ message: "No permissions configured for your role" });

    // get target role from request
    const [source, key] = targetRoleSource.split(".");
    let targetRole;
    if (source === "body") targetRole = req.body[key];
    else if (source === "params") targetRole = req.params[key];
    else targetRole = req.body[key];

    if (!targetRole) return res.status(400).json({ message: "Target role is required" });

    const allowed = permissions[action];
    if (allowed.includes("*") || allowed.includes(targetRole)) {
      return next();
    }

    return res.status(403).json({ message: `Forbidden: ${actorRole} cannot perform action on ${targetRole}` });
  };
};

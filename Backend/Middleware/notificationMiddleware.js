// middleware/roleMiddleware.js

// roles = array of allowed roles
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // assume req.user set after authentication

    if (!userRole) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "You do not have permission" });
    }

    next(); // user allowed, proceed to next middleware/controller
  };
};

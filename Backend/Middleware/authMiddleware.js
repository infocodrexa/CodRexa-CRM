import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const protect = async (req, res, next) => {
  console.log(req.body);
  let token = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select("-password -otp -resetPasswordToken -resetPasswordExpiry");
      if (!user) return res.status(401).json({ message: "Not authorized" });
      // check blocked
      if (user.blockedUntil && user.blockedUntil > new Date()) {
        return res.status(403).json({ message: "Account temporarily blocked" });
      }
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }
    next();
  };
};

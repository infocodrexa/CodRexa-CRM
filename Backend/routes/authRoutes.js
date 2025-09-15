import express from "express";
import {
  publicRegister, createUser, loginStep1, verifyOTP,
  forgotPassword, resetPassword, changePassword, refreshToken, logout,
  getUserTree, deleteUser, updateUser,getAssignableUsers
} from "../Controllers/authController.js";
import { protect } from "../Middleware/authMiddleware.js";
import { checkPermission } from "../Middleware/permissionMiddleware.js";

const router = express.Router();

// Public (only general user self-register if you want)
router.post("/register-public", publicRegister);

// Developer/Admin/Manager create user (protected + checkPermission)
router.post("/create-user", protect, checkPermission("canCreate", "body.role"), createUser);

// Login (step1)
router.post("/login", loginStep1);

// OTP verify (step2)
router.post("/verify-otp", verifyOTP);

// refresh token
router.post("/refresh", refreshToken);

// forgot/reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// change password (logged-in)
router.post("/change-password", protect, changePassword);

// get all user 
router.get("/:id/tree", protect, getUserTree);

//Update user 
router.put("/:id", protect, updateUser);

//all assign user 
router.get("/assignable-users", protect, getAssignableUsers);

//delete user 
router.delete("/:id", protect, deleteUser);

// logout
router.post("/logout", logout);

export default router;

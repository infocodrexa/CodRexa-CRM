import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpTemplate, resetPasswordTemplate } from "../utils/emailTemplates.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import { rolePermissions } from "../config/roles.js";

// helper: is blocked
const isBlocked = (user) => user.blockedUntil && user.blockedUntil > new Date();

// create/register user (used by developer/admin/manager endpoints)
export const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    // basic validation
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // duplication check
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res
        .status(400)
        .json({ message: "Email or username already exists" });

    // permission double-check (middleware should already enforce, but double-check server-side)
    const actorRole = req.user.role;
    const allowed = rolePermissions[actorRole]?.canCreate || [];
    if (!(allowed.includes("*") || allowed.includes(role))) {
      return res
        .status(403)
        .json({ message: `${actorRole} cannot create ${role}` });
    }

    const newUser = new User({
      name,
      username,
      email,
      password,
      role,
      createdBy: req.user._id,
    });

    await newUser.save();
    return res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// public register endpoint (only for initial dev or special flows). In normal flow use createUser via protected route.
export const publicRegister = async (req, res) => {
  try {
    console.log("📩 Register Body:", req.body); // yahan check karo
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res
        .status(400)
        .json({ message: "Email or username already exists" });

    // by default create as 'user'
    const u = new User({ name, username, email, password, role: "user" });
    await u.save();
    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Step 1: login with identifier (username or email) + password => generate OTP, send to email
export const loginStep1 = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res
        .status(400)
        .json({ message: "Identifier and password required" });

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (isBlocked(user))
      return res.status(403).json({
        message: "Account temporarily blocked due to multiple failed attempts",
      });

    const match = await user.comparePassword(password);
    if (!match) {
      user.passwordAttempts = (user.passwordAttempts || 0) + 1;
      if (user.passwordAttempts >= 5) {
        user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      await user.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // reset password attempts on success
    user.passwordAttempts = 0;

    // generate OTP
    const otp = generateOTP();
    console.log("Generated OTP (for dev only):", otp);

    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);

    // user.otp = otp;

    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    user.otpAttempts = 0;

    await user.save();

    // send email (text)
    await sendEmail({
      to: user.email,
      subject: "Your CRM Login OTP",
      html: otpTemplate(user.username, otp),
    });

    // console.log("User object before response:", user);

    return res.json({ message: "OTP sent to email", userId: user._id });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Step 2: verify OTP and issue tokens
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    // console.log(req.body);
    if (!userId || !otp)
      return res.status(400).json({ message: "userId and otp required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (isBlocked(user))
      return res.status(403).json({
        message: "Account temporarily blocked due to multiple failed attempts",
      });

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please login again." });
    }

    const validOTP = await bcrypt.compare(otp, user.otp);
      if (!validOTP) {
          user.otpAttempts = (user.otpAttempts || 0) + 1;
          if (user.otpAttempts >= 5) {
              user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
          }
          await user.save();
          return res.status(400).json({ message: "Invalid OTP" });
      }


    // if (user.otp !== otp) {
    //   user.otpAttempts = (user.otpAttempts || 0) + 1;
    //   if (user.otpAttempts >= 5) {
    //     user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
    //   }
    //   await user.save();
    //   return res.status(400).json({ message: "Invalid OTP" });
    // }

    // OTP correct
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // set httpOnly refresh cookie
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// refresh endpoint
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // verify
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    // optional: compare stored refresh token if you store it
    const accessToken = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user);

    res.cookie("jid", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// forgot password -> send reset link with token
export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body; // email or username
    if (!identifier)
      return res.status(400).json({ message: "Identifier required" });

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const resetLink = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: resetPasswordTemplate(user.name, resetLink),
    });

    return res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// reset via token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res
        .status(400)
        .json({ message: "Token and newPassword required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword; // will be hashed in pre-save
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    user.passwordAttempts = 0;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// logged-in change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await user.comparePassword(oldPassword);
    if (!match)
      return res.status(400).json({ message: "Old password incorrect" });

    user.password = newPassword; // will be hashed
    await user.save();
    // optionally revoke refresh tokens by removing whatever you used to store them
    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// logout
export const logout = async (req, res) => {
  res.clearCookie("jid", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.json({ message: "Logged out" });
};

// Get full creation chain of a user

// Recursive function to build children
const buildChildTree = async (parentId) => {
  const children = await User.find({ createdBy: parentId }).select(
    "name username email role createdBy"
  );

  const tree = [];
  for (const child of children) {
    tree.push({
      id: child._id,
      name: child.name,
      username: child.username,
      email: child.email,
      role: child.role,
      children: await buildChildTree(child._id), // recursion
    });
  }
  return tree;
};

// Main API function
export const getUserTree = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find root user
    const user = await User.findById(id).select(
      "name username email role createdBy"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Build tree starting from this user
    const tree = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      children: await buildChildTree(user._id),
    };

    return res.json({ tree });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// 🔹 Delete user (Admin + Developer only)
export const deleteUser = async (req, res) => {
  try {
    const requester = req.user; // jo request bhej raha hai
    const { id } = req.params; // jis user ko delete karna hai

    // Target user dhoondo
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Koi bhi apna khud ka account delete na kar sake
    if (requester._id.toString() === targetUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot delete your own account" });
    }

    // 🔹 Developer → sabko delete kar sakta hai (except self)
    if (requester.role === "developer") {
      await targetUser.deleteOne();
      return res.json({ message: `${targetUser.role} deleted by Developer` });
    }

    // 🔹 Admin → sirf user ko delete kar sakta hai (except self)
    if (requester.role === "admin") {
      if (targetUser.role === "user") {
        await targetUser.deleteOne();
        return res.json({ message: "User deleted by Admin" });
      } else {
        return res
          .status(403)
          .json({
            message: "Admin can only delete users, not Admins or Developers",
          });
      }
    }

    // 🔹 User → delete ka access hi nahi
    return res
      .status(403)
      .json({ message: "Users are not allowed to delete accounts" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update user (Admin + Developer only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Target user jisko update karna hai
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Logged-in user ka role lowercase me le lo (case-insensitive)
    const loggedRole = req.user.role.toLowerCase();

    // ✅ Sirf Developer ya Admin update kar sake
    if (loggedRole !== "developer" && loggedRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update users" });
    }

    // ❌ Apna khud ka role change na kare
    if (req.user._id.toString() === id && role && role !== user.role) {
      return res
        .status(403)
        .json({ message: "You cannot change your own role" });
    }

    // ✅ Agar Admin hai → sirf apne se niche wale ko update kar sake
    if (loggedRole === "admin") {
      const allowedRoles = ["manager", "user"]; // admin sirf inko update kar sake
      if (!allowedRoles.includes(user.role.toLowerCase())) {
        return res
          .status(403)
          .json({ message: "Admin cannot update this user" });
      }
    }

    // ✅ Developer sabko update kar sakta hai (super power)
    // koi restriction nahi

    // 🔹 Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (role) user.role = role;

    await user.save();

    return res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Get users with specific roles
export const getAssignableUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["developer", "admin", "manager"] },
    }).select("name email role");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

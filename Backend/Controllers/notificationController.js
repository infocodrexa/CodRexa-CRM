import Notification from "../Models/Notification.js";
import Lead from "../Models/Lead.js";

import { io } from "../server.js";

export const createNotification = async (req, res) => {
  try {
    const { leadId, message, createdBy } = req.body;

    const notification = await Notification.create({
      leadId,
      message,
      createdBy,
    });

    await Lead.findByIdAndUpdate(leadId, {
      $push: { notifications: notification._id },
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const createSimpleNotification = async (req, res) => {
//   try {
//     const {
//       title,
//       message,
//       sentToUsers = [],
//       sentToGroups = [],
//       broadcast = false,
//       relatedEntity = null,
//     } = req.body;

//     const userRole = req.user.role;

//     // Role checks
//     if (broadcast && !["admin", "developer"].includes(userRole)) {
//       return res.status(403).json({ success: false, message: "Only Admin or Developer can send broadcast notifications" });
//     }

//     if (sentToGroups.length > 0 && !["manager", "admin", "developer"].includes(userRole)) {
//       return res.status(403).json({ success: false, message: "Only Manager/Admin/Developer can send group notifications" });
//     }

//     // Create notification document
//     const notification = await Notification.create({
//       title,
//       message,
//       createdBy: req.user._id,
//       sentToUsers,
//       sentToGroups,
//       broadcast,
//       relatedEntity,
//       status: "Pending",
//     });

//     // Lead association
//     if (relatedEntity?.entityType === "Lead" && relatedEntity?.entityId) {
//       await Lead.findByIdAndUpdate(relatedEntity.entityId, {
//         $push: { notifications: notification._id },
//       });
//     }

//     // Emit via socket.io
//     sentToUsers.forEach((userId) => io.to(userId.toString()).emit("receiveNotification", notification));
//     sentToGroups.forEach((groupId) => io.to(groupId.toString()).emit("receiveNotification", notification));
//     if (broadcast) io.emit("receiveNotification", notification);

//     res.status(201).json({ success: true, notification });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// ----------------------- MARK AS READ -----------------------

// export const createSimpleNotification = async (req, res) => {
//   try {
//     let {
//       title,
//       message,
//       sentToUsers = [],
//       sentToGroups = [],
//       broadcast = false,
//       relatedEntity = null,
//     } = req.body;

//     const userRole = req.user.role;

//     // Role checks
//     if (broadcast && !["admin", "developer"].includes(userRole)) {
//       return res.status(403).json({
//         success: false,
//         message: "Only Admin or Developer can send broadcast notifications",
//       });
//     }

//     if (sentToGroups.length > 0 && !["manager", "admin", "developer"].includes(userRole)) {
//       return res.status(403).json({
//         success: false,
//         message: "Only Manager/Admin/Developer can send group notifications",
//       });
//     }

//     // Remove null/undefined/invalid IDs
//     sentToUsers = Array.isArray(sentToUsers)
//       ? sentToUsers.filter((id) => id)
//       : [];
//     if (!broadcast && sentToUsers.length === 0 && sentToGroups.length === 0) {
//       return res.status(400).json({ success: false, message: "No valid users selected" });
//     }

//     // Create notification document
//     const notification = await Notification.create({
//       title,
//       message,
//       createdBy: req.user._id,
//       sentToUsers,
//       sentToGroups,
//       broadcast,
//       relatedEntity,
//       status: "Pending",
//     });

//     // Lead association
//     if (relatedEntity?.entityType === "Lead" && relatedEntity?.entityId) {
//       await Lead.findByIdAndUpdate(relatedEntity.entityId, {
//         $push: { notifications: notification._id },
//       });
//     }

//     // Emit via socket.io
//     sentToUsers.forEach((userId) =>
//       io.to(userId.toString()).emit("receiveNotification", notification)
//     );
//     sentToGroups.forEach((groupId) =>
//       io.to(groupId.toString()).emit("receiveNotification", notification)
//     );
//     if (broadcast) io.emit("receiveNotification", notification);

//     res.status(201).json({ success: true, notification });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const createSimpleNotification = async (req, res) => {
  try {
    let {
      title,
      message,
      sentToUsers = [],
      sentToGroups = [],
      broadcast = false, // We rely on the frontend setting this for permissions, but not for emission
      relatedEntity = null,
    } = req.body;

    const userRole = req.user.role; // --- 1. Permission Checks (Keep these strict) ---

    if (broadcast && !["admin", "developer"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only Admin or Developer can send broadcast notifications",
      });
    }

    if (
      sentToGroups.length > 0 &&
      !["manager", "admin", "developer"].includes(userRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Only Manager/Admin/Developer can send group notifications",
      });
    }

    // --- 2. Input Validation (Ensure array integrity) ---
    const finalSentToUsers = Array.isArray(sentToUsers)
      ? sentToUsers.filter((id) => id)
      : [];
    const finalSentToGroups = Array.isArray(sentToGroups)
      ? sentToGroups.filter((id) => id)
      : [];

    if (
      !broadcast &&
      finalSentToUsers.length === 0 &&
      finalSentToGroups.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No valid users selected" });
    } // --- 3. Database Save ---

    const notification = await Notification.create({
      title,
      message,
      createdBy: req.user._id,
      sentToUsers: finalSentToUsers,
      sentToGroups: finalSentToGroups,
      broadcast,
      relatedEntity,
      status: "Pending",
    }); // Lead association

    if (relatedEntity?.entityType === "Lead" && relatedEntity?.entityId) {
      await Lead.findByIdAndUpdate(relatedEntity.entityId, {
        $push: { notifications: notification._id },
      });
    }

    // --- 4. 🛑 FIX: Centralize Socket.io Emission (Prevents Duplicates) ---

    // Combine all recipients into a single, unique set
    let allRecipientIds = new Set();

    // Add IDs from single user send (sentToUsers)
    finalSentToUsers.forEach((id) => allRecipientIds.add(id.toString()));

    // Add IDs from group send (sentToGroups)
    finalSentToGroups.forEach((id) => allRecipientIds.add(id.toString()));

    // 🛑 If 'broadcast' flag is true, it means send to EVERYONE in the system
    //    (If this is the case, you might need to fetch all users' IDs here and iterate,
    //    but since your frontend sends the entire tree list to sentToGroups,
    //    we can assume we only deal with targeted lists.)

    // Emit the notification exactly once for every unique recipient
    allRecipientIds.forEach((userId) => {
      // Emit the notification directly to the user's Socket.io room (which should be their ID)
      io.to(userId).emit("receiveNotification", notification);
    });

    // Note: The global io.emit() for broadcast is intentionally removed to avoid duplicates,
    // as the frontend is already sending the list of IDs for the tree in sentToGroups.

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id; // from auth middleware

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const alreadyRead = notification.readBy.some(
      (r) => r.userId.toString() === userId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({ userId, readAt: new Date() });
      await notification.save();
    }

    res.json({ success: true, readBy: notification.readBy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------- GET USER NOTIFICATIONS -----------------------
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      $or: [
        { sentToUsers: userId },
        { sentToGroups: { $in: req.user.groups || [] } },
        { broadcast: true },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const enriched = notifications.map((n) => ({
      ...n,
      isRead: n.readBy.some((r) => r.userId.toString() === userId.toString()),
    }));

    res.json({ success: true, notifications: enriched });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------- DELETE NOTIFICATION -----------------------
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

import Event from "../Models/Event.js";

export const isEventOwnerOrAdmin = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Admin ya creator check
    if (req.user.role === "admin" || event.createdBy.toString() === req.user._id.toString()) {
      req.event = event; // optional, future use ke liye
      return next();
    } else {
      return res.status(403).json({ success: false, message: "You are not allowed to perform this action" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

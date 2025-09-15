import Event from "../Models/Event.js";
import Lead from "../Models/Lead.js";

// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    const { leadId, title, date } = req.body;
    const createdBy = req.user._id;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const event = await Event.create({ leadId, title, date, createdBy });

    await Lead.findByIdAndUpdate(leadId, { $push: { events: event._id } });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Event By ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("leadId", "name email phone")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "You are not allowed to view this event" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Event
export const updateEvent = async (req, res) => {
  try {
    const { title, date } = req.body;
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this event" });
    }

    event.title = title || event.title;
    event.date = date || event.date;
    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Events
export const getAllEvents = async (req, res) => {
  try {
    let events;

    if (req.user.role === "admin") {
      events = await Event.find().populate("leadId", "name email phone");
    } else {
      events = await Event.find({ createdBy: req.user._id }).populate("leadId", "name email phone");
    }

    const eventList = events.map(event => ({
      _id: event._id,
      title: event.title,
      date: event.date,
      lead: event.leadId ? { _id: event.leadId._id, name: event.leadId.name } : null,
      status: event.status,
      eventType: event.eventType,
    }));

    res.status(200).json({ success: true, events: eventList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    await Lead.findByIdAndUpdate(event.leadId, { $pull: { events: event._id } });

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

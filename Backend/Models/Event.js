import mongoose from "mongoose";

const eventAttachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    eventType: {
      type: String,
      enum: [
        "Meeting","Demo","Reminder","Deadline","Task","ClientCall","FollowUp",
        "Training","InternalDiscussion","Presentation","Other"
      ],
      required: true,
    },

    date: { type: Date, required: true },
    endDate: { type: Date },
    allDay: { type: Boolean, default: false },

    location: { type: String },
    meetingLink: { type: String },

    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },

    status: { type: String, enum: ["Scheduled", "Ongoing", "Completed", "Cancelled", "Postponed"], default: "Scheduled" },

    // 🔗 Relations
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    relatedClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    relatedDeal: { type: mongoose.Schema.Types.ObjectId, ref: "Deal" },

    notifications: {
      enabled: { type: Boolean, default: true },
      reminderBefore: { type: Number, default: 30 }, // minutes
      channels: {
        type: [String],
        enum: ["Email", "SMS", "WhatsApp", "PushNotification"],
        default: ["Email"],
      },
    },

    attachments: { type: [eventAttachmentSchema], default: [] },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;

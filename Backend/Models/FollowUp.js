import mongoose from "mongoose";
import historySchema from "./History.js";

const attachmentSchema = new mongoose.Schema(
  {
    fileUrl: String,
    fileType: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const noteSubSchema = new mongoose.Schema(
  {
    body: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const followUpSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Call", "Email", "Meeting", "SMS", "WhatsApp",
        "VideoCall", "Demo", "Site Visit", "Task"
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Missed", "Rescheduled", "Overdue"],
      default: "Scheduled",
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },

    scheduledAt: { type: Date, required: true },
    completedAt: { type: Date },
    reminder: { type: Boolean, default: true },
    reminderTime: { type: Date },

    // 👤 User & Assignment
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    groupAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

    // 🔗 Relations
    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    relatedClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    relatedDeal: { type: mongoose.Schema.Types.ObjectId, ref: "Deal" },

    // Result
    outcome: { type: String, enum: ["Positive", "Negative", "No Response", "Follow-Up Needed"] },
    nextStep: { type: String, enum: ["Call Again", "Send Proposal", "Schedule Demo", "Close Lead", "Payment Follow-Up"] },

    // Extra Info
    location: { type: String },
    channelDetails: { type: String },

    attachments: { type: [attachmentSchema], default: [] },

    notifyClient: { type: Boolean, default: false },
    notifyTeam: { type: Boolean, default: true },

    notes: { type: [noteSubSchema], default: [] },

    history: { type: [historySchema], default: [] },

    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FollowUp = mongoose.model("FollowUp", followUpSchema);
export default FollowUp;
export { followUpSchema };

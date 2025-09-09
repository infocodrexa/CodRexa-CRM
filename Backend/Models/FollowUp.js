import mongoose from "mongoose";

import historySchema from "./History";
// FollowUp Schema
const followUpSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Call",
        "Email",
        "Meeting",
        "SMS",
        "WhatsApp",
        "VideoCall",
        "Demo",
        "Site Visit",
        "Task"
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
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    scheduledAt: { type: Date, required: true },
    completedAt: { type: Date },

    reminder: { type: Boolean, default: true },
    reminderTime: { type: Date },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    relatedClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    relatedDeal: { type: mongoose.Schema.Types.ObjectId, ref: "Deal" },

    outcome: {
      type: String,
      enum: ["Positive", "Negative", "No Response", "Follow-Up Needed"],
    },
    nextStep: {
      type: String,
      enum: ["Call Again", "Send Proposal", "Schedule Demo", "Close Lead", "Payment Follow-Up"],
    },

    location: { type: String },
    channelDetails: { type: String },

    attachments: [
      {
        fileUrl: { type: String },
        fileType: { type: String },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    notifyClient: { type: Boolean, default: false },
    notifyTeam: { type: Boolean, default: true },

    notes: [
      {
        body: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    history: [historySchema], // 🔥 embedded history
  },
  { timestamps: true }
);

export default followUpSchema;

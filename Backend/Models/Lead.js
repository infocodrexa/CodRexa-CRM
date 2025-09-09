import mongoose from "mongoose";
import followUpSchema from "./FollowUp.js";
import eventSchema from "./Event.js";
import paymentSchema from "./Payment.js";
import invoiceSchema from "./Invoice.js";
import notificationSchema from "./Notification.js";
import historySchema from "./History.js";

const leadSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    designation: { type: String },
    industry: { type: String },
    website: { type: String },

    // Lead Source & Status
    source: {
      type: String,
      enum: ["Website", "Referral", "Ad", "Email Campaign", "Event", "Other"],
      default: "Website",
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Follow Up", "Converted", "Lost"],
      default: "New",
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },

    // Assignment
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedGroup: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["Manager", "Member"], default: "Member" },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Notes & Documents
    notes: { type: String },
    documents: [
      {
        fileName: String,
        fileUrl: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Sub-schemas
    followUps: [followUpSchema],
    events: [eventSchema],
    payments: [paymentSchema],
    invoices: [invoiceSchema],
    notifications: [notificationSchema],
    history: [historySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);

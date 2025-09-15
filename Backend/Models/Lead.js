import mongoose from "mongoose";
import historySchema from "./History.js";

const documentSubSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const assignedGroupSubSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["Manager", "Member", "Admin", "Developer"], default: "Member" },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
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
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // single owner
    assignedGroup: { type: [assignedGroupSubSchema], default: [] },   // multiple users with role in group
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Notes & Documents
    notes: { type: String },
    documents: { type: [documentSubSchema], default: [] },

    // Sub-References (No embedding)
    followUps: [{ type: mongoose.Schema.Types.ObjectId, ref: "FollowUp", default: [] }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: [] }],
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: [] }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification", default: [] }],

    // small audit lists
    history: { type: [historySchema], default: [] },

    // optional tags & status history
    tags: { type: [String], default: [] },
    statusHistory: {
      type: [
        {
          from: String,
          to: String,
          changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          changedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

leadSchema.index({ email: 1 }, { unique: true }); 
leadSchema.index({ phone: 1 });                   
leadSchema.index({ status: 1 });                 
leadSchema.index({ assignedTo: 1 });             
leadSchema.index({ tags: 1 });                    
leadSchema.index({ notes: "text", tags: "text" }); 


export default mongoose.model("Lead", leadSchema);

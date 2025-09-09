import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "LeadCreated",
        "LeadUpdated",
        "StatusChanged",
        "AssignedToUser",
        "AssignedToGroup",
        "FollowUpAdded",
        "FollowUpUpdated",
        "FollowUpCompleted",
        "PaymentAdded",
        "InvoiceGenerated",
        "NotificationSent",
        "PermissionChanged",
        "DocumentUploaded",
        "NoteAdded"
      ],
      required: true,
    },
    description: { type: String }, // free text (details of what changed)
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne kiya
    relatedTo: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" }, // kis entity pe (lead, invoice, followup, group…)
    onModel: {
      type: String,
      enum: ["Lead", "FollowUp", "Invoice", "Group", "Payment"],
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export default historySchema;
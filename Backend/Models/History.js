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
        "NoteAdded",
        "EventCreated",
        "EventUpdated",
        "EventCancelled"
      ],
      required: true,
    },
    description: { type: String }, // free text (details of what changed)
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne kiya
    relatedTo: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" }, // polymorphic ref id
    onModel: {
      type: String,
      enum: ["Lead", "FollowUp", "Invoice", "Group", "Payment", "Event", "User"],
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false, timestamps: true }
);

export default historySchema;

import mongoose from "mongoose";

const notificationAttachmentSchema = new mongoose.Schema(
  { fileName: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } },
  { _id: false }
);

const relatedEntitySchema = new mongoose.Schema(
  {
    entityType: { type: String, enum: ["Lead", "Event", "Invoice", "Payment", "FollowUp", "Task", "Other"] },
    entityId: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedEntity.entityType" },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    channel: {
      type: String,
      enum: ["Email", "SMS", "WhatsApp", "Push", "InApp", "System"],
      default: "System",
    },

    priority: { type: String, enum: ["Low", "Normal", "High", "Critical","Urgent"], default: "Normal" },

    status: { type: String, enum: ["Pending", "Sent", "Delivered", "Failed", "Read","Queued"], default: "Pending" },

    sentAt: { type: Date },
    readAt: { type: Date },

    // targets
    sentToUsers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] }, // personal targets
    sentToGroups: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], default: [] }, // group targets
    broadcast: { type: Boolean, default: false }, // send to everyone

    readBy: [
      { userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, readAt: Date }
    ],

    relatedEntity: { type: relatedEntitySchema, default: null },

    deliveryDetails: {
      channelId: String,
      provider: String,
      responseId: String,
    },

    retries: {
      count: { type: Number, default: 0 },
      lastTriedAt: Date,
    },

    attachments: { type: [notificationAttachmentSchema], default: [] },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;

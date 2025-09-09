import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // short heading
    message: { type: String, required: true }, // full message

    type: {
      type: String,
      enum: ["Email", "SMS", "WhatsApp", "Push", "InApp", "System"],
      default: "System",
    },

    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Critical"],
      default: "Normal",
    },

    status: {
      type: String,
      enum: ["Pending", "Sent", "Delivered", "Failed", "Read"],
      default: "Pending",
    },

    sentAt: { type: Date },
    readAt: { type: Date },

    sentTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // multiple users
    sentToGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], // group notifications

    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Lead", "Event", "Invoice", "Payment", "FollowUp", "Task", "Other"],
      },
      entityId: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedEntity.entityType" },
    },

    deliveryDetails: {
      channelId: String, // email id, phone no, device token
      provider: String, // Twilio, AWS SES, Firebase, etc.
      responseId: String, // API response / Message ID
    },

    retries: {
      count: { type: Number, default: 0 },
      lastTriedAt: { type: Date },
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne create kiya
  },
  { timestamps: true }
);

export default notificationSchema;

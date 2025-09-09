import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Event ka naam
    description: { type: String }, // Details

    eventType: {
      type: String,
      enum: [
        "Meeting",
        "Demo",
        "Reminder",
        "Deadline",
        "Task",
        "ClientCall",
        "FollowUp",
        "Training",
        "InternalDiscussion",
        "Presentation",
        "Other",
      ],
      required: true,
    },

    date: { type: Date, required: true }, // Start date/time
    endDate: { type: Date }, // Optional end time
    allDay: { type: Boolean, default: false }, // Full day events

    location: {
      type: String,
    },
    meetingLink: { type: String }, // Zoom/Google Meet link

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled", "Postponed"],
      default: "Scheduled",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne banaya
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // event me kon kon hai
    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }, // Lead ke sath link

    notifications: {
      enabled: { type: Boolean, default: true },
      reminderBefore: {
        type: Number, // minutes before event
        default: 30,
      },
      channels: {
        type: [String],
        enum: ["Email", "SMS", "WhatsApp", "PushNotification"],
        default: ["Email"],
      },
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default eventSchema;

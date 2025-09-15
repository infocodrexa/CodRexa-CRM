import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  { name: String, percentage: Number, amount: Number },
  { _id: false }
);

const paymentAttachmentSchema = new mongoose.Schema(
  { fileName: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    method: {
      type: String,
      enum: ["Cash","Bank Transfer","UPI","Card","Cheque","Wallet","NetBanking","Other"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending","Completed","Failed","Refunded","Partially Paid","Cancelled"],
      default: "Pending",
    },

    transactionId: { type: String },
    referenceNumber: { type: String },
    gateway: { type: String },

    paymentDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    notes: { type: String },

    taxes: { type: [taxSchema], default: [] },

    discounts: {
      type: {
        type: String,
        enum: ["Flat","Percentage"],
      },
      value: Number,
      reason: String,
    },

    breakdown: {
      subtotal: Number,
      taxTotal: Number,
      discountTotal: Number,
      finalAmount: Number,
    },

    refundDetails: {
      refundedAmount: { type: Number },
      refundDate: { type: Date },
      refundReason: { type: String },
      refundTransactionId: { type: String },
    },

    attachments: { type: [paymentAttachmentSchema], default: [] },
  },
  { timestamps: true }
);

paymentSchema.index({ lead: 1 });
paymentSchema.index({ invoice: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: -1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

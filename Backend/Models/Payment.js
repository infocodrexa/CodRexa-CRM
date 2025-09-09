import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }, // kis invoice se linked hai
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }, // kis lead/customer se related hai

    amount: { type: Number, required: true }, // total amount
    currency: { type: String, default: "INR" }, // INR, USD, EUR, etc.

    method: {
      type: String,
      enum: [
        "Cash",
        "Bank Transfer",
        "UPI",
        "Card",
        "Cheque",
        "Wallet",
        "NetBanking",
        "Other",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
        "Failed",
        "Refunded",
        "Partially Paid",
        "Cancelled",
      ],
      default: "Pending",
    },

    transactionId: { type: String }, // Bank/UPI/PG transaction ID
    referenceNumber: { type: String }, // cheque no, UTR, ref no etc.
    gateway: { type: String }, // Razorpay, Stripe, PayPal, Paytm, etc.

    paymentDate: { type: Date, default: Date.now },
    dueDate: { type: Date }, // agar credit hai to due date

    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne receive kiya
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne approve kiya (finance/admin)

    notes: { type: String },

    taxes: [
      {
        name: String, // GST, VAT, Service Tax
        percentage: Number,
        amount: Number,
      },
    ],

    discounts: {
      type: {
        type: String,
        enum: ["Flat", "Percentage"],
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

export default paymentSchema;

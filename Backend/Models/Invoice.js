import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true }, // auto-generated unique number
    referenceNumber: { type: String }, // quotation/PO number if linked

    companyDetails: {
      name: String,
      address: String,
      gstNumber: String,
      panNumber: String,
      cinNumber: String,
      logo: String, // file URL
      signature: String, // file URL
      bankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branch: String,
        upiId: String,
      },
    },

    client: {
      name: String,
      email: String,
      phone: String,
      address: String,
      gstNumber: String,
      companyName: String,
    },

    items: [
      {
        description: String,
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: "pcs" }, // pcs, hours, kg, etc.
        price: Number,
        discount: {
          type: {
            type: String,
            enum: ["Flat", "Percentage"],
          },
          value: Number,
        },
        tax: {
          name: String, // GST, VAT
          percentage: Number,
        },
        total: Number,
      },
    ],

    subTotal: Number,
    discountTotal: Number,
    taxTotal: Number,
    shippingCharges: Number,
    adjustment: Number,
    totalAmount: Number,
    currency: { type: String, default: "INR" },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partially Paid", "Paid", "Overdue", "Cancelled", "Refunded"],
      default: "Unpaid",
    },

    paymentDetails: [
      {
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
        method: String,
        amount: Number,
        date: Date,
        transactionId: String,
        notes: String,
      },
    ],

    issuedDate: { type: Date, default: Date.now },
    dueDate: Date,

    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: { type: String, enum: ["Daily", "Weekly", "Monthly", "Yearly"] },
      endDate: { type: Date },
    },

    status: {
      type: String,
      enum: ["Draft", "Sent", "Viewed", "Approved", "Rejected", "Archived"],
      default: "Draft",
    },

    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    terms: String,
    notes: String,

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    history: [
      {
        action: {
          type: String,
          enum: [
            "Created",
            "Sent",
            "Viewed",
            "Approved",
            "Rejected",
            "Payment Received",
            "Updated",
            "Cancelled",
          ],
        },
        actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        actionAt: { type: Date, default: Date.now },
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

export default invoiceSchema;

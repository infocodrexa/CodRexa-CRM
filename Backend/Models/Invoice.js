import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    description: String,
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: "pcs" },
    price: Number,
    discount: {
      type: { type: String, enum: ["Flat","Percentage"] },
      value: Number,
    },
    tax: { name: String, percentage: Number },
    total: Number,
  },
  { _id: false }
);

const paymentDetailSchema = new mongoose.Schema(
  {
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    method: String,
    amount: Number,
    date: Date,
    transactionId: String,
    notes: String,
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    referenceNumber: { type: String },

    companyDetails: {
      name: String,
      address: String,
      gstNumber: String,
      panNumber: String,
      cinNumber: String,
      logo: String,
      signature: String,
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

    items: { type: [itemSchema], default: [] },

    subTotal: Number,
    discountTotal: Number,
    taxTotal: Number,
    shippingCharges: Number,
    adjustment: Number,
    totalAmount: Number,
    currency: { type: String, default: "INR" },

    paymentStatus: {
      type: String,
      enum: ["Unpaid","Partially Paid","Paid","Overdue","Cancelled","Refunded"],
      default: "Unpaid",
    },

    paymentDetails: { type: [paymentDetailSchema], default: [] },

    issuedDate: { type: Date, default: Date.now },
    dueDate: Date,

    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: { type: String, enum: ["Daily","Weekly","Monthly","Yearly"] },
      endDate: { type: Date },
    },

    status: {
      type: String,
      enum: ["Draft","Sent","Viewed","Approved","Rejected","Archived"],
      default: "Draft",
    },

    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    terms: String,
    notes: String,

    attachments: { type: [{ fileName: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } }], default: [] },

    history: {
      type: [
        {
          action: {
            type: String,
            enum: ["Created","Sent","Viewed","Approved","Rejected","Payment Received","Updated","Cancelled"],
          },
          actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          actionAt: { type: Date, default: Date.now },
          notes: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;

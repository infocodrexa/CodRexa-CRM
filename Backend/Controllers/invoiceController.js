import Invoice from "../Models/Invoice.js";
import Lead from "../Models/Lead.js";
import Payment from "../Models/Payment.js";
import Notification from "../Models/Notification.js";
import { sendEmail } from "../utils/sendEmail.js";

// 🔹 Generate unique invoice number
const generateInvoiceNumber = () => {
  return "INV-" + Date.now();
};

// ✅ Create Invoice (Manual, default: Pending)
export const createInvoice = async (req, res) => {
  try {
    const { leadId, total, createdBy } = req.body;

    if (!leadId || !total) {
      return res
        .status(400)
        .json({ success: false, message: "LeadId and Total are required" });
    }

    const invoice = await Invoice.create({
      leadId,
      total,
      status: "Pending", // default
      createdBy,
      invoiceNumber: generateInvoiceNumber(),
    });

    await Lead.findByIdAndUpdate(leadId, { $push: { invoices: invoice._id } });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin Approves Invoice (from Payment)
export const approveInvoice = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId).populate("lead");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status !== "Completed")
      return res.status(400).json({ message: "Payment not completed" });

    // Check duplicate invoice for this payment
    const existingInvoice = await Invoice.findOne({ paymentId: payment._id });
    if (existingInvoice) {
      return res
        .status(400)
        .json({ success: false, message: "Invoice already generated" });
    }

    // Create Invoice
    const invoice = await Invoice.create({
      leadId: payment.lead._id,
      paymentId: payment._id,
      invoiceNumber: generateInvoiceNumber(),
      total: payment.amount,
      status: "Complete",
    });

    await Lead.findByIdAndUpdate(payment.lead._id, {
      $push: { invoices: invoice._id },
    });

    // Email to client
    const html = `
      <h2>Invoice Generated</h2>
      <p>Dear ${payment.lead.name},</p>
      <p>Thank you for your payment of <b>₹${payment.amount}</b>.</p>
      <p>Your invoice number is <b>${invoice.invoiceNumber}</b>.</p>
    `;

    await sendEmail({
      to: payment.lead.email,
      subject: `Your Invoice ${invoice.invoiceNumber}`,
      html,
    });

    // Notification
    await Notification.create({
      leadId: payment.lead._id,
      message: `Invoice ${invoice.invoiceNumber} approved.`,
      type: "InvoiceApproval",
      status: "Complete",
    });

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin Rejects Invoice
export const rejectInvoice = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;
    const payment = await Payment.findById(paymentId).populate("lead");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Find invoice linked with this payment
    const invoice = await Invoice.findOne({ paymentId: payment._id });
    if (invoice) {
      invoice.status = "Rejected";
      invoice.rejectionReason = reason || "Not specified";
      await invoice.save();
    }

    // Update notification as rejected
    await Notification.updateMany(
      { leadId: payment.lead._id, type: "InvoiceApproval" },
      { $set: { status: "Rejected", rejectionReason: reason } }
    );

    res.json({ success: true, message: "Invoice approval rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("leadId", "name email phone")
      .populate("paymentId", "amount status")
      .populate("createdBy", "name email");

    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id)
      .populate("leadId", "name email phone")
      .populate("paymentId", "amount status")
      .populate("createdBy", "name email");

    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Invoice (only status/total can change)
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.total) updates.total = req.body.total;
    if (req.body.status) updates.status = req.body.status;

    const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true });

    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

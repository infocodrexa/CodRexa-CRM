import Invoice from "../Models/Invoice.js";
import Lead from "../Models/Lead.js";
import Payment from "../Models/Payment.js";
import Notification from "../Models/Notification.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createInvoice = async (req, res) => {
  try {
    const { leadId, total, status, createdBy } = req.body;

    const invoice = await Invoice.create({ leadId, total, status, createdBy });

    await Lead.findByIdAndUpdate(leadId, { $push: { invoices: invoice._id } });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Generate unique invoice number
const generateInvoiceNumber = () => {
  return "INV-" + Date.now();
};

// ✅ Admin Approves Invoice
export const approveInvoice = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId).populate("leadId");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status !== "Completed")
      return res.status(400).json({ message: "Payment not completed" });

    // Invoice create
    const invoice = await Invoice.create({
      leadId: payment.leadId._id,
      paymentId: payment._id,
      invoiceNumber: generateInvoiceNumber(),
      amount: payment.amount,
      status: "Sent"
    });

    // Lead me link karna
    await Lead.findByIdAndUpdate(payment.leadId._id, { $push: { invoices: invoice._id } });

    // Client ko email bhejna
    const html = `
      <h2>Invoice Generated</h2>
      <p>Dear ${payment.leadId.name},</p>
      <p>Thank you for your payment of <b>₹${payment.amount}</b>.</p>
      <p>Your invoice number is <b>${invoice.invoiceNumber}</b>.</p>
    `;

    await sendEmail({
      to: payment.leadId.email,
      subject: `Your Invoice ${invoice.invoiceNumber}`,
      html
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
    const payment = await Payment.findById(paymentId).populate("leadId");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Update notification as rejected
    await Notification.updateMany(
      { leadId: payment.leadId._id, type: "InvoiceApproval" },
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
    const invoices = await Invoice.find().populate("leadId paymentId createdBy");
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("leadId paymentId createdBy");
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { total, status } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { total, status },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};   
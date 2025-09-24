import Payment from "../Models/Payment.js";
import Lead from "../Models/Lead.js";
import Notification from "../Models/Notification.js";
import User from "../Models/User.js"; // Admin ko nikalne ke liye

// ✅ Create Payment + Notify Admin
export const createPayment = async (req, res) => {
  try {
    const { leadId, amount, method, createdBy } = req.body;

    // Step 1: Payment create karo
    const payment = await Payment.create({
      leadId,
      amount,
      method,
      createdBy,
      status: "Pending", // ✅ ab default Pending
    });

    // Step 2: Lead ke andar payment push karo
    await Lead.findByIdAndUpdate(leadId, { $push: { payments: payment._id } });

    // Step 3: Admin(s) ko nikalna
    const admins = await User.find({ role: "admin" }).select("_id email");

    // Step 4: Har admin ko notification bhejna
    for (const admin of admins) {
      await Notification.create({
        leadId,
        message: `💰 Payment of ₹${amount} received for Lead ${leadId}. Approval required for Invoice.`,
        createdBy,
        user: admin._id, // Ye admin ke dashboard me dikhega
        type: "InvoiceApproval",
      });
    }

    res.status(201).json({
      success: true,
      message: "Payment created & Admin notified for invoice approval",
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("leadId", "name email phone");
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ READ Single Payment
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("leadId", "name email phone");
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE Payment
// export const updatePayment = async (req, res) => {
//   try {
//     const { amount, method, status } = req.body;
//     const payment = await Payment.findByIdAndUpdate(
//       req.params.id,
//       { amount, method, status },
//       { new: true }
//     );

//     if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

//     res.status(200).json({ success: true, message: "Payment updated", payment });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const updatePayment = async (req, res) => {
  try {
    const { amount, method, status } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // 🔹 Check if logged-in user is creator or admin
    if (req.user.role !== "admin" && payment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only update your own payments" });
    }

    // 🔹 Update fields
    payment.amount = amount || payment.amount;
    payment.method = method || payment.method;
    payment.status = status || payment.status;

    await payment.save();

    res.status(200).json({ success: true, message: "Payment updated", payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ DELETE Payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Lead se payment remove kar do
    await Lead.findByIdAndUpdate(payment.leadId, { $pull: { payments: payment._id } });

    res.status(200).json({ success: true, message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
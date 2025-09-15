import Lead from "../Models/Lead.js";
import { Parser } from "json2csv"; // npm install json2csv
import { ROLES } from "../config/roles.js";
import { sendEmail } from "../utils/sendEmail.js"; // ✅ tumhara sendEmail helper

// ✅ Create Lead + Email Notify
// ✅ Create Lead + Email Notify
export const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      createdBy,
      assignedTo,
      assignedGroup,
    } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      createdBy,
      assignedTo,
      assignedGroup,
    });

    // 🔔 Email Notification
    let recipients = [];

    // Case 1: Single assignedTo
    if (assignedTo) {
      const populatedLead = await Lead.populate(lead, {
        path: "assignedTo",
        select: "name email",
      });
      if (populatedLead.assignedTo?.email) {
        recipients.push({
          name: populatedLead.assignedTo.name,
          email: populatedLead.assignedTo.email,
        });
      }
    }

    // Case 2: Assigned Group (multiple users)
    if (assignedGroup?.length > 0) {
      const populatedLead = await Lead.populate(lead, {
        path: "assignedGroup.user",
        select: "name email",
      });

      populatedLead.assignedGroup.forEach((member) => {
        if (member.user?.email) {
          recipients.push({ name: member.user.name, email: member.user.email });
        }
      });
    }

    // 🚀 Send email to all recipients (single or group)
    for (const user of recipients) {
      await sendEmail({
        to: user.email,
        subject: "📌 New Lead Assigned to You - CodRexa CRM",
        html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; background:#f9f9f9; padding:20px;">
          <table width="100%" style="max-width:600px; margin:auto; background:#fff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <tr>
              <td style="background:#4CAF50; color:#fff; padding:15px 20px; text-align:center; font-size:20px; font-weight:bold; border-radius:8px 8px 0 0;">
                🚀 New Lead Assigned - CodRexa CRM
              </td>
            </tr>
            <tr>
              <td style="padding:20px;">
                <p>Hi <b>${user.name}</b>,</p>
                <p>A new lead has been assigned to you. Please review the details below:</p>
                
                <table width="100%" style="border-collapse:collapse; margin:15px 0;">
                  <tr>
                    <td style="padding:8px; border:1px solid #ddd; background:#f1f1f1;"><b>Name</b></td>
                    <td style="padding:8px; border:1px solid #ddd;">${lead.name}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px; border:1px solid #ddd; background:#f1f1f1;"><b>Email</b></td>
                    <td style="padding:8px; border:1px solid #ddd;">${lead.email}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px; border:1px solid #ddd; background:#f1f1f1;"><b>Phone</b></td>
                    <td style="padding:8px; border:1px solid #ddd;">${
                      lead.phone || "N/A"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:8px; border:1px solid #ddd; background:#f1f1f1;"><b>Company</b></td>
                    <td style="padding:8px; border:1px solid #ddd;">${
                      lead.company || "N/A"
                    }</td>
                  </tr>
                </table>

                <p style="margin-top:20px;">You can log in to <a href="https://your-crm-url.com" style="color:#4CAF50; font-weight:bold; text-decoration:none;">CodRexa CRM</a> to view and manage this lead.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777; border-radius:0 0 8px 8px;">
                © ${new Date().getFullYear()} CodRexa CRM. All rights reserved.
              </td>
            </tr>
          </table>
        </div>
        `,
      });
    }

    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("assignedGroup.user", "name email role")
      .populate("followUps")
      .populate("events")
      .populate("payments")
      .populate("invoices")
      .populate("notifications");

    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Lead By ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("assignedGroup.user", "name email role")
      .populate("followUps")
      .populate("events")
      .populate("payments")
      .populate("invoices")
      .populate("notifications");

    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📤 Export leads as CSV + RBAC
export const exportLeads = async (req, res) => {
  try {
    const { status, priority, source } = req.query;
    const userRole = req.user.role;
    const userId = req.user._id.toString();

    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;

    // RBAC: lower roles only export assigned leads
    if (![ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MANAGER].includes(userRole)) {
      filter.$or = [{ assignedTo: userId }, { "assignedGroup.user": userId }];
    }

    const leads = await Lead.find(filter)
      .populate("assignedTo assignedGroup.user createdBy")
      .lean();

    if (!leads.length)
      return res.status(404).json({ message: "No leads to export" });

    const fields = [
      "name",
      "email",
      "phone",
      "company",
      "designation",
      "industry",
      "website",
      "status",
      "priority",
      "source",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(leads);

    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

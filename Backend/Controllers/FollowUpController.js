import FollowUp from "../Models/FollowUp.js";

import ExcelJS from "exceljs";

// ➕ Create FollowUp
export const createFollowUp = async (req, res) => {
  try {
    const followUp = new FollowUp(req.body);
    await followUp.save();
    res.status(201).json({ success: true, data: followUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📖 Get all FollowUps (with Filters + Search + Pagination + Date Range)
export const getAllFollowUps = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      type, 
      search, 
      upcoming, 
      fromDate, 
      toDate 
    } = req.query;

    const query = {};

    // ✅ Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    // ✅ Upcoming = only future scheduled followups
    if (upcoming === "true") {
      query.scheduledAt = { $gte: new Date() };
    }

    // ✅ Date Range Filter
    if (fromDate || toDate) {
      query.scheduledAt = {};
      if (fromDate) query.scheduledAt.$gte = new Date(fromDate);
      if (toDate) query.scheduledAt.$lte = new Date(toDate);
    }

    // ✅ Search by title / description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Pagination
    const skip = (page - 1) * limit;

    const followUps = await FollowUp.find(query)
      .populate("createdBy assignedTo groupAssignedTo relatedLead relatedClient relatedDeal")
      .sort({ scheduledAt: 1 }) // earliest first
      .skip(skip)
      .limit(Number(limit));

    const total = await FollowUp.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: followUps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📖 Get single FollowUp by ID
export const getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id)
      .populate("createdBy assignedTo groupAssignedTo relatedLead relatedClient relatedDeal");
    if (!followUp) return res.status(404).json({ success: false, message: "FollowUp not found" });
    res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update FollowUp
export const updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!followUp) return res.status(404).json({ success: false, message: "FollowUp not found" });
    res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🗑️ Delete FollowUp
export const deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);
    if (!followUp) return res.status(404).json({ success: false, message: "FollowUp not found" });
    res.status(200).json({ success: true, message: "FollowUp deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const exportFollowUps = async (req, res) => {
  try {
    const { status, priority, type, search, upcoming, fromDate, toDate } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    if (upcoming === "true") {
      query.scheduledAt = { $gte: new Date() };
    }

    if (fromDate || toDate) {
      query.scheduledAt = {};
      if (fromDate) query.scheduledAt.$gte = new Date(fromDate);
      if (toDate) query.scheduledAt.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const followUps = await FollowUp.find(query)
      .populate("createdBy assignedTo relatedLead relatedClient relatedDeal")
      .sort({ scheduledAt: 1 });

    // ✅ Excel Workbook बनाना
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("FollowUps");

    // ✅ Header Row
    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Type", key: "type", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Scheduled At", key: "scheduledAt", width: 25 },
      { header: "Completed At", key: "completedAt", width: 25 },
      { header: "Created By", key: "createdBy", width: 25 },
      { header: "Related Lead", key: "relatedLead", width: 25 },
      { header: "Related Client", key: "relatedClient", width: 25 },
      { header: "Outcome", key: "outcome", width: 20 },
      { header: "Next Step", key: "nextStep", width: 20 },
    ];

    // ✅ Data Rows
    followUps.forEach((f) => {
      worksheet.addRow({
        title: f.title,
        type: f.type,
        status: f.status,
        priority: f.priority,
        scheduledAt: f.scheduledAt ? f.scheduledAt.toISOString() : "",
        completedAt: f.completedAt ? f.completedAt.toISOString() : "",
        createdBy: f.createdBy?.name || "",
        relatedLead: f.relatedLead?.name || "",
        relatedClient: f.relatedClient?.name || "",
        outcome: f.outcome || "",
        nextStep: f.nextStep || "",
      });
    });

    // ✅ File Response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=followups.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
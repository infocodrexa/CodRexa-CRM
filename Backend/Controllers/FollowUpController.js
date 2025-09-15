import FollowUp from "../Models/FollowUp.js";
import ExcelJS from "exceljs";

// ➕ Create FollowUp
export const createFollowUp = async (req, res) => {
  try {
    const userId = req.user?._id;

    const followUp = new FollowUp({
      ...req.body,
      isDeleted: false, // force safe default
      createdBy: userId,
      lastUpdatedBy: userId,
      history: [
        {
          action: "Created",
          performedBy: userId,
          timestamp: new Date(),
        },
      ],
    });

    await followUp.save();

    res.status(201).json({ success: true, data: followUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📖 Get all FollowUps (Filters + Pagination + Search)
export const getAllFollowUps = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, type, search, upcoming, fromDate, toDate } =
      req.query;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    if (upcoming === "true") query.scheduledAt = { $gte: new Date() };

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

    const skip = (Number(page) - 1) * Number(limit);

    const followUps = await FollowUp.find(query)
      .populate("createdBy assignedTo groupAssignedTo relatedLead relatedClient relatedDeal")
      .sort({ scheduledAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await FollowUp.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: followUps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📖 Get single FollowUp
export const getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id)
      .populate("createdBy assignedTo groupAssignedTo relatedLead relatedClient relatedDeal");

    if (!followUp || followUp.isDeleted) {
      return res.status(404).json({ success: false, message: "FollowUp not found" });
    }

    res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update FollowUp
export const updateFollowUp = async (req, res) => {
  try {
    const userId = req.user?._id;

    const update = {
      ...req.body,
      lastUpdatedBy: userId,
      $push: {
        history: {
          action: "Updated",
          performedBy: userId,
          timestamp: new Date(),
        },
      },
    };

    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!followUp || followUp.isDeleted) {
      return res.status(404).json({ success: false, message: "FollowUp not found" });
    }

    res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🗑️ Soft Delete FollowUp
export const deleteFollowUp = async (req, res) => {
  try {
    const userId = req.user?._id;

    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        lastUpdatedBy: userId,
        $push: {
          history: {
            action: "Deleted",
            performedBy: userId,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!followUp) {
      return res.status(404).json({ success: false, message: "FollowUp not found" });
    }

    if (followUp.isDeleted) {
      return res.status(200).json({ success: true, message: "FollowUp already deleted" });
    }

    res.status(200).json({ success: true, message: "FollowUp deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📤 Export FollowUps to Excel
export const exportFollowUps = async (req, res) => {
  try {
    const { status, priority, type, search, upcoming, fromDate, toDate } = req.query;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    if (upcoming === "true") query.scheduledAt = { $gte: new Date() };

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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("FollowUps");

    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Type", key: "type", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Scheduled At", key: "scheduledAt", width: 25 },
      { header: "Completed At", key: "completedAt", width: 25 },
      { header: "Created By", key: "createdBy", width: 25 },
      { header: "Assigned To", key: "assignedTo", width: 25 },
      { header: "Related Lead", key: "relatedLead", width: 25 },
      { header: "Related Client", key: "relatedClient", width: 25 },
      { header: "Outcome", key: "outcome", width: 20 },
      { header: "Next Step", key: "nextStep", width: 20 },
    ];

    followUps.forEach((f) => {
      worksheet.addRow({
        title: f.title,
        type: f.type,
        status: f.status,
        priority: f.priority,
        scheduledAt: f.scheduledAt ? f.scheduledAt.toISOString() : "",
        completedAt: f.completedAt ? f.completedAt.toISOString() : "",
        createdBy: f.createdBy?.name || "",
        assignedTo: Array.isArray(f.assignedTo)
          ? f.assignedTo.map((u) => u.name).join(", ")
          : f.assignedTo?.name || "",
        relatedLead: f.relatedLead?.name || "",
        relatedClient: f.relatedClient?.name || "",
        outcome: f.outcome || "",
        nextStep: f.nextStep || "",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=followups.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

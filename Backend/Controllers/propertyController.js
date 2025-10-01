import Property from "../Models/Property.js";

// ➕ Add Property
export const addProperty = async (req, res) => {
  console.log("Body:", req.body); // Fields: name, address, price
  console.log("Files:", req.files); // Images

  console.log("User from protect middleware:", req.user); // 🔹 check
  try {
    if (!req.body.name || !req.body.address) {
      return res.status(400).json({ message: "Name and Address are required" });
    }

    // 🔹 Agar images upload kiye gaye hain to unke path save karo
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    const newProperty = new Property({
      ...req.body,
      images: imagePaths, // images ka array DB me save hoga
      user: req.user._id, // logged-in user ka ID
    });

    await newProperty.save();

    res.status(201).json({
      message: "Property added successfully",
      newProperty,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding property",
      error: error.message,
    });
  }
};

// 📋 Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "user",
      "name email role"
    ); // user details bhi aayenge
    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

// 🔍 Get Property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user", // yahan 'createdBy' ki jagah 'user' likho
      "name email role"
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching property", error: error.message });
  }
};

// ✏ Update Property
export const updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // ✅ jo field bhejoge wahi update hoga
      { new: true, runValidators: true }
    );
    if (!updatedProperty)
      return res.status(404).json({ message: "Property not found" });
    res
      .status(200)
      .json({ message: "Property updated successfully", updatedProperty });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating property", error: error.message });
  }
};

// ❌ Delete Property
export const deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting property", error: error.message });
  }
};

// ➕ Add Plot to a Property
export const addPlotToProperty = async (req, res) => {
  try {
    const { plotNo, sizeSqFt, price, status, createdAt, User } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.plots.push({
      plotNo,
      sizeSqFt,
      price,
      status,
      createdAt: createdAt || Date.now(), // agar user de to wahi use ho
      User: req.user._id,
    });

    await property.save();

    res.status(201).json({
      message: "Plot added successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding plot",
      error: error.message,
    });
  }
};
// ✏ Update Plot
export const updatePlotInProperty = async (req, res) => {
  try {
    const { id, plotId } = req.params; // propertyId & plotId
    const { plotNo, sizeSqFt, price, status } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // find plot
    const plot = property.plots.id(plotId);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }

    // update fields if provided
    if (plotNo) plot.plotNo = plotNo;
    if (sizeSqFt) plot.sizeSqFt = sizeSqFt;
    if (price) plot.price = price;
    if (status) plot.status = status;

    await property.save();

    res.status(200).json({
      message: "Plot updated successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating plot",
      error: error.message,
    });
  }
};


// 🗑️ Delete Plot from a Property
export const deletePlotInProperty = async (req, res) => {
  try {
    const { id, plotId } = req.params; // propertyId & plotId

    // Step 1: Find the parent property
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Step 2: Find the specific plot within the property
    const plot = property.plots.id(plotId);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }

    // Step 3: Remove the plot from the array
    // Mongoose 5.11+ mein remove() ki jagah deleteOne() use karein
    await plot.deleteOne();

    // Step 4: Save the parent property to persist the change
    await property.save();

    res.status(200).json({
      message: "Plot deleted successfully",
      property, // Return the updated property
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting plot",
      error: error.message,
    });
  }
};
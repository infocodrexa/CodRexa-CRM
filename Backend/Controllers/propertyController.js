import Property from "../Models/Property.js";

// ➕ Add Property
export const addProperty = async (req, res) => {
  try {
    if (!req.body.name || !req.body.address) {
      return res.status(400).json({ message: "Name and Address are required" });
    }

    // 🔹 Agar images upload kiye gaye hain to unke path save karo
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    const newProperty = new Property({
      ...req.body,
      images: imagePaths,          // images ka array DB me save hoga
      user: req.user._id,     // logged-in user ka ID
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


// ✏️ Update Property
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

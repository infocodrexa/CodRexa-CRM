// models/Property.js
import mongoose from "mongoose";

// ========== Sub Schema (Plot) ==========
const PlotSchema = new mongoose.Schema({
  plotNo: { type: String, required: true },
  sizeSqFt: { type: Number },
  price: { type: Number },
  status: {
    type: String,
    enum: ["Available", "Sold", "Reserved"],
    default: "Available",
  },
  createdAt: { type: Date, default: Date.now },
});

// ========== Main Schema (Property) ==========
const PropertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // jo user property add karega
    required: true,
  },
  name: { type: String, required: true }, // Project/Property Name
  address: { type: String },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  type: { type: String }, // Residential / Commercial / Plot / Flat
  ownerName: { type: String },
  contactNumber: { type: String },
  price: { type: Number },
  description: { type: String },
  images: {
    type: [String],
    required: false, // optional field
    default: [],
  }, // array of image URLs
  plots: [PlotSchema], // embed plots
  createdAt: { type: Date, default: Date.now },
});

// ========== Model Export ==========
export default mongoose.model("Property", PropertySchema);

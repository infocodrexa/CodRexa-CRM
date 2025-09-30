import React, { useState } from "react";
import axios from "axios";

export default function AddPlot({ propertyId, onPlotAdded }) {
  const [formData, setFormData] = useState({
    plotNo: "",
    sizeSqFt: "",
    price: "",
    status: "Available",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/property/${propertyId}/plots`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Plot added successfully");
      setFormData({
        plotNo: "",
        sizeSqFt: "",
        price: "",
        status: "Available",
      });

      if (onPlotAdded) onPlotAdded(); // parent ko refresh bol do
    } catch (err) {
      console.error("Error adding plot:", err);
      alert(err.response?.data?.message || "Error adding plot");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow-sm rounded bg-white border"
      style={{ maxWidth: "1140px", margin: "20px auto" }}
    >
      <h4 className="mb-4 text-primary border-bottom pb-2">Add Plot</h4>
      <div className="row g-3">
        <div className="col-md-3">
          <input
            type="text"
            name="plotNo"
            placeholder="Plot No"
            value={formData.plotNo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            name="sizeSqFt"
            placeholder="Size (SqFt)"
            value={formData.sizeSqFt}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>
      <div className="text-end mt-4">
        <button type="submit" className="btn btn-primary px-4 py-2">
          Save Plot
        </button>
      </div>
    </form>
  );
}
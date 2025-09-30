import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

export default function EditProperty() {
  const { id } = useParams(); // URL se id le
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "Available",
  });

  // 🟢 Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/property/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };
    fetchProperty();
  }, [id]);

  // 🟢 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Submit update
// 🟢 Submit update
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/property/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("✅ Property updated successfully");

    // 🔹 Navigate to Property Detail page instead of list
    navigate(`/dashboard/properties/${id}`);
  } catch (err) {
    console.error("Error updating property:", err);
    alert(err.response?.data?.message || "Error updating property");
  }
};


  return (
    <div className="container mt-4">
      <h3>Edit Property</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Reserved">Reserved</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary">
          Update Property
        </Button>
      </Form>
    </div>
  );
}
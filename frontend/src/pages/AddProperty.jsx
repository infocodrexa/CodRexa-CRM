import React, { useState } from "react";
import axios from "axios";

export default function AddProperty() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  const handleFiles = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token missing! Login again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("price", price);
    images.forEach((img) => formData.append("images", img));

    try {
      console.log("Sending FormData:", {
        name,
        address,
        price,
        images,
      });

      const res = await axios.post(
        `http://localhost:5000/api/property/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", res.data);
      alert("Property added successfully!");

      // Reset form
      setName("");
      setAddress("");
      setPrice("");
      setImages([]);
    } catch (err) {
      console.error("Error:", err.response || err);
      alert(`
        Failed to add property: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="card p-3">
      <h3>Add Property</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="file"
          multiple
          onChange={handleFiles}
        />
        <button type="submit" className="btn btn-success">
          Save
        </button>
      </form>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  // 🟢 Decode user info from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🟢 Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/property`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchProperties();
  }, []);

  // 🟢 Delete Property
  const handleDeleteProperty = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/property/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  // 🟢 View Property
  const handleViewProperty = (id) => {
    navigate(`/dashboard/properties/${id}`);
  };

  // 🟢 Edit Property
  const handleEditProperty = (id) => {
    navigate(`/dashboard/properties/edit/${id}`);
  };

  // 🟢 Add Property
  const handleAddProperty = () => {
    navigate(`/dashboard/properties/add`);
  };

  // 🔍 Filtered properties
  const filtered = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  // 📑 Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Property List</h3>
        <Button variant="success" onClick={handleAddProperty}>
          Add New Property
        </Button>
      </div>

      {/* Search and Rows per page */}
      <div className="d-flex justify-content-between mb-3">
        <Form.Select
          style={{ width: "120px" }}
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="Search..."
          style={{ width: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* DataTable */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Address</th>
            <th>Status</th>
            <th style={{ width: "200px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.address}</td>
                <td>{p.status}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewProperty(p._id)}
                  >
                    👁
                  </Button>

                  {/* Edit sirf Admin/Developer */}
                  {(user?.role === "admin" || user?.role === "developer") && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditProperty(p._id)}
                    >
                      ✏
                    </Button>
                  )}

                  {/* Delete sirf Admin/Developer */}
                  {(user?.role === "admin" || user?.role === "developer") && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProperty(p._id)}
                    >
                      🗑
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No Properties Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <span>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)}{" "}
          of {filtered.length} entries
        </span>
        <div>
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="me-2"
          >
            ◀
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="ms-2"
          >
            ▶
          </Button>
        </div>
      </div>
    </div>
  );
}
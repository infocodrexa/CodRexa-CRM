// import React, { useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios";

// export default function PlotList({ plots, propertyId, onPlotUpdated }) {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedPlot, setSelectedPlot] = useState(null);
//   const [formData, setFormData] = useState({
//     plotNo: "",
//     sizeSqFt: "",
//     price: "",
//     status: "Available",
//   });
//   const [isLoading, setIsLoading] = useState(false); // For loading feedback

//   if (!plots || plots.length === 0) {
//     return <p className="text-muted">No plots available.</p>;
//   }

//   // Opens the modal to edit a plot
//   const handleShowModal = (plot) => {
//     setSelectedPlot(plot);
//     setFormData({
//       plotNo: plot.plotNo,
//       sizeSqFt: plot.sizeSqFt,
//       price: plot.price,
//       status: plot.status,
//     });
//     setShowModal(true);
//   };

//   // Closes the modal
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedPlot(null);
//   };

//   // Handles changes in the form inputs
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handles the plot update submission
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedPlot) return;

//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:5000/api/property/${propertyId}/plots/${selectedPlot._id}`,
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       handleCloseModal();
//       onPlotUpdated(); // Refresh the list
//       alert("Plot updated successfully!");
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "An unknown error occurred.";
//       alert(`Failed to update plot: ${errorMsg}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handles the plot deletion
//   const handleDelete = async (plotId) => {
//     if (window.confirm("Are you sure you want to delete this plot?")) {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         await axios.delete(
//           `http://localhost:5000/api/property/${propertyId}/plots/${plotId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         onPlotUpdated(); // Refresh the list
//         alert("Plot deleted successfully!");
//       } catch (error) {
//         const errorMsg = error.response?.data?.message || "An unknown error occurred.";
//         alert(`Failed to delete plot: ${errorMsg}`);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <div className="table-responsive mt-3">
//         <table className="table table-striped table-hover shadow-sm">
//           <thead className="table-dark">
//             <tr>
//               <th>Plot No</th>
//               <th>Size (SqFt)</th>
//               <th>Price</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Created By</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {plots.map((plot) => (
//               <tr key={plot._id}>
//                 <td><strong>{plot.plotNo}</strong></td>
//                 <td>{plot.sizeSqFt}</td>
//                 <td>₹{plot.price.toLocaleString()}</td>
//                 <td>
//                   <span
//                     className={`badge ${
//                       plot.status === "Available"
//                         ? "bg-success"
//                         : plot.status === "Sold"
//                         ? "bg-danger"
//                         : "bg-warning text-dark"
//                     }`}
//                   >
//                     {plot.status}
//                   </span>
//                 </td>
//                 <td>{new Date(plot.createdAt).toLocaleString()}</td>
//                 <td>{plot.user?.name || "Unknown"}</td>
//                 <td>
//                   <Button
//                     variant="primary"
//                     size="sm"
//                     onClick={() => handleShowModal(plot)}
//                     disabled={isLoading}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     className="ms-2"
//                     onClick={() => handleDelete(plot._id)}
//                     disabled={isLoading}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Update Plot Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Plot #{selectedPlot?.plotNo}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleUpdateSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Plot No</Form.Label>
//               <Form.Control type="text" name="plotNo" value={formData.plotNo} onChange={handleFormChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Size (SqFt)</Form.Label>
//               <Form.Control type="number" name="sizeSqFt" value={formData.sizeSqFt} onChange={handleFormChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Price</Form.Label>
//               <Form.Control type="number" name="price" value={formData.price} onChange={handleFormChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Status</Form.Label>
//               <Form.Select name="status" value={formData.status} onChange={handleFormChange}>
//                 <option value="Available">Available</option>
//                 <option value="Sold">Sold</option>
//                 <option value="Booked">Booked</option>
//               </Form.Select>
//             </Form.Group>
//             <div className="d-flex justify-content-end">
//               <Button variant="secondary" onClick={handleCloseModal} disabled={isLoading} className="me-2">
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" disabled={isLoading}>
//                 {isLoading ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }


import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from 'react-toastify'; // react-toastify import karein

// Component 'userRole' prop le raha hai
export default function PlotList({ plots, propertyId, onPlotUpdated, userRole }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [formData, setFormData] = useState({
    plotNo: "",
    sizeSqFt: "",
    price: "",
    status: "Available",
  });
  const [isLoading, setIsLoading] = useState(false); // For loading feedback

  if (!plots || plots.length === 0) {
    return <p className="text-muted">No plots available.</p>;
  }

  // Opens the modal to edit a plot
  const handleShowModal = (plot) => {
    setSelectedPlot(plot);
    setFormData({
      plotNo: plot.plotNo,
      sizeSqFt: plot.sizeSqFt,
      price: plot.price,
      status: plot.status,
    });
    setShowModal(true);
  };

  // Closes the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlot(null);
  };

  // Handles changes in the form inputs
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the plot update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlot) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/property/${propertyId}/plots/${selectedPlot._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleCloseModal();
      onPlotUpdated(); // Refresh the list
      toast.success("Plot updated successfully!"); // Alert replaced with toast
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An unknown error occurred.";
      toast.error(`Failed to update plot: ${errorMsg}`); // Alert replaced with toast
    } finally {
      setIsLoading(false);
    }
  };

  // Handles the plot deletion
  const handleDelete = async (plotId) => {
    if (window.confirm("Are you sure you want to delete this plot?")) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:5000/api/property/${propertyId}/plots/${plotId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onPlotUpdated(); // Refresh the list
        toast.success("Plot deleted successfully!"); // Alert replaced with toast
      } catch (error) {
        const errorMsg = error.response?.data?.message || "An unknown error occurred.";
        toast.error(`Failed to delete plot: ${errorMsg}`); // Alert replaced with toast
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="table-responsive mt-3">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Plot No</th>
              <th>Size (SqFt)</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plots.map((plot) => (
              <tr key={plot._id}>
                <td><strong>{plot.plotNo}</strong></td>
                <td>{plot.sizeSqFt}</td>
                <td>₹{plot.price.toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      plot.status === "Available"
                        ? "bg-success"
                        : plot.status === "Sold"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {plot.status}
                  </span>
                </td>
                <td>{new Date(plot.createdAt).toLocaleString()}</td>
                <td>{plot.user?.name || "Unknown"}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleShowModal(plot)}
                    disabled={isLoading}
                  >
                    Update
                  </Button>

                  {/* 👇 DELETE BUTTON AB SIRF ADMIN KO DIKHEGA 👇 */}
                  {userRole === 'admin' && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleDelete(plot._id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Plot Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        {/* ... Modal content remains the same ... */}
        <Modal.Header closeButton>
          <Modal.Title>Update Plot #{selectedPlot?.plotNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Plot No</Form.Label>
              <Form.Control type="text" name="plotNo" value={formData.plotNo} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Size (SqFt)</Form.Label>
              <Form.Control type="number" name="sizeSqFt" value={formData.sizeSqFt} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleFormChange}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Booked">Booked</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} disabled={isLoading} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
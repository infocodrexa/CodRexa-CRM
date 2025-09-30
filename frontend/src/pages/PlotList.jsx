import React from "react";

export default function PlotList({ plots }) {
  if (!plots || plots.length === 0) {
    return <p className="text-muted">No plots available.</p>;
  }

  return (
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
          </tr>
        </thead>
        <tbody>
          {plots.map((plot) => (
            <tr key={plot._id}>
              <td>
                <strong>{plot.plotNo}</strong>
              </td>
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
              <td>{plot.createdBy?.name || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

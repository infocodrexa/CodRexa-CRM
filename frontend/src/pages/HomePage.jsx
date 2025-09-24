import React from "react";

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to CRM</h2>
      <div className="row g-3 mt-3">
        <div className="col-sm-4"><div className="card p-3">Total Leads: --</div></div>
        <div className="col-sm-4"><div className="card p-3">Closed Deals: --</div></div>
        <div className="col-sm-4"><div className="card p-3">Revenue: --</div></div>
      </div>
    </div>
  );
}

import React from "react";

export default function PropertyInfo({ property }) {
  return (
    <div className="card p-3">
      <h3>Property Details</h3>
      <p>
        Name:<strong> {property.name}</strong>
      </p>
      <p>
        Address:<strong> {property.address} </strong>
      </p>
    </div>
  );
}
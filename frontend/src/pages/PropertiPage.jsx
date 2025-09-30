import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function PropertiesPage() {
  return (
    <div className="p-4">
      <h2>Properties Dashboard</h2>

      {/* Optional submenu */}
      {/* <nav className="mb-4">
        <NavLink to="add" className="me-3">
          Add Property
        </NavLink>
        <NavLink to="list" className="me-3">
          Property List
        </NavLink>
        <NavLink to="detail">Property Detail</NavLink>
      </nav> */}

      {/* Nested routes render here */}
      <Outlet />
    </div>
  );
}
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { menuConfig } from "../config/menuConfig";
import { ROLES } from "../constants/roles.js";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role || ROLES.USER;
  const menu = menuConfig[role] || menuConfig[ROLES.USER];

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{ width: 250, minHeight: "100vh" }}
    >
      {/* Logo / Title */}
      <h3 className="fw-bold text-primary mb-4 text-center">CodRexa CRM</h3>

      {/* User Info */}
      <div className="me-3 text-white">
        <span className="fw-semibold text-white">{user?.username}</span>
      </div>
      <div className="fw-semibold mt-2 mb-3 text-white">
        Role: <span className="fw-semibold small text-white">{role}</span>
      </div>

      {/* Navigation */}
      <ul className="nav flex-column gap-2">
        {menu.map((m) => (
          <li key={m.label || m.to}>
            {m.children ? (
              <>
                <div
                  onClick={() => toggleMenu(m.label)}
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded nav-link text-light"
                  style={{ cursor: "pointer" }}
                >
                  {m.icon} {m.label}
                </div>
                {openMenu === m.label && (
                  <ul className="nav flex-column ms-3 mt-1">
                    {m.children.map((child) => (
                      <li key={child.to}>
                        <NavLink
                          to={child.to}
                          end
                          className={({ isActive }) =>
                            `d-flex align-items-center gap-2 px-3 py-2 rounded nav-link ${
                              isActive ? "bg-primary text-white" : "text-light"
                            }`
                          }
                        >
                          {child.icon} {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={m.to}
                end
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 px-3 py-2 rounded nav-link ${
                    isActive ? "bg-primary text-white" : "text-light"
                  }`
                }
              >
                {m.icon} {m.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-auto text-center small text-secondary">
        <button className="btn btn-outline-primary btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

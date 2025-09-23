import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import API from "../utils/api.js";

const socket = io("http://localhost:5000/api"); // backend URL

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await API.get("/notifications");
        console.log("Notifications:", data.notifications);
        setNotifications(data.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err.response || err);
      }
    };

    fetchNotifications();
  }, [user]);

  // Real-time notifications
  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off("receiveNotification");
  }, [user]);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="d-flex justify-content-between align-items-center bg-white border-bottom p-2">
      <div className="ps-3">
        <strong>Dashboard</strong>
      </div>

      <div
        className="d-flex align-items-center pe-3 position-relative"
        ref={dropdownRef}
      >
        <FaBell
          size={22}
          className="text-dark cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        {notifications.some((n) => !n.isRead) && (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle"></span>
        )}

        {open && (
          <div
            className="position-absolute bg-white shadow border rounded"
            style={{
              width: 300,
              zIndex: 1000,
              top: "100%",
              right: 0,
              marginTop: "0.5rem",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <div className="p-2 border-bottom fw-bold">Notifications</div>
            {notifications.length === 0 && (
              <div className="p-2 text-muted">No notifications</div>
            )}
            <ul className="list-group list-group-flush">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`list-group-item d-flex justify-content-between align-items-start ${
                    n.isRead ? "" : "fw-bold"
                  }`}
                >
                  <div
                    onClick={() => markAsRead(n._id)}
                    className="me-2"
                    style={{ cursor: "pointer" }}
                  >
                    {n.title && <div>{n.title}</div>}
                    <div className="small">{n.message}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteNotification(n._id)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

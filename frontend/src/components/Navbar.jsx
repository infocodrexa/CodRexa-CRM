// Navbar.jsx - Modernized, Fixed, and Feature-Complete
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaBell,
  FaTrashAlt,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import { io } from "socket.io-client";
import API from "../utils/api.js";
import { sendNotification } from "../api/notifications";

// Component for displaying temporary messages
const FlashMessage = ({ message, type, setMessage }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3500); // Message disappears after 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) return null;

  const alertClass = type === "success" ? "alert-success" : "alert-danger";
  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade show shadow-sm`}
      role="alert"
      style={{
        position: "fixed",
        top: "15px",
        right: "15px",
        zIndex: 2000,
        minWidth: "250px",
      }}
    >
           {" "}
      <strong className="me-2">
        {type === "success" ? <FaCheck /> : <FaExclamationCircle />}
      </strong>
            {message}     {" "}
      <button
        type="button"
        className="btn-close"
        onClick={() => setMessage(null)}
        aria-label="Close"
      ></button>
         {" "}
    </div>
  );
};

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [broadcast, setBroadcast] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [flashType, setFlashType] = useState("success");
  const [isSending, setIsSending] = useState(false); // State for debouncing button
  const dropdownRef = useRef();

  const userId = user?._id;

  const socket = io("http://localhost:5000", {
    auth: { token: localStorage.getItem("token") },
  });

  const showFlash = (msg, type) => {
    setFlashMessage(msg);
    setFlashType(type);
  }; // Flatten tree helper (Robust ID checking for _id or id)

  const flattenTree = (node) => {
    if (!node) return [];
    const id = node._id || node.id;
    let arr = [{ _id: id, username: node.username, role: node.role }];
    if (node.children) {
      node.children.forEach((child) => {
        arr = arr.concat(flattenTree(child));
      });
    }
    return arr;
  };

  // ----------------------------------------------------------------------
  // Fetch Data (Robust Checks for Refresh/Loading)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // Wait until user object is fully populated and has an _id.
    if (!user || !user._id) {
      setAllUsers([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data } = await API.get("/notifications");
        const validNotifications = data.notifications.filter((n) => n._id);
        setNotifications(validNotifications);
      } catch (err) {
        console.error(
          "Error fetching notifications:",
          err.response?.data || err
        );
      }
    };

    const fetchTree = async () => {
      try {
        const url =
          user.role === "admin"
            ? `/auth/${user._id}/tree`
            : `/users/${user._id}/tree`;
        const { data } = await API.get(url);
        if (user.role === "admin") {
          const flattenedUsers = flattenTree(data.tree);
          const validUsers = flattenedUsers.filter(
            (u) => u._id && String(u._id).trim() !== "undefined"
          );
          setAllUsers(validUsers);
        }
      } catch (err) {
        console.error("Failed to fetch tree:", err.response?.data || err);
      }
    };

    fetchNotifications();
    fetchTree();
  }, [user]);

  // ----------------------------------------------------------------------
  // Notification Handlers
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!userId) return;
    socket.emit("joinRoom", { type: "user", id: userId });
    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => socket.off("receiveNotification");
  }, [userId, socket]);

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
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);

    if (unreadIds.length === 0) return;

    try {
      await API.put("/notifications/mark-all-read", { ids: unreadIds });

      setNotifications((prev) =>
        prev.map((n) =>
          unreadIds.includes(n._id) ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking all as read:", err.response?.data || err);
      unreadIds.forEach((id) => markAsRead(id));
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showFlash("Notification deleted.", "success");
    } catch (err) {
      console.error("Error deleting notification:", err);
      showFlash("Failed to delete notification.", "danger");
    }
  };

  // ----------------------------------------------------------------------
  // Notification Sending Logic (Single/Group/Broadcast Logic)
  // ----------------------------------------------------------------------

  const handleUserCheckbox = (id) => {
    if (!id || String(id).trim() === "undefined") {
      return;
    }
    const stringId = String(id);
    setSelectedUsers((prev) => {
      const newState = prev.includes(stringId)
        ? prev.filter((i) => i !== stringId)
        : [...prev, stringId];
      return newState;
    });
  };

  const handleSendNotification = async () => {
    if (isSending) return; // Prevent double submit

    const allTreeUserIds = allUsers
      .map((u) => String(u._id))
      .filter((id) => id && id !== "undefined");

    const targetUserIds = broadcast
      ? allTreeUserIds
      : selectedUsers.filter((id) => id && String(id).trim() !== "undefined");

    if (targetUserIds.length === 0) {
      showFlash("Error: Select users or check broadcast.", "danger");
      return;
    }

    // 🛑 CORE LOGIC: Set payload fields based on target count
    const payload = {
      title,
      message,
      // CRITICAL FIX: Set broadcast to FALSE for all targeted sends
      broadcast: false,
      sentToUsers: [],
      sentToGroups: [],
    };

    if (targetUserIds.length === 1) {
      // Single user selected: Direct message
      payload.sentToUsers = targetUserIds;
    } else {
      // Multiple users selected OR Broadcast selected (to tree users): Group Message
      payload.sentToGroups = targetUserIds;
    }
    // 🛑 END CORE LOGIC 🛑

    setIsSending(true);

    try {
      await sendNotification(payload);
      showFlash("Notification sent successfully!", "success");
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
      setBroadcast(false);
    } catch (err) {
      console.error("Failed to send notification:", err.response?.data || err);
      showFlash(
        `Failed to send: ${err.response?.data?.message || err.message}`,
        "danger"
      );
    } finally {
      setIsSending(false);
    }
  }; // Close dropdown when clicking outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!userId) return <div>Loading...</div>;

  // ----------------------------------------------------------------------
  // JSX Rendering
  // ----------------------------------------------------------------------
  return (
    <>
           {" "}
      <FlashMessage
        message={flashMessage}
        type={flashType}
        setMessage={setFlashMessage}
      />
                 {" "}
      <nav className="d-flex justify-content-between align-items-center bg-white border-bottom p-3 shadow-sm">
               {" "}
        <div className="ps-3">
                    <strong className="fs-5 text-primary">Dashboard</strong>   
             {" "}
        </div>
                       {" "}
        <div
          className="d-flex align-items-center pe-3 position-relative"
          ref={dropdownRef}
        >
                   {" "}
          <FaBell
            size={24}
            className="text-dark cursor-pointer transition-all hover-scale"
            style={{ transition: "transform 0.1s", cursor: "pointer" }}
            onClick={() => {
              setOpen((prevOpen) => {
                const newState = !prevOpen;
                if (newState) {
                  markAllAsRead();
                }
                return newState;
              });
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
                   {" "}
          {notifications.some((n) => !n.isRead) && (
            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
          )}
                   {" "}
          {open && (
            <div
              className="position-absolute bg-white shadow-lg border rounded-lg"
              style={{
                width: 350,
                zIndex: 1000,
                top: "calc(100% + 10px)",
                right: 0,
                maxHeight: "500px",
                overflowY: "auto",
                border: "1px solid #eee",
              }}
            >
                           {" "}
              <div className="p-3 border-bottom fw-bold bg-light text-secondary">
                Notifications ({notifications.filter((n) => !n.isRead).length}{" "}
                Unread)
              </div>
                                         {" "}
              {notifications.length === 0 && (
                <div className="p-3 text-muted text-center">
                  No notifications yet.
                </div>
              )}
                                         {" "}
              <ul className="list-group list-group-flush">
                               {" "}
                {notifications.map((n) => (
                  <li
                    key={n._id || Math.random()}
                    className={`list-group-item d-flex justify-content-between align-items-center p-3 transition-all ${
                      n.isRead ? "text-muted bg-white" : "fw-bold bg-light-blue"
                    }`}
                    style={{
                      transition: "background-color 0.1s",
                      borderLeft: n.isRead ? "none" : "3px solid #0d6efd",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = n.isRead
                        ? "#f8f9fa"
                        : "#e6f0ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = n.isRead
                        ? "#fff"
                        : "#f8f9fa")
                    }
                  >
                                       {" "}
                    <div
                      onClick={() => markAsRead(n._id)}
                      style={{ cursor: "pointer", flexGrow: 1 }}
                    >
                                           {" "}
                      {n.title && (
                        <div
                          className="mb-1 text-truncate"
                          style={{ maxWidth: "250px", fontSize: "1rem" }}
                        >
                          {n.title}
                        </div>
                      )}
                                           {" "}
                      <div
                        className="small text-wrap"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {n.message}
                      </div>
                                         {" "}
                    </div>
                                       {" "}
                    <button
                      className="btn btn-sm btn-outline-danger ms-3 rounded-circle p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n._id);
                      }}
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                                            <FaTrashAlt size={12} />           
                             {" "}
                    </button>
                                     {" "}
                  </li>
                ))}
                             {" "}
              </ul>
                           {" "}
              {user.role === "admin" && (
                <div className="p-3 border-top bg-light">
                                   {" "}
                  <h6 className="mb-2 text-primary">Send New Notification</h6>
                                   {" "}
                  <input
                    type="text"
                    placeholder="Title"
                    className="form-control form-control-sm mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                                   {" "}
                  <textarea
                    placeholder="Message"
                    className="form-control form-control-sm mb-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="2"
                  />
                                                     {" "}
                  <div
                    className="border rounded p-2 mb-2 bg-white"
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                                       {" "}
                    <p className="small text-muted mb-1">
                      Select Recipients ({allUsers.length} users)
                    </p>
                                       {" "}
                    {allUsers.map((u) => (
                      <div key={u._id} className="form-check small">
                                               {" "}
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`user-${u._id}`}
                          checked={selectedUsers.includes(String(u._id))}
                          onChange={() => handleUserCheckbox(u._id)}
                          disabled={broadcast}
                        />
                                               {" "}
                        <label
                          className="form-check-label"
                          htmlFor={`user-${u._id}`}
                        >
                                                    {u.username} ({u.role})    
                                             {" "}
                        </label>
                                             {" "}
                      </div>
                    ))}
                                     {" "}
                  </div>
                                                      {/* Broadcast checkbox */}
                                   {" "}
                  <div className="form-check mb-2">
                                       {" "}
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="broadcastCheckbox"
                      checked={broadcast}
                      onChange={(e) => {
                        setBroadcast(e.target.checked);
                        if (e.target.checked) {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                                       {" "}
                    <label
                      htmlFor="broadcastCheckbox"
                      className="form-check-label fw-bold"
                    >
                      Broadcast to all in tree
                    </label>
                                     {" "}
                  </div>
                                   {" "}
                  <button
                    className="btn btn-primary w-100 btn-sm"
                    onClick={handleSendNotification}
                  >
                    Send Notification
                  </button>
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </nav>
         {" "}
    </>
  );
}

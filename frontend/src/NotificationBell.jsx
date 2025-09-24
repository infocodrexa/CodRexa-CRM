import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getNotifications, markNotificationAsRead } from "./api";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
const socket = io(API_BASE, { transports: ["websocket", "polling"] });

const NotificationBell = ({ userId, token }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!userId) return;
    const data = await getNotifications(token, userId);
    const notifs = data.notifications || [];
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.isRead).length);
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id, token);
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    fetchNotifications();

    if (userId) {
      socket.emit("joinRoom", userId);
      const handler = (n) => {
        setNotifications(prev => [{ ...n, isRead: false }, ...prev]);
        setUnreadCount(prev => prev + 1);
      };
      socket.on("receiveNotification", handler);

      return () => socket.off("receiveNotification", handler);
    }
  }, [userId]);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "30px",
          right: 0,
          border: "1px solid #ccc",
          background: "#fff",
          width: "300px",
          maxHeight: "400px",
          overflowY: "auto",
          zIndex: 1000
        }}>
          {notifications.length === 0 && <p style={{ padding: "10px" }}>No notifications</p>}
          {notifications.map(n => (
            <div
              key={n._id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                background: n.isRead ? "#f9f9f9" : "#e6f7ff",
              }}
            >
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              {!n.isRead && (
                <button onClick={() => handleMarkAsRead(n._id)}>Mark as Read</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

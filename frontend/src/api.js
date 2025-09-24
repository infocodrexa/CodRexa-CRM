// src/api.js
const API = import.meta.env.VITE_API_URL;

export const getNotifications = async (token) => {
  const res = await fetch(`${API}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const markNotificationAsRead = async (id, token) => {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

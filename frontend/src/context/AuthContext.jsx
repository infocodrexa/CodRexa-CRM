import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const saveAuth = ({ token, user }) => {
    console.log("Saving token to localStorage:", token, "user:", user);

    // Ensure user has _id and role
    const safeUser = {
      _id: user._id || user.id,
      username: user.username,
      role: user.role || "user",
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
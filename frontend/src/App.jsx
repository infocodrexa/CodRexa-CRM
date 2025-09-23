import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import DashboardLayout from "./components/DashboardLayout";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import PropertiesPage from "./pages/PropertiesPage";
import NotesPage from "./pages/NotesPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="notes" element={<NotesPage />} />
      </Route>

      <Route path="*" element={<div className="p-4">404 - Not found</div>} />
    </Routes>
  );
}

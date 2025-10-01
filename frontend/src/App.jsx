import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import VerifyOTPPage from "./pages/VerifyOTPPage";

import DashboardLayout from "./components/DashboardLayout";

import HomePage from "./pages/HomePage";

import UsersPage from "./pages/UsersPage";

import PropertiPage from "./pages/PropertiPage";

import AddPropertyPage from "./pages/AddProperty";

import PropertyListPage from "./pages/PropertiesPage";

import PropertyDetailPage from "./pages/PropertyDetail";

import EditProperty from "./pages/EditProperty";

import NotesPage from "./pages/NotesPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>

    <ToastContainer position="top-right" autoClose={5000} />
      
    <Routes>
      {/* Root redirect */}

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public routes */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/verify-otp" element={<VerifyOTPPage />} />

      {/* Protected dashboard */}

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard */}

        <Route index element={<HomePage />} />

        {/* Users */}

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["developer", "admin", "manager"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Properties nested */}

        <Route
          path="properties/*"
          element={
            <ProtectedRoute
              allowedRoles={[
                "developer",

                "admin",

                "manager",

                "executive",

                "sales_executive",

                "user",
              ]}
            >
              <PropertiPage />
            </ProtectedRoute>
          }
        >
          <Route path="add" element={<AddPropertyPage />} />

          <Route path="list" element={<PropertyListPage />} />

          <Route path="edit/:id" element={<EditProperty editMode={true} />} />

          <Route path=":id" element={<PropertyDetailPage />} />
        </Route>

        {/* Notes */}

        <Route
          path="notes"
          element={
            <ProtectedRoute
              allowedRoles={["developer", "admin", "executive", "user"]}
            >
              <NotesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 fallback */}

      <Route path="*" element={<div className="p-4">404 - Not Found</div>} />
    </Routes>
    </>
  );
}

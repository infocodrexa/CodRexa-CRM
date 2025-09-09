import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Dashboard from "./pages/Dashboard";
import Forbidden from "./pages/Forbidden";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected route with role-based access */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={["Developer", "Admin", "Manager", "User"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

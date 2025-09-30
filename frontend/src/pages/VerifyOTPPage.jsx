import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { AuthContext } from "../context/AuthContext";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveAuth } = useContext(AuthContext);

  const handleVerify = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const userId = localStorage.getItem("loginUserId"); // userId from step 1
    const res = await API.post("/auth/verify-otp", { userId, otp });

    saveAuth({
      token: res.data.accessToken,
      user: res.data.user,
    });

    console.log("Login response:", res.data);
    console.log("Token saved:", localStorage.getItem("token"));

    navigate("/dashboard"); // redirect to dashboard
  } catch (err) {
    console.error("OTP verification failed:", err.response?.data || err);
    alert(err?.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div className="card p-4" style={{ width: 420 }}>
        <h4 className="mb-3">Verify OTP (Step 2)</h4>
        <form onSubmit={handleVerify}>
          <input
            className="form-control mb-2"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { setAccessToken } from "../api/axios";

export default function VerifyOTP(){
  const loc = useLocation();
  const nav = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [otp,setOtp]=useState("");
  const userId = loc.state?.userId;
  const [err,setErr]=useState("");

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", { userId, otp });
      const token = res.data.accessToken;
      setAccessToken(token);
      // optional: get profile
      const me = await api.get("/auth/me");
      setUser(me.data.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "OTP failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Enter OTP</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit OTP" required/>
      <button type="submit">Verify & Login</button>
    </form>
  );
}

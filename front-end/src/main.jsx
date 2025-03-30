import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import Signup from "./pages/SignUp/Signup";
import QRGenerate from './pages/2FA/QRGenerate';
import OTPverify from './pages/2FA/VerifyOTP';
import TwoFAProcess from './pages/2FA/2faprocess';
import Dashboard from './pages/AdminDashboard/Dashboard';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/qrgenerate" element={<QRGenerate />} />
        <Route path="/verifyOTP" element={<OTPverify />} />
        <Route path="/2faprocess" element={<TwoFAProcess />} />
        
        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
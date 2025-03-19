import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TwoFASetup from "./pages/TwoFASetup";
import TwoFAVerify from "./pages/TwoFAVerify";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/2fa-setup" element={<TwoFASetup />} />
        <Route path="/2fa-verify" element={<TwoFAVerify />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
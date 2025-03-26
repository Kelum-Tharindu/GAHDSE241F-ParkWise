import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/Signup";
import QRGenerate from './pages/2FA/QRGenerate';
import OTPverify from './pages/2FA/VerifyOTP';
import TwoFAProcess from './pages/2FA/2faprocess';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/qrgenerate" element={<QRGenerate />} />
        <Route path="/verifyOTP" element={<OTPverify />} />
        <Route path="/2faprocess" element={<TwoFAProcess />} />
      </Routes>
      
    </Router>
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";  // Keep App as the root component
// import "./index.css";  // Ensure Tailwind is imported

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
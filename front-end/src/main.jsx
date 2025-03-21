import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/Signup";
import TwoFASetup from "./pages/2FA/TwoFASetup";
import TwoFAVerify from "./pages/2FA/TwoFAVerify";
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

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";  // Keep App as the root component
// import "./index.css";  // Ensure Tailwind is imported

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
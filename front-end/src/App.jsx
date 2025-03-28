// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Signup from './pages/SignUp/Signup';
// import Login from './pages/Login/Login';
// import QRGenerate from './pages/2FA/QRGenerate';
// import OTPverify from './pages/2FA/VerifyOTP';
// import TwoFAProcess from './pages/2FA/2faprocess';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/qrgenerate" element={<QRGenerate />} />
//         <Route path="/verifyOTP" element={<OTPverify />} />
//         <Route path="/2faprocess" element={<TwoFAProcess />} />
//         <Route path="/" element={<Login />} /> {/* Default route */}
        
        
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// import Test from "./pages/test";  // Import the Test component

// function App() {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <Test />
//     </div>
//   );
// }

// export default App;


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/SignUp/Signup';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import QRGenerate from './pages/2FA/QRGenerate';
import OTPverify from './pages/2FA/VerifyOTP';
import TwoFAProcess from './pages/2FA/2faprocess';
import "./index.css";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/qrgenerate" element={<QRGenerate />} />
        <Route path="/verifyOTP" element={<OTPverify />} />
        <Route path="/2faprocess" element={<TwoFAProcess />} />

        {/* Main Application Routes (Protected) */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
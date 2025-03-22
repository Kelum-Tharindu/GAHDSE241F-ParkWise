import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/SignUp/Signup';
import Login from './pages/Login/Login';
import QRGenerate from './pages/2FA/QRGenerate';
import OTPverify from './pages/2FA/VerifyOTP';
import TwoFAProcess from './pages/2FA/2faprocess';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/qrgenerate" element={<QRGenerate />} />
        <Route path="/verifyOTP" element={<OTPverify />} />
        <Route path="/2faprocess" element={<TwoFAProcess />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
        
      </Routes>
    </Router>
  );
};

export default App;


// import Test from "./pages/test";  // Import the Test component

// function App() {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <Test />
//     </div>
//   );
// }

// export default App;

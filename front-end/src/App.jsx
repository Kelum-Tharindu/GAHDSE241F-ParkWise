import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/SignUp/Signup';
import Login from './pages/Login/Login';
import QRGenerate from './pages/2FA/QRGenerate';
import OTPverify from './pages/2FA/VerifyOTP';
import TwoFAProcess from './pages/2FA/2faprocess';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/AdminDashboard/Dashboard';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This would typically be set after successful login/2FA verification
  // For demo purposes, we'll just check if we're on a dashboard route
  const checkAuth = () => {
    return isAuthenticated || window.location.pathname === '/dashboard';
  };

  const PrivateRoute = ({ children }) => {
    return checkAuth() ? (
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/qrgenerate" element={<QRGenerate />} />
        <Route path="/verifyOTP" element={<OTPverify setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/2faprocess" element={<TwoFAProcess setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Default routes */}
        <Route
          path="/"
          element={
            checkAuth() ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to={checkAuth() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
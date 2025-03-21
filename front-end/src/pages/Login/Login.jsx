import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      if (response.data.message === "Enter OTP") {
        // Show OTP field if 2FA is enabled
        setShowOtpField(true);
        setUserId(response.data.userId); // Save userId for OTP verification
      } else {
        // Save token and role to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        // Redirect based on role
        if (response.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error logging in");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        userId,
        otp,
      });

      // Save token and role to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Redirect based on role
      if (response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error verifying OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl p-10 rounded-2xl w-full max-w-lg border border-white/20">
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg mb-4">
          Welcome to ParkWise!
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!showOtpField ? (
          <form onSubmit={handleLogin}>
            <InputField
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <Button
              type="submit"
              className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <InputField
              label="OTP"
              type="text"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <Button
              type="submit"
              className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              Verify OTP
            </Button>
          </form>
        )}

        <p className="text-center text-gray-200 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-white font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
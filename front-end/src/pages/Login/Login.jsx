import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaLinkedin, FaGoogle, FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      if (response.data.message === "Enter OTP") {
        alert("2FA is enabled. Please enter your OTP.");
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        rememberMe 
          ? localStorage.setItem('rememberedEmail', formData.email) 
          : localStorage.removeItem('rememberedEmail');
        window.location.href = response.data.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error logging in. Please try again.");
    }
  };

  const handleGoogleLogin = () => window.location.href = "http://localhost:5000/api/auth/google";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-emerald-800 text-white px-10 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">ParkWise</div>
          <div className="flex space-x-8">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/about" className="hover:text-gray-300">About us</Link>
            <Link to="/contact" className="hover:text-gray-300">Contact us</Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-160px)]">
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4">Welcome back! Please login to your account.</h2>
            
            {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-3">
                <label className="block text-gray-700 mb-1 text-sm">Email Address</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="hakeem@digital.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 text-sm">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="***********"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-1 block text-gray-700 text-sm">Remember Me</label>
                </div>
                <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-sm transition"
              >
                Login
              </button>
            </form>

            <div className="mb-4">
              <Link 
                to="/signup" 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-sm transition block text-center"
              >
                Sign Up
              </Link>
            </div>

            <div className="text-center">
              <p className="text-gray-500 mb-2 text-xs">Or login with</p>
              <div className="flex justify-center space-x-4">
                <button onClick={handleGoogleLogin} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                  <FaGoogle className="text-gray-700 text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={'/src/assets/login1.png'} 
            alt="ParkWise Parking System" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
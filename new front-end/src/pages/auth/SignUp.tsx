import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  password: string;
  email: string;
  role: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    role: 'user',
  });

  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || "Error registering user. Please try again.");
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

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
            <h2 className="text-2xl font-bold mb-4">Create your account</h2>
            <p className="text-gray-600 mb-6 text-sm">Join us to start managing your parking needs.</p>

            {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            <button 
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded text-sm mb-4 hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-red-500" />
              Sign up with Google
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-xs">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-3">
                <label className="block text-gray-700 mb-1 text-sm">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john_doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 text-sm">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
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

              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="user">Regular User</option>
                  <option value="landowner">Land Owner</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-sm transition mb-4"
              >
                Create Account
              </button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
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

export default Signup;

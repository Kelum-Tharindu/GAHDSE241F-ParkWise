import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log('ForgotPassword component mounted');
  console.log('Current state:', { email, message, error, isLoading });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
    
    setIsLoading(true);
    setError('');
    setMessage('');
    console.log('State reset for new submission');

    try {
      console.log('Attempting to send request to /api/users/forgot-password');
      const response = await axios.post<{ message: string }>('/api/users/forgot-password', { email });
      
      console.log('Server response:', response.data);
      setMessage(response.data.message);
      console.log('Success message set:', response.data.message);

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Error occurred:', axiosError);
      
      const errorMessage = axiosError.response?.data?.message || 'Error sending reset email';
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);

      if (axiosError.response) {
        console.error('Server responded with:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
          headers: axiosError.response.headers
        });
      } else if (axiosError.request) {
        console.error('No response received:', axiosError.request);
      } else {
        console.error('Request setup error:', axiosError.message);
      }
    } finally {
      console.log('Request completed, setting isLoading to false');
      setIsLoading(false);
      console.log('Final state:', { email, message, error, isLoading });
    }
  };

  const handleLoginRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log('Redirecting to login page');
    navigate('/login');
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
            <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>
            
            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-6">
                <label className="block text-gray-700 mb-1 text-sm">Email Address</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      console.log('Email input changed:', e.target.value);
                      setEmail(e.target.value);
                    }}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-sm transition"
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-blue-600 hover:underline text-sm"
                onClick={handleLoginRedirect}
              >
                Remember your password? Login here
              </Link>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={'/src/assets/login1.png'} 
            alt="ParkWise Parking System" 
            className="w-full h-full object-cover"
            onError={() => console.error('Failed to load image at /src/assets/login1.png')}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

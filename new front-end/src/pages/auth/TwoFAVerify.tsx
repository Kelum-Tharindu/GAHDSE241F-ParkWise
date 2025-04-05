// src/components/TwoFAVerify.tsx
import React from 'react';

const TwoFAVerify: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Verify OTP</h1>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter the OTP from your app"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFAVerify;

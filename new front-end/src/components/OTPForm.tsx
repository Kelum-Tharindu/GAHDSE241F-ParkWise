import React, { ChangeEvent } from 'react';
import { FaArrowRight } from 'react-icons/fa';

interface OTPFormProps {
  otp: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  isLoading: boolean;
}

const OTPForm: React.FC<OTPFormProps> = ({ otp, onChange, onVerify, isLoading }) => {
  return (
    <>
      <div className="w-full mb-4">
        <input
          type="text"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          required
          maxLength={6}
        />
      </div>
      <button
        type="button"
        onClick={onVerify}
        className="w-full bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Continue"} <FaArrowRight />
      </button>
    </>
  );
};

export default OTPForm;



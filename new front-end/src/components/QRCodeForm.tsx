import React, { FormEvent, ChangeEvent } from 'react';
import { FaQrcode } from 'react-icons/fa';

interface QRCodeFormProps {
  userId: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({ userId, onChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-4">
        <input
          type="text"
          name="userId"
          placeholder="Enter your User ID"
          value={userId}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? "Generating QR Code..." : "Generate QR Code"} <FaQrcode />
      </button>
    </form>
  );
};

export default QRCodeForm;

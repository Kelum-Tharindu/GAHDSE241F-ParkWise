// import React, { FormEvent, ChangeEvent } from 'react';
// import { FaQrcode } from 'react-icons/fa';

// interface QRCodeFormProps {
//   userId: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   onSubmit: (e: FormEvent<HTMLFormElement>) => void;
//   isLoading: boolean;
// }

// const QRCodeForm: React.FC<QRCodeFormProps> = ({ userId, onChange, onSubmit, isLoading }) => {
//   return (
//     <form onSubmit={onSubmit} className="w-full">
//       <div className="mb-4">
//         <input
//           type="text"
//           name="userId"
//           placeholder="Enter your User ID"
//           value={userId}
//           onChange={onChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
//           required
//         />
//       </div>
//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2"
//         disabled={isLoading}
//       >
//         {isLoading ? "Generating QR Code..." : "Generate QR Code"} <FaQrcode />
//       </button>
//     </form>
//   );
// };

// export default QRCodeForm;


import React, { FormEvent, ChangeEvent } from 'react';
import { FaQrcode } from 'react-icons/fa';

interface QRCodeFormProps {
  userId: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: string;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({ 
  userId, 
  onChange, 
  onSubmit, 
  isLoading,
  error 
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          User ID
        </label>
        <input
          type="text"
          id="userId"
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
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            Generate QR Code <FaQrcode />
          </>
        )}
      </button>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      
      <p className="mt-4 text-sm text-gray-600">
        This will generate a QR code that you can scan with your authenticator app to enable two-factor authentication.
      </p>
    </form>
  );
};

export default QRCodeForm;

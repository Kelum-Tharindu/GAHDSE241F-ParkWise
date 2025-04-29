// import React, { useState, FormEvent} from 'react';
// import axios from 'axios';
// import QRCodeForm from '@/components/QRCodeForm';
// import OTPForm from '@/components/OTPForm';

// const TwoFAFlow: React.FC = () => {
//   const [userId, setUserId] = useState('');
//   const [qrCode, setQrCode] = useState('');
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGenerateQR = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/setup-2fa", { userId });
//       if (response.data.qrCode) {
//         setQrCode(response.data.qrCode);
//       }
//     } catch (error: any) {
//       setError(error.response?.data?.message || "Error generating QR code. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     setError('');
//     setSuccess('');
//     setIsLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/verify-and-enable-2fa", {
//         userId,
//         otp
//       });
//       if (response.data.message === "2FA enabled successfully") {
//         setSuccess("2FA enabled successfully! Check your email for backup codes.");
//         setQrCode('');
//         setOtp('');
//       }
//     } catch (error: any) {
//       setError(error.response?.data?.message || "Error verifying OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
//       <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-md flex flex-col items-center p-8">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Scan QR code</h1>
//         <p className="text-sm text-center text-gray-600 mb-6">Scan this QR code in-app to verify a device.</p>

//         {qrCode ? (
//           <div className="flex flex-col items-center justify-center mb-6">
//             <img src={qrCode} alt="QR Code" className="w-48 h-48 mb-4" />
//           </div>
//         ) : (
//           <QRCodeForm
//             userId={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             onSubmit={handleGenerateQR}
//             isLoading={isLoading}
//           />
//         )}

//         <p className="text-sm text-gray-600 mb-2">or enter the code manually</p>
//         <div className="text-lg font-mono text-gray-800 bg-gray-100 p-2 rounded-lg mb-6">HLA8G4L1B9ZX4</div>

//         {qrCode && (
//           <OTPForm
//             otp={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             onVerify={handleVerifyOTP}
//             isLoading={isLoading}
//           />
//         )}

//         {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
//         {success && <p className="text-green-500 text-center mb-4 text-sm">{success}</p>}
//       </div>
//     </div>
//   );
// };

// export default TwoFAFlow;


import React, { useState, FormEvent } from 'react';
import axios from 'axios';

// QRCodeForm Component
const QRCodeForm: React.FC<{
  userId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}> = ({ userId, onChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="w-full mb-6">
      <div className="mb-4">
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          User ID
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your user ID"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        Generate QR Code
      </button>
    </form>
  );
};

// OTPForm Component
const OTPForm: React.FC<{
  otp: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  isLoading: boolean;
}> = ({ otp, onChange, onVerify, isLoading }) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
          Verification Code
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the 6-digit code"
          required
        />
      </div>
      <button
        type="button"
        onClick={onVerify}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        Verify Code
      </button>
    </div>
  );
};

const TwoFAFlow: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  const handleGenerateQR = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/setup-2fa", { userId });
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
        // Extract secret key from the QR code URL if needed
        const qrCodeUrl = response.data.qrCode;
        const secretMatch = qrCodeUrl.match(/secret=([A-Z0-9]+)/i);
        if (secretMatch && secretMatch[1]) {
          setSecretKey(secretMatch[1]);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error generating QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-and-enable-2fa", {
        userId,
        otp
      });
      if (response.data.message === "2FA enabled successfully") {
        setSuccess("2FA enabled successfully! Check your email for backup codes.");
        setQrCode('');
        setOtp('');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-md flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Two-Factor Authentication Setup</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          {qrCode ? "Scan this QR code with your authenticator app" : "Enter your user ID to begin 2FA setup"}
        </p>

        {qrCode ? (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={qrCode} alt="QR Code" className="w-48 h-48 mb-4" />
            {secretKey && (
              <>
                <p className="text-sm text-gray-600 mb-2">Or enter this code manually in your authenticator app:</p>
                <div className="text-lg font-mono text-gray-800 bg-gray-100 p-2 rounded-lg mb-6">
                  {secretKey}
                </div>
              </>
            )}
          </div>
        ) : (
          <QRCodeForm
            userId={userId}
            onChange={(e) => setUserId(e.target.value)}
            onSubmit={handleGenerateQR}
            isLoading={isLoading}
          />
        )}

        {qrCode && (
          <OTPForm
            otp={otp}
            onChange={(e) => setOtp(e.target.value)}
            onVerify={handleVerifyOTP}
            isLoading={isLoading}
          />
        )}

        {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4 text-sm">{success}</p>}
      </div>
    </div>
  );
};

export default TwoFAFlow;

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import QRCodeForm from '@/components/QRCodeForm';
import OTPForm from '@/components/OTPForm';

const TwoFAFlow: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQR = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/setup-2fa", { userId });
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
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
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Scan QR code</h1>
        <p className="text-sm text-center text-gray-600 mb-6">Scan this QR code in-app to verify a device.</p>

        {qrCode ? (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={qrCode} alt="QR Code" className="w-48 h-48 mb-4" />
          </div>
        ) : (
          <QRCodeForm
            userId={userId}
            onChange={(e) => setUserId(e.target.value)}
            onSubmit={handleGenerateQR}
            isLoading={isLoading}
          />
        )}

        <p className="text-sm text-gray-600 mb-2">or enter the code manually</p>
        <div className="text-lg font-mono text-gray-800 bg-gray-100 p-2 rounded-lg mb-6">HLA8G4L1B9ZX4</div>

        {qrCode && (
          <OTPForm
            otp={otp}
            onChange={(e) => setOtp(e.target.value)}
            onVerify={handleVerifyOTP}
            isLoading={isLoading}
          />
        )}

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4 text-sm">{success}</p>}
      </div>
    </div>
  );
};

export default TwoFAFlow;

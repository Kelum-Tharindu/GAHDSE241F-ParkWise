import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { FaQrcode, FaArrowRight } from 'react-icons/fa'; // Icons for better UX

const TwoFAFlow: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error generating QR code. Please try again.");
      }
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
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error verifying OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: "min-h-screen flex items-center justify-center bg-gray-100 p-8",
    wrapper: "bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-md flex flex-col items-center p-8",
    title: "text-2xl font-bold text-center text-gray-800 mb-2",
    subtitle: "text-sm text-center text-gray-600 mb-6",
    qrContainer: "flex flex-col items-center justify-center mb-6",
    qrImage: "w-48 h-48 mb-4",
    manualCode: "text-sm text-gray-600 mb-4",
    code: "text-lg font-mono text-gray-800 bg-gray-100 p-2 rounded-lg mb-6",
    button: "w-full bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2",
    errorMessage: "text-red-500 text-center mb-4 text-sm",
    successMessage: "text-green-500 text-center mb-4 text-sm",
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Scan QR code</h1>
        <p className={styles.subtitle}>Scan this QR code in-app to verify a device.</p>

        {qrCode ? (
          <div className={styles.qrContainer}>
            <img src={qrCode} alt="QR Code" className={styles.qrImage} />
          </div>
        ) : (
          <form onSubmit={handleGenerateQR}>
            <div className="mb-4">
              <input
                type="text"
                name="userId"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? "Generating QR Code..." : "Generate QR Code"} <FaQrcode />
            </button>
          </form>
        )}

        <p className={styles.manualCode}>or enter the code manually</p>
        <div className={styles.code}>HLA8G4L1B9ZX4</div>

        {qrCode && (
          <div className="w-full mb-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
              maxLength={6}
            />
          </div>
        )}

        {qrCode && (
          <button
            type="button"
            onClick={handleVerifyOTP}
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Continue"} <FaArrowRight />
          </button>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}
      </div>
    </div>
  );
};

export default TwoFAFlow;

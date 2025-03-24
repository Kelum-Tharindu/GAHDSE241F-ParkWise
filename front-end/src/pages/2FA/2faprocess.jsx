import React, { useState } from 'react';
import axios from 'axios';
import { FaQrcode, FaArrowRight } from 'react-icons/fa'; // Icons for better UX

const TwoFAFlow = () => {
  const [userId, setUserId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Handle QR code generation
  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post("http://localhost:5000/api/auth/setup-2fa", { userId });
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode); // Set the QR code image URL
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error generating QR code. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle OTP verification and enable 2FA
  const handleVerifyOTP = async () => {
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-and-enable-2fa", { userId, otp });
      if (response.data.message === "2FA enabled successfully") {
        setSuccess("2FA enabled successfully! Check your email for backup codes.");
        setQrCode(''); // Clear the QR code
        setOtp(''); // Clear the OTP input
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error verifying OTP. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Styles
  const styles = {
    container: "min-h-screen flex items-center justify-center bg-gray-100 p-8", // Background color and padding
    wrapper: "bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-md flex flex-col items-center p-8", // Centered container with padding
    title: "text-2xl font-bold text-center text-gray-800 mb-2", // Title style
    subtitle: "text-sm text-center text-gray-600 mb-6", // Subtitle style
    qrContainer: "flex flex-col items-center justify-center mb-6", // QR code container
    qrImage: "w-48 h-48 mb-4", // QR code size
    manualCode: "text-sm text-gray-600 mb-4", // Manual code text style
    code: "text-lg font-mono text-gray-800 bg-gray-100 p-2 rounded-lg mb-6", // Manual code display style
    button: "w-full bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2", // Button style
    errorMessage: "text-red-500 text-center mb-4 text-sm", // Error message style
    successMessage: "text-green-500 text-center mb-4 text-sm", // Success message style
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Title */}
        <h1 className={styles.title}>Scan QR code</h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>Scan this QR code in-app to verify a device.</p>

        {/* Display QR Code */}
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
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? "Generating QR Code..." : "Generate QR Code"}
            </button>
          </form>
        )}

        {/* Manual Code Option */}
        <p className={styles.manualCode}>or enter the code manually</p>
        <div className={styles.code}>HLA8G4L1B9ZX4</div>

        {/* OTP Input (shown only when QR code is generated) */}
        {qrCode && (
          <div className="w-full mb-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
              maxLength={6} // Limit to 6 digits
            />
          </div>
        )}

        {/* Continue Button (shown only when QR code is generated) */}
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

        {/* Display error message if any */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Display success message if any */}
        {success && <p className={styles.successMessage}>{success}</p>}
      </div>
    </div>
  );
};

export default TwoFAFlow;
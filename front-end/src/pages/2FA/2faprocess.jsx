import React, { useState } from 'react';
import axios from 'axios';
import { FaQrcode, FaKey, FaArrowLeft, FaSpinner } from 'react-icons/fa'; // Icons for better UX

const TwoFAFlow = () => {
  const [userId, setUserId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTPVerify, setShowOTPVerify] = useState(false); // State to toggle between QR and OTP
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

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { userId, otp });
      if (response.data.message === "2FA enabled successfully") {
        setSuccess("2FA enabled successfully! Check your email for backup codes.");
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
    container: "min-h-screen flex items-center justify-center bg-yellow-100 p-8", // Background color and padding
    wrapper: "bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row relative border-4 border-yellow-300 p-8", // Larger container with border and padding
    formSection: "w-full md:w-1/2 p-6 flex flex-col justify-center", // Padding for form sections
    title: "text-2xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2", // Centered title with icon
    subtitle: "text-lg text-center text-gray-600 mb-6", // Reduced font size for subtitle
    inputContainer: "relative w-full mb-6", // Spacing for input container
    input: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all", // User-friendly input size
    button: "w-full bg-black text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-900 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2", // Button with icon
    nextButton: "w-full bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 mt-6 flex items-center justify-center gap-2", // Next button with icon
    errorMessage: "text-red-500 text-center mb-4 text-sm animate-fade-in", // Error message with animation
    successMessage: "text-green-500 text-center mb-4 text-sm animate-fade-in", // Success message with animation
    qrContainer: "flex flex-col items-center justify-center p-6", // Padding for QR container
    qrImage: "w-48 h-48 mb-4", // Adjusted QR code size
    backButton: "text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-2 mb-4", // Back button style
    loadingSpinner: "animate-spin", // Loading spinner animation
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {showOTPVerify ? (
          // OTP Verification UI
          <div className={styles.formSection}>
            {/* Back Button */}
            <div className={styles.backButton} onClick={() => setShowOTPVerify(false)}>
              <FaArrowLeft /> Back to QR Code
            </div>

            <h1 className={styles.title}>
              <FaKey /> Verify OTP
            </h1>
            <p className={styles.subtitle}>
              Enter the 6-digit OTP from your authenticator app to complete the 2FA setup.
            </p>

            {/* Display error message if any */}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {/* Display success message if any */}
            {success && <p className={styles.successMessage}>{success}</p>}

            {/* OTP Input */}
            <form onSubmit={handleVerifyOTP}>
              <div className={styles.inputContainer}>
                <input 
                  type="text" 
                  name="otp" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  className={styles.input} 
                  required 
                  maxLength={6} // Limit to 6 digits
                />
              </div>

              <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? <FaSpinner className={styles.loadingSpinner} /> : <FaKey />}
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        ) : (
          // QR Code Generation UI
          <div className={styles.formSection}>
            <h1 className={styles.title}>
              <FaQrcode /> Set Up 2FA
            </h1>
            <p className={styles.subtitle}>
              Scan the QR code below using an authenticator app like Google Authenticator or Authy.
            </p>

            {/* Display error message if any */}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {/* User ID Input */}
            <form onSubmit={handleGenerateQR}>
              <div className={styles.inputContainer}>
                <input 
                  type="text" 
                  name="userId" 
                  placeholder="Enter your User ID" 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)} 
                  className={styles.input} 
                  required 
                />
              </div>

              <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? <FaSpinner className={styles.loadingSpinner} /> : <FaQrcode />}
                {isLoading ? "Generating QR Code..." : "Generate QR Code"}
              </button>
            </form>

            {/* Display QR Code */}
            {qrCode && (
              <div className={styles.qrContainer}>
                <img src={qrCode} alt="QR Code" className={styles.qrImage} />
                <p className="text-sm text-gray-600 mb-4">
                  Can't scan the QR code? Enter this code manually in your app: <strong>{userId}</strong>
                </p>
                <button 
                  type="button" 
                  onClick={() => setShowOTPVerify(true)} 
                  className={styles.nextButton}
                >
                  <FaArrowLeft /> Next: Verify OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFAFlow;
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

const OTPVerify: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { userId, otp });
      if (response.data.message === "2FA enabled successfully") {
        setSuccess("2FA enabled successfully!");
      }
    } catch (error) {
      // Check if error is an instance of AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An unknown error occurred.");
        }
      } else {
        setError("Error verifying OTP. Please try again.");
      }
    }
  };

  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const styles = {
    container: "min-h-screen flex items-center justify-center bg-yellow-200", // Yellow background outside the container
    wrapper: "bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row relative border-4 border-transparent", // Container with transparent border
    formSection: "w-full md:w-1/2 p-6 flex flex-col justify-center", // Reduced padding to p-6
    title: "text-3xl font-bold text-center text-gray-800 mb-1", // Reduced margin-bottom to mb-1
    subtitle: "text-lg text-center text-gray-600 mb-2", // Reduced margin-bottom to mb-2
    inputContainer: "relative w-full mb-3", // Reduced margin-bottom to mb-3
    input: "w-full px-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all",
    button: "w-full bg-black text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-900 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50",
    errorMessage: "text-red-500 text-center mb-3", // Reduced margin-bottom to mb-3
    successMessage: "text-green-500 text-center mb-3", // Reduced margin-bottom to mb-3
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Verify OTP</h1>
          <p className={styles.subtitle}>Enter the OTP from your authenticator app to enable 2FA.</p>

          {/* Display error message if any */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* Display success message if any */}
          {success && <p className={styles.successMessage}>{success}</p>}

          {/* User ID Input */}
          <form onSubmit={handleVerifyOTP}>
            <div className={styles.inputContainer}>
              <input 
                type="text" 
                name="userId" 
                placeholder="Enter User ID" 
                value={userId} 
                onChange={handleUserIdChange} 
                className={styles.input} 
                required 
              />
            </div>

            {/* OTP Input */}
            <div className={styles.inputContainer}>
              <input 
                type="text" 
                name="otp" 
                placeholder="Enter OTP" 
                value={otp} 
                onChange={handleOtpChange} 
                className={styles.input} 
                required 
              />
            </div>

            <button type="submit" className={styles.button}>Verify OTP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;

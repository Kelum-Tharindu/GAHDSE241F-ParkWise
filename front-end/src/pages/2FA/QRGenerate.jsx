import React, { useState } from 'react';
import axios from 'axios';

const QRGenerate = () => {
  const [userId, setUserId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

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
    }
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
    qrContainer: "flex items-center justify-center p-6", // Container for QR code
    qrImage: "w-48 h-48", // QR code image size
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Set Up Two-Factor Authentication (2FA)</h1>
          <p className={styles.subtitle}>Scan the QR code with your authenticator app to enable 2FA.</p>

          {/* Display error message if any */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* User ID Input */}
          <form onSubmit={handleGenerateQR}>
            <div className={styles.inputContainer}>
              <input 
                type="text" 
                name="userId" 
                placeholder="Enter User ID" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                className={styles.input} 
                required 
              />
            </div>

            <button type="submit" className={styles.button}>Generate QR Code</button>
          </form>

          {/* Display QR Code */}
          {qrCode && (
            <div className={styles.qrContainer}>
              <img src={qrCode} alt="QR Code" className={styles.qrImage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerate;
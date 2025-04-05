import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

const QRGenerate: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateQR = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post<{ qrCode: string }>("http://localhost:5000/api/auth/setup-2fa", { userId });
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error generating QR code. Please try again.");
      }
    }
  };

  const styles = {
    container: "min-h-screen flex items-center justify-center bg-yellow-200",
    wrapper: "bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row relative border-4 border-transparent",
    formSection: "w-full md:w-1/2 p-6 flex flex-col justify-center",
    title: "text-3xl font-bold text-center text-gray-800 mb-1",
    subtitle: "text-lg text-center text-gray-600 mb-2",
    inputContainer: "relative w-full mb-3",
    input: "w-full px-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all",
    button: "w-full bg-black text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-900 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50",
    errorMessage: "text-red-500 text-center mb-3",
    qrContainer: "flex items-center justify-center p-6",
    qrImage: "w-48 h-48",
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Set Up Two-Factor Authentication (2FA)</h1>
          <p className={styles.subtitle}>Scan the QR code with your authenticator app to enable 2FA.</p>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleGenerateQR}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="userId"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.button}>Generate QR Code</button>
          </form>

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

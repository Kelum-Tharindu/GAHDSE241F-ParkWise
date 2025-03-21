// src/components/TwoFASetup.jsx
export default function TwoFASetup() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Enable 2FA</h1>
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">Scan the QR code below using Google Authenticator:</p>
            <img src="https://via.placeholder.com/150" alt="QR Code" className="mx-auto mb-4" />
            <p className="text-gray-700">Or enter this code manually:</p>
            <p className="font-mono text-lg text-gray-900">JBSWY3DPEHPK3PXP</p>
          </div>
          <button
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
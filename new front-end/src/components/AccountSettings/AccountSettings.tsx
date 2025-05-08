import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle, FaLanguage, FaBell, FaClock, FaGlobe, FaKey } from "react-icons/fa";

export default function AccountSettings() {
  // Simulated user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "",
    language: "English",
    timezone: "Asia/Kolkata",
    notifications: true,
    apiToken: "sk-1234-5678-ABCD-EFGH",
  });

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Simulate 2FA secret and OTP (for demo)
  const generate2FASecret = () => "JBSWY3DPEHPK3PXP";

  const handle2FAToggle = () => {
    setOtpError("");
    setSuccessMsg("");
    if (!is2FAEnabled) {
      setOtpSecret(generate2FASecret());
      setShow2FASetup(true);
    } else {
      if (window.confirm("Are you sure you want to disable 2FA?")) {
        setIs2FAEnabled(false);
        setSuccessMsg("Two-factor authentication disabled.");
      }
    }
  };

  const handle2FASetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === "123456") {
      setIs2FAEnabled(true);
      setShow2FASetup(false);
      setOtpInput("");
      setSuccessMsg("Two-factor authentication enabled.");
    } else {
      setOtpError("Invalid code. Try '123456' for demo.");
    }
  };

  // Additional setting handlers
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({ ...user, language: e.target.value });
    setSuccessMsg("Language updated.");
  };
  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({ ...user, timezone: e.target.value });
    setSuccessMsg("Timezone updated.");
  };
  const handleNotificationsToggle = () => {
    setUser({ ...user, notifications: !user.notifications });
    setSuccessMsg(
      `Notifications ${!user.notifications ? "enabled" : "disabled"}.`
    );
  };
  const handleApiTokenRegenerate = () => {
    if (
      window.confirm(
        "Regenerating your API token will invalidate the old one. Continue?"
      )
    ) {
      setUser({
        ...user,
        apiToken: "sk-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      });
      setSuccessMsg("API token regenerated.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          Account Settings
        </h2>

        {/* Personal Info */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <FaUser className="inline mr-2" /> Name
            </label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <FaEnvelope className="inline mr-2" /> Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <FaLock className="inline mr-2" /> Change Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={user.password}
              onChange={e => setUser({ ...user, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
              disabled={!user.password}
              onClick={() => {
                setSuccessMsg("Password changed!");
                setUser({ ...user, password: "" });
              }}
            >
              Update Password
            </button>
          </div>
        </form>

        {/* 2FA Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Two-Factor Authentication (2FA)
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {is2FAEnabled ? (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <FaCheckCircle className="mr-1" /> Enabled
                  </span>
                ) : (
                  <span className="flex items-center text-red-500 dark:text-red-400">
                    <FaTimesCircle className="mr-1" /> Disabled
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={handle2FAToggle}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition
                ${is2FAEnabled
                  ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                }`}
            >
              {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Protect your account with an extra layer of security. When enabled, you’ll need to enter a code from your authenticator app at login.
          </p>
        </div>

        {/* Additional Settings */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <FaLanguage className="inline mr-2" /> Language
            </label>
            <select
              value={user.language}
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option>English</option>
              <option>हिन्दी (Hindi)</option>
              <option>Español (Spanish)</option>
              <option>Français (French)</option>
              <option>Deutsch (German)</option>
              <option>中文 (Chinese)</option>
            </select>
          </div>
          {/* Timezone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <FaClock className="inline mr-2" /> Timezone
            </label>
            <select
              value={user.timezone}
              onChange={handleTimezoneChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>
          {/* Notifications */}
          <div className="md:col-span-2 flex items-center">
            <FaBell className="mr-2 text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-4">
              Email Notifications
            </span>
            <button
              type="button"
              onClick={handleNotificationsToggle}
              className={`px-3 py-1 rounded-full text-xs font-medium transition
                ${user.notifications
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              {user.notifications ? "On" : "Off"}
            </button>
          </div>
        </div>

        {/* API Token Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              <FaKey className="inline mr-2" /> API Token
            </span>
            <button
              type="button"
              onClick={handleApiTokenRegenerate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
            >
              Regenerate
            </button>
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-300">
            <span className="truncate">{user.apiToken}</span>
            <button
              type="button"
              className="ml-2 px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              onClick={() => {
                navigator.clipboard.writeText(user.apiToken);
                setSuccessMsg("API token copied to clipboard.");
              }}
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Keep your API token secret. Regenerating will invalidate the old token.
          </p>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 text-xs">
            {successMsg}
          </div>
        )}

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                Set up Two-Factor Authentication
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Scan this code in your authenticator app or enter the secret manually.
              </p>
              <div className="mb-4">
                {/* In a real app, show QR code here */}
                <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-center text-xs font-mono mb-2">
                  Secret: <span className="font-bold">{otpSecret}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Use Google Authenticator, Authy, etc.
                </div>
              </div>
              <form onSubmit={handle2FASetup}>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Enter 6-digit code from your app
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-2"
                  autoFocus
                />
                {otpError && (
                  <div className="text-red-500 text-xs mb-2">{otpError}</div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                  >
                    Confirm & Enable
                  </button>
                  <button
                    type="button"
                    onClick={() => setShow2FASetup(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-4">
                  <b>Demo:</b> Use <span className="font-mono">123456</span> as code.
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

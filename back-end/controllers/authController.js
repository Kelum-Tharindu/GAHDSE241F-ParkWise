const User = require("../models/User");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateBackupCodes = require("../utils/generateBackupCodes");
const sendEmail = require("../utils/sendEmail");

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, password, email, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    // Check if 2FA is enabled
    if (user.is2FAEnabled) {
      if (!user.otpSecret) {
        // Generate a new secret and QR code
        const secret = speakeasy.generateSecret({ name: `ParkBooking:${user.email}` });
        user.otpSecret = secret.base32;
        await user.save();

        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
          if (err) throw err;
          res.status(200).json({ qrCode: data_url, userId: user._id });
        });
      } else {
        res.status(200).json({ message: "Enter OTP", userId: user._id });
      }
    } else {
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token, role: user.role });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Verify OTP from Google Authenticator
const verifyOTP = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if the token is a backup code
    const isBackupCode = user.backupCodes.includes(Buffer.from(token).toString("base64"));

    if (isBackupCode) {
      // Remove the used backup code
      user.backupCodes = user.backupCodes.filter((code) => code !== Buffer.from(token).toString("base64"));
      await user.save();
    } else {
      // Verify the OTP from the authentication app
      const verified = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: "base32",
        token,
        window: 1, // Allow 1-step time window for OTP validation
      });

      if (!verified) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }

    // Generate JWT token
    const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token: authToken, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// Enable 2FA and generate backup codes
const enable2FA = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify the OTP
    const verified = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: "base32",
      token: otp,
      window: 1, // Allow 1-step time window for OTP validation
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Hash backup codes and store them
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(async (code) => await bcrypt.hash(code, 10))
    );

    // Save the secret key and backup codes to the user
    user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64")); // Store in base64
    user.hashedBackupCodes = hashedBackupCodes;
    user.is2FAEnabled = true;
    await user.save();

    // Send backup codes to the user's email
    const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
    await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);

    res.status(200).json({ message: "2FA enabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error enabling 2FA", error });
  }
};

// Reset 2FA using a backup code
const reset2FA = async (req, res) => {
  const { userId, backupCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the backup code matches any of the hashed backup codes
    const isBackupCodeValid = await Promise.any(
      user.hashedBackupCodes.map(async (hashedCode) => await bcrypt.compare(backupCode, hashedCode))
    );

    if (!isBackupCodeValid) {
      return res.status(400).json({ message: "Invalid backup code" });
    }

    // Disable 2FA
    user.is2FAEnabled = false;
    user.otpSecret = null;
    user.backupCodes = [];
    user.hashedBackupCodes = [];
    await user.save();

    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting 2FA", error });
  }
};

// Google OAuth callback
const googleCallback = (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  enable2FA,
  reset2FA,
  googleCallback,
};
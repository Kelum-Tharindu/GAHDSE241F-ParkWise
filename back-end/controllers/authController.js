const User = require("../models/User");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateBackupCodes = require("../utils/generateBackupCodes");
const sendEmail = require("../utils/sendEmail");
const passport = require("passport");

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Validate input fields
    if (!username || !username.trim() || !password || !password.trim() || !email || !email.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Create a new user
    const newUser = new User({ username, password, email, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log the full error
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !username.trim() || !password || !password.trim()) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if 2FA is enabled
    if (user.is2FAEnabled) {
      return res.status(200).json({ message: "Enter OTP", userId: user._id });
    } else {
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token, role: user.role });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Setup 2FA
const setup2FA = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if 2FA is already enabled
    if (user.is2FAEnabled) {
      return res.status(400).json({ message: "2FA is already enabled" });
    }

    // Generate a new secret for 2FA
    const secret = speakeasy.generateSecret({ name: `ParkBooking:${user.email}` });
    user.otpSecret = secret.base32;
    await user.save();

    // Generate QR code URL
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(500).json({ message: "Error generating QR code" });
      }

      res.status(200).json({ qrCode: data_url, userId: user._id });
    });
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    res.status(500).json({ message: "Error setting up 2FA", error: error.message });
  }
};

// Verify OTP and enable 2FA
const verifyAndEnable2FA = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the OTP
    const verified = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: "base32",
      token: String(otp),
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
    user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64"));
    user.hashedBackupCodes = hashedBackupCodes;
    user.is2FAEnabled = true;
    await user.save();

    // Send backup codes to the user's email
    const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
    await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);

    res.status(200).json({ message: "2FA enabled successfully" });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    res.status(500).json({ message: "Error enabling 2FA", error: error.message });
  }
};

// Verify OTP for login
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP is a backup code
    const isBackupCode = user.backupCodes.includes(Buffer.from(otp).toString("base64"));

    if (isBackupCode) {
      // Remove the used backup code
      user.backupCodes = user.backupCodes.filter((code) => code !== Buffer.from(otp).toString("base64"));
      await user.save();
    } else {
      // Verify the OTP from the authentication app
      const verified = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: "base32",
        token: String(otp),
        window: 1, // Allow 1-step time window for OTP validation
      });

      if (!verified) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }

    // Generate JWT token
    const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token: authToken, role: user.role });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// Disable 2FA
const disable2FA = async (req, res) => {
  const { userId, backupCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the backup code is valid
    const isBackupCodeValid = await Promise.any(
      user.hashedBackupCodes.map(async (hashedCode) => {
        return await bcrypt.compare(backupCode, hashedCode);
      })
    );

    if (!isBackupCodeValid) {
      return res.status(400).json({ message: "Invalid backup code" });
    }

    // Disable 2FA and clear related fields
    user.is2FAEnabled = false;
    user.otpSecret = null;
    user.backupCodes = [];
    user.hashedBackupCodes = [];
    await user.save();

    // Send email confirmation
    const emailText = `Two-factor authentication (2FA) has been disabled for your account. If you did not perform this action, please contact support immediately.`;
    await sendEmail(user.email, "2FA Disabled", emailText);

    res.status(200).json({ message: "2FA disabled successfully" });
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    res.status(500).json({ message: "Error disabling 2FA", error });
  }
};

// Google OAuth login route
const googleLogin = (req, res) => {
  console.log("Initiating Google OAuth login...");
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
};

// Google OAuth callback route
const googleCallback = (req, res, next) => {
  console.log("Handling Google OAuth callback..."); // Log entry
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      console.error("Error during Google OAuth:", err); // Log error
      return res.status(500).json({ message: "Error during Google OAuth", error: err });
    }

    if (!user) {
      console.error("Google OAuth failed: No user returned"); // Log failure
      return res.status(400).json({ message: "Google OAuth failed" });
    }

    console.log(`Google OAuth successful for user: ${user.email}`); // Log success

    // Generate JWT token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Redirect to the frontend with the token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  })(req, res, next);
};

module.exports = {
  registerUser,
  loginUser,
  setup2FA,
  verifyAndEnable2FA,
  verifyOTP,
  disable2FA,
  googleLogin,
  googleCallback,
};
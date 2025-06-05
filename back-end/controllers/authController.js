const User = require("../models/Usermodel");
const Landowner = require("../models/LandOwner");
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
    

    if (!username || !username.trim() || !password || !password.trim() || !email || !email.trim()) {
      console.log(`[REGISTER][FAIL] Missing fields for username: "${username}", email: "${email}"`);
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log(`[REGISTER][FAIL] Username or email already exists: "${username}", "${email}"`);
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const newUser = new User({ username, password, email, role });
    await newUser.save();

    // If user is a landowner, create a Landowner document
    if (role === 'landowner') {
      const newLandowner = new Landowner({
        username: username,
        userDocumentId: newUser._id,
        parkingIds: []
      });
      await newLandowner.save();
      console.log(`[REGISTER][SUCCESS] Created Landowner document for user: ${username}`);
    }

    console.log("====User registered successfully:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(`[REGISTER][ERROR] Error registering user:`, error);
    if (error.code === 11000) {
      console.log(`[REGISTER][FAIL] Duplicate key error for username: "${req.body.username}", email: "${req.body.email}"`);
      return res.status(400).json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt with username:", username); // Log the username

    console.log("Login attempt with password:", password);

    // Validate input fields
    if (!username || !username.trim() || !password || !password.trim()) {
      console.log(`[LOGIN][FAIL] Missing username or password`);
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`[LOGIN][FAIL] User not found: "${username}"`);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[LOGIN][FAIL] Incorrect password for username: "${username}"`);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.is2FAEnabled) {
      console.log(`[LOGIN][SUCCESS] 2FA required for user: "${username}"`);
      return res.status(200).json({ message: "Enter OTP", userId: user._id });
    } else {
      const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      console.log(`[LOGIN][SUCCESS] User logged in: "${username}", userId: ${user._id}`);
      return res.status(200).json({ message: "Login successful", token,role: user.role ,id: user._id, username: user.username });
    }
  } catch (error) {
    console.error(`[LOGIN][ERROR] Error logging in:`, error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Setup 2FA
const setup2FA = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`[2FA SETUP][FAIL] User not found: userId=${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is2FAEnabled) {
      console.log(`[2FA SETUP][FAIL] 2FA already enabled: userId=${userId}`);
      return res.status(400).json({ message: "2FA is already enabled" });
    }

    const secret = speakeasy.generateSecret({ name: `ParkBooking:${user.email}` });
    user.otpSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error(`[2FA SETUP][ERROR] Error generating QR code for userId=${userId}:`, err);
        return res.status(500).json({ message: "Error generating QR code" });
      }

      console.log(`[2FA SETUP][SUCCESS] 2FA setup initiated for userId=${userId}`);
      res.status(200).json({ qrCode: data_url, userId: user._id });
    });
  } catch (error) {
    console.error(`[2FA SETUP][ERROR] Error setting up 2FA for userId=${userId}:`, error);
    res.status(500).json({ message: "Error setting up 2FA", error: error.message });
  }
};

// Verify OTP and enable 2FA
const verifyAndEnable2FA = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`[2FA VERIFY][FAIL] User not found: userId=${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: "base32",
      token: String(otp),
      window: 1,
    });

    if (!verified) {
      console.log(`[2FA VERIFY][FAIL] Invalid OTP for userId=${userId}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(async (code) => await bcrypt.hash(code, 10))
    );

    user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64"));
    user.hashedBackupCodes = hashedBackupCodes;
    user.is2FAEnabled = true;
    await user.save();

    const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
    await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);

    console.log(`[2FA VERIFY][SUCCESS] 2FA enabled for userId=${userId}`);
    res.status(200).json({ message: "2FA enabled successfully" });
  } catch (error) {
    console.error(`[2FA VERIFY][ERROR] Error enabling 2FA for userId=${userId}:`, error);
    res.status(500).json({ message: "Error enabling 2FA", error: error.message });
  }
};

// Verify OTP for login
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`[OTP LOGIN][FAIL] User not found: userId=${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const isBackupCode = user.backupCodes.includes(Buffer.from(otp).toString("base64"));

    if (isBackupCode) {
      user.backupCodes = user.backupCodes.filter((code) => code !== Buffer.from(otp).toString("base64"));
      await user.save();
      console.log(`[OTP LOGIN][SUCCESS] Backup code used for userId=${userId}`);
    } else {
      const verified = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: "base32",
        token: String(otp),
        window: 1,
      });

      if (!verified) {
        console.log(`[OTP LOGIN][FAIL] Invalid OTP for userId=${userId}`);
        return res.status(400).json({ message: "Invalid OTP" });
      }
      console.log(`[OTP LOGIN][SUCCESS] OTP verified for userId=${userId}`);
    }

    const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token: authToken, role: user.role });
  } catch (error) {
    console.error(`[OTP LOGIN][ERROR] Error verifying OTP for userId=${userId}:`, error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, platform } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.log(`[FORGOT PASSWORD][FAIL] Invalid email: "${email}"`);
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Return same message whether user exists or not (security best practice)
    const responseMessage = "If this email exists in our system, you'll receive a reset link";

    if (user) {
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 3600000;
      await user.save();

      // Choose frontend base URL based on platform
      let baseUrl;
      let resetUrl; // Declare resetUrl outside if/else blocks
      
      if (platform === 'mobile') {
        // For mobile, we need a deep link scheme that the app can handle
        baseUrl = process.env.MOBILE_FRONTEND_URL || 'parkwise://app';
        resetUrl = `${baseUrl}#/reset_password/${resetToken}`; // Added missing '/'
        console.log("Mobile reset link generated");
      } else {
        baseUrl = process.env.WEB_FRONTEND_URL || 'http://localhost:5173';
        resetUrl = `${baseUrl}/reset-password/${resetToken}`;
        console.log("Web reset link generated");
      }
    
      console.log("Base URL:", baseUrl);
      console.log("Reset URL:", resetUrl);

      const emailText = `Click to reset your password: ${resetUrl}\n\nLink expires in 1 hour.`;

      try {
        await sendEmail(user.email, "Password Reset Request", emailText);
        console.log(`[FORGOT PASSWORD][SUCCESS] Reset email sent to: "${user.email}"`);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    } else {
      console.log(`[FORGOT PASSWORD][INFO] No user found for email: "${email}"`);
    }

    res.status(200).json({ message: responseMessage });

  } catch (error) {
    console.error(`[FORGOT PASSWORD][ERROR] Error processing forgot password for email: "${req.body.email}"`, error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    console.log("📝 RESET PASSWORD REQUEST RECEIVED");
    const { token } = req.params;
    const { password } = req.body;
    console.log("Raw token received:", token);
    
    // Validate token format before attempting to verify
    if (!token || typeof token !== 'string' || token.trim() === '') {
      return res.status(400).json({
        message: "Missing or invalid token format"
      });
    }
    // 1. Validate new password
    if (!password || password.length < 8) {
      console.log("❌ Password validation failed: insufficient length");
      return res.status(400).json({ 
        message: "Password must be at least 8 characters" 
      });
    }

    // 2. Verify token and find user
    console.log("🔍 Verifying token and finding user...");
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully, user ID:", decoded.id);
      
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        console.error("User not found with this token or token expired");
        return res.status(400).json({ 
          message: "Invalid or expired token" 
        });
      }

      // 3. Update password and clear reset fields
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      // 4. Send confirmation email (with proper validation)
      if (user.email) {  // Check email exists
        const message = `Your password has been successfully updated.`;
        try {
          await sendEmail(
            user.email,
            "Password Updated Successfully",
            message
          );
        } catch (emailError) {
          console.error("Confirmation email failed:", emailError);
          // Continue without failing the request
        }
      }

      return res.status(200).json({ 
        message: "Password reset successful" 
      });
      
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return res.status(400).json({ 
        message: "Invalid token" 
      });
    }

  } catch (error) {
    console.error(`[RESET PASSWORD][ERROR] Error resetting password:`, error);

    if (error.name === 'JsonWebTokenError') {
      console.log(`[RESET PASSWORD][FAIL] Invalid token`);
      return res.status(400).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      console.log(`[RESET PASSWORD][FAIL] Token expired`);
      return res.status(400).json({ message: "Token expired" });
    }

    res.status(500).json({
      message: "Error resetting password",
      error: error.message
    });
  }
};

// Disable 2FA
const disable2FA = async (req, res) => {
  const { userId, backupCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`[DISABLE 2FA][FAIL] User not found: userId=${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const isBackupCodeValid = await Promise.any(
      user.hashedBackupCodes.map(async (hashedCode) => {
        return await bcrypt.compare(backupCode, hashedCode);
      })
    );

    if (!isBackupCodeValid) {
      console.log(`[DISABLE 2FA][FAIL] Invalid backup code for userId=${userId}`);
      return res.status(400).json({ message: "Invalid backup code" });
    }

    user.is2FAEnabled = false;
    user.otpSecret = null;
    user.backupCodes = [];
    user.hashedBackupCodes = [];
    await user.save();

    const emailText = `Two-factor authentication (2FA) has been disabled for your account. If you did not perform this action, please contact support immediately.`;
    await sendEmail(user.email, "2FA Disabled", emailText);

    console.log(`[DISABLE 2FA][SUCCESS] 2FA disabled for userId=${userId}`);
    res.status(200).json({ message: "2FA disabled successfully" });
  } catch (error) {
    console.error(`[DISABLE 2FA][ERROR] Error disabling 2FA for userId=${userId}:`, error);
    res.status(500).json({ message: "Error disabling 2FA", error });
  }
};

// Google OAuth login route
const googleLogin = (req, res) => {
  console.log("[GOOGLE OAUTH][INFO] Initiating Google OAuth login...");
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
};

// Google OAuth callback route
const googleCallback = (req, res, next) => {
  console.log("[GOOGLE OAUTH][INFO] Handling Google OAuth callback...");
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      console.error("[GOOGLE OAUTH][ERROR] Error during Google OAuth:", err);
      return res.status(500).json({ message: "Error during Google OAuth", error: err });
    }

    if (!user) {
      console.error("[GOOGLE OAUTH][FAIL] Google OAuth failed: No user returned");
      return res.status(400).json({ message: "Google OAuth failed" });
    }

    console.log(`[GOOGLE OAUTH][SUCCESS] Google OAuth successful for user: ${user.email}`);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  })(req, res, next);
};

const validateToken = require("./validateToken");

module.exports = {
  registerUser,
  loginUser,
  setup2FA,
  verifyAndEnable2FA,
  verifyOTP,
  forgotPassword,
  resetPassword,
  disable2FA,
  googleLogin,
  googleCallback,
  validateToken,
};
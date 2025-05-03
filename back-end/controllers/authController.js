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
    console.log("User registered successfully:", newUser); // Log the new user object
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
    console.log("Login attempt with username:", username); // Log the username

    console.log("Login attempt with password:", password);

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

// Forgot Password - Generate and send reset token
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
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
      user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const emailText = `Click to reset your password: ${resetUrl}\n\nLink expires in 1 hour.`;

      try {
        await sendEmail(user.email, "Password Reset Request", emailText);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request - still return success message
      }
    }

    res.status(200).json({ message: responseMessage });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      message: "Error processing request",
      error: error.message 
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Validate new password
    if (!password || password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters" 
      });
    }

    // 2. Verify token and find user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
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

    res.status(200).json({ 
      message: "Password reset successful" 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
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
  forgotPassword,
  resetPassword,
  disable2FA,
  googleLogin,
  googleCallback,
};

// const User = require("../models/User");
// const Landowner = require("../models/LandOwner");
// const speakeasy = require("speakeasy");
// const qrcode = require("qrcode");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const generateBackupCodes = require("../utils/generateBackupCodes");
// const sendEmail = require("../utils/sendEmail");
// const passport = require("passport");

// // Helper function to validate email
// const validateEmail = (email) => {
//   const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email);
// };

// // Register user with role-based collection handling
// const registerUser = async (req, res) => {
//   try {
//     const { username, password, email, role, ...additionalData } = req.body;

//     // Validate inputs
//     if (!username || !password || !email) {
//       return res.status(400).json({ message: "Username, email and password are required" });
//     }

//     if (!validateEmail(email)) {
//       return res.status(400).json({ message: "Please enter a valid email" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     // Normalize inputs
//     const normalizedUsername = username.trim().toLowerCase();
//     const normalizedEmail = email.trim().toLowerCase();

//     // Check for existing records (case-insensitive)
//     const [existingUser, existingLandowner] = await Promise.all([
//       User.findOne({
//         $or: [
//           { username: { $regex: `^${normalizedUsername}$`, $options: 'i' } },
//           { email: { $regex: `^${normalizedEmail}$`, $options: 'i' } }
//         ]
//       }),
//       Landowner.findOne({
//         $or: [
//           { username: { $regex: `^${normalizedUsername}$`, $options: 'i' } },
//           { email: { $regex: `^${normalizedEmail}$`, $options: 'i' } }
//         ]
//       })
//     ]);

//     // Check for conflicts
//     const conflicts = [];
//     if (existingUser || existingLandowner) {
//       if (existingUser?.username?.toLowerCase() === normalizedUsername || 
//           existingLandowner?.username?.toLowerCase() === normalizedUsername) {
//         conflicts.push('username');
//       }
//       if (existingUser?.email?.toLowerCase() === normalizedEmail || 
//           existingLandowner?.email?.toLowerCase() === normalizedEmail) {
//         conflicts.push('email');
//       }
//       return res.status(400).json({
//         message: 'Registration failed',
//         conflicts: conflicts
//       });
//     }

//     // Create new entity
//     const isLandowner = role === 'landowner';
//     const Model = isLandowner ? Landowner : User;
    
//     const newEntity = new Model({
//       username: normalizedUsername,
//       email: normalizedEmail,
//       password,
//       ...(isLandowner && additionalData),
//       ...(!isLandowner && { role: role || 'user' })
//     });

//     await newEntity.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: newEntity._id, role: isLandowner ? 'landowner' : newEntity.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(201).json({
//       message: 'Registration successful',
//       token,
//       userId: newEntity._id,
//       role: isLandowner ? 'landowner' : newEntity.role,
//       isLandowner
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
    
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return res.status(400).json({ 
//         message: `${field} already exists`,
//         field: field
//       });
//     }
    
//     res.status(500).json({
//       message: 'Registration failed',
//       error: error.message
//     });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Validate input fields
//     if (!username || !username.trim() || !password || !password.trim()) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     // Find the user by username or email
//     const user = await User.findOne({ 
//       $or: [
//         { username: username.trim() },
//         { email: username.trim().toLowerCase() }
//       ]
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Compare the provided password with the stored hash
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Check if 2FA is enabled
//     if (user.is2FAEnabled) {
//       return res.status(200).json({ 
//         message: "2FA required", 
//         userId: user._id,
//         requires2FA: true 
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ 
//       token, 
//       role: user.role,
//       userId: user._id,
//       username: user.username
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };

// // Setup 2FA
// const setup2FA = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if 2FA is already enabled
//     if (user.is2FAEnabled) {
//       return res.status(400).json({ message: "2FA is already enabled" });
//     }

//     // Generate a new secret for 2FA
//     const secret = speakeasy.generateSecret({ 
//       name: `ParkBooking:${user.email}`,
//       length: 20
//     });

//     user.otpSecret = secret.base32;
//     await user.save();

//     // Generate QR code URL
//     qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
//       if (err) {
//         console.error("Error generating QR code:", err);
//         return res.status(500).json({ message: "Error generating QR code" });
//       }

//       res.status(200).json({ 
//         qrCode: data_url, 
//         secret: secret.base32, // For manual entry
//         userId: user._id 
//       });
//     });

//   } catch (error) {
//     console.error("Error setting up 2FA:", error);
//     res.status(500).json({ 
//       message: "Error setting up 2FA", 
//       error: error.message 
//     });
//   }
// };

// // Verify OTP and enable 2FA
// const verifyAndEnable2FA = async (req, res) => {
//   const { userId, otp } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify the OTP
//     const verified = speakeasy.totp.verify({
//       secret: user.otpSecret,
//       encoding: "base32",
//       token: String(otp),
//       window: 1, // Allow 1-step time window for OTP validation
//     });

//     if (!verified) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Generate backup codes
//     const backupCodes = generateBackupCodes();

//     // Hash backup codes and store them
//     const hashedBackupCodes = await Promise.all(
//       backupCodes.map(async (code) => await bcrypt.hash(code, 10))
//     );

//     // Enable 2FA and save backup codes
//     user.is2FAEnabled = true;
//     user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64"));
//     user.hashedBackupCodes = hashedBackupCodes;
//     await user.save();

//     // Send backup codes to the user's email
//     const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
//     await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);

//     res.status(200).json({ 
//       message: "2FA enabled successfully",
//       backupCodes // Only returned in development for testing
//     });

//   } catch (error) {
//     console.error("Error enabling 2FA:", error);
//     res.status(500).json({ 
//       message: "Error enabling 2FA", 
//       error: error.message 
//     });
//   }
// };

// // Verify OTP for login
// const verifyOTP = async (req, res) => {
//   const { userId, otp } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let isValid = false;

//     // First check if it's a backup code
//     const isBackupCode = user.backupCodes.includes(
//       Buffer.from(otp).toString("base64")
//     );

//     if (isBackupCode) {
//       // Remove the used backup code
//       user.backupCodes = user.backupCodes.filter(
//         (code) => code !== Buffer.from(otp).toString("base64")
//       );
//       await user.save();
//       isValid = true;
//     } else {
//       // Verify as TOTP code
//       isValid = speakeasy.totp.verify({
//         secret: user.otpSecret,
//         encoding: "base32",
//         token: String(otp),
//         window: 1,
//       });
//     }

//     if (!isValid) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ 
//       token, 
//       role: user.role,
//       userId: user._id,
//       username: user.username
//     });

//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ 
//       message: "Error verifying OTP", 
//       error: error.message 
//     });
//   }
// };

// // Forgot Password - Generate and send reset token
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !validateEmail(email)) {
//       return res.status(400).json({ message: "Valid email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase().trim() });

//     // Return same message whether user exists or not (security best practice)
//     const responseMessage = "If this email exists in our system, you'll receive a reset link";

//     if (user) {
//       const resetToken = jwt.sign(
//         { id: user._id }, 
//         process.env.JWT_SECRET, 
//         { expiresIn: '1h' }
//       );

//       user.resetPasswordToken = resetToken;
//       user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
//       await user.save();

//       const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//       const emailText = `Click to reset your password: ${resetUrl}\n\nLink expires in 1 hour.`;

//       try {
//         await sendEmail(user.email, "Password Reset Request", emailText);
//       } catch (emailError) {
//         console.error("Email sending failed:", emailError);
//       }
//     }

//     res.status(200).json({ message: responseMessage });

//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ 
//       message: "Error processing request",
//       error: error.message 
//     });
//   }
// };

// // Reset Password
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     if (!password || password.length < 6) {
//       return res.status(400).json({ 
//         message: "Password must be at least 6 characters" 
//       });
//     }

//     // Verify token and find user
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({
//       _id: decoded.id,
//       resetPasswordToken: token,
//       resetPasswordExpire: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ 
//         message: "Invalid or expired token" 
//       });
//     }

//     // Update password and clear reset fields
//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     // Send confirmation email
//     const message = `Your password has been successfully updated.`;
//     try {
//       await sendEmail(user.email, "Password Updated Successfully", message);
//     } catch (emailError) {
//       console.error("Confirmation email failed:", emailError);
//     }

//     res.status(200).json({ 
//       message: "Password reset successful" 
//     });

//   } catch (error) {
//     console.error("Reset password error:", error);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(400).json({ message: "Invalid token" });
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(400).json({ message: "Token expired" });
//     }
    
//     res.status(500).json({ 
//       message: "Error resetting password",
//       error: error.message 
//     });
//   }
// };

// // Disable 2FA
// const disable2FA = async (req, res) => {
//   const { userId, backupCode } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.is2FAEnabled) {
//       return res.status(400).json({ message: "2FA is not enabled" });
//     }

//     // Check if any backup code matches
//     let isValidBackupCode = false;
//     for (const hashedCode of user.hashedBackupCodes) {
//       if (await bcrypt.compare(backupCode, hashedCode)) {
//         isValidBackupCode = true;
//         break;
//       }
//     }

//     if (!isValidBackupCode) {
//       return res.status(400).json({ message: "Invalid backup code" });
//     }

//     // Disable 2FA and clear related fields
//     user.is2FAEnabled = false;
//     user.otpSecret = undefined;
//     user.backupCodes = [];
//     user.hashedBackupCodes = [];
//     await user.save();

//     // Send email confirmation
//     const emailText = `Two-factor authentication has been disabled for your account.`;
//     try {
//       await sendEmail(user.email, "2FA Disabled", emailText);
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//     }

//     res.status(200).json({ message: "2FA disabled successfully" });

//   } catch (error) {
//     console.error("Error disabling 2FA:", error);
//     res.status(500).json({ 
//       message: "Error disabling 2FA", 
//       error: error.message 
//     });
//   }
// };

// // Google OAuth login route
// const googleLogin = (req, res) => {
//   passport.authenticate("google", { 
//     scope: ["profile", "email"],
//     prompt: "select_account"
//   })(req, res);
// };

// // Google OAuth callback route
// const googleCallback = (req, res, next) => {
//   passport.authenticate("google", { session: false }, (err, user, info) => {
//     if (err) {
//       console.error("Google OAuth error:", err);
//       return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
//     }

//     if (!user) {
//       return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: "1h" }
//     );

//     // Redirect with token
//     res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&role=${user.role}`);

//   })(req, res, next);
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   setup2FA,
//   verifyAndEnable2FA,
//   verifyOTP,
//   forgotPassword,
//   resetPassword,
//   disable2FA,
//   googleLogin,
//   googleCallback,
// };
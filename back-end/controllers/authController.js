// const User = require("../models/User");
// const speakeasy = require("speakeasy");
// const qrcode = require("qrcode");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const generateBackupCodes = require("../utils/generateBackupCodes");
// const sendEmail = require("../utils/sendEmail");

// // Register user
// const registerUser = async (req, res) => {
//   try {
//     const { username, password, email, role } = req.body;
//     const existingUser = await User.findOne({ username });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const newUser = new User({ username, password, email, role });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user", error });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user) return res.status(400).json({ message: "Invalid username or password" });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

//     // Check if 2FA is enabled
//     if (user.is2FAEnabled) {
//       if (!user.otpSecret) {
//         // Generate a new secret and QR code
//         const secret = speakeasy.generateSecret({ name: `ParkBooking:${user.email}` });
//         user.otpSecret = secret.base32;
//         await user.save();

//         qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
//           if (err) throw err;
//           res.status(200).json({ qrCode: data_url, userId: user._id });
//         });
//       } else {
//         res.status(200).json({ message: "Enter OTP", userId: user._id });
//       }
//     } else {
//       // Generate JWT token
//       const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       res.status(200).json({ token, role: user.role });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error });
//   }
// };

// // Verify OTP from Google Authenticator
// const verifyOTP = async (req, res) => {
//   const { userId, token } = req.body;
//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Check if the token is a backup code
//     const isBackupCode = user.backupCodes.includes(Buffer.from(token).toString("base64"));

//     if (isBackupCode) {
//       // Remove the used backup code
//       user.backupCodes = user.backupCodes.filter((code) => code !== Buffer.from(token).toString("base64"));
//       await user.save();
//     } else {
//       // Verify the OTP from the authentication app
//       const verified = speakeasy.totp.verify({
//         secret: user.otpSecret,
//         encoding: "base32",
//         token,
//         window: 1, // Allow 1-step time window for OTP validation
//       });

//       if (!verified) {
//         return res.status(400).json({ message: "Invalid OTP" });
//       }
//     }

//     // Generate JWT token
//     const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ token: authToken, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: "Error verifying OTP", error });
//   }
// };

// // Enable 2FA and generate backup codes
// const enable2FA = async (req, res) => {
//   const { userId, otp } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Verify the OTP
//     const verified = speakeasy.totp.verify({
//       secret: user.otpSecret,
//       encoding: "base32",
//       token: otp,
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

//     // Save the secret key and backup codes to the user
//     user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64")); // Store in base64
//     user.hashedBackupCodes = hashedBackupCodes;
//     user.is2FAEnabled = true;
//     await user.save();

//     // Send backup codes to the user's email
//     const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
//     await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);

//     res.status(200).json({ message: "2FA enabled successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error enabling 2FA", error });
//   }
// };

// // Reset 2FA using a backup code
// const reset2FA = async (req, res) => {
//   const { userId, backupCode } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Check if the backup code matches any of the hashed backup codes
//     const isBackupCodeValid = await Promise.any(
//       user.hashedBackupCodes.map(async (hashedCode) => await bcrypt.compare(backupCode, hashedCode))
//     );

//     if (!isBackupCodeValid) {
//       return res.status(400).json({ message: "Invalid backup code" });
//     }

//     // Disable 2FA
//     user.is2FAEnabled = false;
//     user.otpSecret = null;
//     user.backupCodes = [];
//     user.hashedBackupCodes = [];
//     await user.save();

//     res.status(200).json({ message: "2FA reset successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error resetting 2FA", error });
//   }
// };

// // Google OAuth callback
// const googleCallback = (req, res) => {
//   res.redirect("http://localhost:5173/dashboard");
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   verifyOTP,
//   enable2FA,
//   reset2FA,
//   googleCallback,
// };

// const User = require("../models/User");
// const speakeasy = require("speakeasy");
// const qrcode = require("qrcode");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const generateBackupCodes = require("../utils/generateBackupCodes");
// const sendEmail = require("../utils/sendEmail");

// // Register user
// const registerUser = async (req, res) => {
//   try {
//     const { username, password, email, role } = req.body;
//     const existingUser = await User.findOne({ username });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const newUser = new User({ username, password, email, role });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user", error });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user) return res.status(400).json({ message: "Invalid username or password" });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

//     // Check if 2FA is enabled
//     if (user.is2FAEnabled) {
//       // If 2FA is enabled, prompt the user to enter the OTP
//       return res.status(200).json({ message: "Enter OTP", userId: user._id });
//     } else {
//       // If 2FA is not enabled, log the user in directly
//       const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       res.status(200).json({ token, role: user.role });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error });
//   }
// };

// // Verify OTP from Google Authenticator
// const verifyOTP = async (req, res) => {
//   const { userId, token } = req.body;
//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Check if the token is a backup code
//     const isBackupCode = user.backupCodes.includes(Buffer.from(token).toString("base64"));

//     if (isBackupCode) {
//       // Remove the used backup code
//       user.backupCodes = user.backupCodes.filter((code) => code !== Buffer.from(token).toString("base64"));
//       await user.save();
//     } else {



//       // Verify the OTP from the authentication app
//       const verified = speakeasy.totp.verify({
//         secret: user.otpSecret,
//         encoding: "base32",
//         token,
//         window: 1, // Allow 1-step time window for OTP validation

        
//       });

//       if (!verified) {
//         return res.status(400).json({ message: "Invalid OTP" });
//       }
//     }

//     // Generate JWT token
//     const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ token: authToken, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: "Error verifying OTP", error });
//   }
// };

// // Enable 2FA and generate backup codes
// const enable2FA = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate a new secret and QR code
//     const secret = speakeasy.generateSecret({ name: `ParkBooking:${user.email}` });
//     user.otpSecret = secret.base32;
//     await user.save();

//     qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
//       if (err) throw err;
//       res.status(200).json({ qrCode: data_url, userId: user._id });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error enabling 2FA", error });
//   }
// };

// // Verify OTP and enable 2FA
// const verifyOTPAndEnable2FA = async (req, res) => {
//   const { userId, otp } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Verify the OTP
//     const verified = speakeasy.totp.verify({
//       secret: user.otpSecret,
//       encoding: "base32",
//       token: otp,
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

//     // Save the secret key and backup codes to the user
//     user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64")); // Store in base64
//     user.hashedBackupCodes = hashedBackupCodes;
//     user.is2FAEnabled = true;

//     // Debug logs
//     console.log("Generated Backup Codes:", backupCodes);
//     console.log("Hashed Backup Codes:", hashedBackupCodes);
//     console.log("User Backup Codes (Base64):", user.backupCodes);
//     console.log("User Document Before Save:", user);

//     // Save the user document
//     await user.save();

//     // Send backup codes to the user's email
//     const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
//     await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);

//     res.status(200).json({ message: "2FA enabled successfully" });
//   } catch (error) {
//     console.error("Error saving user document:", error);
//     res.status(500).json({ message: "Error enabling 2FA", error });
//   }
// };

// // Disable 2FA
// const disable2FA = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Disable 2FA
//     user.is2FAEnabled = false;
//     user.otpSecret = null;
//     user.backupCodes = [];
//     user.hashedBackupCodes = [];
//     await user.save();

//     res.status(200).json({ message: "2FA disabled successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error disabling 2FA", error });
//   }
// };

// // Google OAuth callback
// const googleCallback = (req, res) => {
//   res.redirect("http://localhost:5173/dashboard");
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   verifyOTP,
//   enable2FA,
//   verifyOTPAndEnable2FA,
//   disable2FA,
//   googleCallback,
// };

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
  
      // Check if any field is empty or contains only spaces
      if (!username || !username.trim()) {
        return res.status(400).json({ message: "Username is required" });
      }
      if (!password || !password.trim()) {
        return res.status(400).json({ message: "Password is required" });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (!role || !role.trim()) {
        return res.status(400).json({ message: "Role is required" });
      }
  
      // Check if the username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Check if the email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // If all validations pass, create a new user
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
  
      // Check if username or password is empty
      if (!username || !username.trim()) {
        return res.status(400).json({ message: "Username is required" });
      }
      if (!password || !password.trim()) {
        return res.status(400).json({ message: "Password is required" });
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
        // If 2FA is enabled, prompt the user to enter the OTP
        return res.status(200).json({ message: "Enter OTP", userId: user._id });
      } else {
        // If 2FA is not enabled, log the user in directly
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, role: user.role });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };


  const setup2FA = async (req, res) => {
    const { userId } = req.body;
    console.log("Received request to setup 2FA"); // Log function entry
    console.log("Request Body:", req.body);
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error(`User not found: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log(`User found: ${user.email}, 2FA Enabled: ${user.is2FAEnabled}`);
  
      // Check if 2FA is already enabled
      if (user.is2FAEnabled) {
        console.warn(`2FA is already enabled for user: ${user.email}`);
        return res.status(400).json({ message: "2FA is already enabled" });
      }
  
      // Generate a new secret for 2FA
      console.log("Generating new 2FA secret...");
      const secret = speakeasy.generateSecret({ name: `ParkBooking:${user.email}` });
  
      // Save the secret to the user document (but do not enable 2FA yet)
      user.otpSecret = secret.base32;
      await user.save();
      console.log(`2FA secret saved for user: ${user.email}`);
  
      // Generate QR code URL
      console.log("Generating QR code...");
      qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) {
          console.error("Error generating QR code:", err);
          throw err;
        }
  
        console.log(`QR code generated successfully for user: ${user.email}`);
        res.status(200).json({ qrCode: data_url, userId: user._id });
      });
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      res.status(500).json({ message: "Error setting up 2FA", error: error.message });
    }
  };
  


const verifyAndEnable2FA = async (req, res) => {
  const { userId, otp } = req.body;
  console.log("Received request to verify and enable 2FA"); // Log function entry
  console.log("Request Body:", req.body);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User found: ${user.email}, 2FA Enabled: ${user.is2FAEnabled}`);

    // Check if 2FA is already enabled
    if (user.is2FAEnabled) {
      console.warn(`2FA is already enabled for user: ${user.email}`);
      return res.status(400).json({ message: "2FA is already enabled" });
    }

    // Verify the OTP with Google Authenticator
    console.log("Verifying OTP...");
    const verified = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: "base32",
      token: String(otp),  // Ensure `otp` is used instead of `token`
      window: 1, // Allow 1-step time window for OTP validation
    });

    if (!verified) {
      console.warn(`Invalid OTP for user: ${user.email}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    console.log("OTP verified successfully");

    // Check if backup codes already exist
    if (!user.backupCodes || user.backupCodes.length === 0) {
      console.log("Generating new backup codes...");

      // Generate backup codes
      const backupCodes = generateBackupCodes();

      // Hash backup codes and store them
      const hashedBackupCodes = await Promise.all(
        backupCodes.map(async (code) => await bcrypt.hash(code, 10))
      );

      // Save backup codes in base64 format
      user.backupCodes = backupCodes.map((code) => Buffer.from(code).toString("base64"));
      user.hashedBackupCodes = hashedBackupCodes;

      console.log(`Generated and saved ${backupCodes.length} backup codes for user: ${user.email}`);

      // Send backup codes to the user's email
      const emailText = `Your backup codes are:\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can be used only once.`;
      await sendEmail(user.email, "Your Backup Codes for 2FA", emailText);
      console.log(`Backup codes sent to ${user.email}`);
    } else {
      console.log("User already has backup codes.");
    }

    // Enable 2FA
    user.is2FAEnabled = true;
    await user.save();

    console.log(`2FA enabled successfully for user: ${user.email}`);
    res.status(200).json({ message: "2FA enabled successfully" });

  } catch (error) {
    console.error("Error enabling 2FA:", error);
    res.status(500).json({ message: "Error enabling 2FA", error: error.message });
  }
};



// Verify OTP for login
const verifyOTP = async (req, res) => {
    const { userId, otp } = req.body; // Use `otp` instead of `token`
  
    try {
      console.log("Request Body:", req.body); // Debug log
      console.log("User ID:", userId); // Debug log
      console.log("OTP:", otp); // Debug log
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      console.log("User:", user); // Debug log
      console.log("User OTP Secret:", user.otpSecret); // Debug log
  
      // Check if the OTP is a backup code
      const isBackupCode = user.backupCodes.includes(Buffer.from(otp).toString("base64"));
  
      if (isBackupCode) {
        // Remove the used backup code
        user.backupCodes = user.backupCodes.filter((code) => code !== Buffer.from(otp).toString("base64"));
        await user.save();
      } else {
        // Verify the OTP with Google Authenticator
        const verified = speakeasy.totp.verify({
          secret: user.otpSecret,
          encoding: "base32",
          token: String(otp), // Use `otp` instead of `token`
          window: 1, // Allow 1-step time window for OTP validation
        });
  
        console.log("OTP Verification Arguments:", {
          secret: user.otpSecret,
          encoding: "base32",
          token: String(otp),
          window: 1,
        });
        console.log("OTP Verification Result:", verified); // Debug log
  
        if (!verified) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      }
  
      // Generate JWT token
      const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token: authToken, role: user.role });
    } catch (error) {
      console.error("Error in verifyOTP:", error); // Debug log
      res.status(500).json({ message: "Error verifying OTP", error });
    }
  };



// Disable 2FA
const disable2FA = async (req, res) => {
    const { userId, backupCode } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
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



// Google OAuth callback
const googleCallback = (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
};

module.exports = {
  registerUser,
  loginUser,
  setup2FA,
  verifyAndEnable2FA,
  verifyOTP,
  disable2FA,
  googleCallback,
};
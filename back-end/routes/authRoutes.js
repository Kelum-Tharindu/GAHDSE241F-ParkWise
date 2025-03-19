const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTP,
  enable2FA,
  reset2FA,
  googleCallback,
} = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

// Register and Login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 2FA routes
router.post("/verify-otp", verifyOTP); // Verify OTP from Google Authenticator
router.post("/enable-2fa", enable2FA); // Enable 2FA and generate backup codes
router.post("/reset-2fa", reset2FA); // Reset 2FA using a backup code

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

module.exports = router;
const express = require("express");
const {
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
} = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

// Registration and Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// 2FA Routes
router.post("/setup-2fa", setup2FA);
router.post("/verify-and-enable-2fa", verifyAndEnable2FA);
router.post("/verify-otp", verifyOTP);
router.post("/disable-2fa", disable2FA);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);  // Changed from put to post

// Google OAuth Routes
router.get("/google", googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

module.exports = router;

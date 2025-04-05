// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   verifyOTP,
//   enable2FA,
//   reset2FA,
//   googleCallback,
// } = require("../controllers/authController");
// const passport = require("passport");

// const router = express.Router();

// // Register and Login routes
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// // 2FA routes
// router.post("/verify-otp", verifyOTP); // Verify OTP from Google Authenticator
// router.post("/enable-2fa", enable2FA); // Enable 2FA and generate backup codes
// router.post("/reset-2fa", reset2FA); // Reset 2FA using a backup code

// // Google OAuth routes
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   googleCallback
// );

// module.exports = router;
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
router.put('/reset-password/:token', resetPassword);

// Google OAuth Routes
router.get("/google", googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

module.exports = router;

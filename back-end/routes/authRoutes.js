const express = require("express");
const { registerUser, loginUser, verifyOTP, googleCallback } = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

// Register and Login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 2FA routes
router.post("/verify-otp", verifyOTP);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    googleCallback
);

module.exports = router;
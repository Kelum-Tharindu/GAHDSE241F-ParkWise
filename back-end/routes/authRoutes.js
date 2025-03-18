const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 2FA routes
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);



// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Successful authentication, redirect to the frontend
        res.redirect("http://localhost:5173/dashboard");
    }
);


module.exports = router;

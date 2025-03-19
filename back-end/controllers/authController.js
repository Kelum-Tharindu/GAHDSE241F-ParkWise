const User = require("../models/User");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");

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

        const verified = speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: "base32",
            token,
            window: 1, // Allow 1-step time window for OTP validation
        });

        if (verified) {
            // Generate JWT token
            const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ token: authToken, role: user.role });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error });
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
    googleCallback,
};
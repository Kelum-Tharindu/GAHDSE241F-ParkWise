const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com", // Replace with your email
        pass: "your-email-password", // Replace with your email password
    },
});

// Register user
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ username, password });
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// Send OTP for 2FA
const sendOTP = async (req, res) => {
    const { email } = req.body;

    // Generate a secret and OTP
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
    });

    // Save the secret in the user's database record (temporarily)
    await User.updateOne({ email }, { otpSecret: secret.base32 });

    // Send OTP via email
    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Your OTP for 2FA",
        text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: "Error sending OTP", error });
        }
        res.status(200).json({ message: "OTP sent successfully" });
    });
};

// Verify OTP for 2FA
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    // Retrieve the secret from the user's database record
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const verified = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: "base32",
        token: otp,
        window: 1, // Allow 1-step time window for OTP validation
    });

    if (verified) {
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
};

// Google OAuth callback
const googleCallback = (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
};

// Initialize Passport for Google OAuth
const initializePassport = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: "your-google-client-id", // Replace with your Google Client ID
                clientSecret: "your-google-client-secret", // Replace with your Google Client Secret
                callbackURL: "http://localhost:5000/api/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                // Check if the user already exists in your database
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Create a new user
                    user = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                    });
                    await user.save();
                }

                return done(null, user);
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};

module.exports = {
    registerUser,
    loginUser,
    sendOTP,
    verifyOTP,
    googleCallback,
    initializePassport,
};
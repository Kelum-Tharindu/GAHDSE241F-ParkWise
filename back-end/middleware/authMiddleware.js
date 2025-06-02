const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");
const Landowner = require("../models/LandOwner");

const protect = async (req, res, next) => {
    let token;

    console.log("========================= Middleware Called");


    // ✅ Check for token in Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } 
    // ✅ Fallback: check cookie for token
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // ❌ No token found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token not provided",
        });
    }

    try {
        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Get user from DB
        const user = await User.findById(decoded.id).select(
            "-password -otpSecret -hashedBackupCodes -backupCodes -resetPasswordToken -resetPasswordExpire"
        );

        if (!user) {
            console.error("User not found for token");
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found",
            });
        }

        req.user = user;

        // ✅ Attach landowner profile if needed
        if (user.role === "landowner") {
            const landowner = await Landowner.findOne({ user: user._id }).select(
                "-verificationDocuments -paymentDetails"
            );
            req.landowner = landowner;
        }

        next();
    } catch (error) {
        console.error("JWT verification failed:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired, please login again",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Not authorized, invalid token",
            });
        }

        res.status(401).json({
            success: false,
            message: "Not authorized, authentication failed",
        });
    }
};

// Role-based access control middleware
const roleAuth = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: "Access denied, insufficient permissions" 
            });
        }
        next();
    };
};

// 2FA verification middleware (for routes that require 2FA)
const require2FA = async (req, res, next) => {
    if (req.user.is2FAEnabled) {
        // Check if 2FA was verified in this session
        if (!req.session?.is2FAVerified) {
            return res.status(403).json({ 
                success: false,
                requires2FA: true,
                message: "Two-factor authentication required" 
            });
        }
    }
    next();
};

module.exports = { 
    protect, 
    roleAuth, 
    require2FA 
};
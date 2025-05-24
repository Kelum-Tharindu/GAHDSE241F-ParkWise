// back-end/controllers/authController.js (add this function)
const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");

// Validate token and return user details
const validateToken = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("[validateToken] Received token:", token);
    if (!token) {
      console.log("[validateToken] No token provided");
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[validateToken] Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("_id role username");
    if (!user) {
      console.log("[validateToken] User not found for id:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("[validateToken] User found:", user);
    res.status(200).json({ user });
  } catch (error) {
    console.log("[validateToken] Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateToken;

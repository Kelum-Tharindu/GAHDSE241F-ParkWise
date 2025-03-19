require("dotenv").config();
require("./config/passport");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passport = require("passport");
const session = require("express-session"); 

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(passport.initialize());

// Middleware
app.use(express.json());

// Configure express-session
app.use(
    session({
        secret: process.env.JWT_SECRET, // Use your JWT secret or any random string
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
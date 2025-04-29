require("dotenv").config();
require("./config/passport"); // Load Passport configuration
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passport = require("passport");
const session = require("express-session");
const parkingRoutes = require('./routes/parkingRoutes');
const billingRoutes = require("./routes/billingRoutes");

const cors = require("cors");

// Initialize express app
const app = express();


// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Make frontend URL configurable through .env
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies and credentials

}));

app.use(express.json());  // Middleware to parse JSON request bodies

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();



// Configure express-session
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key", // Use a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS only)
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      maxAge: 24 * 60 * 60 * 1000, // Session expiration time (1 day)
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use('/parking', parkingRoutes);
app.use("/billing", billingRoutes);

// Home route for testing
app.get('/', (req, res) => {
  res.send('MongoDB Connection Test Successful');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});







// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

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
const qrRoutes = require('./routes/qrRoutes');
const bookingRoutes = require('./routes/bookingRoute');
const userProfileRoutes = require('./routes/userProfileRoutes');
const cors = require('cors');
const os = require('os');
const landownerRoutes = require('./routes/landownerRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const transactionRoutes = require('./routes/transactionRoutes');



// -------------------- GET LOCAL IP --------------------
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let config of interfaces[iface]) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'localhost';
};

const localIP = getLocalIP();

// -------------------- EXPRESS INIT --------------------
const app = express();

// -------------------- CORS CONFIG --------------------
const allowedOrigins = [
  'http://localhost:5173',  // React Dev
  'http://localhost:3000',  // Optional other dev port
  'http://localhost:5500',
  'http://localhost:51761',  // Flutter Web dev
  `http://${localIP}:3000`, // Flutter or React from another device
  process.env.FRONTEND_URL  // React Prod
];

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Make frontend URL configurable through .env
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies and credentials

  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS: ' + origin));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());  // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Middleware to parse cookies
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
app.use('/api/parking', parkingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/landowners', landownerRoutes);
app.use('/api/transactions', transactionRoutes);

// -------------------- TEST ROUTE --------------------
app.get('/', (req, res) => {
  res.send('✅ MongoDB Connection Test Successful');
});



// Routes
app.use("/api/auth", authRoutes);
app.use('/parking', parkingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/users', userRoutes);

// -------------------- ERROR HANDLERS --------------------

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ error: "🚨 Internal Server Error" });
});

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

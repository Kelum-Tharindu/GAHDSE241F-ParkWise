require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const os = require('os');

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
  'http://localhost:49539',  // Flutter Web dev
  `http://${localIP}:3000`, // Flutter or React from another device
  process.env.FRONTEND_URL  // React Prod
];

app.use(cors({
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

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- DB CONNECT --------------------
connectDB();

// -------------------- TEST ROUTE --------------------
app.get('/', (req, res) => {
  res.send('✅ MongoDB Connection Test Successful');
});

// -------------------- ROUTES --------------------
const parkingRoutes = require('./routes/parkingRoutes');
const billingRoutes = require('./routes/billingRoutes');
const qrRoutes = require('./routes/qrRoutes');
const bookingRoutes = require('./routes/bookingRoute');


app.use('/parking', parkingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/bookings', bookingRoutes);

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at: http://${localIP}:${PORT}`);
});

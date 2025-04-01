require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parkingRoutes');
const billingRoutes = require("./routes/billingRoutes");
const cors = require("cors"); // Import CORS


const app = express(); // Initialize Express app

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Make frontend URL configurable through .env
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());  // Middleware to parse JSON request bodies

// Connect to MongoDB
connectDB();

// Home route for testing
app.get('/', (req, res) => {
    res.send('MongoDB Connection Test Successful');
});

// Routes
app.use('/parking', parkingRoutes);
app.use("/billing", billingRoutes);


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

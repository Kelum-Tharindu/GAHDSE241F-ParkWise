require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parkingRoutes');
const billingRoutes = require("./routes/billingRoutes");

const app = express();
app.use(express.json());  // Middleware to parse JSON request bodies

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('MongoDB Connection Test Successful');
});
app.use('/parking', parkingRoutes);

app.use("/billing", billingRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

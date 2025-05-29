const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/dashboard/metricsController');
const bookingAnalyticsController = require('../controllers/dashboard/bookingAnalyticsController');

// Get dashboard metrics
router.get('/metrics', metricsController.getDashboardMetrics);

// Get monthly booking analytics
router.get('/monthly-bookings', bookingAnalyticsController.getMonthlyBookings);

module.exports = router;

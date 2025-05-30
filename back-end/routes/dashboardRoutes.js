const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/dashboard/metricsController');
const bookingAnalyticsController = require('../controllers/dashboard/bookingAnalyticsController');
const targetController = require('../controllers/dashboard/targetController');
const targetManagementController = require('../controllers/dashboard/targetManagementController');

// Get dashboard metrics
router.get('/metrics', metricsController.getDashboardMetrics);

// Get monthly booking analytics
router.get('/monthly-bookings', bookingAnalyticsController.getMonthlyBookings);

// Get monthly target data
router.get('/monthly-target', targetController.getMonthlyTarget);

// Target management routes
router.get('/target-management', targetManagementController.getAllMonthlyTargets);
router.get('/target-management/:year/:month', targetManagementController.getMonthlyTargetByYearMonth);
router.post('/target-management', targetManagementController.setMonthlyTarget);
router.put('/target-management/:year/:month', targetManagementController.updateMonthlyTarget);
router.delete('/target-management', targetManagementController.deleteMonthlyTarget);

module.exports = router;

const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/dashboard/metricsController');

// Get dashboard metrics
router.get('/metrics', metricsController.getDashboardMetrics);

module.exports = router;

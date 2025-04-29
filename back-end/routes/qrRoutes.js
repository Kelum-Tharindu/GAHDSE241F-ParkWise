// routes/qrRoutes.js

const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// QR Entry route
router.post('/entry', qrController.handleEntryQR);

// QR Exit route
router.post('/exit', qrController.handleExitQR);

// Get QR status route
router.get('/status/:id', qrController.getQRStatus);

module.exports = router;
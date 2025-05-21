const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment routes
router.post('/customer', paymentController.createCustomerPayment);
router.post('/landowner', paymentController.createLandownerPayment);
router.get('/all', paymentController.getAllPayments);
router.get('/summary', paymentController.getPaymentSummary);
router.get('/user/:userId', paymentController.getPaymentsByUserId);
router.get('/:paymentId', paymentController.getPaymentById);
router.patch('/:paymentId/status', paymentController.updatePaymentStatus);

module.exports = router; 
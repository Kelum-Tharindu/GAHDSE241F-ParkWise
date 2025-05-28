const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Create
router.post('/', transactionController.createTransaction);
// Read all
router.get('/', transactionController.getAllTransactions);
// Read one
router.get('/:id', transactionController.getTransactionById);
// Update
router.put('/:id', transactionController.updateTransaction);
// Delete
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;

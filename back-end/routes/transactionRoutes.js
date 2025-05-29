const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get all transactions with booking usernames
router.get('/details-with-info', transactionController.getAllTransactionsWithDetails);

// If you implement this function later, uncomment the following line:
// router.get('/details/all', transactionController.getTransactionDetails);

// Get a single transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Update a transaction
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;

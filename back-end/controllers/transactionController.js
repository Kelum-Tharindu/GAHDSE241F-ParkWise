const Transaction = require('../models/transactionModel');
const Landowner = require('../models/LandOwner');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions (with landowner name for admin payouts)
exports.getAllTransactions = async (req, res) => {
  try {
    console.log('[API] GET /api/transactions called');
    // Get all transactions
    let transactions = await Transaction.find().lean();
    console.log('[API] Transactions fetched:', transactions.length);

    // For admin payouts, populate landowner name and remove LandOwnerID
    const adminTransactions = transactions.filter(t => t.type === 'admin' && t.LandOwnerID);
    if (adminTransactions.length > 0) {
      const landownerIds = [...new Set(adminTransactions.map(t => t.LandOwnerID.toString()))];
      const landowners = await Landowner.find({ _id: { $in: landownerIds } }).select('_id username').lean();
      const landownerMap = {};
      landowners.forEach(l => { landownerMap[l._id.toString()] = l.username; });
      transactions = transactions.map(t => {
        if (t.type === 'admin' && t.LandOwnerID) {
          return { ...t, landownerName: landownerMap[t.LandOwnerID.toString()] || 'Unknown' };
        }
        return t;
      });
      console.log('[API] Admin transactions mapped with landowner names');
    }
    transactions = transactions.map(t => {
      if (t.type === 'admin') {
        const { LandOwnerID, ...rest } = t;
        return rest;
      }
      return t;
    });
    console.log('[API] Sending transactions response:', transactions.length);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('bookingId')
      .populate('billingId');
    if (!transaction) return res.status(404).json({ error: 'Not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ error: 'Not found' });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

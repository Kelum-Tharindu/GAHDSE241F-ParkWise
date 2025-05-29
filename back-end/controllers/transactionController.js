const Transaction = require('../models/transactionModel');
const Landowner = require('../models/LandOwner');
const Booking = require('../models/bookingmodel');
const Billing = require('../models/Billingmodel');
const User = require('../models/usermodel');
const Parking = require('../models/parkingmodel');

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions (with landowner name for admin payouts)
const getAllTransactions = async (req, res) => {
  try {
    console.log('[API] GET /api/transactions called');

    let transactions = await Transaction.find().lean();
    console.log('[API] Transactions fetched:', transactions.length);

    const adminTransactions = transactions.filter(t => t.type === 'admin' && t.LandOwnerID);
    if (adminTransactions.length > 0) {
      const landownerIds = [...new Set(adminTransactions.map(t => t.LandOwnerID.toString()))];
      const landowners = await Landowner.find({ _id: { $in: landownerIds } }).select('_id username').lean();

      const landownerMap = {};
      landowners.forEach(l => {
        landownerMap[l._id.toString()] = l.username;
      });

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
const getTransactionById = async (req, res) => {
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
const updateTransaction = async (req, res) => {
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
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTransactionsWithDetails = async (req, res) => {
  try {
    console.log('[API] GET /api/transactions (with details and summary) called');
    let transactions = await Transaction.find().lean();
    console.log('[API] Transactions fetched:', transactions.length);

    // --- ADMIN: Add landowner name ---
    const adminTransactions = transactions.filter(t => t.type === 'admin' && t.LandOwnerID);
    let landownerMap = {};
    if (adminTransactions.length > 0) {
      const landownerIds = [...new Set(adminTransactions.map(t => t.LandOwnerID.toString()))];
      const landowners = await Landowner.find({ _id: { $in: landownerIds } }).select('_id username').lean();
      landowners.forEach(l => { landownerMap[l._id.toString()] = l.username; });
    }

    // --- BOOKING: Add user name ---
    const bookingTransactions = transactions.filter(t => t.type === 'booking' && t.bookingId);
    let bookingUserMap = {};
    if (bookingTransactions.length > 0) {
      const bookingIds = [...new Set(bookingTransactions.map(t => t.bookingId.toString()))];
      const bookings = await Booking.find({ _id: { $in: bookingIds } }).select('_id userId').lean();
      const userIds = [...new Set(bookings.map(b => b.userId.toString()))];
      const users = await User.find({ _id: { $in: userIds } }).select('_id username').lean();
      const userMap = {};
      users.forEach(u => { userMap[u._id.toString()] = u.username; });
      bookings.forEach(b => { bookingUserMap[b._id.toString()] = userMap[b.userId.toString()] || 'Unknown'; });
    }

    // --- BILLING: Add parking name ---
    const billingTransactions = transactions.filter(t => t.type === 'billing' && t.billingId);
    let billingParkingMap = {};
    if (billingTransactions.length > 0) {
      const billingIds = [...new Set(billingTransactions.map(t => t.billingId.toString()))];
      const billings = await Billing.find({ _id: { $in: billingIds } }).select('_id parkingID').lean();
      const parkingIds = [...new Set(billings.map(b => b.parkingID))];
      const parkings = await Parking.find({ _id: { $in: parkingIds } }).select('_id name').lean();
      const parkingMap = {};
      parkings.forEach(p => { parkingMap[p._id.toString()] = p.name; });
      billings.forEach(b => { billingParkingMap[b._id.toString()] = parkingMap[b.parkingID?.toString()] || 'Unknown'; });
    }

    // --- Compose final transactions ---
    transactions = transactions.map(t => {
      if (t.type === 'admin' && t.LandOwnerID) {
        return { ...t, landownerName: landownerMap[t.LandOwnerID.toString()] || 'Unknown' };
      }
      if (t.type === 'booking' && t.bookingId) {
        return { ...t, bookedBy: bookingUserMap[t.bookingId.toString()] || 'Unknown' };
      }
      if (t.type === 'billing' && t.billingId) {
        return { ...t, parkingName: billingParkingMap[t.billingId.toString()] || 'Unknown' };
      }
      return t;
    });

    // Remove LandOwnerID for admin transactions
    transactions = transactions.map(t => {
      if (t.type === 'admin') {
        const { LandOwnerID, ...rest } = t;
        return rest;
      }
      return t;
    });

    // --- Calculate summary ---
    const summary = transactions.reduce((acc, t) => {
      if (!acc.byType[t.type]) acc.byType[t.type] = 0;
      acc.byType[t.type] += t.amount || 0;
      acc.total += t.amount || 0;
      return acc;
    }, { byType: {}, total: 0 });

    console.log('[API] Sending transactions response with summary:', transactions.length);
    
    res.status(200).json({
      transactions,
      summary
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
  }
};

// Export all functions
module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAllTransactionsWithDetails,
};

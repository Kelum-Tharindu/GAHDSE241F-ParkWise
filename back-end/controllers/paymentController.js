const Payment = require('../models/paymentModel');
const Booking = require('../models/bookingmodel');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Generate a unique payment ID
const generatePaymentId = (userType) => {
  const prefix = userType === 'customer' ? 'C-' : 'L-';
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${prefix}${randomNum}`;
};

// Create a new customer payment when a booking is completed
exports.createCustomerPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if payment already exists for this booking
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this booking' });
    }

    // Create a new payment record
    const newPayment = new Payment({
      paymentId: generatePaymentId('customer'),
      userType: 'customer',
      userId: booking.userId,
      date: new Date(),
      amount: booking.fee.totalFee,
      method: paymentMethod || 'Credit Card', // Default to Credit Card if not specified
      location: booking.parkingName,
      status: 'Completed',
      bookingId: booking._id,
      spot: `Lot ${booking.parkingName.charAt(0)} - ${Math.floor(Math.random() * 20) + 1}`, // Generate a sample spot for demo
      description: `Payment for booking on ${new Date(booking.bookingDate).toLocaleDateString()}`,
      reference: crypto.randomBytes(8).toString('hex')
    });

    const savedPayment = await newPayment.save({ session });

    // Update booking payment status
    booking.paymentStatus = 'completed';
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedPayment);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating customer payment:', error);
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
};

// Create a landowner payment (payout)
exports.createLandownerPayment = async (req, res) => {
  try {
    const { landownerId, amount, location, spaces, periodStart, periodEnd } = req.body;

    if (!landownerId || !amount || !location || !spaces) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newPayment = new Payment({
      paymentId: generatePaymentId('landowner'),
      userType: 'landowner',
      userId: landownerId,
      date: new Date(),
      amount,
      method: 'Bank Transfer', // Default method for landowner payouts
      location,
      status: 'Paid',
      spaces,
      periodStart: periodStart ? new Date(periodStart) : new Date(Date.now() - 30*24*60*60*1000), // Default to last 30 days
      periodEnd: periodEnd ? new Date(periodEnd) : new Date(),
      description: `Monthly payout for parking spaces at ${location}`,
      reference: crypto.randomBytes(8).toString('hex')
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Error creating landowner payment:', error);
    res.status(500).json({ message: 'Failed to create landowner payment', error: error.message });
  }
};

// Get all payments (with filtering options)
exports.getAllPayments = async (req, res) => {
  try {
    const { userType, userId, startDate, endDate, status } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (userType) filter.userType = userType;
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    
    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const payments = await Payment.find(filter)
      .sort({ date: -1 })
      .lean();
    
    // Format data to match frontend format
    const formattedPayments = payments.map(payment => ({
      id: payment.paymentId,
      date: payment.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      amount: payment.amount,
      method: payment.method,
      spot: payment.spot,
      spaces: payment.spaces,
      location: payment.location,
      status: payment.status
    }));
    
    // Calculate totals for summary
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    res.status(200).json({
      payments: formattedPayments,
      summary: {
        total: totalAmount,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

// Get payment details by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findOne({ paymentId })
      .lean();
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
  }
};

// Get payments by user ID
exports.getPaymentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType } = req.query;
    
    const filter = { userId };
    if (userType) filter.userType = userType;
    
    const payments = await Payment.find(filter)
      .sort({ date: -1 })
      .lean();
    
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }
    
    // Format data to match frontend requirements
    const formattedPayments = payments.map(payment => ({
      id: payment.paymentId,
      date: payment.date.toISOString().split('T')[0],
      amount: payment.amount,
      method: payment.method,
      spot: payment.userType === 'customer' ? payment.spot : undefined,
      spaces: payment.userType === 'landowner' ? payment.spaces : undefined,
      location: payment.location,
      status: payment.status
    }));
    
    // Calculate totals
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    res.status(200).json({
      payments: formattedPayments,
      summary: {
        total: totalAmount,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Failed to fetch user payments', error: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const payment = await Payment.findOne({ paymentId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    payment.status = status;
    await payment.save();
    
    res.status(200).json({ message: 'Payment status updated', payment });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
};

// Generate payment summary data (for dashboard)
exports.getPaymentSummary = async (req, res) => {
  try {
    // Get current month details
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Get all payments for the current month
    const monthlyPayments = await Payment.find({
      date: { $gte: firstDay, $lte: lastDay }
    }).lean();
    
    // Calculate customer payments
    const customerPayments = monthlyPayments.filter(p => p.userType === 'customer');
    const customerTotal = customerPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Calculate landowner payouts
    const landownerPayments = monthlyPayments.filter(p => p.userType === 'landowner');
    const landownerTotal = landownerPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Calculate by payment status
    const completedPayments = monthlyPayments.filter(p => p.status === 'Completed' || p.status === 'Paid');
    const pendingPayments = monthlyPayments.filter(p => p.status === 'Pending');
    const failedPayments = monthlyPayments.filter(p => p.status === 'Failed');
    
    // Calculate by payment method
    const methodBreakdown = {};
    monthlyPayments.forEach(payment => {
      if (!methodBreakdown[payment.method]) {
        methodBreakdown[payment.method] = { count: 0, amount: 0 };
      }
      methodBreakdown[payment.method].count++;
      methodBreakdown[payment.method].amount += payment.amount;
    });
    
    // Format month name
    const monthName = now.toLocaleString('default', { month: 'long' });
    
    res.status(200).json({
      month: `${monthName} ${currentYear}`,
      totalTransactions: monthlyPayments.length,
      customerPayments: {
        count: customerPayments.length,
        total: customerTotal
      },
      landownerPayouts: {
        count: landownerPayments.length,
        total: landownerTotal
      },
      statusBreakdown: {
        completed: completedPayments.length,
        pending: pendingPayments.length,
        failed: failedPayments.length
      },
      methodBreakdown
    });
  } catch (error) {
    console.error('Error generating payment summary:', error);
    res.status(500).json({ message: 'Failed to generate payment summary', error: error.message });
  }
};

// Hook function to be called after booking confirmation
exports.processBookingPayment = async (bookingId, paymentMethod = 'Credit Card') => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Create a payment record
    const payment = new Payment({
      paymentId: generatePaymentId('customer'),
      userType: 'customer',
      userId: booking.userId,
      date: new Date(),
      amount: booking.fee.totalFee,
      method: paymentMethod,
      location: booking.parkingName,
      status: booking.paymentStatus === 'completed' ? 'Completed' : 'Pending',
      bookingId: booking._id,
      spot: `Lot ${booking.parkingName.charAt(0)} - ${Math.floor(Math.random() * 20) + 1}`, // Generate a sample spot
      description: `Payment for booking on ${new Date(booking.bookingDate).toLocaleDateString()}`
    });
    
    await payment.save();
    return payment;
  } catch (error) {
    console.error('Error processing booking payment:', error);
    throw error;
  }
}; 
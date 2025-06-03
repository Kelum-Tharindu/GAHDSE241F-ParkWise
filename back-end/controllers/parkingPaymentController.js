const BulkBookingChunk = require('../models/bulkbooking');
const Transaction = require('../models/transactionModel');
const Parking = require('../models/parkingmodel');
const User = require('../models/usermodel');

// Get parking payment summary for a user (Event Coordinator)
const getParkingPaymentSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get all bulk booking chunks for the user
    const bulkBookings = await BulkBookingChunk.find({ user: userId }).lean();

    if (!bulkBookings || bulkBookings.length === 0) {
      return res.status(404).json({ message: 'No parking payment data found for this user' });
    }

    // Get all transaction records for these bulk bookings
    const bulkBookingIds = bulkBookings.map(booking => booking._id);
    const transactions = await Transaction.find({
      type: 'bulkbooking',
      bulkBookingId: { $in: bulkBookingIds }
    }).lean();

    // Transform bulk booking data to match frontend expectations
    const parkingSlots = bulkBookings.map(booking => {
      // Find corresponding transaction for this booking
      const transaction = transactions.find(t => 
        t.bulkBookingId && t.bulkBookingId.toString() === booking._id.toString()
      );

      // Calculate usage percentage (used spots / total spots * 100)
      const usage = booking.totalSpots > 0 
        ? Math.round((booking.usedSpots / booking.totalSpots) * 100) 
        : 0;

      // Determine payment status based on bulk booking status and transaction
      let paymentStatus = 'pending';
      if (transaction && transaction.status === 'completed') {
        paymentStatus = 'paid';
      } else if (new Date(booking.validTo) < new Date()) {
        paymentStatus = 'overdue';
      }

      return {
        id: booking._id.toString(),
        location: booking.parkingName,
        capacity: booking.totalSpots,
        price: transaction ? transaction.amount : 0,
        paymentDate: booking.purchaseDate,
        paymentStatus: paymentStatus,
        validUntil: booking.validTo,
        usage: usage,
        chunkName: booking.chunkName,
        company: booking.company,
        vehicleType: booking.vehicleType,
        availableSpots: booking.availableSpots,
        usedSpots: booking.usedSpots,
        status: booking.status
      };
    });

    // Calculate summary statistics
    const summary = calculateParkingPaymentSummary(parkingSlots);

    res.status(200).json({
      slots: parkingSlots,
      summary: summary
    });

  } catch (error) {
    console.error('Error fetching parking payment summary:', error);
    res.status(500).json({ 
      message: 'Error fetching parking payment summary', 
      error: error.message 
    });
  }
};

// Get all parking payments for admin view
const getAllParkingPayments = async (req, res) => {
  try {
    // Get all bulk booking chunks
    const bulkBookings = await BulkBookingChunk.find().populate('user', 'username email').lean();

    if (!bulkBookings || bulkBookings.length === 0) {
      return res.status(404).json({ message: 'No parking payment data found' });
    }

    // Get all transaction records for bulk bookings
    const bulkBookingIds = bulkBookings.map(booking => booking._id);
    const transactions = await Transaction.find({
      type: 'bulkbooking',
      bulkBookingId: { $in: bulkBookingIds }
    }).lean();

    // Transform data
    const parkingSlots = bulkBookings.map(booking => {
      const transaction = transactions.find(t => 
        t.bulkBookingId && t.bulkBookingId.toString() === booking._id.toString()
      );

      const usage = booking.totalSpots > 0 
        ? Math.round((booking.usedSpots / booking.totalSpots) * 100) 
        : 0;

      let paymentStatus = 'pending';
      if (transaction && transaction.status === 'completed') {
        paymentStatus = 'paid';
      } else if (new Date(booking.validTo) < new Date()) {
        paymentStatus = 'overdue';
      }

      return {
        id: booking._id.toString(),
        location: booking.parkingName,
        capacity: booking.totalSpots,
        price: transaction ? transaction.amount : 0,
        paymentDate: booking.purchaseDate,
        paymentStatus: paymentStatus,
        validUntil: booking.validTo,
        usage: usage,
        chunkName: booking.chunkName,
        company: booking.company,
        vehicleType: booking.vehicleType,
        availableSpots: booking.availableSpots,
        usedSpots: booking.usedSpots,
        status: booking.status,
        user: booking.user
      };
    });

    // Calculate summary statistics
    const summary = calculateParkingPaymentSummary(parkingSlots);

    res.status(200).json({
      slots: parkingSlots,
      summary: summary
    });

  } catch (error) {
    console.error('Error fetching all parking payments:', error);
    res.status(500).json({ 
      message: 'Error fetching parking payments', 
      error: error.message 
    });
  }
};

// Get detailed information for a specific parking slot payment
const getParkingPaymentDetails = async (req, res) => {
  try {
    const { slotId } = req.params;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    // Get the bulk booking chunk
    const bulkBooking = await BulkBookingChunk.findById(slotId)
      .populate('user', 'username email')
      .lean();

    if (!bulkBooking) {
      return res.status(404).json({ message: 'Parking slot payment not found' });
    }

    // Get transaction record
    const transaction = await Transaction.findOne({
      type: 'bulkbooking',
      bulkBookingId: slotId
    }).lean();

    // Get parking details for additional information
    const parking = await Parking.findOne({ name: bulkBooking.parkingName }).lean();

    const usage = bulkBooking.totalSpots > 0 
      ? Math.round((bulkBooking.usedSpots / bulkBooking.totalSpots) * 100) 
      : 0;

    let paymentStatus = 'pending';
    if (transaction && transaction.status === 'completed') {
      paymentStatus = 'paid';
    } else if (new Date(bulkBooking.validTo) < new Date()) {
      paymentStatus = 'overdue';
    }

    const detailedSlot = {
      id: bulkBooking._id.toString(),
      location: bulkBooking.parkingName,
      capacity: bulkBooking.totalSpots,
      price: transaction ? transaction.amount : 0,
      paymentDate: bulkBooking.purchaseDate,
      paymentStatus: paymentStatus,
      validUntil: bulkBooking.validTo,
      usage: usage,
      chunkName: bulkBooking.chunkName,
      company: bulkBooking.company,
      vehicleType: bulkBooking.vehicleType,
      availableSpots: bulkBooking.availableSpots,
      usedSpots: bulkBooking.usedSpots,
      status: bulkBooking.status,
      user: bulkBooking.user,
      remarks: bulkBooking.remarks,
      validFrom: bulkBooking.validFrom,
      transaction: transaction,
      parkingDetails: parking
    };

    res.status(200).json(detailedSlot);

  } catch (error) {
    console.error('Error fetching parking payment details:', error);
    res.status(500).json({ 
      message: 'Error fetching parking payment details', 
      error: error.message 
    });
  }
};

// Helper function to calculate summary statistics
const calculateParkingPaymentSummary = (parkingSlots) => {
  const totalSpent = parkingSlots.reduce((sum, slot) => sum + (slot.price || 0), 0);
  const totalSlots = parkingSlots.reduce((sum, slot) => sum + (slot.capacity || 0), 0);
  const activePayments = parkingSlots.filter(slot => slot.paymentStatus === 'paid').length;
  const pendingPayments = parkingSlots.filter(slot => slot.paymentStatus === 'pending').length;
  const overduePayments = parkingSlots.filter(slot => slot.paymentStatus === 'overdue').length;
  
  const totalUsagePercentage = parkingSlots.reduce((sum, slot) => sum + (slot.usage || 0), 0);
  const averageUsage = parkingSlots.length > 0 ? totalUsagePercentage / parkingSlots.length : 0;

  return {
    totalSpent,
    totalSlots,
    activePayments,
    pendingPayments,
    overduePayments,
    averageUsage: Math.round(averageUsage * 100) / 100
  };
};

// Update parking slot usage (when spots are used/freed)
const updateSlotUsage = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { usedSpots } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    if (usedSpots === undefined || usedSpots < 0) {
      return res.status(400).json({ message: 'Valid used spots count is required' });
    }

    const bulkBooking = await BulkBookingChunk.findById(slotId);

    if (!bulkBooking) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    if (usedSpots > bulkBooking.totalSpots) {
      return res.status(400).json({ 
        message: 'Used spots cannot exceed total spots' 
      });
    }

    // Update usage
    bulkBooking.usedSpots = usedSpots;
    bulkBooking.availableSpots = bulkBooking.totalSpots - usedSpots;

    // Update status based on usage
    if (usedSpots >= bulkBooking.totalSpots) {
      bulkBooking.status = 'Full';
    } else if (new Date(bulkBooking.validTo) < new Date()) {
      bulkBooking.status = 'Expired';
    } else {
      bulkBooking.status = 'Active';
    }

    await bulkBooking.save();

    res.status(200).json({
      message: 'Slot usage updated successfully',
      slot: bulkBooking
    });

  } catch (error) {
    console.error('Error updating slot usage:', error);
    res.status(500).json({ 
      message: 'Error updating slot usage', 
      error: error.message 
    });
  }
};

module.exports = {
  getParkingPaymentSummary,
  getAllParkingPayments,
  getParkingPaymentDetails,
  updateSlotUsage
};

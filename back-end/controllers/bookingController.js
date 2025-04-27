const Booking = require('../models/bookingmodel');
const Parking = require('../models/parkingmodel');
const crypto = require('crypto');
const { generateQR } = require("../utils/qrGenertor");

// Helper: calculate duration in minutes
function calculateMinutes(entry, exit) {
  const diff = Math.abs(new Date(exit) - new Date(entry));
  return Math.ceil(diff / (1000 * 60)); // in minutes
}

// Step 1: Calculate and preview fee
const calculateFee = async (req, res) => {
  try {
    const { parkingName, vehicleType, entryTime, exitTime } = req.body;

    const parking = await Parking.findOne({ name: parkingName });
    if (!parking) return res.status(404).json({ message: 'Parking not found' });

    const pricing = parking.slotDetails[vehicleType];
    if (!pricing) return res.status(400).json({ message: 'Invalid vehicle type' });

    const totalMinutes = calculateMinutes(entryTime, exitTime);
    const usageFee = Math.ceil(totalMinutes / 30) * pricing.perPrice30Min;
    const bookingFee = 100; // Static booking fee (or change as needed)
    const totalFee = usageFee + bookingFee;

    res.status(200).json({
      usageFee,
      bookingFee,
      totalFee,
      entryTime,
      exitTime,
      totalDuration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    });
  } catch (error) {
    res.status(500).json({ message: 'Fee calculation failed', error: error.message });
  }
};

// Step 2: Confirm booking
const confirmBooking = async (req, res) => {
  try {
    const {
      parkingId,
      userId,
      bookingDate,
      entryTime,
      exitTime,
      fee,
      paymentStatus,
      bookingState,
      vehicleType
    } = req.body;

    // Generate unique billingHash and qrImage
    const hashData = `${parkingId}${userId}${Date.now()}`;
    const billingHash = crypto.createHash('sha256').update(hashData).digest('hex');
    const qrImage = await generateQR(billingHash);

    const totalMinutes = calculateMinutes(entryTime, exitTime);
    const totalDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

    const newBooking = new Booking({
      parkingId,
      userId,
      bookingDate,
      entryTime,
      exitTime,
      fee,
      paymentStatus,
      bookingState,
      billingHash,
      qrImage,
      totalDuration,
      vehicleType
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Failed to confirm booking', error: error.message });
  }
};

const getParkingNames = async (req, res) => {
  try {
    const parkingNames = await Parking.find({}, 'name'); // Fetch only the 'name' field
    res.status(200).json(parkingNames.map(parking => parking.name));
  } catch (error) {
    console.error('Error fetching parking names:', error);
    res.status(500).json({ message: 'Failed to fetch parking names', error: error.message });
  }
};

module.exports = {
  calculateFee,
  confirmBooking,
  getParkingNames
};

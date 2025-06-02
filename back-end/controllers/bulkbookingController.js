const BulkBookingChunk = require('../models/bulkbooking');
const Transaction = require('../models/transactionModel');
const crypto = require('crypto');
const { generateQR } = require('../utils/qrGenertor');

// Get all bulk booking chunks
exports.getAllBulkBookingChunks = async (req, res) => {
  try {
    const chunks = await BulkBookingChunk.find().populate('user', 'email _id');
    res.status(200).json(chunks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bulk booking chunks', error: error.message });
  }
};

// Get bulk booking chunks for a specific user
exports.getBulkBookingChunksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Ensure the requesting user is either an admin or the user whose chunks are being requested
  
    const chunks = await BulkBookingChunk.find({ user: userId }).populate('user', 'email _id');
    if (!chunks || chunks.length === 0) {
      return res.status(404).json({ message: 'No bulk booking chunks found for this user' });
    }
    res.status(200).json(chunks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bulk booking chunks for user', error: error.message });
  }
};

// Create a new bulk booking chunk
exports.createBulkBookingChunk = async (req, res) => {
  try {
    const {
      user, // user id
      parkingId,
      chunkName,
      company,
      totalSpots,
      validFrom,
      validTo,
      remarks,
      vehicleType = 'car' // Default to car if not provided
    } = req.body;

    // Set default values
    const purchaseDate = new Date();
    const usedSpots = 0;
    const availableSpots = totalSpots;
    const status = 'Active';

    // Fetch parking name from parkingId
    let parkingName = '';
    try {
      const Parking = require('../models/parkingmodel');
      const parking = await Parking.findById(parkingId);
      if (parking) {
        parkingName = parking.name;
      } else {
        return res.status(404).json({ message: 'Parking not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching parking details', error: error.message });
    }

    // Create the chunk first (without qrImage)
    const chunk = new BulkBookingChunk({
      user,
      purchaseDate,
      parkingName,
      chunkName,
      company,
      totalSpots,
      usedSpots,
      availableSpots,
      validFrom,
      validTo,
      status,
      remarks,
      vehicleType
    });
    await chunk.save();

    // Prepare the payload and encrypt it (id and type)
    const payload = JSON.stringify({
      id: chunk._id.toString(),
      type: 'bulkbooking'
    });
    // Encrypt the payload using sha256
    const encryptedCode = crypto.createHash('sha256').update(payload).digest('hex');
    // Generate QR code with only the encrypted code
    const qrImage = await generateQR(encryptedCode);    // Update chunk with qrImage
    chunk.qrImage = qrImage;
    await chunk.save();

    // Calculate transaction amount based on pricing
    // First get the parking details to calculate the amount
    let transactionAmount = 0;
    try {
      const Parking = require('../models/parkingmodel');
      const parking = await Parking.findById(parkingId);
      if (parking && parking.slotDetails && parking.slotDetails[vehicleType]) {
        const pricePerDay = parking.slotDetails[vehicleType].perDayPrice || 0;
        
        // Calculate number of days (inclusive)
        const startDate = new Date(validFrom);
        const endDate = new Date(validTo);
        const numDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        
        transactionAmount = pricePerDay * totalSpots * numDays;
      }
    } catch (pricingError) {
      console.warn('Warning: Could not calculate pricing for bulk booking transaction:', pricingError.message);
      // Continue without failing the bulk booking creation
    }

    // Create corresponding transaction record
    try {
      const transaction = new Transaction({
        type: 'bulkbooking',
        bulkBookingId: chunk._id,
        amount: transactionAmount,
        method: 'Credit Card', // Default payment method - can be made dynamic later
        status: 'Completed', // Assuming immediate completion - can be made dynamic later
        date: new Date()
      });
      
      await transaction.save();
      console.log('Transaction created for bulk booking:', transaction._id);
    } catch (transactionError) {
      console.error('Warning: Failed to create transaction for bulk booking:', transactionError.message);
      // Log the error but don't fail the bulk booking creation
    }

    res.status(201).json(chunk);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create bulk booking chunk', error: error.message });
  }
};

// Decrypt function to get details from encrypted code
exports.decryptBulkBookingCode = async (req, res) => {
  try {
    const { code } = req.body; // code is the sha256 hash
    // Since sha256 is one-way, you cannot decrypt it directly.
    // Instead, you must search all bulk bookings and compare hashes.
    const chunks = await BulkBookingChunk.find();
    for (const chunk of chunks) {
      const payload = JSON.stringify({ id: chunk._id.toString(), type: 'bulkbooking' });
      const hash = crypto.createHash('sha256').update(payload).digest('hex');
      if (hash === code) {
        return res.status(200).json({ id: chunk._id.toString(), type: 'bulkbooking' });
      }
    }
    res.status(404).json({ message: 'No matching record found for this code.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to decrypt code', error: error.message });
  }
};

// Update status of a bulk booking chunk
exports.updateBulkBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const chunk = await BulkBookingChunk.findByIdAndUpdate(id, { status }, { new: true });
    if (!chunk) return res.status(404).json({ message: 'Chunk not found' });
    res.status(200).json(chunk);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update status', error: error.message });
  }
};

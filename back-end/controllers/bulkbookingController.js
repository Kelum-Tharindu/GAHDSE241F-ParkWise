const BulkBookingChunk = require('../models/bulkbooking');
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

// Create a new bulk booking chunk
exports.createBulkBookingChunk = async (req, res) => {
  try {
    const {
      user, // user id
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
    } = req.body;

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

    // Generate encrypted id using sha256
    const encryptedId = crypto.createHash('sha256').update(chunk._id.toString()).digest('hex');
    // Generate QR code with collection id (chunk._id)
    const qrImage = await generateQR(chunk._id.toString());

    // Update chunk with qrImage
    chunk.qrImage = qrImage;
    await chunk.save();

    res.status(201).json(chunk);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create bulk booking chunk', error: error.message });
  }
};

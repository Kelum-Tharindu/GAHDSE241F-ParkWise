const SubBulkBooking = require('../models/subBulkBooking');
const BulkBookingChunk = require('../models/bulkbooking');
const User = require('../models/usermodel');
const crypto = require('crypto');
const { generateQR } = require('../utils/qrGenertor');

// Get all sub bulk bookings for a specific owner (Event Coordinator)
exports.getSubBulkBookingsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const subBookings = await SubBulkBooking.find({ ownerId })
      .populate('bulkBookingId', 'parkingName chunkName totalSpots')
      .populate('customerId', 'username email firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subBookings.length,
      data: subBookings
    });
  } catch (error) {
    console.error('Error fetching sub bulk bookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch sub bulk bookings', 
      error: error.message 
    });
  }
};

// Get sub bulk bookings for a specific customer
exports.getSubBulkBookingsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const subBookings = await SubBulkBooking.find({ customerId })
      .populate('bulkBookingId', 'parkingName chunkName')
      .populate('ownerId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subBookings.length,
      data: subBookings
    });
  } catch (error) {
    console.error('Error fetching customer sub bulk bookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customer sub bulk bookings', 
      error: error.message 
    });
  }
};

// Create a new sub bulk booking assignment
exports.createSubBulkBooking = async (req, res) => {
  try {
    const {
      bulkBookingId,
      ownerId,
      customerId,
      assignedSpots,
      validFrom,
      validTo,
      notes
    } = req.body;

    // Validate required fields
    if (!bulkBookingId || !ownerId || !customerId || !assignedSpots || !validFrom || !validTo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get bulk booking details
    const bulkBooking = await BulkBookingChunk.findById(bulkBookingId);
    if (!bulkBooking) {
      return res.status(404).json({
        success: false,
        message: 'Bulk booking not found'
      });
    }

    // Verify ownership
    if (bulkBooking.user.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only assign from your own bulk bookings'
      });
    }

    // Get customer details
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if there are enough available spots
    const existingAssignments = await SubBulkBooking.find({ 
      bulkBookingId, 
      status: 'Active' 
    });
    const totalAssignedSpots = existingAssignments.reduce((sum, assignment) => sum + assignment.assignedSpots, 0);
    
    if (totalAssignedSpots + assignedSpots > bulkBooking.availableSpots) {
      return res.status(400).json({
        success: false,
        message: `Insufficient available spots. Available: ${bulkBooking.availableSpots - totalAssignedSpots}, Requested: ${assignedSpots}`
      });
    }

    // Validate dates are within bulk booking period
    const bulkValidFrom = new Date(bulkBooking.validFrom);
    const bulkValidTo = new Date(bulkBooking.validTo);
    const subValidFrom = new Date(validFrom);
    const subValidTo = new Date(validTo);

    if (subValidFrom < bulkValidFrom || subValidTo > bulkValidTo) {
      return res.status(400).json({
        success: false,
        message: `Assignment dates must be within bulk booking period (${bulkValidFrom.toDateString()} - ${bulkValidTo.toDateString()})`
      });
    }

    // Create sub bulk booking
    const subBulkBooking = new SubBulkBooking({
      bulkBookingId,
      ownerId,
      customerId,
      customerName: customer.username || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      customerEmail: customer.email,
      assignedSpots,
      validFrom: subValidFrom,
      validTo: subValidTo,
      parkingLocation: bulkBooking.parkingName,
      notes: notes || ''
    });

    // Generate QR code
    const qrPayload = JSON.stringify({
      id: subBulkBooking._id.toString(),
      type: 'subbulkbooking',
      customerId: customerId,
      bulkBookingId: bulkBookingId
    });
    const encryptedCode = crypto.createHash('sha256').update(qrPayload).digest('hex');
    const qrImage = await generateQR(encryptedCode);
    subBulkBooking.qrCode = qrImage;

    await subBulkBooking.save();

    // Update bulk booking used spots
    bulkBooking.usedSpots += assignedSpots;
    bulkBooking.availableSpots = bulkBooking.totalSpots - bulkBooking.usedSpots;
    await bulkBooking.save();

    // Populate the response
    await subBulkBooking.populate('bulkBookingId', 'parkingName chunkName');
    await subBulkBooking.populate('customerId', 'username email');

    res.status(201).json({
      success: true,
      message: 'Sub bulk booking created successfully',
      data: subBulkBooking
    });

  } catch (error) {
    console.error('Error creating sub bulk booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sub bulk booking',
      error: error.message
    });
  }
};

// Update a sub bulk booking
exports.updateSubBulkBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const subBulkBooking = await SubBulkBooking.findById(id);
    if (!subBulkBooking) {
      return res.status(404).json({
        success: false,
        message: 'Sub bulk booking not found'
      });
    }

    // If updating assigned spots, check availability
    if (updates.assignedSpots && updates.assignedSpots !== subBulkBooking.assignedSpots) {
      const bulkBooking = await BulkBookingChunk.findById(subBulkBooking.bulkBookingId);
      const spotDifference = updates.assignedSpots - subBulkBooking.assignedSpots;
      
      if (spotDifference > 0 && spotDifference > (bulkBooking.availableSpots - bulkBooking.usedSpots)) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient available spots for this update'
        });
      }

      // Update bulk booking spots
      bulkBooking.usedSpots += spotDifference;
      bulkBooking.availableSpots = bulkBooking.totalSpots - bulkBooking.usedSpots;
      await bulkBooking.save();
    }

    // Update customer info if customer changed
    if (updates.customerId && updates.customerId !== subBulkBooking.customerId.toString()) {
      const customer = await User.findById(updates.customerId);
      if (customer) {
        updates.customerName = customer.username || `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
        updates.customerEmail = customer.email;
      }
    }

    const updatedSubBulkBooking = await SubBulkBooking.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('bulkBookingId', 'parkingName chunkName')
     .populate('customerId', 'username email');

    res.status(200).json({
      success: true,
      message: 'Sub bulk booking updated successfully',
      data: updatedSubBulkBooking
    });

  } catch (error) {
    console.error('Error updating sub bulk booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sub bulk booking',
      error: error.message
    });
  }
};

// Delete a sub bulk booking
exports.deleteSubBulkBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const subBulkBooking = await SubBulkBooking.findById(id);
    if (!subBulkBooking) {
      return res.status(404).json({
        success: false,
        message: 'Sub bulk booking not found'
      });
    }

    // Return spots to bulk booking
    const bulkBooking = await BulkBookingChunk.findById(subBulkBooking.bulkBookingId);
    if (bulkBooking) {
      bulkBooking.usedSpots -= subBulkBooking.assignedSpots;
      bulkBooking.availableSpots = bulkBooking.totalSpots - bulkBooking.usedSpots;
      await bulkBooking.save();
    }

    await SubBulkBooking.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Sub bulk booking deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting sub bulk booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sub bulk booking',
      error: error.message
    });
  }
};

// Get available bulk bookings for assignment (owner's active bookings with available spots)
exports.getAvailableBulkBookings = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const availableBookings = await BulkBookingChunk.find({
      user: ownerId,
      status: 'Active',
      availableSpots: { $gt: 0 },
      validTo: { $gte: new Date() }
    }).select('parkingName chunkName totalSpots usedSpots availableSpots validFrom validTo');

    res.status(200).json({
      success: true,
      count: availableBookings.length,
      data: availableBookings
    });

  } catch (error) {
    console.error('Error fetching available bulk bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available bulk bookings',
      error: error.message
    });
  }
};

// Update last access date when customer uses the assignment
exports.updateLastAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { usageHours = 1 } = req.body;

    const subBulkBooking = await SubBulkBooking.findByIdAndUpdate(
      id,
      { 
        lastAccessDate: new Date(),
        $inc: { usageTime: usageHours }
      },
      { new: true }
    );

    if (!subBulkBooking) {
      return res.status(404).json({
        success: false,
        message: 'Sub bulk booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Last access updated successfully',
      data: subBulkBooking
    });

  } catch (error) {
    console.error('Error updating last access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update last access',
      error: error.message
    });
  }
};

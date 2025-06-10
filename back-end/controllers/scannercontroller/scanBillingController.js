// filepath: c:\Users\Tharindu\Desktop\GAHDSE241F-ParkWise\back-end\controllers\scannercontroller\scanBillingController.js
const Billing = require("../../models/Billingmodel");
const Parking = require("../../models/parkingmodel");

/**
 * Handle QR code scanning and retrieve billing information
 * @param {Object} req - Request object containing billingHash in body
 * @param {Object} res - Response object
 * @returns {Object} - Billing information or error message
 */
exports.handleScan = async (req, res) => {
  try {
    // Validate input
    const { billingHash } = req.body;

    if (!billingHash) {
      return res.status(400).json({
        success: false,
        message: "Billing hash is required",
        RESPONSE_CODE: "err",
      });
    }

    // Find billing record by hash
    const billingRecord = await Billing.findOne({ billingHash });

    if (!billingRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code. Billing record not found.",
        RESPONSE_CODE: "err",
      });
    }

    // Check payment status
    if (billingRecord.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "This QR code has already been used.",
        RESPONSE_CODE: "err",
      });
    }

    // If payment status is pending, process further
    const { parkingID, vehicleType, entryTime } = billingRecord;

    // Find parking details
    const parkingDetails = await Parking.findById(parkingID);

    if (!parkingDetails) {
      return res.status(404).json({
        success: false,
        message: "Parking information not found.",
        RESPONSE_CODE: "err",
      });
    }

    // Get price for 30 minutes based on vehicle type
    const price30Min =
      parkingDetails.slotDetails[vehicleType]?.perPrice30Min || 0;

    // Calculate current duration in minutes
    const nowUTC = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000;
    const exitTime = new Date(nowUTC.getTime() + sriLankaOffset); // Get current time in Sri Lanka as exit time

    const durationInMs = exitTime - new Date(entryTime);
    const durationInMinutes = Math.floor(durationInMs / (1000 * 60));

    // Calculate fee based on duration (number of 30-minute intervals)
    const thirtyMinIntervals = Math.ceil(durationInMinutes / 30);
    const calculatedFee = thirtyMinIntervals * price30Min;

    // Update billing record with exit time, duration, and fee
    billingRecord.exitTime = exitTime;
    billingRecord.duration = durationInMinutes;
    billingRecord.fee = calculatedFee;
    await billingRecord.save(); // Return billing information
    return res.status(200).json({
      success: true,
      RESPONSE_CODE: "BILLING_CALCULATED",
      message: "Billing information retrieved successfully",
      data: {
        parkingName: parkingDetails.name,
        entryTime: billingRecord.entryTime,
        exitTime: billingRecord.exitTime,
        duration: durationInMinutes,
        priceFor30Min: price30Min,
        totalFee: calculatedFee,
        paymentStatus: billingRecord.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error in handleScan:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while processing QR scan",
      error: error.message,
      RESPONSE_CODE: "err",
    });
  }
};

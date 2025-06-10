const { hash } = require("crypto");
const Billing = require("../../models/Billingmodel");
const Parking = require("../../models/parkingmodel");
const Transaction = require("../../models/transactionModel");
// const Transaction = require("../../models/Transactionmodel"); // Assuming the transaction model is in this path

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
        hash: billingRecord.billingHash,
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

/**
 * Confirm payment for a billing record and update transaction status
 * @param {Object} req - Request object containing billing data
 * @param {Object} res - Response object
 * @returns {Object} - Confirmation status and updated billing information
 */
exports.confirmPayment = async (req, res) => {
  try {
    // Extract billing data from request
    const { data } = req.body;

    if (!data || !data.hash) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data. Billing hash is required.",
        RESPONSE_CODE: "err",
      });
    }

    // Find billing record by hash
    const billingRecord = await Billing.findOne({ billingHash: data.hash });

    if (!billingRecord) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found.",
        RESPONSE_CODE: "err",
      });
    } // Check if payment is already completed
    if (billingRecord.paymentStatus === "completed") {
      return res.status(409).json({
        success: true,
        message: "Payment has already been processed.",
        RESPONSE_CODE: "PAYMENT_ALREADY_COMPLETED",
        data: {
          parkingName: data.parkingName,
          totalFee: billingRecord.fee,
          paymentStatus: "completed",
        },
      });
    }

    // Find existing transaction by ID or create one if it doesn't exist
    let transaction;

    if (billingRecord.transactionId) {
      // If there's already a transaction ID in the billing record, use that
      transaction = await Transaction.findById(billingRecord.transactionId);

      if (transaction) {
        // Update existing transaction
        transaction.method = "card"; // Assuming payment method is card
        transaction.amount = billingRecord.fee;
        transaction.status = "Completed";
        transaction.date = new Date();
        await transaction.save();
      }
    }

    // If no transaction found, create a new one
    if (!transaction) {
      transaction = new Transaction({
        type: "billing",
        billingId: billingRecord._id,
        userId: billingRecord.userID,
        amount: billingRecord.fee,
        method: "scanner_app",
        status: "Completed",
        date: new Date(),
      });

      await transaction.save(); // Link the transaction to the billing record if it wasn't linked before
      if (!billingRecord.transactionId) {
        billingRecord.transactionId = transaction._id;
      }
    }

    // Get parking ID and vehicle type from billing record
    const parkingID = billingRecord.parkingID;
    const vehicleType = billingRecord.vehicleType;

    // Find the parking space using the parking ID
    const parkingSpace = await Parking.findById(parkingID);

    if (parkingSpace) {
      // Increment withoutBookingAvailableSlot for the specific vehicle type
      if (parkingSpace.slotDetails[vehicleType]) {
        parkingSpace.slotDetails[vehicleType].withoutBookingAvailableSlot += 1;

        console.log(`Incrementing withoutBookingAvailableSlot for ${vehicleType} at ${parkingSpace.name}. 
                    New value: ${parkingSpace.slotDetails[vehicleType].withoutBookingAvailableSlot}`);

        // Save the updated parking space
        await parkingSpace.save();
      } else {
        console.error(
          `Vehicle type '${vehicleType}' not found in slot details for parking ID ${parkingID}`
        );
      }
    } else {
      console.error(`Parking space with ID '${parkingID}' not found`);
    }

    // Update the billing record payment status
    billingRecord.paymentStatus = "completed";
    await billingRecord.save();
    return res.status(200).json({
      success: true,
      RESPONSE_CODE: "PAYMENT_CONFIRMED",
      message: "Payment confirmed successfully",
      data: {
        parkingName: data.parkingName,
        entryTime: billingRecord.entryTime,
        exitTime: billingRecord.exitTime,
        duration: billingRecord.duration,
        totalFee: billingRecord.fee,
        paymentStatus: "completed",
        transactionId: transaction._id,
        vehicleType: billingRecord.vehicleType,
        slotUpdated: true,
      },
    });
  } catch (error) {
    console.error("Error in confirmPayment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while processing payment confirmation",
      error: error.message,
      RESPONSE_CODE: "err",
    });
  }
};

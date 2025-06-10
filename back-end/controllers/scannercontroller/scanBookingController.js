const { hash } = require("crypto");
const Booking = require("../../models/bookingmodel");
const Parking = require("../../models/parkingmodel");
const Transaction = require("../../models/transactionModel");

/**
 * Handle booking checkout when scanning QR code
 * Calculate extra fees if the current time exceeds the scheduled exit time
 * Only calculates values without updating the database
 * @param {Object} req - Request object containing billingHash in body
 * @param {Object} res - Response object
 * @returns {Object} - Checkout information with fee details
 */
exports.handleBookingCheckout = async (req, res) => {
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

    // Find booking record by hash
    const bookingRecord = await Booking.findOne({ billingHash });

    if (!bookingRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code. Booking record not found.",
        RESPONSE_CODE: "err",
      });
    }

    // Get current time in Sri Lanka timezone
    const nowUTC = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000;
    const currentTime = new Date(nowUTC.getTime() + sriLankaOffset);

    // Get scheduled exit time from booking
    const scheduledExitTime = bookingRecord.exitTime;

    // Calculate if current time exceeds scheduled exit time
    const hasExceededTime = currentTime > scheduledExitTime;

    // Find parking details to get price per 30 minutes
    const parkingDetails = await Parking.findOne({
      name: bookingRecord.parkingName,
    });

    if (!parkingDetails) {
      return res.status(404).json({
        success: false,
        message: "Parking information not found.",
        RESPONSE_CODE: "err",
      });
    }

    // Get price for 30 minutes based on vehicle type
    const price30Min =
      parkingDetails.slotDetails[bookingRecord.vehicleType]?.perPrice30Min || 0;

    // Initialize variables for fee calculation
    let extraTimeDuration = 0;
    let extraTimeFee = 0;
    let formattedExtraTime = "00:00:00"; // If exceeded time, calculate extra fee
    if (hasExceededTime) {
      // Calculate extra duration in milliseconds
      const extraTimeMs = currentTime - scheduledExitTime;

      // Convert to minutes
      extraTimeDuration = Math.floor(extraTimeMs / (1000 * 60));

      // Calculate fee based on 30-minute intervals
      const extraTimeIntervals = Math.ceil(extraTimeDuration / 30);
      extraTimeFee = extraTimeIntervals * price30Min;

      // Format extra time as HH:MM:SS
      const hours = Math.floor(extraTimeDuration / 60);
      const minutes = extraTimeDuration % 60;
      formattedExtraTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`;

      // Calculate new usage fee and total fee (without updating the record)
      const updatedUsageFee = bookingRecord.fee.usageFee + extraTimeFee;
      const updatedTotalFee = updatedUsageFee + bookingRecord.fee.bookingFee;

      // Return checkout information with calculated values
      return res.status(200).json({
        success: true,
        RESPONSE_CODE: "CHECKOUT_CALCULATED",
        message: "Booking checkout information calculated successfully",
        data: {
          parkingName: bookingRecord.parkingName,
          bookingDate: bookingRecord.bookingDate,
          entryTime: bookingRecord.entryTime,
          scheduledExitTime: scheduledExitTime,
          actualExitTime: currentTime,
          hasExceededTime: true,
          extraTimeDuration: extraTimeDuration,
          formattedExtraTime: formattedExtraTime,
          priceFor30Min: price30Min,
          extraTimeFee: extraTimeFee,
          originalUsageFee: bookingRecord.fee.usageFee,
          updatedUsageFee: updatedUsageFee,
          bookingFee: bookingRecord.fee.bookingFee,
          totalFee: updatedTotalFee,
          vehicleType: bookingRecord.vehicleType,
          paymentStatus: bookingRecord.paymentStatus,
          bookingState: bookingRecord.bookingState,
        },
      });
    } else {
      // If not exceeded, return original values
      return res.status(200).json({
        success: true,
        RESPONSE_CODE: "CHECKOUT_CALCULATED",
        message: "Booking checkout information calculated successfully",
        data: {
          parkingName: bookingRecord.parkingName,
          bookingDate: bookingRecord.bookingDate,
          entryTime: bookingRecord.entryTime,
          scheduledExitTime: scheduledExitTime,
          actualExitTime: currentTime,
          hasExceededTime: false,
          extraTimeDuration: 0,
          formattedExtraTime: "00:00:00",
          priceFor30Min: price30Min,
          extraTimeFee: 0,
          originalUsageFee: bookingRecord.fee.usageFee,
          updatedUsageFee: bookingRecord.fee.usageFee,
          bookingFee: bookingRecord.fee.bookingFee,
          totalFee: bookingRecord.fee.totalFee,
          vehicleType: bookingRecord.vehicleType,
          paymentStatus: bookingRecord.paymentStatus,
          bookingState: bookingRecord.bookingState,
        },
      });
    }
  } catch (error) {
    console.error("Error in handleBookingCheckout:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while processing booking checkout",
      error: error.message,
      RESPONSE_CODE: "err",
    });
  }
};

/**
 * Handle booking processing based on booking state
 * @param {Object} req - Request object containing billingHash in body
 * @param {Object} res - Response object
 * @returns {Object} - Response based on booking state
 */
exports.handleBooking = async (req, res) => {
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

    // Find booking record by hash
    const bookingRecord = await Booking.findOne({ billingHash });

    if (!bookingRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code. Booking record not found.",
        RESPONSE_CODE: "err",
      });
    }

    // Get current time in Sri Lanka timezone
    const nowUTC = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000;
    const currentTime = new Date(nowUTC.getTime() + sriLankaOffset);

    // Process based on booking state
    switch (bookingRecord.bookingState) {
      case "active":
        // Check if entry time (current time) is after scheduled exit time
        if (currentTime > bookingRecord.exitTime) {
          // Update booking state to cancelled due to expiry
          bookingRecord.bookingState = "cancelled";
          await bookingRecord.save();
          return res.status(400).json({
            success: false,
            RESPONSE_CODE: "err",
            message:
              "Booking has expired. Entry time is past the scheduled exit time.",
            // data: {
            //   parkingName: bookingRecord.parkingName,
            //   bookingState: "cancelled",
            // },
          });
        }
        // Update booking state to ongoing and set entry time
        bookingRecord.bookingState = "ongoing";
        bookingRecord.entryTime = currentTime;
        await bookingRecord.save();

        return res.status(200).json({
          success: true,
          RESPONSE_CODE: "BOOKING_ENTRY_RECORDED",
          message: "Booking entry time recorded successfully",
          data: {
            parkingName: bookingRecord.parkingName,
            bookingDate: bookingRecord.bookingDate,
            entryTime: currentTime,
            scheduledExitTime: bookingRecord.exitTime,
            vehicleType: bookingRecord.vehicleType,
            bookingState: "ongoing",
            paymentStatus: bookingRecord.paymentStatus,
          },
        });

      case "ongoing":
        // Call the handleBookingCheckout function internally
        // instead of responding directly, we're using the function's logic
        // to prepare the response

        // Find parking details to get price per 30 minutes
        const parkingDetails = await Parking.findOne({
          name: bookingRecord.parkingName,
        });

        if (!parkingDetails) {
          return res.status(404).json({
            success: false,
            message: "Parking information not found.",
            RESPONSE_CODE: "err",
          });
        }

        // Get price for 30 minutes based on vehicle type
        const price30Min =
          parkingDetails.slotDetails[bookingRecord.vehicleType]
            ?.perPrice30Min || 0;

        // Get scheduled exit time from booking
        const scheduledExitTime = bookingRecord.exitTime;

        // Calculate if current time exceeds scheduled exit time
        const hasExceededTime = currentTime > scheduledExitTime;

        // Initialize variables for fee calculation
        let extraTimeDuration = 0;
        let extraTimeFee = 0;
        let formattedExtraTime = "00:00:00";

        // If exceeded time, calculate extra fee
        if (hasExceededTime) {
          // Calculate extra duration in milliseconds
          const extraTimeMs = currentTime - scheduledExitTime;

          // Convert to minutes
          extraTimeDuration = Math.floor(extraTimeMs / (1000 * 60));

          // Calculate fee based on 30-minute intervals
          const extraTimeIntervals = Math.ceil(extraTimeDuration / 30);
          extraTimeFee = extraTimeIntervals * price30Min;

          // Format extra time as HH:MM:SS
          const hours = Math.floor(extraTimeDuration / 60);
          const minutes = extraTimeDuration % 60;
          formattedExtraTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:00`;

          // Calculate new usage fee and total fee
          const updatedUsageFee = bookingRecord.fee.usageFee + extraTimeFee;
          const updatedTotalFee =
            updatedUsageFee + bookingRecord.fee.bookingFee;

          // Return checkout information with calculated values
          return res.status(200).json({
            success: true,
            RESPONSE_CODE: "CHECKOUT_CALCULATED",
            message: "Booking checkout information calculated successfully",
            data: {
              parkingName: bookingRecord.parkingName,
              bookingDate: bookingRecord.bookingDate,
              entryTime: bookingRecord.entryTime,
              scheduledExitTime: scheduledExitTime,
              actualExitTime: currentTime,
              hasExceededTime: true,
              extraTimeDuration: extraTimeDuration,
              formattedExtraTime: formattedExtraTime,
              priceFor30Min: price30Min,
              extraTimeFee: extraTimeFee,
              originalUsageFee: bookingRecord.fee.usageFee,
              updatedUsageFee: updatedUsageFee,
              bookingFee: bookingRecord.fee.bookingFee,
              totalFee: updatedTotalFee,
              vehicleType: bookingRecord.vehicleType,
              paymentStatus: bookingRecord.paymentStatus,
              bookingState: bookingRecord.bookingState,
              hash: bookingRecord.billingHash,
            },
          });
        } else {
          // If not exceeded, return original values
          return res.status(200).json({
            success: true,
            RESPONSE_CODE: "CHECKOUT_CALCULATED",
            message: "Booking checkout information calculated successfully",
            data: {
              parkingName: bookingRecord.parkingName,
              bookingDate: bookingRecord.bookingDate,
              entryTime: bookingRecord.entryTime,
              scheduledExitTime: scheduledExitTime,
              actualExitTime: currentTime,
              hasExceededTime: false,
              extraTimeDuration: 0,
              formattedExtraTime: "00:00:00",
              priceFor30Min: price30Min,
              extraTimeFee: 0,
              originalUsageFee: bookingRecord.fee.usageFee,
              updatedUsageFee: bookingRecord.fee.usageFee,
              bookingFee: bookingRecord.fee.bookingFee,
              totalFee: bookingRecord.fee.totalFee,
              vehicleType: bookingRecord.vehicleType,
              paymentStatus: bookingRecord.paymentStatus,
              bookingState: bookingRecord.bookingState,
              hash: bookingRecord.billingHash,
            },
          });
        }

      case "completed":
        return res.status(400).json({
          success: false,
          RESPONSE_CODE: "BOOKING_ALREADY_COMPLETED",
          message: "This booking has already been completed",
          data: {
            parkingName: bookingRecord.parkingName,
            bookingState: "completed",
          },
        });

      case "cancelled":
        return res.status(400).json({
          success: false,
          RESPONSE_CODE: "BOOKING_CANCELLED",
          message: "This booking has been cancelled",
          data: {
            parkingName: bookingRecord.parkingName,
            bookingState: "cancelled",
          },
        });

      default:
        return res.status(400).json({
          success: false,
          RESPONSE_CODE: "INVALID_BOOKING_STATE",
          message: "Invalid booking state",
          data: {
            bookingState: bookingRecord.bookingState,
          },
        });
    }
  } catch (error) {
    console.error("Error in handleBooking:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while processing booking",
      error: error.message,
      RESPONSE_CODE: "err",
    });
  }
};

/**
 * Confirm booking checkout and update booking and transaction records
 * Process payment and update booking state to completed
 * @param {Object} req - Request object containing checkout data
 * @param {Object} res - Response object
 * @returns {Object} - Confirmation response
 */
exports.confirmBookingCheckout = async (req, res) => {
  try {
    // Extract data from request body
    const { data, RESPONSE_CODE } = req.body;

    // Validate response code
    if (RESPONSE_CODE !== "CHECKOUT_CALCULATED") {
      return res.status(400).json({
        success: false,
        message: "Invalid response code for checkout confirmation",
        RESPONSE_CODE: "err",
      });
    } // Extract necessary data
    const billingHash =
      req.body.billingHash ||
      (req.body.data && req.body.data.hash) ||
      (req.body.data && req.body.data.billingHash);

    if (!billingHash) {
      return res.status(400).json({
        success: false,
        message: "Billing hash is required",
        RESPONSE_CODE: "err",
      });
    }

    // Find booking record by hash
    const bookingRecord = await Booking.findOne({ billingHash });

    if (!bookingRecord) {
      return res.status(404).json({
        success: false,
        message: "Booking record not found",
        RESPONSE_CODE: "err",
      });
    }

    // Get the hasExceededTime and fee data from the request or calculate it
    const hasExceededTime = data.hasExceededTime || false;
    const extraTimeFee = data.extraTimeFee || 0;
    const formattedExtraTime = data.formattedExtraTime || "00:00:00";
    const totalFee = data.totalFee || bookingRecord.fee.totalFee;
    const actualExitTime = data.actualExitTime || new Date();

    // Update booking with exit information
    bookingRecord.bookingState = "completed";

    // Set exit time
    if (typeof actualExitTime === "string") {
      bookingRecord.exitTime = new Date(actualExitTime);
    } else {
      bookingRecord.exitTime = actualExitTime;
    }

    // Update fee information if extra time was used
    if (hasExceededTime) {
      // Update the fee structure
      bookingRecord.fee.usageFee =
        data.updatedUsageFee || bookingRecord.fee.usageFee + extraTimeFee;
      bookingRecord.fee.totalFee = totalFee;

      // Record the extra time details
      bookingRecord.exitedBookingTime = {
        extraTime: formattedExtraTime,
        extraTimeFee: extraTimeFee,
        exitTime: bookingRecord.exitTime,
      };
    } // Save the updated booking record
    await bookingRecord.save();

    // Find the parking space and update the bookingAvailableSlot
    const parkingSpace = await Parking.findOne({
      name: bookingRecord.parkingName,
    });

    if (parkingSpace) {
      // Increment bookingAvailableSlot for the specific vehicle type
      const vehicleType = bookingRecord.vehicleType; // 'car', 'bicycle', or 'truck'

      if (parkingSpace.slotDetails[vehicleType]) {
        parkingSpace.slotDetails[vehicleType].bookingAvailableSlot += 1;

        console.log(`Incrementing bookingAvailableSlot for ${vehicleType} at ${bookingRecord.parkingName}. 
                    New value: ${parkingSpace.slotDetails[vehicleType].bookingAvailableSlot}`);

        // Save the updated parking space
        await parkingSpace.save();
      } else {
        console.error(
          `Vehicle type '${vehicleType}' not found in slot details for ${bookingRecord.parkingName}`
        );
      }
    } else {
      console.error(
        `Parking space with name '${bookingRecord.parkingName}' not found`
      );
    }

    // Update the transaction if it exists, otherwise create a new one
    let transaction;
    if (bookingRecord.transactionId) {
      transaction = await Transaction.findById(bookingRecord.transactionId);
    }

    if (transaction) {
      // Update existing transaction
      transaction.amount = totalFee;
      transaction.status = "Completed";
      transaction.date = new Date();
      await transaction.save();
    } else {
      // Create a new transaction record
      transaction = new Transaction({
        type: "booking",
        bookingId: bookingRecord._id,
        userId: bookingRecord.userId,
        amount: totalFee,
        method: "Scanner App",
        status: "Completed",
        date: new Date(),
      });

      // Save the transaction and update the booking with the transaction ID
      await transaction.save();
      bookingRecord.transactionId = transaction._id;
      await bookingRecord.save();
    } // Return success response
    return res.status(200).json({
      success: true,
      RESPONSE_CODE: "CHECKOUT_CONFIRMED",
      message: "Booking checkout confirmed successfully",
      data: {
        parkingName: bookingRecord.parkingName,
        bookingDate: bookingRecord.bookingDate,
        entryTime: bookingRecord.entryTime,
        exitTime: bookingRecord.exitTime,
        bookingState: bookingRecord.bookingState,
        paymentStatus: "completed",
        totalFee: totalFee,
        transactionId: transaction._id,
        hasExceededTime: hasExceededTime,
        extraTimeFee: hasExceededTime ? extraTimeFee : 0,
        vehicleType: bookingRecord.vehicleType,
        slotUpdated: true,
      },
    });
  } catch (error) {
    console.error("Error in confirmBookingCheckout:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while confirming booking checkout",
      error: error.message,
      RESPONSE_CODE: "err",
    });
  }
};

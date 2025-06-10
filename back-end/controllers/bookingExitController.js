const Booking = require('../models/bookingmodel');
const Parking = require('../models/parkingmodel');
const { calculateExtraBookingFee, getCurrentSriLankaTime } = require('../utils/feeCalculator');

/**
 * Process exit for an ongoing booking - Calculate fees when exiting
 * @param {String} bookingHash - The booking hash to lookup
 * @param {Object} res - Response object
 */
const processBookingExit = async (bookingHash, res) => {
    try {
        console.log(`Processing booking exit with hash: ${bookingHash}`);
        
        // Find the booking document using the hash
        const booking = await Booking.findOne({ billingHash: bookingHash });
        
        if (!booking) {
            console.log(`No booking found with hash: ${bookingHash}`);
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        
        console.log(`Found booking: ${booking._id} for user: ${booking.userId}`);
        
        // Check if booking is in 'ongoing' state
        if (booking.bookingState !== 'ongoing') {
            console.log(`Booking ${booking._id} is not in ongoing state. Current state: ${booking.bookingState}`);
            
            if (booking.bookingState === 'active') {
                return res.status(200).json({
                    success: false,
                    message: "This booking hasn't been activated yet",
                    response_Code: "NOT_ACTIVATED"
                });
            } else if (booking.bookingState === 'completed') {
                return res.status(200).json({
                    success: false,
                    message: "This booking has already been completed",
                    response_Code: "ALREADY_COMPLETED"
                });
            } else if (booking.bookingState === 'cancelled') {
                return res.status(200).json({
                    success: false,
                    message: "This booking has been cancelled",
                    response_Code: "CANCELLED_BOOKING"
                });
            }
        }
        
        // Get current time for exit calculation
        const currentTime = getCurrentSriLankaTime();
        
        // Calculate fee details using our utility function
        const feeDetails = await calculateExtraBookingFee(booking, currentTime);
        
        // Create the exited booking time data that would be saved to the booking
        // (but don't save it yet as per requirements)
        const exitedBookingTime = {
            extraTime: feeDetails.extraTime,
            extraTimeFee: feeDetails.fee.extraTimeFee,
            exitTime: currentTime
        };
        
        // Prepare response with all calculated data
        return res.status(200).json({
            success: true,
            message: "Booking exit fees calculated",
            response_Code: "BOOKING_EXIT_CALCULATED",
            data: {
                booking: {
                    _id: booking._id,
                    parkingName: booking.parkingName,
                    userId: booking.userId,
                    vehicleType: booking.vehicleType,
                    entryTime: booking.entryTime,
                    exitTime: booking.exitTime,
                    bookingState: booking.bookingState,
                    billingHash: booking.billingHash
                },
                feeDetails: {
                    usageFee: feeDetails.fee.usageFee,
                    bookingFee: feeDetails.fee.bookingFee,
                    totalFee: feeDetails.fee.totalFee,
                    extraTimeFee: feeDetails.fee.extraTimeFee,
                    grandTotal: feeDetails.fee.grandTotal
                },
                timeDetails: {
                    scheduledExitTime: feeDetails.scheduledExitTime,
                    currentTime: feeDetails.currentTime,
                    extraTime: feeDetails.extraTime,
                    totalDuration: feeDetails.totalDuration
                },
                exitedBookingTime: exitedBookingTime
            }
        });
    } catch (error) {
        console.error("Error processing booking exit:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message        });
    }
};

module.exports = {
    processBookingExit
};

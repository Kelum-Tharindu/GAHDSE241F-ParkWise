const Parking = require('../models/parkingmodel');

// Define Sri Lanka time offset for getCurrentSriLankaTime function
const SRI_LANKA_OFFSET = 5.5 * 60 * 60 * 1000;

/**
 * Get current time in Sri Lanka time zone (UTC+5:30)
 * @returns {Date} Current time in Sri Lanka time zone
 */
const getCurrentSriLankaTime = () => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcTime + SRI_LANKA_OFFSET);
};

/**
 * Calculate extra fees for a booking that has exceeded its exit time
 * @param {Object} booking - The booking object
 * @param {Object} parking - The parking object
 * @param {Date} currentTime - Current time (usually Sri Lanka time)
 * @returns {Object} Extra fee details and formatted information
 */
const calculateExtraBookingFee = async (booking, currentTime) => {
    try {
        console.log(`Calculating extra fees for booking: ${booking._id}`);
        
        // Find the parking using parkingName
        const parking = await Parking.findOne({ name: booking.parkingName });
        
        if (!parking) {
            console.log(`No parking found with name: ${booking.parkingName}`);
            throw new Error("Parking not found");
        }
        
        // Get scheduled exit time and entry time from booking
        const scheduledExitTime = new Date(booking.exitTime);
        const entryTime = new Date(booking.entryTime);
        
        // Get current time if not provided
        if (!currentTime) {
            currentTime = getCurrentSriLankaTime();
        }
        
        console.log(`Scheduled exit: ${scheduledExitTime}, Current time: ${currentTime}`);
        
        // Default to car if not specified
        const vehicleType = booking.vehicleType || "car";
        
        // Get fee per 30 minutes for the vehicle type
        const perPrice30Min = parking.slotDetails[vehicleType]?.perPrice30Min || 0;
        
        console.log(`Vehicle type: ${vehicleType}, Fee per 30 minutes: ${perPrice30Min}`);
        
        // Calculate if current time exceeds scheduled exit time
        let extraTimeFee = 0;
        let extraTimeMinutes = 0;
        let extraTimePeriods = 0;
        
        if (currentTime > scheduledExitTime) {
            // Calculate extra time in minutes
            const extraTimeMs = currentTime - scheduledExitTime;
            extraTimeMinutes = Math.ceil(extraTimeMs / (1000 * 60));
            
            // Calculate extra fee based on 30-minute periods
            extraTimePeriods = Math.ceil(extraTimeMinutes / 30);
            extraTimeFee = extraTimePeriods * perPrice30Min;
            
            console.log(`Extra time: ${extraTimeMinutes} minutes (${extraTimePeriods} periods)`);
            console.log(`Extra fee: ${extraTimeFee}`);
            
        }
          // Calculate total duration from entry time to current time
        const totalDurationMs = currentTime - entryTime;
        const totalDurationMinutes = Math.ceil(totalDurationMs / (1000 * 60));
        
        // Format extra time for display (HH:MM:SS)
        const hours = Math.floor(extraTimeMinutes / 60);
        const minutes = extraTimeMinutes % 60;
        const formattedExtraTime = extraTimeMinutes > 0 
            ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
            : "00:00:00";
        
        // Format total duration for display
        const totalHours = Math.floor(totalDurationMinutes / 60);
        const totalMinutes = totalDurationMinutes % 60;
        const formattedTotalDuration = `${totalHours}h ${totalMinutes}m`;
        
        // Prepare result with all fee information
        const result = {
            booking: booking,
            scheduledExitTime: scheduledExitTime,
            currentTime: currentTime,
            extraTime: formattedExtraTime,
            extraTimeMinutes: extraTimeMinutes,
            extraTimePeriods: extraTimePeriods,
            extraTimeFee: extraTimeFee,
            perPrice30Min: perPrice30Min,
            totalDuration: formattedTotalDuration,
            totalDurationMinutes: totalDurationMinutes,
            fee: {
                // Original booking fees from the booking
                usageFee: booking.fee.usageFee,
                bookingFee: booking.fee.bookingFee,
                totalFee: booking.fee.totalFee,
                // Add extra fee
                extraTimeFee: extraTimeFee,
                // Grand total including extra fees
                grandTotal: booking.fee.totalFee + extraTimeFee
            }
        };
        
        console.log(`Calculation complete: Extra fee = ${extraTimeFee}, Grand total = ${result.fee.grandTotal}`);
        
        return result;
    } catch (error) {        console.error("Error calculating extra booking fee:", error);
        throw error;
    }
};

module.exports = {
    calculateExtraBookingFee,
    getCurrentSriLankaTime
};

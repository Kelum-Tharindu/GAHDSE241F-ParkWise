const Booking = require('../../models/bookingmodel');

/**
 * Get monthly booking counts for the current year
 * Returns the number of bookings for each month of the current year
 */
const getMonthlyBookings = async (req, res) => {
  try {
    console.log('[API] GET /api/dashboard/monthly-bookings called');
    
    const currentYear = new Date().getFullYear();
    console.log(`[API] Fetching monthly bookings for year: ${currentYear}`);
    
    // Create an array with all months of the year
    const monthlyData = [];
    
    // For each month, count the bookings
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      try {
        const count = await Booking.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        });
        
        monthlyData.push(count);
        console.log(`[API] Month ${month + 1}: ${count} bookings`);
      } catch (err) {
        console.error(`[API] Error counting bookings for month ${month + 1}:`, err);
        monthlyData.push(0); // Use 0 as fallback
      }
    }
    
    // Return the data with month names
    const response = {
      year: currentYear,
      months: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      data: monthlyData
    };
    
    console.log('[API] Sending monthly bookings response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('[API] Error getting monthly bookings:', error);
    res.status(500).json({ 
      message: 'Error retrieving monthly bookings', 
      error: error.message 
    });
  }
};

module.exports = {
  getMonthlyBookings
};

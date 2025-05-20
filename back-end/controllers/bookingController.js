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
      parkingName,
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
    const hashData = `${parkingName}${userId}${Date.now()}`;
    const billingHash = crypto.createHash('sha256').update(hashData).digest('hex');
    const qrImage = await generateQR(billingHash);

    const totalMinutes = calculateMinutes(entryTime, exitTime);
    const totalDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

    const newBooking = new Booking({
      parkingName,
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
    console.log('Fetching parking names...');
    const parkingNames = await Parking.find({}, 'name'); // Fetch only the 'name' field
    res.status(200).json(parkingNames.map(parking => parking.name));
    console.log('Fetched parking names:', parkingNames.map(parking => parking.name));
  } catch (error) {
    console.error('Error fetching parking names:', error);
    res.status(500).json({ message: 'Failed to fetch parking names', error: error.message });
  }
};

// Get booking history by user ID
const getBookingHistoryByUserId = async (req, res) => {
  try {
    let { userId } = req.params;

    // Sanitize userId
    userId = userId.trim();

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await Booking.find({ userId })
      .sort({ bookingDate: -1 }) // Sort by booking date, newest first
      .lean(); // Use lean for better performance since we're just reading data

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No booking history found for this user' });
    }

    // Transform data to match front-end structure
    const formattedBookings = bookings.map(booking => {
      // Get color based on booking status for UI display
      let color;
      if (booking.bookingState === 'completed') {
        color = { r: 21, g: 166, b: 110, a: 1 }; // highlightColor
      } else if (booking.bookingState === 'active') {
        color = { r: 1, g: 50, b: 32, a: 1 }; // primaryColor
      } else {
        color = { r: 2, g: 89, b: 57, a: 1 }; // accentColor for cancelled or other states
      }

      // Format date to match front-end format (e.g., "Apr 15, 2025")
      const dateObj = new Date(booking.bookingDate);
      const dateFormatted = dateObj.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric', 
        year: 'numeric'
      });

      const totalFee = booking.fee?.totalFee || 0;

      return {
        id: booking._id,
        location: booking.parkingName,
        date: dateFormatted,
        duration: booking.totalDuration || 'N/A',
        cost: `$${(totalFee / 100).toFixed(2)}`, // Convert cents to dollars with $ prefix
        status: booking.bookingState.charAt(0).toUpperCase() + booking.bookingState.slice(1), // Capitalize first letter
        color: color,
        vehicleType: booking.vehicleType,
        entryTime: booking.entryTime,
        exitTime: booking.exitTime,
        paymentStatus: booking.paymentStatus
      };
    });

    // Calculate summary statistics for the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    });
    
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    const totalSpent = currentMonthBookings.reduce((sum, booking) => {
      return sum + (booking.fee?.totalFee || 0);
    }, 0) / 100;
    
    // Calculate total parking duration in minutes
    let totalMinutes = 0;
    currentMonthBookings.forEach(booking => {
      if (booking.entryTime && booking.exitTime) {
        totalMinutes += calculateMinutes(booking.entryTime, booking.exitTime);
      }
    });
    
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    const summary = {
      month: `${monthName} ${currentYear}`,
      totalSpent: `$${totalSpent.toFixed(2)}`,
      hoursParked: `${totalHours}h ${remainingMinutes}m`,
      bookingsCount: currentMonthBookings.length.toString()
    };

    res.status(200).json({
      bookings: formattedBookings,
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch booking history', 
      error: error.message 
    });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 }) // Sort by booking date, newest first
      .lean();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    // Get current month's start and end dates
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Filter bookings for current month
    const currentMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= firstDayOfMonth && bookingDate <= lastDayOfMonth;
    });

    // Transform data to match front-end structure
    const formattedBookings = bookings.map(booking => {
      // Get color based on booking status
      let color;
      switch (booking.bookingState) {
        case 'completed':
          color = { r: 21, g: 166, b: 110, a: 1 };
          break;
        case 'active':
          color = { r: 1, g: 50, b: 32, a: 1 };
          break;
        case 'ongoing':
          color = { r: 255, g: 165, b: 0, a: 1 }; // Orange for ongoing
          break;
        case 'cancelled':
          color = { r: 255, g: 0, b: 0, a: 1 }; // Red for cancelled
          break;
        default:
          color = { r: 2, g: 89, b: 57, a: 1 };
      }

      const dateObj = new Date(booking.bookingDate);
      const dateFormatted = dateObj.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric', 
        year: 'numeric'
      });

      // Format entry and exit times
      const entryTimeFormatted = booking.entryTime ? new Date(booking.entryTime).toLocaleTimeString() : 'N/A';
      const exitTimeFormatted = booking.exitTime ? new Date(booking.exitTime).toLocaleTimeString() : 'N/A';

      // Calculate extra time fee if exists
      const extraTimeFee = booking.exitedBookingTime?.extraTimeFee || 0;
      const extraTime = booking.exitedBookingTime?.extraTime || 'N/A';

      return {
        id: booking._id,
        location: booking.parkingName,
        date: dateFormatted,
        duration: booking.totalDuration || 'N/A',
        cost: `$${((booking.fee?.totalFee || 0) / 100).toFixed(2)}`,
        status: booking.bookingState.charAt(0).toUpperCase() + booking.bookingState.slice(1),
        color: color,
        vehicleType: booking.vehicleType,
        entryTime: entryTimeFormatted,
        exitTime: exitTimeFormatted,
        paymentStatus: booking.paymentStatus,
        userId: booking.userId,
        billingHash: booking.billingHash,
        qrImage: booking.qrImage,
        feeDetails: {
          usageFee: `$${((booking.fee?.usageFee || 0) / 100).toFixed(2)}`,
          bookingFee: `$${((booking.fee?.bookingFee || 0) / 100).toFixed(2)}`,
          totalFee: `$${((booking.fee?.totalFee || 0) / 100).toFixed(2)}`,
          extraTimeFee: `$${(extraTimeFee / 100).toFixed(2)}`
        },
        extraTime: extraTime,
        createdAt: new Date(booking.createdAt).toLocaleString(),
        updatedAt: new Date(booking.updatedAt).toLocaleString()
      };
    });

    // Calculate summary statistics for current month only
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    const summary = {
      month: `${monthName} ${currentYear}`,
      totalBookings: currentMonthBookings.length,
      activeBookings: currentMonthBookings.filter(b => b.bookingState === 'active').length,
      completedBookings: currentMonthBookings.filter(b => b.bookingState === 'completed').length,
      cancelledBookings: currentMonthBookings.filter(b => b.bookingState === 'cancelled').length,
      ongoingBookings: currentMonthBookings.filter(b => b.bookingState === 'ongoing').length,
      totalRevenue: (currentMonthBookings.reduce((sum, booking) => {
        return sum + (booking.fee?.totalFee || 0);
      }, 0) / 100).toFixed(2)
    };

    res.status(200).json({
      bookings: formattedBookings,
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch bookings', 
      error: error.message 
    });
  }
};

module.exports = {
  calculateFee,
  confirmBooking,
  getParkingNames,
  getBookingHistoryByUserId,
  getAllBookings
};

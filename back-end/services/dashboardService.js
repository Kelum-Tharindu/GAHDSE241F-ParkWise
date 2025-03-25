const Booking = require('../models/Booking');
const User = require('../models/User');
const ParkingSlot = require('../models/ParkingSlot');
const Payment = require('../models/Payment');
const moment = require('moment');

// @desc    Get all dashboard statistics
// @return  {Object} Dashboard statistics
exports.getDashboardStats = async () => {
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  
  const [
    totalBookings,
    todayBookings,
    activeUsers,
    availableSlots,
    totalRevenue,
    todayRevenue
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: startOfToday } }),
    User.countDocuments({ isActive: true }),
    ParkingSlot.countDocuments({ status: 'available' }),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: startOfToday }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  return {
    totalBookings,
    todayBookings,
    activeUsers,
    availableSlots,
    totalRevenue: totalRevenue[0]?.total || 0,
    todayRevenue: todayRevenue[0]?.total || 0
  };
};

// @desc    Get recent bookings
// @param   {Number} limit - Number of bookings to return
// @return  {Array} Recent bookings
exports.getRecentBookings = async (limit = 10) => {
  return Booking.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .populate('slot', 'location');
};

// @desc    Get parking utilization data
// @param   {String} period - Time period (week/month/year)
// @return  {Array} Utilization data
exports.getParkingUtilization = async (period = 'week') => {
  let startDate;
  const endDate = new Date();
  
  switch (period) {
    case 'year':
      startDate = moment().subtract(1, 'year').toDate();
      break;
    case 'month':
      startDate = moment().subtract(1, 'month').toDate();
      break;
    case 'week':
    default:
      startDate = moment().subtract(1, 'week').toDate();
  }

  const utilization = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { 
            format: period === 'year' ? '%Y-%m' : '%Y-%m-%d', 
            date: '$createdAt' 
          }
        },
        totalBookings: { $sum: 1 },
        totalHours: { 
          $sum: { 
            $divide: [
              { $subtract: ['$endTime', '$startTime'] },
              1000 * 60 * 60 // Convert milliseconds to hours
            ]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return utilization;
};

// @desc    Get revenue analytics
// @param   {String} period - Time period (week/month/year)
// @return  {Array} Revenue data
exports.getRevenueAnalytics = async (period = 'month') => {
  let startDate;
  const endDate = new Date();
  
  switch (period) {
    case 'year':
      startDate = moment().subtract(1, 'year').toDate();
      break;
    case 'month':
      startDate = moment().subtract(1, 'month').toDate();
      break;
    case 'week':
    default:
      startDate = moment().subtract(1, 'week').toDate();
  }

  const revenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { 
            format: period === 'year' ? '%Y-%m' : '%Y-%m-%d', 
            date: '$createdAt' 
          }
        },
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return revenue;
};

// @desc    Get user growth data
// @param   {String} period - Time period (week/month/year)
// @return  {Array} User growth data
exports.getUserGrowth = async (period = 'month') => {
  let startDate;
  const endDate = new Date();
  
  switch (period) {
    case 'year':
      startDate = moment().subtract(1, 'year').toDate();
      break;
    case 'month':
      startDate = moment().subtract(1, 'month').toDate();
      break;
    case 'week':
    default:
      startDate = moment().subtract(1, 'week').toDate();
  }

  const growth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { 
            format: period === 'year' ? '%Y-%m' : '%Y-%m-%d', 
            date: '$createdAt' 
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return growth;
};
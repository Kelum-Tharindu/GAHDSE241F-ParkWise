const User = require('../../models/usermodel');
const Booking = require('../../models/bookingmodel');
const Transaction = require('../../models/transactionModel');
const Parking = require('../../models/parkingmodel');

/**
 * Get dashboard metrics for the admin dashboard
 * Returns counts and growth percentages for key metrics
 */
const getDashboardMetrics = async (req, res) => {
  try {
    console.log('[API] GET /api/dashboard/metrics called');
    
    // Get current date and date 30 days ago for growth calculations
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    console.log('[API] Calculating metrics for:', {
      currentDate,
      thirtyDaysAgo,
      sixtyDaysAgo
    });

    // Users metrics
    try {
      var totalUsers = await User.countDocuments();
      var newUsers = await User.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      });
      var previousPeriodUsers = await User.countDocuments({ 
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      });
      
      console.log('[API] User metrics calculated:', {
        totalUsers,
        newUsers,
        previousPeriodUsers
      });
    } catch (err) {
      console.error('[API] Error calculating user metrics:', err);
      totalUsers = 0;
      newUsers = 0;
      previousPeriodUsers = 0;
    }
      // Calculate user growth percentage
    const userGrowthPercentage = previousPeriodUsers > 0 
      ? ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100
      : newUsers > 0 ? 100 : 0;

    // Bookings metrics
    try {
      var totalBookings = await Booking.countDocuments();
      var recentBookings = await Booking.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      });
      var previousPeriodBookings = await Booking.countDocuments({ 
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      });
      
      console.log('[API] Booking metrics calculated:', {
        totalBookings,
        recentBookings,
        previousPeriodBookings
      });
    } catch (err) {
      console.error('[API] Error calculating booking metrics:', err);
      totalBookings = 0;
      recentBookings = 0;
      previousPeriodBookings = 0;
    }
    
    // Calculate booking growth percentage
    const bookingGrowthPercentage = previousPeriodBookings > 0 
      ? ((recentBookings - previousPeriodBookings) / previousPeriodBookings) * 100
      : recentBookings > 0 ? 100 : 0;
      // Transaction metrics
    try {
      var totalTransactions = await Transaction.countDocuments();
      var recentTransactions = await Transaction.countDocuments({ 
        date: { $gte: thirtyDaysAgo } 
      });
      
      console.log('[API] Transaction count metrics calculated:', {
        totalTransactions,
        recentTransactions
      });
    } catch (err) {
      console.error('[API] Error calculating transaction count metrics:', err);
      totalTransactions = 0;
      recentTransactions = 0;
    }
    
    // Revenue metrics (sum of all booking transaction amounts)
    try {
      var allTransactions = await Transaction.find({
        type: { $in: ['booking', 'billing'] }
      });
      
      var totalRevenue = allTransactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
      
      // Recent revenue (last 30 days)
      var recentTransactionsData = await Transaction.find({
        type: { $in: ['booking', 'billing'] },
        date: { $gte: thirtyDaysAgo }
      });
      
      var recentRevenue = recentTransactionsData.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
      
      // Previous period revenue (30-60 days ago)
      var previousTransactionsData = await Transaction.find({
        type: { $in: ['booking', 'billing'] },
        date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
      });
      
      var previousRevenue = previousTransactionsData.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
      
      console.log('[API] Revenue metrics calculated:', {
        totalRevenue,
        recentRevenue,
        previousRevenue
      });
    } catch (err) {
      console.error('[API] Error calculating revenue metrics:', err);
      totalRevenue = 0;
      recentRevenue = 0;
      previousRevenue = 0;
    }
      // Calculate revenue growth percentage
    const revenueGrowthPercentage = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : recentRevenue > 0 ? 100 : 0;

    // Return all metrics data
    const responseData = {
      users: {
        total: totalUsers,
        growth: parseFloat(userGrowthPercentage.toFixed(2)),
        trend: userGrowthPercentage >= 0 ? 'up' : 'down'
      },
      bookings: {
        total: totalBookings,
        growth: parseFloat(bookingGrowthPercentage.toFixed(2)),
        trend: bookingGrowthPercentage >= 0 ? 'up' : 'down'
      },
      revenue: {
        total: totalRevenue,
        growth: parseFloat(revenueGrowthPercentage.toFixed(2)),
        trend: revenueGrowthPercentage >= 0 ? 'up' : 'down'
      },
      transactions: {
        total: totalTransactions,
        recent: recentTransactions
      }
    };
    
    console.log('[API] Sending dashboard metrics response:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('[API] Error getting dashboard metrics:', error);
    res.status(500).json({ 
      message: 'Error retrieving dashboard metrics', 
      error: error.message 
    });
  }
};

module.exports = {
  getDashboardMetrics
};

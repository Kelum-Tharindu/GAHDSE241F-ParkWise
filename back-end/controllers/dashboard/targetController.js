const mongoose = require('mongoose');
const Transaction = require('../../models/transactionModel');
const Others = require('../../models/otherModel');

/**
 * Get monthly target data for dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMonthlyTarget = async (req, res) => {
  try {
    // Get current date information
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Define date ranges
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));
    
    // Previous month for comparison
    const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPreviousMonth = new Date(currentYear, currentMonth, 0);
    
    // Get the monthly target from Others model
    let targetData = await Others.findOne(
      { "monthlyTargets.year": currentYear, "monthlyTargets.month": currentMonth },
      { "monthlyTargets.$": 1 }
    );
    
    // Default target amount if not set
    let targetAmount = 20000; // $20,000 default
    
    if (targetData && targetData.monthlyTargets && targetData.monthlyTargets.length > 0) {
      targetAmount = targetData.monthlyTargets[0].targetAmount;
    } else {
      // If no target exists for the current month, create one with default value
      const others = await Others.findOne({});
      
      if (others) {
        // If Others document exists, add new monthly target
        others.monthlyTargets.push({
          year: currentYear,
          month: currentMonth,
          targetAmount: targetAmount
        });
        await others.save();
      } else {
        // Create new Others document with monthly target
        await Others.create({
          monthlyTargets: [{
            year: currentYear,
            month: currentMonth,
            targetAmount: targetAmount
          }]
        });
      }
    }
    
    // Get current month revenue from transactions (billing and booking only)
    const currentMonthRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'completed',
          type: { $in: ['billing', 'booking'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get today's revenue from transactions (billing and booking only)
    const todayRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          status: 'completed',
          type: { $in: ['billing', 'booking'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get previous month revenue for growth calculation (billing and booking only)
    const previousMonthRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
          status: 'completed',
          type: { $in: ['billing', 'booking'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Extract values or default to 0
    const currentRevenue = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;
    const previousRevenue = previousMonthRevenue.length > 0 ? previousMonthRevenue[0].total : 0;
    const todayAmount = todayRevenue.length > 0 ? todayRevenue[0].total : 0;
    
    // Calculate percentage achieved
    const percentageAchieved = (currentRevenue / targetAmount) * 100;
    
    // Calculate growth percentage
    let growthPercentage = 0;
    if (previousRevenue > 0) {
      growthPercentage = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (currentRevenue > 0) {
      growthPercentage = 100; // If previous month was 0 and current month has revenue, that's 100% growth
    }
    
    // Prepare response
    const response = {
      targetAmount,
      currentRevenue,
      todayRevenue: todayAmount,
      percentageAchieved: parseFloat(percentageAchieved.toFixed(2)),
      growthPercentage: parseFloat(growthPercentage.toFixed(2)),
      growthDirection: growthPercentage >= 0 ? 'up' : 'down'
    };
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error fetching monthly target data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly target data',
      error: error.message
    });
  }
};

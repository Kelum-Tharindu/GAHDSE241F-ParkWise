const mongoose = require('mongoose');
const Others = require('../../models/otherModel');

/**
 * Get all monthly targets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllMonthlyTargets = async (req, res) => {
  try {
    const othersDoc = await Others.findOne({});
    
    if (!othersDoc) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Sort by year and month (descending)
    const sortedTargets = othersDoc.monthlyTargets.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });
    
    res.status(200).json({
      success: true,
      data: sortedTargets
    });
  } catch (error) {
    console.error('Error fetching monthly targets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly targets',
      error: error.message
    });
  }
};

/**
 * Get a single monthly target by year and month
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMonthlyTargetByYearMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Validate required parameters
    if (!year || month === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }
    
    // Convert to numbers
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    
    // Find the Others document
    const othersDoc = await Others.findOne({});
    
    if (!othersDoc) {
      return res.status(404).json({
        success: false,
        message: 'No monthly targets found'
      });
    }
    
    // Find the specific target
    const target = othersDoc.monthlyTargets.find(
      t => t.year === yearNum && t.month === monthNum
    );
    
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Monthly target not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: target
    });
  } catch (error) {
    console.error('Error fetching monthly target:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly target',
      error: error.message
    });
  }
};

/**
 * Set monthly target
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.setMonthlyTarget = async (req, res) => {
  try {
    const { year, month, targetAmount } = req.body;
    
    // Validate required fields
    if (!year || month === undefined || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Year, month, and targetAmount are required'
      });
    }
    
    // Validate year and month values
    if (year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year value'
      });
    }
    
    if (month < 0 || month > 11) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 0 (January) and 11 (December)'
      });
    }
    
    // Validate target amount
    if (targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be greater than zero'
      });
    }
    
    // Find the Others document
    let othersDoc = await Others.findOne({});
    
    if (!othersDoc) {
      // Create new Others document if it doesn't exist
      othersDoc = await Others.create({
        monthlyTargets: [{
          year,
          month,
          targetAmount
        }]
      });
      
      return res.status(201).json({
        success: true,
        message: 'Monthly target set successfully',
        data: othersDoc.monthlyTargets[0]
      });
    }
    
    // Check if a target for this year/month already exists
    const existingTargetIndex = othersDoc.monthlyTargets.findIndex(
      target => target.year === year && target.month === month
    );
    
    if (existingTargetIndex !== -1) {
      // Update existing target
      othersDoc.monthlyTargets[existingTargetIndex].targetAmount = targetAmount;
      othersDoc.monthlyTargets[existingTargetIndex].updatedAt = Date.now();
    } else {
      // Add new monthly target
      othersDoc.monthlyTargets.push({
        year,
        month,
        targetAmount
      });
    }
    
    await othersDoc.save();
    
    res.status(200).json({
      success: true,
      message: 'Monthly target set successfully',
      data: existingTargetIndex !== -1 
        ? othersDoc.monthlyTargets[existingTargetIndex] 
        : othersDoc.monthlyTargets[othersDoc.monthlyTargets.length - 1]
    });
  } catch (error) {
    console.error('Error setting monthly target:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set monthly target',
      error: error.message
    });
  }
};

/**
 * Update monthly target
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateMonthlyTarget = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { targetAmount } = req.body;
    
    // Validate required parameters
    if (!year || month === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }
    
    // Validate required fields
    if (!targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Target amount is required'
      });
    }
    
    // Convert to numbers
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    
    // Validate year and month values
    if (yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year value'
      });
    }
    
    if (monthNum < 0 || monthNum > 11) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 0 (January) and 11 (December)'
      });
    }
    
    // Validate target amount
    if (targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be greater than zero'
      });
    }
    
    // Find the Others document
    const othersDoc = await Others.findOne({});
    
    if (!othersDoc) {
      return res.status(404).json({
        success: false,
        message: 'No monthly targets found'
      });
    }
    
    // Find the target to update
    const targetIndex = othersDoc.monthlyTargets.findIndex(
      target => target.year === yearNum && target.month === monthNum
    );
    
    if (targetIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Monthly target not found'
      });
    }
    
    // Update the target
    othersDoc.monthlyTargets[targetIndex].targetAmount = targetAmount;
    othersDoc.monthlyTargets[targetIndex].updatedAt = Date.now();
    
    await othersDoc.save();
    
    res.status(200).json({
      success: true,
      message: 'Monthly target updated successfully',
      data: othersDoc.monthlyTargets[targetIndex]
    });
  } catch (error) {
    console.error('Error updating monthly target:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update monthly target',
      error: error.message
    });
  }
};

/**
 * Delete monthly target
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteMonthlyTarget = async (req, res) => {
  try {
    const { year, month } = req.body;
    
    // Validate required fields
    if (!year || month === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }
    
    // Find the Others document
    const othersDoc = await Others.findOne({});
    
    if (!othersDoc) {
      return res.status(404).json({
        success: false,
        message: 'No monthly targets found'
      });
    }
    
    // Check if the target exists
    const existingTargetIndex = othersDoc.monthlyTargets.findIndex(
      target => target.year === year && target.month === month
    );
    
    if (existingTargetIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Monthly target not found'
      });
    }
    
    // Remove the target
    othersDoc.monthlyTargets.splice(existingTargetIndex, 1);
    await othersDoc.save();
    
    res.status(200).json({
      success: true,
      message: 'Monthly target deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting monthly target:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete monthly target',
      error: error.message
    });
  }
};
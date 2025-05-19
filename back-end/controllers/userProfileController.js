const User = require('../models/Usermodel');
const mongoose = require('mongoose');

// @desc    Get user profile
// @route   GET /api/users/:id/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
  
      const user = await User.findById(id).select(
        '-password -otpSecret -backupCodes -hashedBackupCodes -resetPasswordToken -resetPasswordExpire -is2FAEnabled -googleId -token -tokenExpiry -createdAt -updatedAt'
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    console.log("call updateUserProfile");
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password -otpSecret -backupCodes -hashedBackupCodes -resetPasswordToken -resetPasswordExpire');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user social links
// @route   PUT /api/users/:id/social-links
// @access  Private
const updateSocialLinks = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { socialLinks: req.body } },
      { new: true, runValidators: true }
    ).select('-password -otpSecret -backupCodes -hashedBackupCodes -resetPasswordToken -resetPasswordExpire');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user address
// @route   PUT /api/users/:id/address
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password -otpSecret -backupCodes -hashedBackupCodes -resetPasswordToken -resetPasswordExpire');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateSocialLinks,
  updateAddress
}; 
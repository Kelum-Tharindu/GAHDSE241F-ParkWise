const User = require("../models/usermodel");

class UserController {
  // Get users by role
  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;

      // Validate role parameter
      const validRoles = ['user', 'landowner', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      // Find users by role, excluding sensitive information
      const users = await User.find({ role })
        .select('-password -resetPasswordToken -resetPasswordExpire -otpSecret -backupCodes -hashedBackupCodes -googleId');

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find()
        .select('-password -resetPasswordToken -resetPasswordExpire -otpSecret -backupCodes -hashedBackupCodes -googleId');

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }
}

module.exports = new UserController(); 
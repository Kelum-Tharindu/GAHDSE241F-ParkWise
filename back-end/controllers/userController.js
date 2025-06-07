const User = require("../models/usermodel");
const bcrypt = require('bcryptjs');

class UserController {
  // Get users by role
  async getUsersByRole(req, res) {
    const { role } = req.params;
    console.log(`[getUsersByRole] Fetching users with role: ${role}`);
    
    try {
      // Validate role parameter
      const validRoles = ['user', 'landowner', 'admin'];
      if (!validRoles.includes(role)) {
        console.log(`[getUsersByRole] Invalid role specified: ${role}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      // Find users by role, excluding sensitive information
      const users = await User.find({ role })
        .select('-password -resetPasswordToken -resetPasswordExpire -otpSecret -backupCodes -hashedBackupCodes -googleId');

      console.log(`[getUsersByRole] Found ${users.length} users with role: ${role}`);
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error(`[getUsersByRole] Error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    console.log('[getAllUsers] Fetching all users');
    
    try {
      const users = await User.find()
        .select('-password -resetPasswordToken -resetPasswordExpire -otpSecret -backupCodes -hashedBackupCodes -googleId');

      console.log(`[getAllUsers] Found ${users.length} users`);
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error(`[getAllUsers] Error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Create a new user
  async createUser(req, res) {
    console.log('[createUser] Creating new user');
    console.log('[createUser] Request body:', JSON.stringify(req.body, null, 2));
    
    try {
      const { 
        username, 
        firstName, 
        lastName, 
        email, 
        password,
        role,
        phone,
        country,
        city,
        postalCode,
        socialLinks,
        addedBy
      } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`[createUser] Email already in use: ${email}`);
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }

      // Check if username already exists
      if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          console.log(`[createUser] Username already taken: ${username}`);
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }

      // Create user
      const user = new User({
        username,
        firstName,
        lastName,
        email,
        password,
        role: role || 'user',
        phone,
        country,
        city,
        postalCode,
        socialLinks: socialLinks || {},
        // Store who added this user (for admin tracking)
        createdBy: addedBy
      });

      await user.save();
      console.log(`[createUser] User created successfully with ID: ${user._id}`);

      // Return user without sensitive data
      const userData = user.toObject();
      delete userData.password;
      delete userData.resetPasswordToken;
      delete userData.resetPasswordExpire;
      delete userData.otpSecret;
      delete userData.backupCodes;
      delete userData.hashedBackupCodes;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userData
      });
    } catch (error) {
      console.error(`[createUser] Error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  // Update a user
  async updateUser(req, res) {
    console.log('[updateUser] Request received');
    const { id } = req.params;
    console.log(`[updateUser] Updating user with ID: ${id}`);
    console.log('[updateUser] Update data:', JSON.stringify(req.body, null, 2));
    
    try {
      const updateData = { ...req.body };
      
      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        console.log(`[updateUser] User not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if email is being updated and if it already exists
      if (updateData.email && updateData.email !== user.email) {
        console.log(`[updateUser] Checking if email already exists: ${updateData.email}`);
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) {
          console.log(`[updateUser] Email already in use: ${updateData.email}`);
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }
      
      // Check if username is being updated and if it already exists
      if (updateData.username && updateData.username !== user.username) {
        console.log(`[updateUser] Checking if username already exists: ${updateData.username}`);
        const existingUsername = await User.findOne({ username: updateData.username });
        if (existingUsername) {
          console.log(`[updateUser] Username already taken: ${updateData.username}`);
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }
      
      // If password is being updated, hash it
      if (updateData.password) {
        console.log('[updateUser] Hashing new password');
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
      
      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password -resetPasswordToken -resetPasswordExpire -otpSecret -backupCodes -hashedBackupCodes -googleId');
      
      console.log(`[updateUser] User updated successfully: ${updatedUser._id}`);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error(`[updateUser] Error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    const { id } = req.params;
    console.log(`[deleteUser] Deleting user with ID: ${id}`);
    
    try {
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        console.log(`[deleteUser] User not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log(`[deleteUser] User deleted successfully: ${id}`);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error(`[deleteUser] Error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }
}

module.exports = new UserController(); 
const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

// Get all users
router.get('/role/all', UserController.getAllUsers);

// Get users by role
router.get('/role/:role', UserController.getUsersByRole);

module.exports = router; 
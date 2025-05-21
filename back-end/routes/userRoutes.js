const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

// Get all users
router.get('/role/all', UserController.getAllUsers);

// Get users by role
router.get('/role/:role', UserController.getUsersByRole);

// Create a new user
router.post('/', UserController.createUser);

// Update a user
router.put('/:id', UserController.updateUser);

// Delete a user
router.delete('/:id', UserController.deleteUser);

module.exports = router; 
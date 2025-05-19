const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateSocialLinks,
  updateAddress
} = require('../controllers/userProfileController');
// const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
// router.use(protect);

// Profile routes
router.get('/:id/profile', getUserProfile);
router.put('/:id/profile', updateUserProfile);
router.put('/:id/social-links', updateSocialLinks);
router.put('/:id/address', updateAddress);

module.exports = router; 
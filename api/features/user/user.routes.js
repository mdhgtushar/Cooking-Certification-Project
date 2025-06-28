const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById
} = require('./user.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', protect, getUserById);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router; 
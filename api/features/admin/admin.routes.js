const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUserManagement,
  updateUser,
  getCertificateManagement,
  getApplicationManagement,
  getExamResultManagement,
  getSystemAnalytics
} = require('./admin.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// All admin routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getUserManagement);
router.put('/users/:id', updateUser);

// Certificate Management
router.get('/certificates', getCertificateManagement);

// Application Management
router.get('/applications', getApplicationManagement);

// Exam Result Management
router.get('/exam-results', getExamResultManagement);

// System Analytics
router.get('/analytics', getSystemAnalytics);

module.exports = router; 
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUserManagement,
  updateUser,
  deleteUser,
  bulkUpdateUsers,
  bulkDeleteUsers,
  getCertificateManagement,
  getApplicationManagement,
  getExamResultManagement,
  getSystemAnalytics,
  createApplication,
  createExam,
  createCertificate
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
router.delete('/users/:id', deleteUser);
router.put('/users/bulk-update', bulkUpdateUsers);
router.delete('/users/bulk-delete', bulkDeleteUsers);

// Certificate Management
router.get('/certificates', getCertificateManagement);
router.post('/certificates', createCertificate);

// Application Management
router.get('/applications', getApplicationManagement);
router.post('/applications', createApplication);

// Exam Result Management
router.get('/exam-results', getExamResultManagement);
router.post('/exam-results', createExam);

// System Analytics
router.get('/analytics', getSystemAnalytics);

module.exports = router; 
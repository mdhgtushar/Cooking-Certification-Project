const express = require('express');
const router = express.Router();
const {
  applyForCourse,
  getMyApplications,
  getApplicationById,
  updateApplication,
  cancelApplication,
  getAllApplications,
  reviewApplication
} = require('./application.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', applyForCourse);
router.get('/my-applications', getMyApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', cancelApplication);

// Admin/Instructor routes
router.get('/', authorize('admin', 'instructor'), getAllApplications);
router.put('/:id/review', authorize('admin', 'instructor'), reviewApplication);

module.exports = router; 
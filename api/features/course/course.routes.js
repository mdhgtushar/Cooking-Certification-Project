const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses
} = require('./course.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.use(protect);

// Instructor routes
router.post('/', authorize('instructor', 'admin'), createCourse);
router.put('/:id', authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authorize('instructor', 'admin'), deleteCourse);
router.get('/instructor/my-courses', authorize('instructor'), getInstructorCourses);

module.exports = router; 
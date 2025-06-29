const express = require('express');
const router = express.Router();
const {
  scheduleExam,
  getMyExams,
  getExamById,
  startExam,
  submitExam,
  gradeExam,
  getAllExams
} = require('./exam.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Student routes
router.get('/my-exams', getMyExams);
router.get('/:id', getExamById);
router.put('/:id/start', startExam);
router.put('/:id/submit', submitExam);

// Admin/Instructor routes
router.post('/', authorize('admin', 'instructor'), scheduleExam);
router.get('/', authorize('admin', 'instructor'), getAllExams);
router.put('/:id/grade', authorize('admin', 'instructor'), gradeExam);

module.exports = router; 
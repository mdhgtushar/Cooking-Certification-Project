const Exam = require('./exam.model');
const Application = require('../application/application.model');
const Course = require('../course/course.model');
const validateInput = require('../../utils/validateInput');

// @desc    Schedule an exam
// @route   POST /api/exams
// @access  Private/Admin/Instructor
const scheduleExam = async (req, res, next) => {
  try {
    const {
      applicationId,
      examDate,
      examTime,
      duration,
      location,
      proctorId,
      questions
    } = req.body;

    // Validate input
    const validation = validateInput({
      applicationId: { value: applicationId, required: true },
      examDate: { value: examDate, required: true },
      examTime: { value: examTime, required: true, maxLength: 10 },
      duration: { value: duration, required: true, type: 'number', min: 15 },
      location: { value: location, maxLength: 200 }
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if application exists and is approved
    const application = await Application.findById(applicationId)
      .populate('course')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Application must be approved before scheduling exam'
      });
    }

    // Check if exam already exists for this application
    const existingExam = await Exam.findOne({ application: applicationId });
    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: 'Exam already scheduled for this application'
      });
    }

    // Create exam
    const exam = await Exam.create({
      course: application.course._id,
      application: applicationId,
      student: application.applicant._id,
      examType: application.examType,
      examDate,
      examTime,
      duration,
      location,
      proctor: proctorId,
      questions,
      passingScore: application.course.examDetails.passingScore
    });

    await exam.populate([
      { path: 'course', select: 'title description' },
      { path: 'student', select: 'firstName lastName email' },
      { path: 'proctor', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Exam scheduled successfully',
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's exams
// @route   GET /api/exams/my-exams
// @access  Private
const getMyExams = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { student: req.user.id };
    if (status) filter.status = status;

    const exams = await Exam.find(filter)
      .populate('course', 'title description')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ examDate: -1 });

    const total = await Exam.countDocuments(filter);

    res.json({
      success: true,
      data: {
        exams,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('course', 'title description')
      .populate('student', 'firstName lastName email')
      .populate('proctor', 'firstName lastName email');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if user is authorized to view this exam
    if (exam.student._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this exam'
      });
    }

    res.json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start exam
// @route   PUT /api/exams/:id/start
// @access  Private
const startExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if user is the student
    if (exam.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this exam'
      });
    }

    // Check if exam can be started
    if (exam.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Exam cannot be started'
      });
    }

    // Check if exam date is today
    const today = new Date();
    const examDate = new Date(exam.examDate);
    if (today.toDateString() !== examDate.toDateString()) {
      return res.status(400).json({
        success: false,
        message: 'Exam can only be started on the scheduled date'
      });
    }

    exam.status = 'in_progress';
    exam.startTime = new Date();
    await exam.save();

    res.json({
      success: true,
      message: 'Exam started successfully',
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit exam answers
// @route   PUT /api/exams/:id/submit
// @access  Private
const submitExam = async (req, res, next) => {
  try {
    const { answers } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if user is the student
    if (exam.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this exam'
      });
    }

    // Check if exam is in progress
    if (exam.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Exam is not in progress'
      });
    }

    exam.answers = answers;
    exam.status = 'completed';
    exam.endTime = new Date();
    exam.actualDuration = Math.round((exam.endTime - exam.startTime) / (1000 * 60)); // in minutes

    // Calculate score
    exam.calculateScore();

    await exam.save();

    res.json({
      success: true,
      message: 'Exam submitted successfully',
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade exam (admin/instructor)
// @route   PUT /api/exams/:id/grade
// @access  Private/Admin/Instructor
const gradeExam = async (req, res, next) => {
  try {
    const { answers, score, feedback } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if user is authorized to grade this exam
    if (req.user.role === 'instructor') {
      const course = await Course.findById(exam.course);
      if (course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to grade this exam'
        });
      }
    }

    if (answers) exam.answers = answers;
    if (score) exam.score = score;
    if (feedback) exam.feedback.proctor = feedback;

    // Recalculate result
    if (exam.score && exam.passingScore) {
      exam.result = exam.score.percentage >= exam.passingScore ? 'pass' : 'fail';
    }

    await exam.save();

    await exam.populate([
      { path: 'course', select: 'title description' },
      { path: 'student', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Exam graded successfully',
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exams (admin/instructor)
// @route   GET /api/exams
// @access  Private/Admin/Instructor
const getAllExams = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, courseId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.course = courseId;

    // If instructor, only show exams for their courses
    if (req.user.role === 'instructor') {
      const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
      filter.course = { $in: instructorCourses.map(c => c._id) };
    }

    const exams = await Exam.find(filter)
      .populate('course', 'title description')
      .populate('student', 'firstName lastName email')
      .populate('proctor', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ examDate: -1 });

    const total = await Exam.countDocuments(filter);

    res.json({
      success: true,
      data: {
        exams,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scheduleExam,
  getMyExams,
  getExamById,
  startExam,
  submitExam,
  gradeExam,
  getAllExams
}; 
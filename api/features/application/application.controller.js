const Application = require('./application.model');
const Course = require('../course/course.model');
const validateInput = require('../../utils/validateInput');

// @desc    Apply for a course
// @route   POST /api/applications
// @access  Private
const applyForCourse = async (req, res, next) => {
  try {
    const {
      courseId,
      applicationType,
      examType,
      examDate,
      examLocation,
      examTime,
      personalInfo,
      education,
      experience,
      documents,
      payment,
      notes
    } = req.body;

    // Validate input
    const validation = validateInput({
      courseId: { value: courseId, required: true },
      applicationType: { value: applicationType, required: true },
      examType: { value: examType, required: true },
      'personalInfo.dateOfBirth': { value: personalInfo?.dateOfBirth, required: true },
      'personalInfo.phone': { value: personalInfo?.phone, required: true, maxLength: 20 },
      'education.highestEducation': { value: education?.highestEducation, required: true, maxLength: 100 },
      'education.institution': { value: education?.institution, required: true, maxLength: 200 },
      'education.graduationYear': { value: education?.graduationYear, required: true, type: 'number', min: 1900 },
      'payment.amount': { value: payment?.amount, required: true, type: 'number', min: 0 },
      'payment.paymentMethod': { value: payment?.paymentMethod, required: true }
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is active and published
    if (!course.isActive || course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for applications'
      });
    }

    // Check if user has already applied for this course
    const existingApplication = await Application.findOne({
      applicant: req.user.id,
      course: courseId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this course'
      });
    }

    // Create application
    const application = await Application.create({
      applicant: req.user.id,
      course: courseId,
      applicationType,
      examType,
      examDate,
      examLocation,
      examTime,
      personalInfo,
      education,
      experience,
      documents,
      payment,
      notes
    });

    // Populate course and applicant details
    await application.populate([
      { path: 'course', select: 'title description price' },
      { path: 'applicant', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { applicant: req.user.id };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('course', 'title description price thumbnail')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
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

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('course', 'title description price instructor')
      .populate('applicant', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to view this application
    if (application.applicant._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to update this application
    if (application.applicant.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Only allow updates if application is pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application that is not pending'
      });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'course', select: 'title description price' },
      { path: 'applicant', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: { application: updatedApplication }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel application
// @route   DELETE /api/applications/:id
// @access  Private
const cancelApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to cancel this application
    if (application.applicant.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this application'
      });
    }

    // Only allow cancellation if application is pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel application that is not pending'
      });
    }

    application.status = 'cancelled';
    await application.save();

    res.json({
      success: true,
      message: 'Application cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (admin/instructor)
// @route   GET /api/applications
// @access  Private/Admin/Instructor
const getAllApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, courseId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.course = courseId;

    // If instructor, only show applications for their courses
    if (req.user.role === 'instructor') {
      const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
      filter.course = { $in: instructorCourses.map(c => c._id) };
    }

    const applications = await Application.find(filter)
      .populate('course', 'title description price')
      .populate('applicant', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
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

// @desc    Review application (admin/instructor)
// @route   PUT /api/applications/:id/review
// @access  Private/Admin/Instructor
const reviewApplication = async (req, res, next) => {
  try {
    const { status, rejectionReason, notes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to review this application
    if (req.user.role === 'instructor') {
      const course = await Course.findById(application.course);
      if (course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to review this application'
        });
      }
    }

    application.status = status;
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    if (rejectionReason) application.rejectionReason = rejectionReason;
    if (notes) application.notes.admin = notes;

    await application.save();

    await application.populate([
      { path: 'course', select: 'title description price' },
      { path: 'applicant', select: 'firstName lastName email' },
      { path: 'reviewedBy', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Application reviewed successfully',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForCourse,
  getMyApplications,
  getApplicationById,
  updateApplication,
  cancelApplication,
  getAllApplications,
  reviewApplication
}; 
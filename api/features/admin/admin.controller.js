const User = require('../user/user.model');
const Course = require('../course/course.model');
const Application = require('../application/application.model');
const Exam = require('../exam/exam.model');
const Certificate = require('../certificate/certificate.model');
const Contact = require('../contact/contact.model');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    console.log('Dashboard stats requested');
    
    // Check if models are properly loaded
    if (!User || !Course || !Application || !Exam || !Certificate || !Contact) {
      throw new Error('One or more models are not properly loaded');
    }

    // User statistics
    let userStats = {};
    try {
      const userAggregation = await User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            students: { $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] } },
            instructors: { $sum: { $cond: [{ $eq: ['$role', 'instructor'] }, 1, 0] } },
            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } }
          }
        }
      ]);
      userStats = userAggregation[0] || {};
    } catch (error) {
      console.error('User aggregation error:', error);
      userStats = { total: 0, students: 0, instructors: 0, admins: 0, active: 0, inactive: 0 };
    }

    // Course statistics
    let courseStats = {};
    try {
      const courseAggregation = await Course.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
            draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
            archived: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } },
            active: { $sum: { $cond: ['$isActive', 1, 0] } }
          }
        }
      ]);
      courseStats = courseAggregation[0] || {};
    } catch (error) {
      console.error('Course aggregation error:', error);
      courseStats = { total: 0, published: 0, draft: 0, archived: 0, active: 0 };
    }

    // Application statistics
    let applicationStats = {};
    try {
      const applicationAggregation = await Application.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
          }
        }
      ]);
      applicationStats = applicationAggregation[0] || {};
    } catch (error) {
      console.error('Application aggregation error:', error);
      applicationStats = { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    }

    // Exam statistics
    let examStats = {};
    try {
      const examAggregation = await Exam.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            passed: { $sum: { $cond: [{ $eq: ['$result', 'pass'] }, 1, 0] } },
            failed: { $sum: { $cond: [{ $eq: ['$result', 'fail'] }, 1, 0] } }
          }
        }
      ]);
      examStats = examAggregation[0] || {};
    } catch (error) {
      console.error('Exam aggregation error:', error);
      examStats = { total: 0, scheduled: 0, inProgress: 0, completed: 0, passed: 0, failed: 0 };
    }

    // Certificate statistics
    let certificateStats = {};
    try {
      const certificateAggregation = await Certificate.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } },
            revoked: { $sum: { $cond: [{ $eq: ['$status', 'revoked'] }, 1, 0] } }
          }
        }
      ]);
      certificateStats = certificateAggregation[0] || {};
    } catch (error) {
      console.error('Certificate aggregation error:', error);
      certificateStats = { total: 0, active: 0, expired: 0, revoked: 0 };
    }

    // Contact statistics
    let contactStats = {};
    try {
      const contactAggregation = await Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } }
          }
        }
      ]);
      contactStats = contactAggregation[0] || {};
    } catch (error) {
      console.error('Contact aggregation error:', error);
      contactStats = { total: 0, new: 0, inProgress: 0, resolved: 0, urgent: 0 };
    }

    // Recent activities
    let recentUsers = [];
    let recentApplications = [];
    let recentExams = [];

    try {
      recentUsers = await User.find()
        .select('firstName lastName email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (error) {
      console.error('Recent users error:', error);
    }

    try {
      recentApplications = await Application.find()
        .populate('applicant', 'firstName lastName email')
        .populate('course', 'title')
        .select('status createdAt')
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (error) {
      console.error('Recent applications error:', error);
    }

    try {
      recentExams = await Exam.find()
        .populate('student', 'firstName lastName email')
        .populate('course', 'title')
        .select('status result createdAt')
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (error) {
      console.error('Recent exams error:', error);
    }

    console.log('Dashboard stats calculated successfully');

    res.json({
      success: true,
      data: {
        users: userStats,
        courses: courseStats,
        applications: applicationStats,
        exams: examStats,
        certificates: certificateStats,
        contacts: contactStats,
        recentActivities: {
          users: recentUsers,
          applications: recentApplications,
          exams: recentExams
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    next(error);
  }
};

// @desc    Get user management data
// @route   GET /api/admin/users
// @access  Private/Admin
const getUserManagement = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
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

// @desc    Update user role/status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has any related data
    const hasApplications = await Application.exists({ applicant: user._id });
    const hasExams = await Exam.exists({ student: user._id });
    const hasCertificates = await Certificate.exists({ student: user._id });

    if (hasApplications || hasExams || hasCertificates) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing applications, exams, or certificates'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update users
// @route   PUT /api/admin/users/bulk-update
// @access  Private/Admin
const bulkUpdateUsers = async (req, res, next) => {
  try {
    const { userIds, updateData } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: updateData }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} users updated successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete users
// @route   DELETE /api/admin/users/bulk-delete
// @access  Private/Admin
const bulkDeleteUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    // Check if any users have related data
    const usersWithData = await User.aggregate([
      {
        $match: { _id: { $in: userIds.map(id => new require('mongoose').Types.ObjectId(id)) } }
      },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'applicant',
          as: 'applications'
        }
      },
      {
        $lookup: {
          from: 'exams',
          localField: '_id',
          foreignField: 'student',
          as: 'exams'
        }
      },
      {
        $lookup: {
          from: 'certificates',
          localField: '_id',
          foreignField: 'student',
          as: 'certificates'
        }
      },
      {
        $match: {
          $or: [
            { applications: { $ne: [] } },
            { exams: { $ne: [] } },
            { certificates: { $ne: [] } }
          ]
        }
      }
    ]);

    if (usersWithData.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some users have existing applications, exams, or certificates and cannot be deleted'
      });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} users deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate management data
// @route   GET /api/admin/certificates
// @access  Private/Admin
const getCertificateManagement = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { certificateNumber: { $regex: search, $options: 'i' } },
        { verificationCode: { $regex: search, $options: 'i' } }
      ];
    }

    const certificates = await Certificate.find(filter)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .populate('instructor', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ issueDate: -1 });

    const total = await Certificate.countDocuments(filter);

    res.json({
      success: true,
      data: {
        certificates,
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

// @desc    Get application management data
// @route   GET /api/admin/applications
// @access  Private/Admin
const getApplicationManagement = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      courseId,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.course = courseId;
    if (search) {
      filter.$or = [
        { 'personalInfo.phone': { $regex: search, $options: 'i' } },
        { 'personalInfo.address.city': { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(filter)
      .populate('applicant', 'firstName lastName email')
      .populate('course', 'title')
      .populate('reviewedBy', 'firstName lastName')
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

// @desc    Get exam result management data
// @route   GET /api/admin/exam-results
// @access  Private/Admin
const getExamResultManagement = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      result,
      courseId,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (result) filter.result = result;
    if (courseId) filter.course = courseId;
    if (search) {
      filter.$or = [
        { 'score.percentage': { $gte: parseInt(search) } }
      ];
    }

    const exams = await Exam.find(filter)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .populate('proctor', 'firstName lastName')
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

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getSystemAnalytics = async (req, res, next) => {
  try {
    console.log('System analytics requested');

    // Get analytics data
    const analytics = {
      userGrowth: [],
      applicationTrends: [],
      examPerformance: [],
      certificateIssuance: []
    };

    // User growth over time (last 12 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    analytics.userGrowth = userGrowth;

    // Application trends
    const applicationTrends = await Application.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    analytics.applicationTrends = applicationTrends;

    // Exam performance
    const examPerformance = await Exam.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$result',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    analytics.examPerformance = examPerformance;

    // Certificate issuance
    const certificateIssuance = await Certificate.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    analytics.certificateIssuance = certificateIssuance;

    console.log('System analytics calculated successfully');

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('System analytics error:', error);
    next(error);
  }
};

// @desc    Create application (admin)
// @route   POST /api/admin/applications
// @access  Private/Admin
const createApplication = async (req, res, next) => {
  try {
    console.log('Creating application:', req.body);

    const {
      applicantId,
      courseId,
      applicationType,
      examType,
      examDate,
      examLocation,
      examTime,
      personalInfo,
      education,
      experience,
      payment
    } = req.body;

    // Validate required fields
    if (!applicantId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide applicant ID and course ID'
      });
    }

    // Validate that user and course exist
    const user = await User.findById(applicantId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Create application with all required fields
    const application = await Application.create({
      applicant: applicantId,
      course: courseId,
      status: 'pending',
      applicationType: applicationType || 'offline',
      examType: examType || 'offline',
      examDate: examDate ? new Date(examDate) : null,
      examLocation: examLocation || 'TBD',
      examTime: examTime || '09:00',
      personalInfo: {
        dateOfBirth: personalInfo?.dateOfBirth ? new Date(personalInfo.dateOfBirth) : new Date('1990-01-01'),
        phone: personalInfo?.phone || 'N/A',
        address: {
          street: personalInfo?.address?.street || 'N/A',
          city: personalInfo?.address?.city || 'N/A',
          state: personalInfo?.address?.state || 'N/A',
          zipCode: personalInfo?.address?.zipCode || 'N/A',
          country: personalInfo?.address?.country || 'N/A'
        },
        emergencyContact: {
          name: personalInfo?.emergencyContact?.name || 'N/A',
          relationship: personalInfo?.emergencyContact?.relationship || 'N/A',
          phone: personalInfo?.emergencyContact?.phone || 'N/A'
        }
      },
      education: {
        highestEducation: education?.highestEducation || 'N/A',
        institution: education?.institution || 'N/A',
        graduationYear: education?.graduationYear || new Date().getFullYear()
      },
      experience: {
        cookingExperience: experience?.cookingExperience || 'none',
        yearsOfExperience: experience?.yearsOfExperience || 0
      },
      payment: {
        amount: payment?.amount || 0,
        currency: payment?.currency || 'USD',
        status: payment?.status || 'completed',
        paymentMethod: payment?.paymentMethod || 'other'
      },
      notes: {
        applicant: `Admin-created application for ${user.firstName} ${user.lastName}`,
        admin: ''
      }
    });

    console.log('Application created successfully:', application._id);

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Create application error:', error);
    next(error);
  }
};

// @desc    Create exam (admin)
// @route   POST /api/admin/exam-results
// @access  Private/Admin
const createExam = async (req, res, next) => {
  try {
    console.log('Creating exam:', req.body);

    const {
      studentName,
      studentEmail,
      courseId,
      courseName,
      examDate,
      duration,
      status = 'scheduled',
      examNumber,
      score,
      passed
    } = req.body;

    // Validate required fields
    if (!studentName || !studentEmail || !courseId || !examDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student name, email, course ID, and exam date'
      });
    }

    // Create exam
    const exam = await Exam.create({
      course: courseId,
      application: null, // Will be set to null for admin-created exams
      student: null, // Will be set to null for admin-created exams
      examType: 'offline',
      status,
      examDate,
      examTime: '09:00', // Default time
      duration: duration || 120,
      location: 'TBD',
      proctor: req.user.id,
      questions: [], // Empty questions array
      answers: [], // Empty answers array
      score: {
        total: 100,
        obtained: score || 0,
        percentage: score ? (score / 100) * 100 : 0
      },
      passingScore: 70,
      result: passed ? 'pass' : (passed === false ? 'fail' : 'pending'),
      notes: {
        student: '',
        proctor: '',
        admin: `Admin-created exam for ${studentName}`
      },
      createdBy: req.user.id
    });

    console.log('Exam created successfully:', exam._id);

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    next(error);
  }
};

// @desc    Create certificate (admin)
// @route   POST /api/admin/certificates
// @access  Private/Admin
const createCertificate = async (req, res, next) => {
  try {
    console.log('Creating certificate:', req.body);

    const {
      studentName,
      studentEmail,
      courseId,
      courseName,
      issueDate,
      status = 'active',
      certificateNumber,
      expiryDate,
      verified = true
    } = req.body;

    // Validate required fields
    if (!studentName || !studentEmail || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student name, email, and course ID'
      });
    }

    // Create certificate
    const certificate = await Certificate.create({
      certificateNumber: certificateNumber || Certificate.generateCertificateNumber(),
      student: null, // Will be set to null for admin-created certificates
      course: courseId,
      exam: null, // Will be set to null for admin-created certificates
      instructor: req.user.id,
      issueDate: issueDate || new Date(),
      expiryDate: expiryDate || new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
      status,
      score: {
        total: 100,
        obtained: 100,
        percentage: 100
      },
      grade: 'A',
      certificateType: 'completion',
      certificateLevel: 'beginner',
      certificateUrl: `https://example.com/certificates/${certificateNumber || 'temp'}`,
      qrCode: `https://example.com/verify/${certificateNumber || 'temp'}`,
      verificationCode: Certificate.generateVerificationCode(),
      issuedBy: 'Cooking Certification Institute',
      authorizedBy: req.user.id,
      metadata: {
        courseDuration: 0,
        examDuration: 0,
        totalQuestions: 0,
        passingScore: 70,
        certificateTemplate: 'default',
        generatedBy: 'admin',
        version: '1.0'
      },
      createdBy: req.user.id
    });

    console.log('Certificate created successfully:', certificate._id);

    res.status(201).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    next(error);
  }
};

module.exports = {
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
}; 
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
    // User statistics
    const userStats = await User.aggregate([
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

    // Course statistics
    const courseStats = await Course.aggregate([
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

    // Application statistics
    const applicationStats = await Application.aggregate([
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

    // Exam statistics
    const examStats = await Exam.aggregate([
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

    // Certificate statistics
    const certificateStats = await Certificate.aggregate([
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

    // Contact statistics
    const contactStats = await Contact.aggregate([
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

    // Recent activities
    const recentUsers = await User.find()
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find()
      .populate('applicant', 'firstName lastName email')
      .populate('course', 'title')
      .select('status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentExams = await Exam.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .select('status result createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        users: userStats[0] || {},
        courses: courseStats[0] || {},
        applications: applicationStats[0] || {},
        exams: examStats[0] || {},
        certificates: certificateStats[0] || {},
        contacts: contactStats[0] || {},
        recentActivities: {
          users: recentUsers,
          applications: recentApplications,
          exams: recentExams
        }
      }
    });
  } catch (error) {
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
    const { period = '30' } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Application trends
    const applicationTrends = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Exam completion trends
    const examTrends = await Exam.aggregate([
      {
        $match: {
          status: 'completed',
          endTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$endTime' },
            month: { $month: '$endTime' },
            day: { $dayOfMonth: '$endTime' }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$score.percentage' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Certificate generation trends
    const certificateTrends = await Certificate.aggregate([
      {
        $match: {
          issueDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$issueDate' },
            month: { $month: '$issueDate' },
            day: { $dayOfMonth: '$issueDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        userTrends,
        applicationTrends,
        examTrends,
        certificateTrends
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUserManagement,
  updateUser,
  getCertificateManagement,
  getApplicationManagement,
  getExamResultManagement,
  getSystemAnalytics
}; 
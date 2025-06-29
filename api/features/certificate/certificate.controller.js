const Certificate = require('./certificate.model');
const Exam = require('../exam/exam.model');
const Course = require('../course/course.model');
const User = require('../user/user.model');
const validateInput = require('../../utils/validateInput');

// @desc    Generate certificate
// @route   POST /api/certificates
// @access  Private/Admin/Instructor
const generateCertificate = async (req, res, next) => {
  try {
    const { examId } = req.body;

    // Validate input
    const validation = validateInput({
      examId: { value: examId, required: true }
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if exam exists and is completed with pass result
    const exam = await Exam.findById(examId)
      .populate('course')
      .populate('student')
      .populate('proctor');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    if (exam.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Exam must be completed before generating certificate'
      });
    }

    if (exam.result !== 'pass') {
      return res.status(400).json({
        success: false,
        message: 'Certificate can only be generated for passing exams'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({ exam: examId });
    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already exists for this exam'
      });
    }

    // Calculate grade based on percentage
    const getGrade = (percentage) => {
      if (percentage >= 97) return 'A+';
      if (percentage >= 93) return 'A';
      if (percentage >= 90) return 'A-';
      if (percentage >= 87) return 'B+';
      if (percentage >= 83) return 'B';
      if (percentage >= 80) return 'B-';
      if (percentage >= 77) return 'C+';
      if (percentage >= 73) return 'C';
      if (percentage >= 70) return 'C-';
      if (percentage >= 60) return 'D';
      return 'F';
    };

    // Determine certificate type and level
    const getCertificateType = (percentage, level) => {
      if (percentage >= 95) return 'excellence';
      if (percentage >= 85) return 'achievement';
      return 'completion';
    };

    // Generate certificate data
    const certificateNumber = Certificate.generateCertificateNumber();
    const verificationCode = Certificate.generateVerificationCode();
    const grade = getGrade(exam.score.percentage);
    const certificateType = getCertificateType(exam.score.percentage, exam.course.level);
    const certificateLevel = exam.course.level;

    // Generate certificate URL (in real app, this would generate a PDF)
    const certificateUrl = `/certificates/${certificateNumber}.pdf`;
    
    // Generate QR code URL
    const qrCode = `${process.env.BASE_URL || 'http://localhost:5000'}/verify/${verificationCode}`;

    // Calculate expiry date (2 years from issue date)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);

    // Create certificate
    const certificate = await Certificate.create({
      certificateNumber,
      student: exam.student._id,
      course: exam.course._id,
      exam: examId,
      instructor: exam.proctor._id,
      issueDate: new Date(),
      expiryDate,
      score: exam.score,
      grade,
      certificateType,
      certificateLevel,
      certificateUrl,
      qrCode,
      verificationCode,
      issuedBy: 'Cooking Certification Institute',
      authorizedBy: req.user.id,
      metadata: {
        courseDuration: exam.course.duration,
        examDuration: exam.duration,
        totalQuestions: exam.questions.length,
        passingScore: exam.passingScore,
        certificateTemplate: 'standard',
        generatedBy: req.user.id,
        version: '1.0'
      }
    });

    // Update exam to mark certificate as generated
    exam.certificateGenerated = true;
    exam.certificateId = certificate._id;
    await exam.save();

    await certificate.populate([
      { path: 'student', select: 'firstName lastName email' },
      { path: 'course', select: 'title description' },
      { path: 'instructor', select: 'firstName lastName' },
      { path: 'authorizedBy', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
const getMyCertificates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { student: req.user.id };
    if (status) filter.status = status;

    const certificates = await Certificate.find(filter)
      .populate('course', 'title description')
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

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title description')
      .populate('instructor', 'firstName lastName')
      .populate('authorizedBy', 'firstName lastName');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if user is authorized to view this certificate
    if (certificate.student._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certificate'
      });
    }

    // Update status based on expiry
    certificate.updateStatus();

    res.json({
      success: true,
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate (public)
// @route   GET /api/certificates/verify/:code
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const { code } = req.params;

    const certificate = await Certificate.findOne({ verificationCode: code })
      .populate('student', 'firstName lastName email')
      .populate('course', 'title description')
      .populate('instructor', 'firstName lastName')
      .populate('authorizedBy', 'firstName lastName');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid verification code'
      });
    }

    // Update status based on expiry
    certificate.updateStatus();

    res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: {
        certificate: {
          certificateNumber: certificate.certificateNumber,
          student: certificate.student,
          course: certificate.course,
          instructor: certificate.instructor,
          issueDate: certificate.issueDate,
          expiryDate: certificate.expiryDate,
          status: certificate.status,
          score: certificate.score,
          grade: certificate.grade,
          certificateType: certificate.certificateType,
          certificateLevel: certificate.certificateLevel,
          issuedBy: certificate.issuedBy,
          authorizedBy: certificate.authorizedBy
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate
// @route   GET /api/certificates/:id/download
// @access  Private
const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student', 'firstName lastName')
      .populate('course', 'title description')
      .populate('instructor', 'firstName lastName');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if user is authorized to download this certificate
    if (certificate.student._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this certificate'
      });
    }

    // In a real application, this would generate and return a PDF
    // For now, we'll return the certificate data
    res.json({
      success: true,
      message: 'Certificate download initiated',
      data: {
        certificateUrl: certificate.certificateUrl,
        certificate: {
          certificateNumber: certificate.certificateNumber,
          student: certificate.student,
          course: certificate.course,
          instructor: certificate.instructor,
          issueDate: certificate.issueDate,
          score: certificate.score,
          grade: certificate.grade,
          certificateType: certificate.certificateType,
          certificateLevel: certificate.certificateLevel,
          qrCode: certificate.qrCode,
          verificationCode: certificate.verificationCode
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all certificates (admin/instructor)
// @route   GET /api/certificates
// @access  Private/Admin/Instructor
const getAllCertificates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, courseId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.course = courseId;

    // If instructor, only show certificates for their courses
    if (req.user.role === 'instructor') {
      const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
      filter.course = { $in: instructorCourses.map(c => c._id) };
    }

    const certificates = await Certificate.find(filter)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title description')
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

// @desc    Revoke certificate (admin)
// @route   PUT /api/certificates/:id/revoke
// @access  Private/Admin
const revokeCertificate = async (req, res, next) => {
  try {
    const { revocationReason } = req.body;

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.status === 'revoked') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is already revoked'
      });
    }

    certificate.status = 'revoked';
    certificate.revocationReason = revocationReason;
    certificate.revokedBy = req.user.id;
    certificate.revokedAt = new Date();

    await certificate.save();

    await certificate.populate([
      { path: 'student', select: 'firstName lastName email' },
      { path: 'course', select: 'title description' },
      { path: 'revokedBy', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Certificate revoked successfully',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
  getAllCertificates,
  revokeCertificate
}; 
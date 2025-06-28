const express = require('express');
const router = express.Router();

// Import feature routes
const userRoutes = require('./user/user.routes');
const courseRoutes = require('./course/course.routes');
const applicationRoutes = require('./application/application.routes');
const examRoutes = require('./exam/exam.routes');
const certificateRoutes = require('./certificate/certificate.routes');
const contactRoutes = require('./contact/contact.routes');
const adminRoutes = require('./admin/admin.routes');

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cooking Certification API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    features: {
      auth: 'User authentication and management',
      courses: 'Course management and browsing',
      applications: 'Online course applications',
      exams: 'Offline and online exam management',
      certificates: 'Certificate generation and verification',
      contacts: 'Contact form and inquiry management',
      admin: 'Comprehensive admin management system'
    },
    adminFeatures: {
      userManagement: 'Complete user management system',
      certificateManagement: 'Certificate oversight and control',
      applicationManagement: 'Application review and processing',
      examResultManagement: 'Exam results and grading oversight',
      contactManagement: 'Contact inquiry and response system'
    }
  });
});

// Mount feature routes
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/applications', applicationRoutes);
router.use('/exams', examRoutes);
router.use('/certificates', certificateRoutes);
router.use('/contacts', contactRoutes);
router.use('/admin', adminRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/users',
      '/api/courses',
      '/api/applications',
      '/api/exams',
      '/api/certificates',
      '/api/contacts',
      '/api/admin'
    ]
  });
});

module.exports = router; 
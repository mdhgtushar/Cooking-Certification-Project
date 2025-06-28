require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');

// Import configurations and utilities
const appConfig = require('./config/app.config');
const corsConfig = require('./config/cors.config');
const connectDB = require('./utils/db');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const routes = require('./features/routes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(corsConfig);

// Rate limiting
const limiter = rateLimit({
  windowMs: appConfig.rateLimitWindow,
  max: appConfig.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Logging middleware
if (appConfig.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Cooking Certification API',
    version: '1.0.0',
    documentation: '/api/health',
    features: [
      'AUTH - User authentication and management',
      'Apply Online - Course application system',
      'Offline Exam - Exam scheduling and management',
      'View Certificate - Certificate generation and viewing',
      'Verify Online - Certificate verification system'
    ],
    adminFeatures: [
      'User Management - Complete user oversight',
      'Certificate Management - Certificate control and verification',
      'Application Management - Application review and processing',
      'Exam Result Management - Exam results and grading oversight',
      'Contact Management - Contact inquiry and response system'
    ]
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Start server
const PORT = appConfig.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${appConfig.nodeEnv} mode on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Main Features:`);
  console.log(`   - AUTH: User authentication and management`);
  console.log(`   - Apply Online: Course application system`);
  console.log(`   - Offline Exam: Exam scheduling and management`);
  console.log(`   - View Certificate: Certificate generation and viewing`);
  console.log(`   - Verify Online: Certificate verification system`);
  console.log(`👨‍💼 Admin Management Features:`);
  console.log(`   - User Management: Complete user oversight`);
  console.log(`   - Certificate Management: Certificate control and verification`);
  console.log(`   - Application Management: Application review and processing`);
  console.log(`   - Exam Result Management: Exam results and grading oversight`);
  console.log(`   - Contact Management: Contact inquiry and response system`);
});

module.exports = app; 
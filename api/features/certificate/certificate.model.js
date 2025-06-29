const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: [true, 'Certificate number is required'],
    unique: true,
    maxlength: [50, 'Certificate number cannot exceed 50 characters']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },
  score: {
    total: {
      type: Number,
      required: [true, 'Total score is required'],
      min: [0, 'Total score cannot be negative']
    },
    obtained: {
      type: Number,
      required: [true, 'Obtained score is required'],
      min: [0, 'Obtained score cannot be negative']
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    }
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    required: [true, 'Grade is required']
  },
  certificateType: {
    type: String,
    enum: ['completion', 'achievement', 'excellence'],
    default: 'completion'
  },
  certificateLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: [true, 'Certificate level is required']
  },
  certificateUrl: {
    type: String,
    required: [true, 'Certificate URL is required']
  },
  qrCode: {
    type: String,
    required: [true, 'QR code is required']
  },
  verificationCode: {
    type: String,
    required: [true, 'Verification code is required'],
    unique: true
  },
  issuedBy: {
    type: String,
    required: [true, 'Issuing organization is required'],
    maxlength: [200, 'Issuing organization cannot exceed 200 characters']
  },
  authorizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Authorized by is required']
  },
  revocationReason: {
    type: String,
    maxlength: [500, 'Revocation reason cannot exceed 500 characters']
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  revokedAt: {
    type: Date
  },
  metadata: {
    courseDuration: Number,
    examDuration: Number,
    totalQuestions: Number,
    passingScore: Number,
    certificateTemplate: String,
    generatedBy: String,
    version: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ issueDate: 1 });

// Generate certificate number
certificateSchema.statics.generateCertificateNumber = function() {
  const prefix = 'CC';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${year}${random}`;
};

// Generate verification code
certificateSchema.statics.generateVerificationCode = function() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Check if certificate is expired
certificateSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

// Update status based on expiry
certificateSchema.methods.updateStatus = function() {
  if (this.status === 'revoked') return;
  
  if (this.isExpired()) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
};

module.exports = mongoose.model('Certificate', certificateSchema); 
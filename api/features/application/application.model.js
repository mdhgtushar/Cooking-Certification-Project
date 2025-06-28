const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  applicationType: {
    type: String,
    enum: ['online', 'offline'],
    required: [true, 'Application type is required']
  },
  examType: {
    type: String,
    enum: ['online', 'offline'],
    required: [true, 'Exam type is required']
  },
  examDate: {
    type: Date
  },
  examLocation: {
    type: String,
    maxlength: [200, 'Exam location cannot exceed 200 characters']
  },
  examTime: {
    type: String,
    maxlength: [10, 'Exam time cannot exceed 10 characters']
  },
  personalInfo: {
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        maxlength: [200, 'Street address cannot exceed 200 characters']
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        maxlength: [100, 'City cannot exceed 100 characters']
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        maxlength: [100, 'State cannot exceed 100 characters']
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        maxlength: [20, 'Zip code cannot exceed 20 characters']
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        maxlength: [100, 'Country cannot exceed 100 characters']
      }
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
        maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
      },
      relationship: {
        type: String,
        required: [true, 'Emergency contact relationship is required'],
        maxlength: [50, 'Relationship cannot exceed 50 characters']
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
        maxlength: [20, 'Phone number cannot exceed 20 characters']
      }
    }
  },
  education: {
    highestEducation: {
      type: String,
      required: [true, 'Highest education is required'],
      maxlength: [100, 'Education cannot exceed 100 characters']
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      maxlength: [200, 'Institution name cannot exceed 200 characters']
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [1900, 'Graduation year must be after 1900'],
      max: [new Date().getFullYear(), 'Graduation year cannot be in the future']
    }
  },
  experience: {
    cookingExperience: {
      type: String,
      enum: ['none', 'beginner', 'intermediate', 'advanced'],
      default: 'none'
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: [0, 'Years of experience cannot be negative']
    },
    previousCertifications: [{
      name: String,
      issuingOrganization: String,
      yearObtained: Number,
      expiryDate: Date
    }]
  },
  documents: [{
    type: {
      type: String,
      enum: ['id_proof', 'education_certificate', 'photo', 'other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Document name cannot exceed 100 characters']
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Payment amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      maxlength: [100, 'Transaction ID cannot exceed 100 characters']
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other'],
      required: [true, 'Payment method is required']
    },
    paidAt: {
      type: Date
    }
  },
  notes: {
    applicant: {
      type: String,
      maxlength: [1000, 'Applicant notes cannot exceed 1000 characters']
    },
    admin: {
      type: String,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
    }
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
applicationSchema.index({ applicant: 1, course: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ examDate: 1 });
applicationSchema.index({ 'payment.status': 1 });

module.exports = mongoose.model('Application', applicationSchema); 
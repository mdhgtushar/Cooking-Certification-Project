const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['culinary-basics', 'pastry-arts', 'international-cuisine', 'advanced-techniques', 'nutrition']
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  duration: {
    type: Number,
    required: [true, 'Course duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  durationUnit: {
    type: String,
    required: [true, 'Duration unit is required'],
    enum: ['hours', 'days', 'weeks', 'months'],
    default: 'hours'
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP']
  },
  maxStudents: {
    type: Number,
    required: [true, 'Maximum students is required'],
    min: [1, 'Maximum students must be at least 1']
  },
  currentStudents: {
    type: Number,
    default: 0,
    min: [0, 'Current students cannot be negative']
  },
  status: {
    type: String,
    required: [true, 'Course status is required'],
    enum: ['draft', 'published', 'archived', 'cancelled'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  syllabus: [{
    week: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    topics: [{
      type: String,
      trim: true
    }]
  }],
  materials: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'other'],
      required: true
    },
    url: String,
    description: String
  }],
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    sessions: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      time: String,
      duration: Number
    }]
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'in-person', 'hybrid'],
      required: [true, 'Location type is required']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    onlinePlatform: String,
    meetingLink: String
  },
  exam: {
    hasExam: {
      type: Boolean,
      default: false
    },
    examType: {
      type: String,
      enum: ['online', 'offline', 'both']
    },
    passingScore: {
      type: Number,
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100']
    },
    examDuration: Number, // in minutes
    examDate: Date
  },
  certificate: {
    providesCertificate: {
      type: Boolean,
      default: true
    },
    certificateType: {
      type: String,
      enum: ['completion', 'achievement', 'excellence'],
      default: 'completion'
    },
    certificateLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  thumbnail: {
    type: String,
    required: [true, 'Course thumbnail is required']
  },
  enrollmentDeadline: {
    type: Date
  },
  earlyBirdDiscount: {
    percentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100']
    },
    validUntil: Date
  },
  refundPolicy: {
    type: String,
    trim: true
  },
  cancellationPolicy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for enrollment status
courseSchema.virtual('enrollmentStatus').get(function() {
  if (this.currentStudents >= this.maxStudents) {
    return 'full';
  }
  if (this.enrollmentDeadline && new Date() > this.enrollmentDeadline) {
    return 'closed';
  }
  if (this.status === 'published' && this.isActive) {
    return 'open';
  }
  return 'closed';
});

// Virtual for availability
courseSchema.virtual('isAvailable').get(function() {
  return this.status === 'published' && 
         this.isActive && 
         this.currentStudents < this.maxStudents &&
         (!this.enrollmentDeadline || new Date() <= this.enrollmentDeadline);
});

// Index for better query performance
courseSchema.index({ status: 1, isActive: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ 'schedule.startDate': 1 });
courseSchema.index({ isFeatured: 1, status: 1 });

// Pre-save middleware to update average rating
courseSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  next();
});

// Static method to get featured courses
courseSchema.statics.getFeaturedCourses = function() {
  return this.find({
    isFeatured: true,
    status: 'published',
    isActive: true
  }).populate('instructor', 'firstName lastName email');
};

// Static method to get courses by category
courseSchema.statics.getCoursesByCategory = function(category) {
  return this.find({
    category,
    status: 'published',
    isActive: true
  }).populate('instructor', 'firstName lastName email');
};

// Instance method to check if user can enroll
courseSchema.methods.canEnroll = function(userId) {
  return this.isAvailable && 
         this.currentStudents < this.maxStudents &&
         (!this.enrollmentDeadline || new Date() <= this.enrollmentDeadline);
};

// Instance method to enroll a student
courseSchema.methods.enrollStudent = function() {
  if (this.currentStudents < this.maxStudents) {
    this.currentStudents += 1;
    return this.save();
  }
  throw new Error('Course is full');
};

// Instance method to unenroll a student
courseSchema.methods.unenrollStudent = function() {
  if (this.currentStudents > 0) {
    this.currentStudents -= 1;
    return this.save();
  }
  throw new Error('No students to unenroll');
};

module.exports = mongoose.model('Course', courseSchema); 
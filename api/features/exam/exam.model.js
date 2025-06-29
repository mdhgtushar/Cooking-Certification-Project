const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  examType: {
    type: String,
    enum: ['online', 'offline'],
    required: [true, 'Exam type is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'failed'],
    default: 'scheduled'
  },
  examDate: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  examTime: {
    type: String,
    required: [true, 'Exam time is required'],
    maxlength: [10, 'Exam time cannot exceed 10 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Exam duration is required'],
    min: [15, 'Exam duration must be at least 15 minutes']
  },
  location: {
    type: String,
    maxlength: [200, 'Exam location cannot exceed 200 characters']
  },
  proctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  questions: [{
    question: {
      type: String,
      required: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
      required: true
    },
    options: [{
      type: String,
      maxlength: [200, 'Option cannot exceed 200 characters']
    }],
    correctAnswer: {
      type: String,
      required: function() { return this.type === 'multiple_choice' || this.type === 'true_false'; }
    },
    points: {
      type: Number,
      required: true,
      min: [1, 'Points must be at least 1']
    },
    order: {
      type: Number,
      required: true
    }
  }],
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  score: {
    total: {
      type: Number,
      min: [0, 'Total score cannot be negative']
    },
    obtained: {
      type: Number,
      min: [0, 'Obtained score cannot be negative']
    },
    percentage: {
      type: Number,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    }
  },
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: [0, 'Passing score cannot be negative'],
    max: [100, 'Passing score cannot exceed 100']
  },
  result: {
    type: String,
    enum: ['pass', 'fail', 'pending'],
    default: 'pending'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  actualDuration: {
    type: Number,
    min: [0, 'Actual duration cannot be negative']
  },
  notes: {
    student: {
      type: String,
      maxlength: [1000, 'Student notes cannot exceed 1000 characters']
    },
    proctor: {
      type: String,
      maxlength: [1000, 'Proctor notes cannot exceed 1000 characters']
    },
    admin: {
      type: String,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
    }
  },
  feedback: {
    student: {
      type: String,
      maxlength: [1000, 'Student feedback cannot exceed 1000 characters']
    },
    proctor: {
      type: String,
      maxlength: [1000, 'Proctor feedback cannot exceed 1000 characters']
    }
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  retakeAllowed: {
    type: Boolean,
    default: false
  },
  retakeCount: {
    type: Number,
    default: 0,
    min: [0, 'Retake count cannot be negative']
  },
  maxRetakes: {
    type: Number,
    default: 2,
    min: [0, 'Max retakes cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
examSchema.index({ student: 1, course: 1 });
examSchema.index({ status: 1 });
examSchema.index({ examDate: 1 });
examSchema.index({ proctor: 1 });
examSchema.index({ result: 1 });

// Pre-save validation for admin-created exams
examSchema.pre('save', function(next) {
  // If no application is provided (admin-created exam), ensure required fields are present
  if (!this.application) {
    if (!this.course || !this.student || !this.examDate || !this.examTime || !this.duration) {
      return next(new Error('Admin-created exams require course, student, exam date, time, and duration'));
    }
  }
  next();
});

// Calculate score and result
examSchema.methods.calculateScore = function() {
  if (!this.answers || this.answers.length === 0) {
    return;
  }

  let totalPoints = 0;
  let obtainedPoints = 0;

  this.questions.forEach(question => {
    totalPoints += question.points;
    
    const answer = this.answers.find(a => a.questionId.toString() === question._id.toString());
    if (answer) {
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        if (answer.answer === question.correctAnswer) {
          obtainedPoints += question.points;
        }
      }
      // For other question types, manual grading is required
    }
  });

  this.score = {
    total: totalPoints,
    obtained: obtainedPoints,
    percentage: totalPoints > 0 ? Math.round((obtainedPoints / totalPoints) * 100) : 0
  };

  this.result = this.score.percentage >= this.passingScore ? 'pass' : 'fail';
};

module.exports = mongoose.model('Exam', examSchema); 
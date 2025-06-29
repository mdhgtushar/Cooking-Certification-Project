const mongoose = require('mongoose');
const User = require('./features/user/user.model');
const Course = require('./features/course/course.model');
const Certificate = require('./features/certificate/certificate.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cooking-certification', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testCertificateCreation() {
  try {
    console.log('Testing certificate creation...');
    
    // Find a user and course
    const user = await User.findOne({ role: 'student' });
    const course = await Course.findOne();
    
    if (!user) {
      console.log('No student found, creating a test user...');
      const testUser = await User.create({
        firstName: 'Test',
        lastName: 'Student',
        email: 'teststudent@example.com',
        password: 'password123',
        role: 'student',
        isActive: true
      });
      console.log('Test user created:', testUser._id);
    }
    
    if (!course) {
      console.log('No course found, creating a test course...');
      const testCourse = await Course.create({
        title: 'Test Cooking Course',
        description: 'A test course for certificate creation',
        duration: 30,
        level: 'beginner',
        status: 'published',
        isActive: true
      });
      console.log('Test course created:', testCourse._id);
    }
    
    const student = user || await User.findOne({ role: 'student' });
    const testCourse = course || await Course.findOne();
    
    console.log('Student ID:', student._id);
    console.log('Course ID:', testCourse._id);
    
    // Test certificate creation
    const certificateData = {
      studentId: student._id,
      courseId: testCourse._id,
      issueDate: new Date(),
      grade: 'A',
      certificateType: 'completion',
      certificateLevel: 'beginner'
    };
    
    console.log('Certificate data:', certificateData);
    
    // Create certificate using the model directly
    const certificate = await Certificate.create({
      certificateNumber: Certificate.generateCertificateNumber(),
      student: student._id,
      course: testCourse._id,
      exam: null,
      instructor: student._id, // Using student as instructor for test
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
      status: 'active',
      score: {
        total: 100,
        obtained: 100,
        percentage: 100
      },
      grade: 'A',
      certificateType: 'completion',
      certificateLevel: 'beginner',
      certificateUrl: `http://localhost:5000/certificates/${Certificate.generateCertificateNumber()}`,
      qrCode: `http://localhost:5000/verify/${Certificate.generateVerificationCode()}`,
      verificationCode: Certificate.generateVerificationCode(),
      issuedBy: 'Cooking Certification Institute',
      authorizedBy: student._id,
      metadata: {
        courseDuration: testCourse.duration || 0,
        examDuration: 0,
        totalQuestions: 0,
        passingScore: 70,
        certificateTemplate: 'default',
        generatedBy: 'test',
        version: '1.0'
      },
      createdBy: student._id
    });
    
    console.log('Certificate created successfully!');
    console.log('Certificate ID:', certificate._id);
    console.log('Certificate Number:', certificate.certificateNumber);
    
    // Populate and display
    await certificate.populate([
      { path: 'student', select: 'firstName lastName email' },
      { path: 'course', select: 'title description' }
    ]);
    
    console.log('Certificate details:', {
      certificateNumber: certificate.certificateNumber,
      student: certificate.student,
      course: certificate.course,
      issueDate: certificate.issueDate,
      status: certificate.status
    });
    
  } catch (error) {
    console.error('Error creating certificate:', error);
  } finally {
    mongoose.connection.close();
  }
}

testCertificateCreation(); 
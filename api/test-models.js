const mongoose = require('mongoose');

// Import models
const User = require('./features/user/user.model');
const Course = require('./features/course/course.model');
const Application = require('./features/application/application.model');
const Exam = require('./features/exam/exam.model');
const Certificate = require('./features/certificate/certificate.model');
const Contact = require('./features/contact/contact.model');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cooking-certification';

async function testModels() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test each model
    console.log('\n🔍 Testing Models:');
    
    console.log('User model:', typeof User);
    console.log('User.aggregate:', typeof User.aggregate);
    
    console.log('Course model:', typeof Course);
    console.log('Course.aggregate:', typeof Course.aggregate);
    
    console.log('Application model:', typeof Application);
    console.log('Application.aggregate:', typeof Application.aggregate);
    
    console.log('Exam model:', typeof Exam);
    console.log('Exam.aggregate:', typeof Exam.aggregate);
    
    console.log('Certificate model:', typeof Certificate);
    console.log('Certificate.aggregate:', typeof Certificate.aggregate);
    
    console.log('Contact model:', typeof Contact);
    console.log('Contact.aggregate:', typeof Contact.aggregate);

    // Test a simple aggregation
    console.log('\n🧪 Testing Aggregation:');
    
    try {
      const userStats = await User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ]);
      console.log('✅ User aggregation works:', userStats);
    } catch (error) {
      console.log('❌ User aggregation failed:', error.message);
    }

    try {
      const courseStats = await Course.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ]);
      console.log('✅ Course aggregation works:', courseStats);
    } catch (error) {
      console.log('❌ Course aggregation failed:', error.message);
    }

    try {
      const applicationStats = await Application.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ]);
      console.log('✅ Application aggregation works:', applicationStats);
    } catch (error) {
      console.log('❌ Application aggregation failed:', error.message);
    }

    try {
      const examStats = await Exam.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ]);
      console.log('✅ Exam aggregation works:', examStats);
    } catch (error) {
      console.log('❌ Exam aggregation failed:', error.message);
    }

    try {
      const certificateStats = await Certificate.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ]);
      console.log('✅ Certificate aggregation works:', certificateStats);
    } catch (error) {
      console.log('❌ Certificate aggregation failed:', error.message);
    }

    try {
      const contactStats = await Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ]);
      console.log('✅ Contact aggregation works:', contactStats);
    } catch (error) {
      console.log('❌ Contact aggregation failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testModels(); 
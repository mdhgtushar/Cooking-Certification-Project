import React from 'react';
import { Link } from 'react-router-dom';

const HowToApply = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How to Apply</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Follow these simple steps to start your culinary certification journey. 
            Our application process is designed to be straightforward and user-friendly.
          </p>
        </div>
      </section>

      {/* Application Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete these steps to enroll in our certification program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="card text-center h-full">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Browse Courses</h3>
                <p className="text-gray-600 mb-6">
                  Explore our comprehensive course catalog and find the perfect program 
                  that matches your skill level and career goals.
                </p>
                <Link
                  to="/courses"
                  className="btn btn-primary"
                >
                  View Courses
                </Link>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card text-center h-full">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Account</h3>
                <p className="text-gray-600 mb-6">
                  Sign up for a free account to access our application portal 
                  and track your progress throughout the process.
                </p>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Register Now
                </Link>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="card text-center h-full">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Submit Application</h3>
                <p className="text-gray-600 mb-6">
                  Fill out the application form with your personal information, 
                  educational background, and course preferences.
                </p>
                <Link
                  to="/apply"
                  className="btn btn-primary"
                >
                  Apply Online
                </Link>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="card text-center h-full">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Approved</h3>
                <p className="text-gray-600 mb-6">
                  Our team will review your application and contact you within 
                  2-3 business days with approval and next steps.
                </p>
                <Link
                  to="/contact"
                  className="btn btn-primary"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Application Requirements</h2>
              <p className="text-lg text-gray-600 mb-8">
                To ensure a smooth application process, please have the following documents ready:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Valid Government ID</h3>
                    <p className="text-gray-600">Driver's license, passport, or national ID card</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Educational Records</h3>
                    <p className="text-gray-600">High school diploma or equivalent (if applicable)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional Photo</h3>
                    <p className="text-gray-600">Recent passport-style photograph</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Application Fee</h3>
                    <p className="text-gray-600">Non-refundable application processing fee</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Important Notes</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-warning-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Application Deadline</h4>
                    <p className="text-gray-600">Submit your application at least 2 weeks before the course start date</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-info-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Processing Time</h4>
                    <p className="text-gray-600">Applications are typically processed within 2-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">No Experience Required</h4>
                    <p className="text-gray-600">Our beginner courses are designed for students with no prior experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our application process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does the application process take?
              </h3>
              <p className="text-gray-600">
                The complete application process typically takes 2-3 business days. 
                You'll receive an email confirmation once your application is approved.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if I don't have prior cooking experience?
              </h3>
              <p className="text-gray-600">
                No problem! We offer courses for all skill levels, including complete beginners. 
                Our instructors will guide you through every step of the learning process.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I apply for multiple courses at once?
              </h3>
              <p className="text-gray-600">
                Yes, you can apply for multiple courses. However, we recommend starting 
                with one course to ensure you can fully commit to the program.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there an application fee?
              </h3>
              <p className="text-gray-600">
                Yes, there is a non-refundable application processing fee. 
                This fee covers administrative costs and is separate from course tuition.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens after my application is approved?
              </h3>
              <p className="text-gray-600">
                You'll receive a welcome email with course details, schedule, 
                and instructions for payment and enrollment confirmation.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I defer my application to a later date?
              </h3>
              <p className="text-gray-600">
                Yes, you can defer your application for up to 6 months. 
                Contact our admissions team to arrange the deferral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Don't wait any longer. Apply now and take the first step towards your culinary career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Apply Now
            </Link>
            <Link
              to="/contact"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              Get Help
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToApply; 
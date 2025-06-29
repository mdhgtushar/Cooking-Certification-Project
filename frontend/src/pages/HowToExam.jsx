const HowToExam = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How to Take Your Exam</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Prepare for success with our comprehensive exam guidelines. 
            Learn everything you need to know about taking your culinary certification exam.
          </p>
        </div>
      </section>

      {/* Exam Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Exam Overview</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our certification exams are designed to assess your practical skills, 
                theoretical knowledge, and understanding of culinary principles. 
                Each exam consists of multiple components to ensure comprehensive evaluation.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                The exam format varies by course level, but typically includes 
                written assessments, practical demonstrations, and oral presentations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Comprehensive evaluation of skills</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Multiple assessment formats</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Industry-standard evaluation</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Exam Components</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Written Assessment</h4>
                    <p className="text-gray-600">Multiple choice and essay questions covering theoretical knowledge</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Practical Demonstration</h4>
                    <p className="text-gray-600">Hands-on cooking tasks to demonstrate technical skills</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Oral Presentation</h4>
                    <p className="text-gray-600">Discussion of techniques, ingredients, and culinary concepts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Prepare</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these steps to ensure you're fully prepared for your certification exam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Study Materials</h3>
              <p className="text-gray-600 mb-4">
                Review all course materials, textbooks, and practice exercises provided during your training.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Course notes and handouts</li>
                <li>• Recommended textbooks</li>
                <li>• Online resources</li>
                <li>• Practice quizzes</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Practice Skills</h3>
              <p className="text-gray-600 mb-4">
                Dedicate time to practicing the practical skills you've learned in your course.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Knife skills and techniques</li>
                <li>• Cooking methods</li>
                <li>• Recipe preparation</li>
                <li>• Time management</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 6h8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Equipment Check</h3>
              <p className="text-gray-600 mb-4">
                Ensure you have all required equipment and tools for the practical exam.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Chef's knife and tools</li>
                <li>• Measuring equipment</li>
                <li>• Safety gear</li>
                <li>• Required ingredients</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Management</h3>
              <p className="text-gray-600 mb-4">
                Practice working within time constraints and develop efficient workflows.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Plan your approach</li>
                <li>• Set time limits</li>
                <li>• Prioritize tasks</li>
                <li>• Stay organized</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mock Exams</h3>
              <p className="text-gray-600 mb-4">
                Take practice exams to familiarize yourself with the format and timing.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sample questions</li>
                <li>• Timed practice</li>
                <li>• Performance review</li>
                <li>• Identify weak areas</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Rest & Relaxation</h3>
              <p className="text-gray-600 mb-4">
                Ensure you're well-rested and mentally prepared for the exam day.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get adequate sleep</li>
                <li>• Eat well</li>
                <li>• Stay hydrated</li>
                <li>• Manage stress</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Day Guidelines */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exam Day Guidelines</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Important information to ensure a smooth exam experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Before the Exam</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Arrive Early</h4>
                    <p className="text-gray-600">Arrive at least 30 minutes before your scheduled exam time</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bring Required Items</h4>
                    <p className="text-gray-600">Government ID, confirmation email, and required equipment</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dress Appropriately</h4>
                    <p className="text-gray-600">Wear comfortable, professional attire suitable for kitchen work</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Instructions</h4>
                    <p className="text-gray-600">Carefully read all exam instructions and requirements</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">During the Exam</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Follow Instructions</h4>
                    <p className="text-gray-600">Listen carefully to examiner instructions and ask questions if needed</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manage Time</h4>
                    <p className="text-gray-600">Keep track of time and pace yourself throughout the exam</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stay Calm</h4>
                    <p className="text-gray-600">Maintain composure and focus on demonstrating your skills</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Safety First</h4>
                    <p className="text-gray-600">Always prioritize safety and follow proper kitchen protocols</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Certification */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Results & Certification</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What happens after you complete your exam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Exam Completion</h3>
              <p className="text-gray-600">
                After completing all exam components, your work will be evaluated by our expert panel.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Results Processing</h3>
              <p className="text-gray-600">
                Results are typically available within 5-7 business days after exam completion.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Certificate Issuance</h3>
              <p className="text-gray-600">
                Upon successful completion, you'll receive your official certification and digital badge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Your Exam?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Contact us to schedule your certification exam or get more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Schedule Exam
            </Link>
            <Link
              to="/courses"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCourseById, clearError } from '../../store/courseSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, loading, error } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(getCourseById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleEnroll = () => {
    if (!user) {
      toast.info('Please log in to enroll in this course');
      navigate('/login');
      return;
    }
    
    // TODO: Implement enrollment logic
    toast.success('Enrollment feature coming soon!');
  };

  const getLevelBadge = (level) => {
    const levelClasses = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
      expert: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${levelClasses[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryClasses = {
      'culinary-basics': 'bg-blue-100 text-blue-800',
      'pastry-arts': 'bg-pink-100 text-pink-800',
      'international-cuisine': 'bg-purple-100 text-purple-800',
      'advanced-techniques': 'bg-indigo-100 text-indigo-800',
      'nutrition': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryClasses[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDuration = (duration, unit) => {
    return `${duration} ${unit}${duration > 1 ? 's' : ''}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Image */}
            <div className="lg:col-span-2">
              <img
                src={currentCourse.thumbnail || '/images/course-placeholder.jpg'}
                alt={currentCourse.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
            </div>

            {/* Course Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                <div className="flex items-center space-x-2 mb-4">
                  {getLevelBadge(currentCourse.level)}
                  {getCategoryBadge(currentCourse.category)}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentCourse.title}
                </h1>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-700">
                      {currentCourse.instructor?.firstName?.charAt(0)}{currentCourse.instructor?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {currentCourse.instructor?.firstName} {currentCourse.instructor?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Instructor</p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {formatPrice(currentCourse.price, currentCourse.currency)}
                    </p>
                    <p className="text-sm text-gray-500">Course Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDuration(currentCourse.duration, currentCourse.durationUnit)}
                    </p>
                    <p className="text-sm text-gray-500">Duration</p>
                  </div>
                </div>

                {/* Rating */}
                {currentCourse.rating && (
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= currentCourse.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {currentCourse.rating} ({currentCourse.ratingCount || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Enroll Button */}
                <button
                  onClick={handleEnroll}
                  className="w-full btn btn-primary btn-lg mb-4"
                >
                  Enroll Now
                </button>

                {/* Course Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Students:</span>
                    <span className="font-medium">{currentCourse.maxStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{currentCourse.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(currentCourse.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'syllabus', 'requirements', 'outcomes', 'exam'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {currentCourse.description}
              </p>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Syllabus</h2>
              {currentCourse.syllabus ? (
                <div className="space-y-4">
                  {currentCourse.syllabus.map((item, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      {item.duration && (
                        <p className="text-sm text-gray-500 mt-1">Duration: {item.duration}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Syllabus details coming soon.</p>
              )}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Requirements</h2>
              {currentCourse.requirements ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentCourse.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No specific requirements for this course.</p>
              )}
            </div>
          )}

          {activeTab === 'outcomes' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Outcomes</h2>
              {currentCourse.learningOutcomes ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentCourse.learningOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Learning outcomes coming soon.</p>
              )}
            </div>
          )}

          {activeTab === 'exam' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Details</h2>
              {currentCourse.examDetails ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Exam Format</h3>
                    <p className="text-gray-600 mt-1">{currentCourse.examDetails.format}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Duration</h3>
                    <p className="text-gray-600 mt-1">{currentCourse.examDetails.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Passing Score</h3>
                    <p className="text-gray-600 mt-1">{currentCourse.examDetails.passingScore}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Exam details coming soon.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 
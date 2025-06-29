import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCourses, clearError } from '../../store/courseSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error, pagination } = useSelector((state) => state.courses);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadCourses();
  }, [pagination.page, selectedLevel, selectedCategory]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadCourses = () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm,
      level: selectedLevel,
      category: selectedCategory
    };
    dispatch(getAllCourses(params));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllCourses({
      page: 1,
      limit: pagination.limit,
      search: searchTerm,
      level: selectedLevel,
      category: selectedCategory
    }));
  };

  const handlePageChange = (newPage) => {
    dispatch(getAllCourses({
      page: newPage,
      limit: pagination.limit,
      search: searchTerm,
      level: selectedLevel,
      category: selectedCategory
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('');
    setSelectedCategory('');
    dispatch(getAllCourses({ page: 1, limit: pagination.limit }));
  };

  const getLevelBadge = (level) => {
    const levelClasses = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
      expert: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelClasses[level] || 'bg-gray-100 text-gray-800'}`}>
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryClasses[category] || 'bg-gray-100 text-gray-800'}`}>
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

  if (loading && courses.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover comprehensive cooking certification courses designed to enhance your culinary skills and advance your career.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="culinary-basics">Culinary Basics</option>
                <option value="pastry-arts">Pastry Arts</option>
                <option value="international-cuisine">International Cuisine</option>
                <option value="advanced-techniques">Advanced Techniques</option>
                <option value="nutrition">Nutrition</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedLevel || selectedCategory) && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {courses.length} of {pagination.total} courses
          </p>
          {loading && <LoadingSpinner />}
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Course Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={course.thumbnail || '/images/course-placeholder.jpg'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center space-x-2 mb-3">
                    {getLevelBadge(course.level)}
                    {getCategoryBadge(course.category)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link to={`/courses/${course._id}`} className="hover:text-primary-600">
                      {course.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-gray-700">
                        {course.instructor?.firstName?.charAt(0)}{course.instructor?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatDuration(course.duration, course.durationUnit)}</span>
                      <span>{course.maxStudents} students max</span>
                    </div>
                    <div className="text-lg font-bold text-primary-600">
                      {formatPrice(course.price, course.currency)}
                    </div>
                  </div>

                  {/* Rating */}
                  {course.rating && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= course.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {course.rating} ({course.ratingCount || 0})
                      </span>
                    </div>
                  )}

                  {/* View Details Button */}
                  <Link
                    to={`/courses/${course._id}`}
                    className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList; 
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  clearError 
} from '../../store/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const CourseManagement = () => {
  const dispatch = useDispatch();
  const { 
    courses, 
    coursesLoading, 
    coursesError, 
    coursesPagination 
  } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'culinary-basics',
    level: 'beginner',
    duration: '',
    durationUnit: 'weeks',
    price: '',
    currency: 'USD',
    maxStudents: '',
    thumbnail: '',
    location: {
      type: 'online'
    },
    schedule: {
      startDate: '',
      endDate: ''
    },
    syllabus: [],
    requirements: [],
    learningOutcomes: [],
    examDetails: {
      format: '',
      duration: '',
      passingScore: ''
    }
  });

  useEffect(() => {
    loadCourses();
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  useEffect(() => {
    if (coursesError) {
      toast.error(coursesError);
      dispatch(clearError('courses'));
    }
  }, [coursesError, dispatch]);

  const loadCourses = async () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(!statusFilter && { status: 'all' })
    };
    
    dispatch(fetchCourses(params));
  };

  const handleCourseAction = async (courseId, action, courseData = {}) => {
    try {
      switch (action) {
        case 'activate':
          await dispatch(updateCourse({ courseId, courseData: { status: 'published' } })).unwrap();
          toast.success('Course activated successfully');
          break;
        case 'deactivate':
          await dispatch(updateCourse({ courseId, courseData: { status: 'draft' } })).unwrap();
          toast.success('Course deactivated successfully');
          break;
        case 'delete':
          await dispatch(deleteCourse(courseId)).unwrap();
          toast.success('Course deleted successfully');
          break;
        case 'edit':
          setEditingCourse(courseData);
          setFormData({
            title: courseData.title || '',
            description: courseData.description || '',
            shortDescription: courseData.shortDescription || '',
            category: courseData.category || 'culinary-basics',
            level: courseData.level || 'beginner',
            duration: courseData.duration?.toString() || '',
            durationUnit: courseData.durationUnit || 'weeks',
            price: courseData.price?.toString() || '',
            currency: courseData.currency || 'USD',
            maxStudents: courseData.maxStudents?.toString() || '',
            thumbnail: courseData.thumbnail || '',
            location: courseData.location || { type: 'online' },
            schedule: courseData.schedule || { startDate: '', endDate: '' },
            syllabus: courseData.syllabus || [],
            requirements: courseData.requirements || [],
            learningOutcomes: courseData.learningOutcomes || [],
            examDetails: courseData.examDetails || {
              format: '',
              duration: '',
              passingScore: ''
            }
          });
          setShowEditModal(true);
          break;
        default:
          break;
      }
      loadCourses(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents),
        schedule: {
          startDate: new Date(formData.schedule.startDate).toISOString(),
          endDate: new Date(formData.schedule.endDate).toISOString()
        }
      };

      if (showEditModal && editingCourse) {
        await dispatch(updateCourse({ courseId: editingCourse._id, courseData: submitData })).unwrap();
        toast.success('Course updated successfully');
        setShowEditModal(false);
        setEditingCourse(null);
      } else {
        await dispatch(createCourse(submitData)).unwrap();
        toast.success('Course created successfully');
        setShowCreateModal(false);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        category: 'culinary-basics',
        level: 'beginner',
        duration: '',
        durationUnit: 'weeks',
        price: '',
        currency: 'USD',
        maxStudents: '',
        thumbnail: '',
        location: {
          type: 'online'
        },
        schedule: {
          startDate: '',
          endDate: ''
        },
        syllabus: [],
        requirements: [],
        learningOutcomes: [],
        examDetails: {
          format: '',
          duration: '',
          passingScore: ''
        }
      });
      
      loadCourses(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to save course');
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'culinary-basics',
      level: 'beginner',
      duration: '',
      durationUnit: 'weeks',
      price: '',
      currency: 'USD',
      maxStudents: '',
      thumbnail: '',
      location: {
        type: 'online'
      },
      schedule: {
        startDate: '',
        endDate: ''
      },
      syllabus: [],
      requirements: [],
      learningOutcomes: [],
      examDetails: {
        format: '',
        duration: '',
        passingScore: ''
      }
    });
    setShowCreateModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: 'bg-success-100 text-success-800',
      draft: 'bg-warning-100 text-warning-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getLevelBadge = (level) => {
    const levelClasses = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelClasses[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (coursesLoading && courses.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Manage all courses in the system</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => loadCourses()}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button 
            onClick={openCreateModal}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input w-full"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Page Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="form-input w-full"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={course.thumbnail || '/images/course-placeholder.jpg'}
                          alt={course.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.instructor?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLevelBadge(course.level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(course.price, course.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(course.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCourseAction(course._id, 'edit', course)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      {course.status === 'published' ? (
                        <button
                          onClick={() => handleCourseAction(course._id, 'deactivate')}
                          className="text-warning-600 hover:text-warning-900"
                        >
                          Draft
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCourseAction(course._id, 'activate')}
                          className="text-success-600 hover:text-success-900"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleCourseAction(course._id, 'delete')}
                        className="text-danger-600 hover:text-danger-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {coursesPagination && coursesPagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === coursesPagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, coursesPagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{coursesPagination.total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: coursesPagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === coursesPagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Course Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showEditModal ? 'Edit Course' : 'Create New Course'}
              </h3>
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingCourse(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Course Form Component
const CourseForm = ({ formData, setFormData, onSubmit, onCancel }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="form-input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="form-input w-full"
          >
            <option value="culinary-basics">Culinary Basics</option>
            <option value="pastry-arts">Pastry Arts</option>
            <option value="international-cuisine">International Cuisine</option>
            <option value="advanced-techniques">Advanced Techniques</option>
            <option value="nutrition">Nutrition</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="form-input w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Short Description</label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          rows={2}
          className="form-input w-full"
          placeholder="Brief description (max 200 characters)"
          maxLength={200}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
        <input
          type="url"
          value={formData.thumbnail}
          onChange={(e) => handleInputChange('thumbnail', e.target.value)}
          className="form-input w-full"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location Type</label>
        <select
          value={formData.location.type}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            location: { ...prev.location, type: e.target.value }
          }))}
          className="form-input w-full"
          required
        >
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={formData.schedule.startDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              schedule: { ...prev.schedule, startDate: e.target.value }
            }))}
            className="form-input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={formData.schedule.endDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              schedule: { ...prev.schedule, endDate: e.target.value }
            }))}
            className="form-input w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <select
            value={formData.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            className="form-input w-full"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="form-input w-full"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration Unit</label>
          <select
            value={formData.durationUnit}
            onChange={(e) => handleInputChange('durationUnit', e.target.value)}
            className="form-input w-full"
          >
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="form-input w-full"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="form-input w-full"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Students</label>
          <input
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleInputChange('maxStudents', e.target.value)}
            className="form-input w-full"
            min="1"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {formData._id ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseManagement; 
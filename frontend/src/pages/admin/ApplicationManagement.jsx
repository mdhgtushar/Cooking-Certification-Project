import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchApplications, 
  approveApplication, 
  rejectApplication, 
  updateApplication, 
  createApplication,
  fetchUsers,
  fetchCourses
} from '../../store/adminSlice';

const ApplicationManagement = () => {
  const dispatch = useDispatch();
  const { 
    applications = [], 
    users = [], 
    courses = [], 
    applicationsLoading = false,
    usersLoading = false,
    coursesLoading = false
  } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    applicantId: '',
    courseId: '',
    applicationType: 'offline',
    examType: 'offline',
    examDate: '',
    examLocation: '',
    examTime: '09:00',
    personalInfo: {
      dateOfBirth: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    education: {
      highestEducation: '',
      institution: '',
      graduationYear: new Date().getFullYear()
    },
    experience: {
      cookingExperience: 'none',
      yearsOfExperience: 0
    },
    payment: {
      amount: 0,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'other'
    }
  });

  // Ensure arrays are actually arrays and contain valid objects
  const safeApplications = Array.isArray(applications) ? applications.filter(app => app && typeof app === 'object') : [];
  const safeUsers = Array.isArray(users) ? users.filter(user => user && typeof user === 'object') : [];
  const safeCourses = Array.isArray(courses) ? courses.filter(course => course && typeof course === 'object') : [];

  // Additional safety check to ensure no objects are rendered directly
  const safeString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return '';
  };

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchUsers());
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredApplications = (safeApplications || []).filter(app => {
    const applicantName = safeString(app.applicant?.firstName || '') + ' ' + safeString(app.applicant?.lastName || '');
    const applicationNumber = safeString(app.applicationNumber || '');
    const courseTitle = safeString(app.course?.title || app.courseName || '');
    
    const matchesSearch = applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || (app.course?._id?.toString() || '') === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleApplicationAction = (appId, action) => {
    switch (action) {
      case 'approve':
        dispatch(updateApplication({ 
          applicationId: appId, 
          applicationData: { status: 'approved', reviewDate: new Date().toISOString().split('T')[0] }
        }));
        toast.success('Application approved successfully');
        break;
      case 'reject':
        dispatch(updateApplication({ 
          applicationId: appId, 
          applicationData: { status: 'rejected', reviewDate: new Date().toISOString().split('T')[0] }
        }));
        toast.success('Application rejected successfully');
        break;
      case 'hold':
        dispatch(updateApplication({ 
          applicationId: appId, 
          applicationData: { status: 'on-hold', reviewDate: new Date().toISOString().split('T')[0] }
        }));
        toast.success('Application put on hold');
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedApplications.length === 0) {
      toast.warning('Please select applications first');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    switch (action) {
      case 'approve':
        selectedApplications.forEach(appId => {
          dispatch(updateApplication({ 
            applicationId: appId, 
            applicationData: { status: 'approved', reviewDate: currentDate }
          }));
        });
        setSelectedApplications([]);
        toast.success(`${selectedApplications.length} applications approved successfully`);
        break;
      case 'reject':
        selectedApplications.forEach(appId => {
          dispatch(updateApplication({ 
            applicationId: appId, 
            applicationData: { status: 'rejected', reviewDate: currentDate }
          }));
        });
        setSelectedApplications([]);
        toast.success(`${selectedApplications.length} applications rejected successfully`);
        break;
      default:
        break;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning-100 text-warning-800',
      approved: 'bg-success-100 text-success-800',
      rejected: 'bg-danger-100 text-danger-800',
      'on-hold': 'bg-info-100 text-info-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getCourses = () => {
    const courses = [...new Set((safeApplications || []).map(app => ({ 
      id: app.course?._id || app.courseId, 
      name: safeString(app.course?.title || app.courseName) 
    })))];
    return courses.filter((course, index, self) => 
      index === self.findIndex(c => c.id === course.id)
    );
  };

  const handleCreateApplication = () => {
    // Add validation
    if (!createForm.applicantId || !createForm.courseId) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create application data
    const applicationData = {
      ...createForm,
      status: 'pending',
      applicationNumber: `APP-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };

    // Dispatch create action
    dispatch(createApplication(applicationData))
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          setShowCreateModal(false);
          setCreateForm({
            applicantId: '',
            courseId: '',
            applicationType: 'offline',
            examType: 'offline',
            examDate: '',
            examLocation: '',
            examTime: '09:00',
            personalInfo: {
              dateOfBirth: '',
              phone: '',
              address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
              },
              emergencyContact: {
                name: '',
                relationship: '',
                phone: ''
              }
            },
            education: {
              highestEducation: '',
              institution: '',
              graduationYear: new Date().getFullYear()
            },
            experience: {
              cookingExperience: 'none',
              yearsOfExperience: 0
            },
            payment: {
              amount: 0,
              currency: 'USD',
              status: 'completed',
              paymentMethod: 'other'
            }
          });
          toast.success('Application created successfully');
        } else {
          toast.error('Failed to create application');
        }
      })
      .catch((error) => {
        toast.error('Failed to create application');
      });
  };

  if (applicationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
          <p className="text-gray-600">Review and manage course applications</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Application
          </button>
          <button className="btn btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Applications
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {(applications || []).filter(app => app.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {(applications || []).filter(app => app.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <svg className="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {(applications || []).filter(app => app.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <svg className="w-6 h-6 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Hold</p>
              <p className="text-2xl font-bold text-gray-900">
                {(applications || []).filter(app => app.status === 'on-hold').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="form-label">Course</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Courses</option>
              {getCourses().map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCourseFilter('all');
              }}
              className="btn btn-outline w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedApplications.length} application(s) selected
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn btn-success text-sm"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="btn btn-danger text-sm"
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApplications(filteredApplications.map(app => app._id || app.id));
                      } else {
                        setSelectedApplications([]);
                      }
                    }}
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app._id || app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app._id || app.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApplications([...selectedApplications, app._id || app.id]);
                        } else {
                          setSelectedApplications(selectedApplications.filter(id => id !== (app._id || app.id)));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {safeString(app.applicationNumber)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {safeString(app.applicant?.firstName || '')} {safeString(app.applicant?.lastName || '')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {safeString(app.applicant?.email || 'No email')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {safeString(app.course?.title || app.courseName || 'Unknown Course')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      try {
                        const date = new Date(app.createdAt || app.submittedDate);
                        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                      } catch (error) {
                        return 'Invalid date';
                      }
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={safeString(app.notes?.admin || app.notes)}>
                      {safeString(app.notes?.admin || app.notes || 'No notes')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => window.open(`/applications/${app._id || app.id}`, '_blank')}
                        className="text-primary-600 hover:text-primary-900 text-sm"
                      >
                        View
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApplicationAction(app._id || app.id, 'approve')}
                            className="text-success-600 hover:text-success-900 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApplicationAction(app._id || app.id, 'reject')}
                            className="text-danger-600 hover:text-danger-900 text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApplicationAction(app._id || app.id, 'hold')}
                            className="text-info-600 hover:text-info-900 text-sm"
                          >
                            Hold
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Create Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Application</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateApplication();
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student *
                  </label>
                  <select
                    value={createForm.applicantId}
                    onChange={(e) => setCreateForm({...createForm, applicantId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a student</option>
                    {Array.isArray(users) && users.map(user => {
                      if (!user || typeof user !== 'object') return null;
                      return (
                        <option key={user._id || user.id || Math.random()} value={user._id || user.id}>
                          {safeString(user.firstName || user.name || 'Unknown')} {safeString(user.lastName || '')} ({safeString(user.email || 'No email')})
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course *
                  </label>
                  <select
                    value={createForm.courseId}
                    onChange={(e) => setCreateForm({...createForm, courseId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {Array.isArray(courses) && courses.map(course => {
                      if (!course || typeof course !== 'object') return null;
                      return (
                        <option key={course._id || course.id || Math.random()} value={course._id || course.id}>
                          {safeString(course.title || course.name || 'Unknown Course')}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Type *
                  </label>
                  <select
                    value={createForm.applicationType}
                    onChange={(e) => setCreateForm({...createForm, applicationType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Type *
                  </label>
                  <select
                    value={createForm.examType}
                    onChange={(e) => setCreateForm({...createForm, examType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    value={createForm.examDate}
                    onChange={(e) => setCreateForm({...createForm, examDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Location *
                  </label>
                  <input
                    type="text"
                    value={createForm.examLocation}
                    onChange={(e) => setCreateForm({...createForm, examLocation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter exam location"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Time *
                  </label>
                  <input
                    type="time"
                    value={createForm.examTime}
                    onChange={(e) => setCreateForm({...createForm, examTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Information
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={createForm.personalInfo.dateOfBirth}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, dateOfBirth: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.phone}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, phone: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.address.street}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, address: {...createForm.personalInfo.address, street: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter street"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.address.city}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, address: {...createForm.personalInfo.address, city: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.address.state}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, address: {...createForm.personalInfo.address, state: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.address.zipCode}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, address: {...createForm.personalInfo.address, zipCode: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter zip code"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.address.country}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, address: {...createForm.personalInfo.address, country: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter country"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.emergencyContact.name}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, emergencyContact: {...createForm.personalInfo.emergencyContact, name: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.emergencyContact.relationship}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, emergencyContact: {...createForm.personalInfo.emergencyContact, relationship: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter relationship"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    value={createForm.personalInfo.emergencyContact.phone}
                    onChange={(e) => setCreateForm({...createForm, personalInfo: {...createForm.personalInfo, emergencyContact: {...createForm.personalInfo.emergencyContact, phone: e.target.value}}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact phone"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highest Education *
                  </label>
                  <input
                    type="text"
                    value={createForm.education.highestEducation}
                    onChange={(e) => setCreateForm({...createForm, education: {...createForm.education, highestEducation: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter highest education"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={createForm.education.institution}
                    onChange={(e) => setCreateForm({...createForm, education: {...createForm.education, institution: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter institution"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year *
                  </label>
                  <input
                    type="text"
                    value={createForm.education.graduationYear}
                    onChange={(e) => setCreateForm({...createForm, education: {...createForm.education, graduationYear: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter graduation year"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cooking Experience *
                  </label>
                  <select
                    value={createForm.experience.cookingExperience}
                    onChange={(e) => setCreateForm({...createForm, experience: {...createForm.experience, cookingExperience: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="none">None</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="text"
                    value={createForm.experience.yearsOfExperience}
                    onChange={(e) => setCreateForm({...createForm, experience: {...createForm.experience, yearsOfExperience: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter years of experience"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="text"
                    value={createForm.payment.amount}
                    onChange={(e) => setCreateForm({...createForm, payment: {...createForm.payment, amount: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency *
                  </label>
                  <select
                    value={createForm.payment.currency}
                    onChange={(e) => setCreateForm({...createForm, payment: {...createForm.payment, currency: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status *
                  </label>
                  <select
                    value={createForm.payment.status}
                    onChange={(e) => setCreateForm({...createForm, payment: {...createForm.payment, status: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={createForm.payment.paymentMethod}
                    onChange={(e) => setCreateForm({...createForm, payment: {...createForm.payment, paymentMethod: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement; 
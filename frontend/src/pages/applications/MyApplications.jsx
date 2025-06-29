import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Redux actions
import { getMyApplications } from '../../store/applicationSlice';

// Components
import LoadingSpinner from '../../components/LoadingSpinner';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector(state => state.applications);

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStep = (application) => {
    if (application.status === 'approved' && application.examResult) {
      return application.examResult.passed ? 'Certificate Issued' : 'Exam Failed';
    }
    if (application.status === 'approved') {
      return 'Exam Scheduled';
    }
    if (application.status === 'pending') {
      return 'Under Review';
    }
    return 'Application Submitted';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the progress of your certification applications</p>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Application Status</h2>
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply for New Course
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-4">Start your certification journey by applying for a course.</p>
                <Link
                  to="/courses"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => (
                  <div key={application._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.course?.name || 'Course Name'}
                        </h3>
                        <p className="text-gray-600">Application ID: {application._id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    {/* Status Steps */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Application Progress</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">Application Submitted</span>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gray-200"></div>
                        
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            application.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}>
                            <span className="text-white text-xs">2</span>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">Under Review</span>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gray-200"></div>
                        
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            application.status === 'approved' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}>
                            <span className="text-white text-xs">3</span>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">Exam Scheduled</span>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gray-200"></div>
                        
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            application.examResult ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            <span className="text-white text-xs">4</span>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">Certificate</span>
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-gray-700">Applied Date:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Current Step:</span>
                        <span className="ml-2 text-gray-600">{getStatusStep(application)}</span>
                      </div>
                      {application.examResult && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Exam Score:</span>
                            <span className="ml-2 text-gray-600">
                              {application.examResult.score}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Exam Result:</span>
                            <span className={`ml-2 ${application.examResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                              {application.examResult.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {application.status === 'approved' && !application.examResult && (
                        <Link
                          to={`/exams/${application._id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Take Exam
                        </Link>
                      )}
                      {application.examResult?.passed && (
                        <Link
                          to={`/certificates/${application._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          View Certificate
                        </Link>
                      )}
                      <Link
                        to={`/dashboard`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications; 
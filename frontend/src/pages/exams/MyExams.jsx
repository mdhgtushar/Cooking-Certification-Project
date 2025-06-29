import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Redux actions
import { getMyExams } from '../../store/examSlice';

// Components
import LoadingSpinner from '../../components/LoadingSpinner';

const MyExams = () => {
  const dispatch = useDispatch();
  const { exams, loading } = useSelector(state => state.exam);

  useEffect(() => {
    dispatch(getMyExams());
  }, [dispatch]);

  const getExamStatusColor = (exam) => {
    if (exam.completed) {
      return exam.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }
    if (exam.scheduled) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getExamStatus = (exam) => {
    if (exam.completed) {
      return exam.passed ? 'Passed' : 'Failed';
    }
    if (exam.scheduled) {
      return 'Scheduled';
    }
    return 'Pending';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
          <p className="mt-2 text-gray-600">View your exam schedule and results</p>
        </div>

        {/* Exams List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Exam Status</h2>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            {exams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams scheduled yet</h3>
                <p className="text-gray-600 mb-4">Complete your application process to schedule an exam.</p>
                <Link
                  to="/my-applications"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Applications
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {exams.map((exam) => (
                  <div key={exam._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {exam.course?.name || 'Course Exam'}
                        </h3>
                        <p className="text-gray-600">Exam ID: {exam._id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamStatusColor(exam)}`}>
                        {getExamStatus(exam)}
                      </span>
                    </div>

                    {/* Exam Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-gray-700">Course:</span>
                        <span className="ml-2 text-gray-600">
                          {exam.course?.name || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Exam Type:</span>
                        <span className="ml-2 text-gray-600">
                          {exam.examType || 'Standard'}
                        </span>
                      </div>
                      {exam.scheduledDate && (
                        <div>
                          <span className="font-medium text-gray-700">Scheduled Date:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(exam.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {exam.duration && (
                        <div>
                          <span className="font-medium text-gray-700">Duration:</span>
                          <span className="ml-2 text-gray-600">
                            {exam.duration} minutes
                          </span>
                        </div>
                      )}
                      {exam.completed && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Score:</span>
                            <span className="ml-2 text-gray-600">
                              {exam.score || 0}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Result:</span>
                            <span className={`ml-2 ${exam.passed ? 'text-green-600' : 'text-red-600'}`}>
                              {exam.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Exam Instructions */}
                    {!exam.completed && exam.scheduled && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Exam Instructions</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Make sure you have a stable internet connection</li>
                          <li>• Find a quiet environment for the exam</li>
                          <li>• Have your ID ready for verification</li>
                          <li>• The exam will start automatically at the scheduled time</li>
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {exam.scheduled && !exam.completed && (
                        <Link
                          to={`/exams/${exam._id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Take Exam
                        </Link>
                      )}
                      {exam.completed && exam.passed && (
                        <Link
                          to={`/certificates/${exam.applicationId}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          View Certificate
                        </Link>
                      )}
                      {exam.completed && !exam.passed && (
                        <Link
                          to={`/exams/${exam._id}`}
                          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm"
                        >
                          Retake Exam
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

export default MyExams; 
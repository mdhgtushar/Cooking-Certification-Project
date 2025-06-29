import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Redux actions
import { fetchUserCertificates } from '../../store/certificateSlice';

// Components
import LoadingSpinner from '../../components/LoadingSpinner';

const MyCertificates = () => {
  const dispatch = useDispatch();
  const { certificates, loading } = useSelector(state => state.certificate);

  useEffect(() => {
    dispatch(fetchUserCertificates());
  }, [dispatch]);

  const copyVerificationCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Verification code copied to clipboard!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="mt-2 text-gray-600">View and manage your earned certificates</p>
        </div>

        {/* Certificates List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Earned Certificates</h2>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                <p className="text-gray-600 mb-4">Complete your exams to earn certificates.</p>
                <Link
                  to="/my-applications"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Applications
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <div key={certificate._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🏆</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {certificate.course?.name || 'Course Certificate'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Issued: {new Date(certificate.issuedDate).toLocaleDateString()}
                      </p>
                      
                      {/* Certificate Details */}
                      <div className="text-left mb-4 space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Course:</span>
                          <span className="ml-2 text-gray-600">
                            {certificate.course?.name || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Certificate ID:</span>
                          <span className="ml-2 text-gray-600 font-mono text-xs">
                            {certificate._id}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Verification Code:</span>
                          <span className="ml-2 text-gray-600 font-mono text-xs">
                            {certificate.verificationCode}
                          </span>
                        </div>
                        {certificate.examResult && (
                          <div>
                            <span className="font-medium text-gray-700">Exam Score:</span>
                            <span className="ml-2 text-gray-600">
                              {certificate.examResult.score}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Link
                          to={`/certificates/${certificate._id}`}
                          className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          View Certificate
                        </Link>
                        <button
                          onClick={() => copyVerificationCode(certificate.verificationCode)}
                          className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                        >
                          Copy Verification Code
                        </button>
                        <Link
                          to={`/verify/${certificate.verificationCode}`}
                          className="block w-full bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition-colors text-sm"
                        >
                          Verify Certificate
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certificate Verification Section */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify Certificate</h2>
            <p className="text-gray-600 mb-4">
              Enter a verification code to check the authenticity of any certificate.
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <span className="mr-2">🔍</span>
              Verify Certificate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCertificates; 
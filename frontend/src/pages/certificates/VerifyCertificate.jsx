import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const VerifyCertificate = () => {
  const { code } = useParams();
  const [verificationCode, setVerificationCode] = useState(code || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setVerificationResult({ valid: false, message: 'Please enter a verification code' });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual verification API call
      // const result = await certificateService.verifyCertificate(verificationCode);
      
      // For now, show a placeholder result
      setTimeout(() => {
        setVerificationResult({
          valid: true,
          message: 'Certificate verified successfully!',
          certificate: {
            name: 'John Doe',
            course: 'Advanced Cooking Techniques',
            issueDate: '2024-01-15',
            certificateId: verificationCode
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setVerificationResult({
        valid: false,
        message: error.message || 'Failed to verify certificate'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Certificate
          </h1>
          <p className="text-lg text-gray-600">
            Enter the certificate verification code to verify its authenticity
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleVerify} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter verification code"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>

          {verificationResult && (
            <div className={`mt-8 p-4 rounded-md ${
              verificationResult.valid 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {verificationResult.valid ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    verificationResult.valid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult.valid ? 'Certificate Verified' : 'Verification Failed'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    verificationResult.valid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <p>{verificationResult.message}</p>
                  </div>
                  
                  {verificationResult.valid && verificationResult.certificate && (
                    <div className="mt-4 p-4 bg-white rounded-md border">
                      <h4 className="font-medium text-gray-900 mb-2">Certificate Details:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Name:</strong> {verificationResult.certificate.name}</p>
                        <p><strong>Course:</strong> {verificationResult.certificate.course}</p>
                        <p><strong>Issue Date:</strong> {verificationResult.certificate.issueDate}</p>
                        <p><strong>Certificate ID:</strong> {verificationResult.certificate.certificateId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate; 
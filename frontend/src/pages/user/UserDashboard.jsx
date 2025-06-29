import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Redux actions
import { fetchUserCertificates } from '../../store/certificateSlice';
import { getMyApplications } from '../../store/applicationSlice';

// Components
import LoadingSpinner from '../../components/LoadingSpinner';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Redux state - optimized selectors to prevent unnecessary re-renders
  const user = useSelector(state => state.user.user);
  const userLoading = useSelector(state => state.user.loading);
  const applications = useSelector(state => state.applications.applications);
  const applicationsLoading = useSelector(state => state.applications.loading);
  const certificates = useSelector(state => state.certificates.certificates);
  const certificatesLoading = useSelector(state => state.certificates.loading);

  useEffect(() => {
    console.log('UserDashboard mounted');
    setIsLoading(false);
    
  //   // Fetch data
    // dispatch(getUserProfile());
    dispatch(getMyApplications());
    dispatch(fetchUserCertificates());
  }, []);

  // Loading state
  if (isLoading || userLoading || applicationsLoading || certificatesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name || 'User'}!</p>
        </div>

        {/* Simple Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Content</h2>
          <p className="text-gray-600">Dashboard is working! User: {user?.email || 'No user data'}</p>
          <p className="text-gray-600">Applications: {applications?.length || 0}</p>
          <p className="text-gray-600">Certificates: {certificates?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 
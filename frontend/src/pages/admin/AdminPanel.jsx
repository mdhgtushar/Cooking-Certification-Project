import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

// Admin Components
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

// Admin Pages
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import CertificateManagement from './CertificateManagement';
import ApplicationManagement from './ApplicationManagement';
import ExamManagement from './ExamManagement';
import ContactManagement from './ContactManagement';
import CourseManagement from './CourseManagement';
import AdminProfile from './AdminProfile';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/certificates" element={<CertificateManagement />} />
            <Route path="/applications" element={<ApplicationManagement />} />
            <Route path="/exams" element={<ExamManagement />} />
            <Route path="/contacts" element={<ContactManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel; 
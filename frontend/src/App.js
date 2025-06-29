import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Store
import store from './store/store';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import AdminPanel from './pages/admin/AdminPanel';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import ApplicationForm from './pages/applications/ApplicationForm';
import MyApplications from './pages/applications/MyApplications';
import MyExams from './pages/exams/MyExams';
import ExamDetail from './pages/exams/ExamDetail';
import MyCertificates from './pages/certificates/MyCertificates';
import CertificateDetail from './pages/certificates/CertificateDetail';
import VerifyCertificate from './pages/certificates/VerifyCertificate';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import HowToApply from './pages/HowToApply';
import About from './pages/About';
import Verify from './pages/certificates/VerifyCertificate';

// Hooks
import { useAuth } from './hooks/useAuth';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// App Component
const AppContent = () => {
  const { loading } = useAuth();
  const location = useLocation();
  
  // Check if we're in admin mode
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {/* Only show Header and Footer for non-admin routes */}
      {!isAdminRoute && <Header />}
      
      {isAdminRoute ? (
        // Admin routes - no wrapper needed
        <Routes>
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      ) : (
        // Non-admin routes with main-content wrapper
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/verify/:code" element={<VerifyCertificate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-to-apply" element={<HowToApply />} />
            <Route path="/about" element={<About />} />
            <Route path="/verify" element={<Verify />} />

            {/* Protected Routes - Students */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/:courseId" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <ApplicationForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-exams" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <MyExams />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exams/:id" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <ExamDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-certificates" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <MyCertificates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates/:id" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin' ]}>
                  <CertificateDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Instructors */}
            <Route 
              path="/instructor/courses" 
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/exams" 
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <MyExams />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      )}
      
      {!isAdminRoute && <Footer />}
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

// Main App Component with Redux Provider
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App; 
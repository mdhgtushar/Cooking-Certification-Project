import { API_BASE_URL, STORAGE_KEYS } from '../constants/apiConstants';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    // Token is invalid, clear storage and redirect to login
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/login';
    throw new Error('Authentication failed. Please log in again.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Dashboard API
export const getDashboardStats = async () => {
  return apiCall('/admin/dashboard');
};

// User Management API
export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/admin/users?${queryString}`);
};

export const updateUser = async (userId, userData) => {
  return apiCall(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId) => {
  return apiCall(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
};

// Certificate Management API
export const getCertificates = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/admin/certificates?${queryString}`);
};

export const updateCertificate = async (certificateId, certificateData) => {
  return apiCall(`/admin/certificates/${certificateId}`, {
    method: 'PUT',
    body: JSON.stringify(certificateData),
  });
};

export const revokeCertificate = async (certificateId) => {
  return apiCall(`/admin/certificates/${certificateId}/revoke`, {
    method: 'PUT',
  });
};

// Application Management API
export const getApplications = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/admin/applications?${queryString}`);
};

export const updateApplication = async (applicationId, applicationData) => {
  return apiCall(`/admin/applications/${applicationId}`, {
    method: 'PUT',
    body: JSON.stringify(applicationData),
  });
};

export const approveApplication = async (applicationId) => {
  return apiCall(`/admin/applications/${applicationId}/approve`, {
    method: 'PUT',
  });
};

export const rejectApplication = async (applicationId, reason) => {
  return apiCall(`/admin/applications/${applicationId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
};

// Exam Management API
export const getExams = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/admin/exam-results?${queryString}`);
};

export const updateExam = async (examId, examData) => {
  return apiCall(`/admin/exam-results/${examId}`, {
    method: 'PUT',
    body: JSON.stringify(examData),
  });
};

export const gradeExam = async (examId, gradeData) => {
  return apiCall(`/admin/exam-results/${examId}/grade`, {
    method: 'PUT',
    body: JSON.stringify(gradeData),
  });
};

// Contact Management API
export const getContacts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/contacts?${queryString}`);
};

export const updateContact = async (contactId, contactData) => {
  return apiCall(`/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(contactData),
  });
};

export const deleteContact = async (contactId) => {
  return apiCall(`/contacts/${contactId}`, {
    method: 'DELETE',
  });
};

// Course Management API
export const getCourses = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/courses?${queryString}`);
};

export const createCourse = async (courseData) => {
  return apiCall('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = async (courseId, courseData) => {
  return apiCall(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = async (courseId) => {
  return apiCall(`/courses/${courseId}`, {
    method: 'DELETE',
  });
};

// System Analytics API
export const getSystemAnalytics = async () => {
  return apiCall('/admin/analytics');
};

// Bulk Operations
export const bulkUpdateUsers = async (userIds, updateData) => {
  return apiCall('/admin/users/bulk-update', {
    method: 'PUT',
    body: JSON.stringify({ userIds, updateData }),
  });
};

export const bulkDeleteUsers = async (userIds) => {
  return apiCall('/admin/users/bulk-delete', {
    method: 'DELETE',
    body: JSON.stringify({ userIds }),
  });
};

export const bulkUpdateApplications = async (applicationIds, updateData) => {
  return apiCall('/admin/applications/bulk-update', {
    method: 'PUT',
    body: JSON.stringify({ applicationIds, updateData }),
  });
};

export const bulkUpdateCertificates = async (certificateIds, updateData) => {
  return apiCall('/admin/certificates/bulk-update', {
    method: 'PUT',
    body: JSON.stringify({ certificateIds, updateData }),
  });
};

// Export/Import functionality
export const exportUsers = async (format = 'csv') => {
  return apiCall(`/admin/users/export?format=${format}`);
};

export const exportApplications = async (format = 'csv') => {
  return apiCall(`/admin/applications/export?format=${format}`);
};

export const exportCertificates = async (format = 'csv') => {
  return apiCall(`/admin/certificates/export?format=${format}`);
};

// Notification and Communication
export const sendBulkNotification = async (notificationData) => {
  return apiCall('/admin/notifications/send', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  });
};

export const getNotificationHistory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/admin/notifications?${queryString}`);
};

export const createApplication = async (applicationData) => {
  return apiCall('/admin/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
};

export const createExam = async (examData) => {
  return apiCall('/admin/exam-results', {
    method: 'POST',
    body: JSON.stringify(examData),
  });
};

export const createCertificate = async (certificateData) => {
  return apiCall('/admin/certificates', {
    method: 'POST',
    body: JSON.stringify(certificateData),
  });
}; 
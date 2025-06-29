// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  PROFILE: '/users/profile',
  
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id) => `/courses/${id}`,
  INSTRUCTOR_COURSES: '/courses/instructor/my-courses',
  
  // Applications
  APPLICATIONS: '/applications',
  MY_APPLICATIONS: '/applications/my-applications',
  APPLICATION_BY_ID: (id) => `/applications/${id}`,
  REVIEW_APPLICATION: (id) => `/applications/${id}/review`,
  
  // Exams
  EXAMS: '/exams',
  MY_EXAMS: '/exams/my-exams',
  EXAM_BY_ID: (id) => `/exams/${id}`,
  START_EXAM: (id) => `/exams/${id}/start`,
  SUBMIT_EXAM: (id) => `/exams/${id}/submit`,
  GRADE_EXAM: (id) => `/exams/${id}/grade`,
  
  // Certificates
  CERTIFICATES: '/certificates',
  MY_CERTIFICATES: '/certificates/my-certificates',
  CERTIFICATE_BY_ID: (id) => `/certificates/${id}`,
  VERIFY_CERTIFICATE: (code) => `/certificates/verify/${code}`,
  DOWNLOAD_CERTIFICATE: (id) => `/certificates/${id}/download`,
  REVOKE_CERTIFICATE: (id) => `/certificates/${id}/revoke`,
  
  // Contacts
  CONTACTS: '/contacts',
  CONTACT_BY_ID: (id) => `/contacts/${id}`,
  CONTACT_STATS: '/contacts/stats',
  UPDATE_CONTACT_STATUS: (id) => `/contacts/${id}/status`,
  RESPOND_TO_CONTACT: (id) => `/contacts/${id}/respond`,
  MARK_AS_SPAM: (id) => `/contacts/${id}/spam`,
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_UPDATE_USER: (id) => `/admin/users/${id}`,
  ADMIN_CERTIFICATES: '/admin/certificates',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_EXAM_RESULTS: '/admin/exam-results',
  ADMIN_ANALYTICS: '/admin/analytics',
  
  // Health
  HEALTH: '/health'
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// Exam Status
export const EXAM_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Exam Result
export const EXAM_RESULT = {
  PASS: 'pass',
  FAIL: 'fail'
};

// Certificate Status
export const CERTIFICATE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REVOKED: 'revoked'
};

// Certificate Types
export const CERTIFICATE_TYPES = {
  COMPLETION: 'completion',
  ACHIEVEMENT: 'achievement',
  EXCELLENCE: 'excellence'
};

// Certificate Levels
export const CERTIFICATE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Course Levels
export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Contact Status
export const CONTACT_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// Contact Priority
export const CONTACT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'cooking_cert_token',
  USER: 'cooking_cert_user',
  THEME: 'cooking_cert_theme'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}; 
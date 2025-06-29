import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../constants/apiConstants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Application service functions
export const applicationService = {
  // Apply for course
  applyForCourse: async (applicationData) => {
    return api.post(API_ENDPOINTS.APPLICATIONS, applicationData);
  },

  // Get my applications
  getMyApplications: async (params = {}) => {
    return api.get(API_ENDPOINTS.MY_APPLICATIONS, { params });
  },

  // Get application by ID
  getApplicationById: async (id) => {
    return api.get(API_ENDPOINTS.APPLICATION_BY_ID(id));
  },

  // Update application
  updateApplication: async (id, applicationData) => {
    return api.put(API_ENDPOINTS.APPLICATION_BY_ID(id), applicationData);
  },

  // Cancel application
  cancelApplication: async (id) => {
    return api.delete(API_ENDPOINTS.APPLICATION_BY_ID(id));
  },

  // Get all applications (admin/instructor only)
  getAllApplications: async (params = {}) => {
    return api.get(API_ENDPOINTS.APPLICATIONS, { params });
  },

  // Review application (admin/instructor only)
  reviewApplication: async (id, reviewData) => {
    return api.put(API_ENDPOINTS.REVIEW_APPLICATION(id), reviewData);
  }
}; 
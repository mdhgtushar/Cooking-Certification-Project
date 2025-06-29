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

// Course service functions
export const courseService = {
  // Get all courses (public)
  getAllCourses: async (params = {}) => {
    return api.get(API_ENDPOINTS.COURSES, { params });
  },

  // Get course by ID (public)
  getCourseById: async (id) => {
    return api.get(API_ENDPOINTS.COURSE_BY_ID(id));
  },

  // Create course (instructor/admin only)
  createCourse: async (courseData) => {
    return api.post(API_ENDPOINTS.COURSES, courseData);
  },

  // Update course (instructor/admin only)
  updateCourse: async (id, courseData) => {
    return api.put(API_ENDPOINTS.COURSE_BY_ID(id), courseData);
  },

  // Delete course (instructor/admin only)
  deleteCourse: async (id) => {
    return api.delete(API_ENDPOINTS.COURSE_BY_ID(id));
  },

  // Get instructor courses (instructor only)
  getInstructorCourses: async (params = {}) => {
    return api.get(API_ENDPOINTS.INSTRUCTOR_COURSES, { params });
  },

  // Search courses
  searchCourses: async (searchTerm, params = {}) => {
    return api.get(API_ENDPOINTS.COURSES, { 
      params: { ...params, search: searchTerm } 
    });
  },

  // Get courses by category
  getCoursesByCategory: async (category, params = {}) => {
    return api.get(API_ENDPOINTS.COURSES, { 
      params: { ...params, category } 
    });
  },

  // Get courses by level
  getCoursesByLevel: async (level, params = {}) => {
    return api.get(API_ENDPOINTS.COURSES, { 
      params: { ...params, level } 
    });
  }
}; 
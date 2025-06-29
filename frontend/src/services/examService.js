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

// Exam service functions
export const examService = {
  // Schedule exam (admin/instructor only)
  scheduleExam: async (examData) => {
    return api.post(API_ENDPOINTS.EXAMS, examData);
  },

  // Get my exams
  getMyExams: async (params = {}) => {
    return api.get(API_ENDPOINTS.MY_EXAMS, { params });
  },

  // Get exam by ID
  getExamById: async (id) => {
    return api.get(API_ENDPOINTS.EXAM_BY_ID(id));
  },

  // Start exam
  startExam: async (id) => {
    return api.put(API_ENDPOINTS.START_EXAM(id));
  },

  // Submit exam
  submitExam: async (id, answers) => {
    return api.put(API_ENDPOINTS.SUBMIT_EXAM(id), { answers });
  },

  // Grade exam (admin/instructor only)
  gradeExam: async (id, gradeData) => {
    return api.put(API_ENDPOINTS.GRADE_EXAM(id), gradeData);
  },

  // Get all exams (admin/instructor only)
  getAllExams: async (params = {}) => {
    return api.get(API_ENDPOINTS.EXAMS, { params });
  }
}; 
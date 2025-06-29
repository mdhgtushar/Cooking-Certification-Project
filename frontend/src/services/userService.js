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

// User service functions
export const userService = {
  // Login user
  login: async (credentials) => {
    return api.post(API_ENDPOINTS.LOGIN, credentials);
  },

  // Register user
  register: async (userData) => {
    return api.post(API_ENDPOINTS.REGISTER, userData);
  },

  // Get user profile
  getProfile: async () => {
    return api.get(API_ENDPOINTS.PROFILE);
  },

  // Update user profile
  updateProfile: async (userData) => {
    return api.put(API_ENDPOINTS.PROFILE, userData);
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    return api.get(API_ENDPOINTS.USERS, { params });
  },

  // Get user by ID
  getUserById: async (id) => {
    return api.get(`/users/${id}`);
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
}; 
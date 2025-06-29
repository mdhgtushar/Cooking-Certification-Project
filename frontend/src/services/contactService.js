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

// Contact service functions
export const contactService = {
  // Submit contact form (public)
  submitContact: async (contactData) => {
    return api.post(API_ENDPOINTS.CONTACTS, contactData);
  },

  // Get all contacts (admin only)
  getAllContacts: async (params = {}) => {
    return api.get(API_ENDPOINTS.CONTACTS, { params });
  },

  // Get contact by ID (admin only)
  getContactById: async (id) => {
    return api.get(API_ENDPOINTS.CONTACT_BY_ID(id));
  },

  // Update contact status (admin only)
  updateContactStatus: async (id, statusData) => {
    return api.put(API_ENDPOINTS.UPDATE_CONTACT_STATUS(id), statusData);
  },

  // Respond to contact (admin only)
  respondToContact: async (id, responseData) => {
    return api.put(API_ENDPOINTS.RESPOND_TO_CONTACT(id), responseData);
  },

  // Get contact stats (admin only)
  getContactStats: async () => {
    return api.get(API_ENDPOINTS.CONTACT_STATS);
  },

  // Mark as spam (admin only)
  markAsSpam: async (id) => {
    return api.put(API_ENDPOINTS.MARK_AS_SPAM(id));
  }
}; 
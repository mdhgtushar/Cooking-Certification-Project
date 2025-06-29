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

// Certificate service functions
const certificateService = {
  // Get user certificates
  getUserCertificates: async () => {
    return api.get(API_ENDPOINTS.MY_CERTIFICATES);
  },

  // Get certificate by ID
  getCertificateById: async (id) => {
    return api.get(API_ENDPOINTS.CERTIFICATE_BY_ID(id));
  },

  // Verify certificate
  verifyCertificate: async (verificationCode) => {
    return api.get(API_ENDPOINTS.VERIFY_CERTIFICATE(verificationCode));
  },

  // Download certificate
  downloadCertificate: async (id) => {
    return api.get(API_ENDPOINTS.DOWNLOAD_CERTIFICATE(id), {
      responseType: 'blob'
    });
  },

  // View certificate in browser
  viewCertificate: async (id) => {
    return api.get(API_ENDPOINTS.VIEW_CERTIFICATE(id), {
      responseType: 'blob'
    });
  },

  // Get all certificates (admin only)
  getAllCertificates: async (params = {}) => {
    return api.get(API_ENDPOINTS.CERTIFICATES, { params });
  },

  // Revoke certificate (admin only)
  revokeCertificate: async (id) => {
    return api.put(API_ENDPOINTS.REVOKE_CERTIFICATE(id));
  },

  // Update certificate (admin only)
  updateCertificate: async (id, certificateData) => {
    return api.put(API_ENDPOINTS.CERTIFICATE_BY_ID(id), certificateData);
  }
};

export default certificateService; 
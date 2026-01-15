import axios from 'axios';
import { logger } from '@/lib/logger';

/**
 * Axios instance configured for API communication
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8534';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });
    return config;
  },
  (error) => {
    logger.error('API Request Error', { error: error.message });
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      logger.error('API Response Error', {
        status: error.response.status,
        url: error.config?.url,
        message: error.response.data?.message || error.message,
      });
    } else if (error.request) {
      // Request made but no response received
      logger.error('API Network Error', {
        url: error.config?.url,
        message: 'No response from server',
      });
    } else {
      // Error in request setup
      logger.error('API Request Setup Error', {
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

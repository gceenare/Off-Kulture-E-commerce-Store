import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  const { data } = response;
  if (data.success && data.data) {
    return data.data;
  }
  throw new ApiError(data.error || data.message || 'API request failed', response.status, data);
};

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response;
    throw new ApiError(
      data.error || data.message || `HTTP ${status} error`,
      status,
      data
    );
  } else if (error.request) {
    throw new ApiError('Network error - no response received');
  } else {
    throw new ApiError(error.message || 'Unknown error occurred');
  }
};

export { apiClient, handleApiResponse, handleApiError };
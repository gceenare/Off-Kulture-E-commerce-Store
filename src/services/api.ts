import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: { [key: string]: string };
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public errors?: { [key: string]: string }) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (response.data.success) {
    return response.data.data;
  }
  throw new ApiError(response.data.message || 'An unknown error occurred.', response.status, response.data.errors);
}

export function handleApiError(error: any): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    if (axiosError.response) {
      const { message, errors } = axiosError.response.data;
      return new ApiError(message || 'An API error occurred.', axiosError.response.status, errors);
    }
    return new ApiError(axiosError.message, 500);
  }
  return new ApiError('An unexpected error occurred.', 500);
}

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './api';
import { User } from '../App';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      const authData = handleApiResponse(response);

      // Store token and user data
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }

      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
      const authData = handleApiResponse(response);

      // Store token and user data
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }

      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh', {
        refreshToken,
      });

      const { token } = handleApiResponse(response);
      localStorage.setItem('authToken', token);

      return token;
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw handleApiError(error);
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update user profile
  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>('/auth/profile', userData);
      const updatedUser = handleApiResponse(response);

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Change password
  static async changePassword(passwordData: PasswordChangeData): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/change-password', passwordData);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', {
        email,
      });
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Reset password
  static async resetPassword(resetData: PasswordResetData): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', resetData);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get stored user
  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored token
  static getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is admin
  static isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.email?.toLowerCase() === 'admin@offkulture.com' ||
           user?.role === 'admin' ||
           false;
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/verify-email', { token });
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/resend-verification');
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthService } from '../services';
import { User } from '../App';

// Types
interface ApiContextState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

type ApiContextAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: ApiContextState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  error: null,
};

// Reducer
const apiReducer = (state: ApiContextState, action: ApiContextAction): ApiContextState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isAdmin: AuthService.isAdmin(),
        loading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
const ApiContext = createContext<{
  state: ApiContextState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
} | null>(null);

// Provider
export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          dispatch({ type: 'SET_LOADING', payload: true });
          const user = await AuthService.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const authResponse = await AuthService.login({ email, password });
      dispatch({ type: 'SET_USER', payload: authResponse.user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed' });
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const authResponse = await AuthService.register(userData);
      dispatch({ type: 'SET_USER', payload: authResponse.user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Registration failed' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const updatedUser = await AuthService.updateProfile(userData);
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Update failed' });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Hook
export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};

// Export types
export type { ApiContextState, ApiContextAction };
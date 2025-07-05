import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  isVerified: boolean;
  totalSpent: number;
  joinDate: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_USER' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// SECURE: Session-based Axios configuration (no localStorage)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.withCredentials = true; // CRITICAL: Always send cookies
axios.defaults.timeout = 30000; // 30 second timeout

// Enhanced headers for security
const getSecureHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'X-Requested-With': 'XMLHttpRequest'
});

// Request interceptor for security
axios.interceptors.request.use(
  (config) => {
    // Ensure credentials are always sent
    config.withCredentials = true;
    
    // Add security headers
    config.headers = {
      ...config.headers,
      ...getSecureHeaders()
    };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response interceptor error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error or server unreachable');
    }
    
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data } = await axios.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await axios.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      dispatch({ type: 'SET_USER', payload: data.user });
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err: any) {
      console.error('Login error:', err);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('/auth/register', { name, email, password });
    } catch (err: any) {
      console.error('Registration error:', err);
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const { data } = await axios.post('/auth/verify-otp', { email, otp });
      dispatch({ type: 'SET_USER', payload: data.user });
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err: any) {
      console.error('OTP verification error:', err);
      throw new Error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await axios.post('/auth/resend-otp', { email });
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      throw new Error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { data: res } = await axios.put('/user/profile', data);
      dispatch({ type: 'UPDATE_USER', payload: res.user });
    } catch (err: any) {
      console.error('Profile update error:', err);
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('auth') === 'success') {
        try {
          // Google OAuth successful, refresh user data
          await refreshUser();
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Google OAuth callback error:', error);
          // Clean up URL even on error
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (urlParams.get('error') === 'auth_failed') {
        console.error('Google OAuth failed');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleGoogleCallback();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
        updateProfile,
        checkAuth,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
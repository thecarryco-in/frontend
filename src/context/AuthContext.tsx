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
  memberStatus: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
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

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('/auth/register', { name, email, password });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await axios.post('/auth/verify-otp', { email, otp });
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await axios.post('/auth/resend-otp', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await axios.put('/user/profile', data);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      verifyOTP,
      resendOTP,
      logout,
      updateProfile,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
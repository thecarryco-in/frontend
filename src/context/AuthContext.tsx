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
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
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

// Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await axios.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch {
      dispatch({ type: 'SET_USER', payload: null });
      // no redirect here: allow public pages to render
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('/auth/register', { name, email, password });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const { data } = await axios.post('/auth/verify-otp', { email, otp });
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await axios.post('/auth/resend-otp', { email });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'SET_USER', payload: null });
      localStorage.clear();
      sessionStorage.clear();
      // no redirect: routing handles it
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white text-lg">Please Wait...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
        updateProfile: async (data) => {
          const { data: res } = await axios.put('/user/profile', data);
          dispatch({ type: 'UPDATE_USER', payload: res.user });
        },
        checkAuth,
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

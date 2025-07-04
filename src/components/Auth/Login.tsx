import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader, Chrome, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Custom notification component
const Notification: React.FC<{ 
  type: 'success' | 'error' | 'info'; 
  message: string; 
  onClose: () => void 
}> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error': return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'info': return <AlertTriangle className="w-6 h-6 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className={`fixed top-24 right-4 z-50 ${getColors()} backdrop-blur-md rounded-2xl p-6 border max-w-md animate-in slide-in-from-right duration-300`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-white font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert email to lowercase for case insensitive login
      await login(formData.email.toLowerCase().trim(), formData.password);
      
      showNotification('success', 'Login successful! Redirecting...');
      
      // Small delay to ensure state is fully updated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error: any) {
      showNotification('error', error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Store the intended destination in sessionStorage for Google OAuth
    sessionStorage.setItem('authRedirect', from);
    
    // For Safari compatibility, open in same window
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to your The CarryCo account</p>
          </div>

          {/* Safari Notice */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-400 font-medium text-sm">Safari Users</p>
                <p className="text-gray-300 text-xs">Please ensure cookies are enabled for the best experience</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 pl-12 pr-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white/10 backdrop-blur-md text-white py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <Chrome className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Footer */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
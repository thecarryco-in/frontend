import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, Smartphone, LogOut, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Cases', href: '/shop?category=cases' },
    { name: 'Accessories', href: '/shop?category=accessories' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                The CarryCo
              </span>
              <div className="text-xs text-gray-400 font-medium">Premium Accessories</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-sm font-medium transition-all duration-300 hover:text-purple-400 group ${
                  isActive(item.href) ? 'text-purple-400' : 'text-gray-300'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300 group-hover:w-full ${
                  isActive(item.href) ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/wishlist"
                  className="relative p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/cart" 
                  className="relative p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-xl backdrop-blur-sm group"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-purple-400"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block font-medium">{user?.name}</span>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <p className="text-purple-400 text-xs font-medium mt-1">{user?.memberStatus} Member</p>
                        {user?.isAdmin && (
                          <p className="text-cyan-400 text-xs font-medium">Admin Access</p>
                        )}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        <User className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                          <User className="w-5 h-5" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-xl backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <nav className="space-y-2 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-6 py-4 text-sm font-medium transition-all duration-200 hover:text-purple-400 hover:bg-white/10 rounded-2xl backdrop-blur-sm ${
                  isActive(item.href) ? 'text-purple-400 bg-white/10' : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isWorkEssentialsDropdownOpen, setIsWorkEssentialsDropdownOpen] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // scroll header background on window scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Close user menu when user changes (login/logout)
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [user, isAuthenticated]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsShopDropdownOpen(false);
      setIsWorkEssentialsDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'Shop', 
      href: '/shop',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Products', href: '/shop' },
        { name: 'Cases', href: '/shop/category/cases' },
        { name: 'Tempered Glass', href: '/shop/category/tempered-glass' },
        { name: 'Chargers', href: '/shop/category/chargers' },
        { name: 'Accessories', href: '/shop/category/accessories' }
      ]
    },
    { name: 'New Arrivals', href: '/shop/filter/new' },
    { name: 'Gifts', href: '/shop/filter/gifts' },
    { 
      name: 'Work Essentials', 
      href: '/shop/category/work-essentials',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Work Essentials', href: '/shop/category/work-essentials' },
        { name: 'Laptop Accessories', href: '/shop/category/work-essentials/laptop-accessories' },
        { name: 'Desk Setup', href: '/shop/category/work-essentials/desk-setup' },
        { name: 'Cable Management', href: '/shop/category/work-essentials/cable-management' },
        { name: 'Productivity Tools', href: '/shop/category/work-essentials/productivity-tools' }
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('/shop/category/')) {
      return location.pathname === href;
    }
    if (href.startsWith('/shop/filter/')) {
      return location.pathname === href;
    }
    if (href === '/shop') {
      return location.pathname === '/shop';
    }
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

  const getMemberStatus = (totalSpent: number = 0) => {
    if (totalSpent >= 10000) return 'Platinum';
    if (totalSpent >= 5000) return 'Gold';
    if (totalSpent >= 1000) return 'Silver';
    return 'Bronze';
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'Platinum':
        return 'text-white';
      case 'Gold':
        return 'text-yellow-400';
      case 'Silver':
        return 'text-gray-400';
      case 'Bronze':
        return 'text-orange-700';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <div
                className="w-10 h-10 md:w-12 md:h-12
                          bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500
                          rounded-xl md:rounded-2xl
                          flex items-center justify-center
                          transform transition-all duration-300
                          group-hover:scale-110 group-hover:rotate-3
                          shadow-lg overflow-hidden"
              >
                <img
                  src={logo}
                  alt="The CarryCo Logo"
                  className="w-full h-full object-contain transform scale-[1.2]"
                />
              </div>

              {/* always-on colored blur */}
              <div
                className="absolute inset-0
                          bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500
                          rounded-xl md:rounded-2xl
                          blur opacity-50"
              />
            </div>

            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg md:text-2xl
                              bg-gradient-to-r from-purple-400 to-cyan-400
                              bg-clip-text text-transparent"
              >
                The CarryCo
              </span>
              <div className="text-xs text-gray-400 font-medium">
                Premium Accessories
              </div>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div 
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.name === 'Shop') {
                        setIsShopDropdownOpen(!isShopDropdownOpen);
                        setIsWorkEssentialsDropdownOpen(false);
                      } else if (item.name === 'Work Essentials') {
                        setIsWorkEssentialsDropdownOpen(!isWorkEssentialsDropdownOpen);
                        setIsShopDropdownOpen(false);
                      }
                    }}
                  >
                    <button className={`relative text-sm font-medium transition-all duration-300 hover:text-purple-400 group flex items-center space-x-1 ${
                      isActive(item.href) ? 'text-purple-400' : 'text-gray-300'
                    }`}>
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        (item.name === 'Shop' && isShopDropdownOpen) || 
                        (item.name === 'Work Essentials' && isWorkEssentialsDropdownOpen) 
                          ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300 group-hover:w-full ${
                      isActive(item.href) ? 'w-full' : ''
                    }`}></span>

                    {/* Dropdown Menu */}
                    {((item.name === 'Shop' && isShopDropdownOpen) || 
                      (item.name === 'Work Essentials' && isWorkEssentialsDropdownOpen)) && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl py-2 z-50">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => {
                              setIsShopDropdownOpen(false);
                              setIsWorkEssentialsDropdownOpen(false);
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {!isLoading && isAuthenticated && user ? (
              <>
                <Link 
                  to="/wishlist"
                  className="relative p-2 md:p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-lg md:rounded-xl backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5 md:w-6 md:h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/cart" 
                  className="relative p-2 md:p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-lg md:rounded-xl backdrop-blur-sm group flex items-center space-x-1 md:space-x-2"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  {itemCount > 0 && (
                    <span className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 md:space-x-2 p-1.5 md:p-2 text-gray-300 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-lg md:rounded-xl backdrop-blur-sm"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-purple-400"
                      />
                    ) : (
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                    )}
                    <span className="hidden md:block font-medium text-sm">{user.name}</span>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 shadow-2xl py-2 z-50">
                      <div className="px-3 md:px-4 py-2 md:py-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm md:text-base">{user.name}</p>
                        <p className="text-gray-400 text-xs md:text-sm">{user.email}</p>
                        <p className={`text-xs font-medium mt-1 ${getMemberStatusColor(getMemberStatus(user.totalSpent))}`}>
                          {getMemberStatus(user.totalSpent)} Member
                        </p>
                        {user.isAdmin && (
                          <p className="text-cyan-400 text-xs font-medium">Admin Access</p>
                        )}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm md:text-base"
                      >
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm md:text-base"
                      >
                        <Package className="w-4 h-4 md:w-5 md:h-5" />
                        <span>My Orders</span>
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm md:text-base"
                        >
                          <User className="w-4 h-4 md:w-5 md:h-5" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm md:text-base"
                      >
                        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : !isLoading && !isAuthenticated ? (
              <>
                {/* Cart for non-authenticated users */}
                <Link 
                  to="/cart" 
                  className="relative p-2 md:p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-lg md:rounded-xl backdrop-blur-sm group flex items-center space-x-1 md:space-x-2"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  {itemCount > 0 && (
                    <span className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 md:px-6 md:py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm md:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 md:px-6 md:py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg md:rounded-xl font-medium hover:shadow-lg transition-all duration-300 text-sm md:text-base"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 md:p-3 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg md:rounded-xl backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 pb-4 md:pb-6' : 'max-h-0 opacity-0'
        }`}>
          <nav className="space-y-1 md:space-y-2 pt-3 md:pt-4">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className={`block px-4 py-3 md:px-6 md:py-4 text-sm font-medium transition-all duration-200 hover:text-purple-400 hover:bg-white/10 rounded-xl md:rounded-2xl backdrop-blur-sm ${
                    isActive(item.href) ? 'text-purple-400 bg-white/10' : 'text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {/* Mobile dropdown items */}
                {item.hasDropdown && item.dropdownItems && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.href}
                        className="block px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

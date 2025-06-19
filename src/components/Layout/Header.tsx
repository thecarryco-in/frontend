import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Smartphone } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

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
                MobileVault
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

          {/* Search Bar */}
          <div className={`hidden md:flex items-center transition-all duration-500 ${
            isSearchOpen ? 'w-80' : 'w-12'
          }`}>
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search premium accessories..."
                className={`bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-3 pl-12 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-500 placeholder-gray-400 ${
                  isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-4 w-6 h-6 text-gray-400 hover:text-purple-400 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-xl backdrop-blur-sm">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>
            
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

            <Link 
              to="/dashboard" 
              className="p-3 text-gray-300 hover:text-purple-400 transition-all duration-200 hover:bg-white/10 rounded-xl backdrop-blur-sm"
            >
              <User className="w-6 h-6" />
            </Link>

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
            <div className="px-6 py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-3 pl-12 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
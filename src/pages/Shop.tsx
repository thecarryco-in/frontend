import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, Search, Star, Loader, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useAuth } from '../context/AuthContext';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    filter: searchParams.get('filter') || '',
    brand: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    rating: 0,
  });

  const { isAuthenticated } = useAuth();

  // Update filters when query changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || '',
      subcategory: searchParams.get('subcategory') || '',
      filter: searchParams.get('filter') || '',
    }));
  }, [searchParams]);

  // Debounce search and price range
  const debouncedSearch = useDebouncedValue(searchQuery, 1000);
  const debouncedMinPrice = useDebouncedValue(filters.minPrice, 1000);
  const debouncedMaxPrice = useDebouncedValue(filters.maxPrice, 1000);

  const { data, loading, error } = useProducts({
    ...filters,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
    page: 1,
    limit: 50
  });

  const products = data?.products || [];
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    return uniqueBrands.sort();
  }, [products]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'cases', label: 'Cases' },
    { value: 'tempered-glass', label: 'Tempered Glass' },
    { value: 'chargers', label: 'Chargers' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'work-essentials', label: 'Work Essentials' }
  ];

  const workEssentialsSubcategories = [
    { value: '', label: 'All Work Essentials' },
    { value: 'laptop-accessories', label: 'Laptop Accessories' },
    { value: 'desk-setup', label: 'Desk Setup' },
    { value: 'cable-management', label: 'Cable Management' },
    { value: 'productivity-tools', label: 'Productivity Tools' }
  ];

  const handleSortChange = (value: string) => {
    switch (value) {
      case 'price-low':
        setSortBy('price');
        setSortOrder('asc');
        break;
      case 'price-high':
        setSortBy('price');
        setSortOrder('desc');
        break;
      case 'rating':
        setSortBy('rating');
        setSortOrder('desc');
        break;
      case 'newest':
        setSortBy('createdAt');
        setSortOrder('desc');
        break;
      case 'name':
      default:
        setSortBy('name');
        setSortOrder('asc');
        break;
    }
  };

  const handleCategoryChange = (category: string, subcategory?: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (category) {
      newSearchParams.set('category', category);
    } else {
      newSearchParams.delete('category');
    }
    
    if (subcategory) {
      newSearchParams.set('subcategory', subcategory);
    } else {
      newSearchParams.delete('subcategory');
    }
    
    // Clear filter when changing category
    newSearchParams.delete('filter');
    
    setSearchParams(newSearchParams);
    setShowCategoryDropdown(false);
  };

  const getPageTitle = () => {
    if (filters.filter === 'new') return 'New Arrivals';
    if (filters.filter === 'gifts') return 'Perfect Gifts';
    if (filters.category === 'work-essentials') {
      if (filters.subcategory) {
        const subcategory = workEssentialsSubcategories.find(s => s.value === filters.subcategory);
        return subcategory ? subcategory.label : 'Work Essentials';
      }
      return 'Work Essentials';
    }
    if (filters.category) {
      const category = categories.find(c => c.value === filters.category);
      return category ? category.label : 'Shop';
    }
    return 'Premium Collection';
  };

  const getPageDescription = () => {
    if (filters.filter === 'new') return 'Discover our latest arrivals and cutting-edge mobile accessories';
    if (filters.filter === 'gifts') return 'Find the perfect gift for tech enthusiasts and mobile lovers';
    if (filters.category === 'work-essentials') return 'Professional accessories to enhance your productivity and workspace';
    if (filters.category) return `Explore our premium ${filters.category.replace('-', ' ')} collection`;
    return 'Discover our curated selection of premium mobile accessories';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {getPageDescription()}
          </p>
        </div>

        {/* Login Prompt - Only show if not authenticated */}
        {!isAuthenticated && (
          <div className="mb-8 md:mb-12">
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-purple-400/30 text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Login to Add Items to Cart & Wishlist
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Create an account or sign in to save your favorite products and add them to your cart for a seamless shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <LogIn className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="group border-2 border-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Dropdown and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 space-y-4 lg:space-y-0 gap-4 md:gap-6">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <span>{categories.find(c => c.value === filters.category)?.label || 'All Categories'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl py-2 z-50">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Work Essentials Subcategory Filter */}
          {filters.category === 'work-essentials' && (
            <div className="flex flex-wrap gap-2">
              {workEssentialsSubcategories.map((subcategory) => (
                <button
                  key={subcategory.value}
                  onClick={() => handleCategoryChange('work-essentials', subcategory.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filters.subcategory === subcategory.value
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {subcategory.label}
                </button>
              ))}
            </div>
          )}

          {/* Search and Controls */}
          <div className="flex items-center space-x-3 md:space-x-4 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md text-white rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 pl-10 md:pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
              />
              <Search className="absolute left-3 md:left-4 top-3 md:top-4 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>
            
            {/* Results Count */}
            <span className="text-gray-400 text-sm whitespace-nowrap">
              {products.length} products
            </span>

            {/* Sort */}
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white/10 backdrop-blur-md text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-1 border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <List className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 mb-4"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Advanced Filters</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              {Object.values(filters).filter(v => v && v !== 0).length}
            </span>
          </button>

          {/* Filters Panel */}
          <div className={`transition-all duration-500 overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Brand Filter */}
                <div>
                  <h4 className="font-semibold mb-3 text-white text-sm">Brand</h4>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({...filters, brand: e.target.value})}
                    className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand} className="bg-gray-800">{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold mb-3 text-white text-sm">Min Price</h4>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                    className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-white text-sm">Max Price</h4>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                    className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-semibold mb-3 text-white text-sm">Min Rating</h4>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                    className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4.5} className="bg-gray-800">4.5+ Stars</option>
                    <option value={4.0} className="bg-gray-800">4.0+ Stars</option>
                    <option value={3.5} className="bg-gray-800">3.5+ Stars</option>
                    <option value={3.0} className="bg-gray-800">3.0+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      subcategory: '',
                      filter: '',
                      brand: '',
                      minPrice: undefined,
                      maxPrice: undefined,
                      rating: 0,
                    });
                    setSearchQuery('');
                    setSearchParams(new URLSearchParams());
                  }}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          {products.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 backdrop-blur-sm border border-white/10">
                <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">No Products Found</h3>
              <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: '',
                    subcategory: '',
                    filter: '',
                    brand: '',
                    minPrice: undefined,
                    maxPrice: undefined,
                    rating: 0,
                  });
                  setSearchParams(new URLSearchParams());
                }}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="transform transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
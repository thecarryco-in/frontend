import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, Search, Star, Loader } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    rating: 0,
  });

  // Update filters when query changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || '',
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
    { value: 'cases', label: 'Cases' },
    { value: 'tempered-glass', label: 'Tempered Glass' },
    { value: 'chargers', label: 'Chargers' },
    { value: 'accessories', label: 'Accessories' }
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
            Premium Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our curated selection of premium mobile accessories
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 space-y-4 lg:space-y-0 gap-4 md:gap-6">
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
          
          <div className="flex items-center space-x-3 md:space-x-4 w-full lg:w-auto">
            {/* Results Count */}
            <span className="text-gray-400 text-sm">
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

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-4 md:space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <h3 className="text-lg md:text-xl font-bold text-white">Filters</h3>
              </div>

              {/* Category Filter */}
              {filters.category === '' && (
                <div className="mb-6 md:mb-8">
                  <h4 className="font-semibold mb-3 md:mb-4 text-white">Category</h4>
                  <div className="space-y-2 md:space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">All Categories</span>
                    </label>
                    {categories.map(category => (
                      <label key={category.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={filters.category === category.value}
                          onChange={(e) => setFilters({...filters, category: e.target.value})}
                          className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 focus:ring-purple-500"
                        />
                        <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              <div className="mb-6 md:mb-8">
                <h4 className="font-semibold mb-3 md:mb-4 text-white">Brand</h4>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand} className="bg-gray-800">{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6 md:mb-8">
                <h4 className="font-semibold mb-3 md:mb-4 text-white">Price Range</h4>
                <div className="space-y-2 md:space-y-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                    className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm md:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                    className="w-full bg-white/10 backdrop-blur-md text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6 md:mb-8">
                <h4 className="font-semibold mb-3 md:mb-4 text-white">Minimum Rating</h4>
                <div className="space-y-2 md:space-y-3">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                        className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 focus:ring-purple-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 md:w-4 md:h-4 ${
                                i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">
                          {rating}+ Stars
                        </span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={filters.rating === 0}
                      onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                      className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    brand: '',
                    minPrice: undefined,
                    maxPrice: undefined,
                    rating: 0,
                  });
                  setSearchQuery('');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm md:text-base"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
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
                      brand: '',
                      minPrice: undefined,
                      maxPrice: undefined,
                      rating: 0,
                    });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-6 lg:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="transform hover:scale-105 transition-all duration-500"
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
    </div>
  );
};

export default Shop;
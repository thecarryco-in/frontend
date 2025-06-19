import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, Search, Star } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { products } from '../data/products';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    priceRange: [0, 200],
    inStock: false,
    rating: 0,
  });

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && product.category !== filters.category) return false;
      
      // Brand filter
      if (filters.brand && product.brand !== filters.brand) return false;
      
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
      
      // Stock filter
      if (filters.inStock && !product.inStock) return false;
      
      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) return false;
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [filters, sortBy, searchQuery]);

  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Premium Collection
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our curated selection of premium mobile accessories
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0 gap-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            />
            <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Results Count */}
            <span className="text-gray-400 text-sm">
              {filteredProducts.length} of {products.length} products
            </span>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <SlidersHorizontal className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Filters</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-white">Category</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors capitalize">
                        {category.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-white">Brand</h4>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand} className="bg-gray-800">{brand}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-white">Minimum Rating</h4>
                <div className="space-y-3">
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
                              className={`w-4 h-4 ${
                                i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">
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
                    <span className="text-gray-300 group-hover:text-white transition-colors">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-8">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                    className="w-4 h-4 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  category: '',
                  brand: '',
                  priceRange: [0, 200],
                  inStock: false,
                  rating: 0,
                })}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">No Products Found</h3>
                <p className="text-gray-400 text-lg mb-8">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      category: '',
                      brand: '',
                      priceRange: [0, 200],
                      inStock: false,
                      rating: 0,
                    });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
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
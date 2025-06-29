import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search, Eye, User, Calendar } from 'lucide-react';
import axios from 'axios';

interface Review {
  _id: string;
  user: string;
  userName: string | { [key: string]: any }; // safer typing
  rating: number;
  comment: string | { [key: string]: any };
  createdAt: string;
}

interface ProductWithReviews {
  _id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

const ProductReviews: React.FC = () => {
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithReviews | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchProductReviews();
  }, []);

  const fetchProductReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/product-reviews', {
        params: {
          search: searchTerm || undefined,
          rating: ratingFilter || undefined,
          category: categoryFilter || undefined,
          limit: 100
        }
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProductReviews();
    }, 1000);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, ratingFilter, categoryFilter]);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Product Reviews
        </h1>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Products with Reviews</p>
          <p className="text-white font-bold text-xl md:text-2xl">{products.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md text-white rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-3 pl-10 md:pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <Search className="absolute left-3 md:left-4 top-3.5 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          <option value="cases">Cases</option>
          <option value="tempered-glass">Tempered Glass</option>
          <option value="chargers">Chargers</option>
          <option value="accessories">Accessories</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-white font-semibold text-base md:text-lg">{product.name}</h3>
                    <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold capitalize bg-purple-500/20 text-purple-400">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-purple-400 text-sm font-medium mb-3">{product.brand}</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`font-bold ${getRatingColor(product.rating)}`}>
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{product.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">No Reviews Found</h3>
          <p className="text-gray-400">No products have reviews matching your current filters.</p>
        </div>
      )}

      {/* Review Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Product Reviews</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-white transition-colors text-xl md:text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                  <p className="text-purple-400 font-medium mb-2">{selectedProduct.brand}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedProduct.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`font-bold text-lg ${getRatingColor(selectedProduct.rating)}`}>
                        {selectedProduct.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-400">({selectedProduct.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Customer Reviews</h3>
              {selectedProduct.reviews.map((review, index) => (
                <div key={review._id || index} className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {typeof review.userName === 'string'
                            ? review.userName
                            : '[Unknown User]'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-yellow-400 text-sm font-bold">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  {typeof review.comment === 'string' && (
                    <div className="bg-white/5 rounded-lg p-3 mt-3">
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  )}
                </div>
              ))}
              {selectedProduct.reviews.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No reviews available for this product.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

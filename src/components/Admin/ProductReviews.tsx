import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search, Eye, User, Calendar, CheckCircle, Package, Truck } from 'lucide-react';
import axios from 'axios';

interface Review {
  _id: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  productDetails: {
    _id: string;
    name: string;
    brand: string;
    category: string;
    image: string;
  };
  orderDetails: {
    _id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
  };
}

const ProductReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('approved');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/reviews', {
        params: {
          search: searchTerm || undefined,
          rating: ratingFilter || undefined,
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
          limit: 100
        }
      });
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchReviews();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, ratingFilter, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Package className="w-4 h-4" />;
      case 'rejected': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/20';
      case 'dispatched': return 'text-blue-400 bg-blue-400/20';
      case 'packed': return 'text-purple-400 bg-purple-400/20';
      case 'confirmed': return 'text-cyan-400 bg-cyan-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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

  if (loading) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Product Reviews
        </h1>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Reviews</p>
          <p className="text-white font-bold text-xl md:text-2xl">{reviews.length}</p>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-3">
          <Eye className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Review Monitoring</h3>
        </div>
        <p className="text-gray-300 leading-relaxed">
          Reviews are automatically approved when customers rate products from delivered orders. 
          This section is for monitoring customer feedback and ensuring quality standards.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search reviews..."
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
          <option value="cases" className="bg-gray-800">Cases</option>
          <option value="tempered-glass" className="bg-gray-800">Tempered Glass</option>
          <option value="chargers" className="bg-gray-800">Chargers</option>
          <option value="accessories" className="bg-gray-800">Accessories</option>
          <option value="work-essentials" className="bg-gray-800">Work Essentials</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Ratings</option>
          <option value="5" className="bg-gray-800">5 Stars</option>
          <option value="4" className="bg-gray-800">4+ Stars</option>
          <option value="3" className="bg-gray-800">3+ Stars</option>
          <option value="2" className="bg-gray-800">2+ Stars</option>
          <option value="1" className="bg-gray-800">1+ Stars</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div 
            key={review._id} 
            className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedReview(review)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <img
                  src={review.productDetails.image}
                  alt={review.productDetails.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-white font-semibold text-base md:text-lg">{review.productDetails.name}</h3>
                    <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold capitalize flex items-center space-x-1 ${getStatusColor(review.status)}`}>
                      {getStatusIcon(review.status)}
                      <span>{review.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-purple-400 text-sm font-medium mb-2">{review.productDetails.brand}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{review.userName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-yellow-400 text-sm font-bold ml-1">{review.rating}/5</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Order: {review.orderDetails.orderNumber}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getOrderStatusColor(review.orderDetails.status)}`}>
                      {review.orderDetails.status}
                    </span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-300 line-clamp-2 text-sm">{review.comment}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReview(review);
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

      {reviews.length === 0 && (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">No Reviews Found</h3>
          <p className="text-gray-400">No reviews match your current filters.</p>
        </div>
      )}

      {/* Review Detail Modal - READ-ONLY */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Review Details (Read-Only)</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-white transition-colors text-xl md:text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Product Information</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedReview.productDetails.image}
                    alt={selectedReview.productDetails.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{selectedReview.productDetails.name}</h4>
                    <p className="text-purple-400 font-medium mb-1">{selectedReview.productDetails.brand}</p>
                    <p className="text-gray-400 text-sm capitalize">{selectedReview.productDetails.category.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Order Number:</span>
                    <span className="text-white font-medium">{selectedReview.orderDetails.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Order Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getOrderStatusColor(selectedReview.orderDetails.status)}`}>
                      {selectedReview.orderDetails.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Order Date:</span>
                    <span className="text-white">{formatDate(selectedReview.orderDetails.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Review Info */}
              <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Review Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Reviewer:</span>
                    <span className="text-white font-medium">{selectedReview.userName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < selectedReview.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-bold">{selectedReview.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Review Date:</span>
                    <span className="text-white">{formatDate(selectedReview.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center space-x-1 ${getStatusColor(selectedReview.status)}`}>
                      {getStatusIcon(selectedReview.status)}
                      <span>{selectedReview.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              {selectedReview.comment && (
                <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Comment</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedReview.comment}</p>
                </div>
              )}

              {/* Admin Notice */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <h4 className="text-white font-semibold">Admin Note</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  This review was automatically approved when the customer rated their delivered order. 
                  Reviews cannot be modified to maintain customer trust and authenticity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
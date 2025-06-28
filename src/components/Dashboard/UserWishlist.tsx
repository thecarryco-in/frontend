import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const UserWishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          My Wishlist
        </h1>
        <div className="text-center py-12 md:py-20">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 backdrop-blur-sm border border-white/10">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg">Save your favorite items for later!</p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          My Wishlist
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">{items.length} items</span>
          <button
            onClick={clearWishlist}
            className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 px-3 py-2 rounded-lg"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((product, index) => {
          // Calculate tax-inclusive prices
          const priceIncludingTax = product.price * 1.18;
          const originalPriceIncludingTax = product.originalPrice ? product.originalPrice * 1.18 : 0;
          
          return (
            <div 
              key={product.id}
              className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all duration-300 border border-red-400/30"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {product.isNewProduct && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm">
                      NEW
                    </span>
                  )}
                  {typeof product.originalPrice === 'number' && product.originalPrice > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Brand & Category */}
                <div className="flex items-center justify-between">
                  <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide">{product.brand}</p>
                  <span className="text-gray-500 text-xs capitalize">{product.category?.replace('-', ' ')}</span>
                </div>
                
                {/* Name */}
                <h3 className="text-white font-bold text-sm md:text-lg leading-tight line-clamp-2">
                  {product.name}
                </h3>

                {/* Price - Now showing tax-inclusive prices */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-white font-bold text-lg md:text-xl">
                      ₹{Math.round(priceIncludingTax)}
                    </span>
                    {originalPriceIncludingTax > 0 && (
                      <span className="text-gray-500 text-sm line-through">
                        ₹{Math.round(originalPriceIncludingTax)}
                      </span>
                    )}
                  </div>
                  
                  {originalPriceIncludingTax > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Save ₹{Math.round(originalPriceIncludingTax - priceIncludingTax)}
                    </div>
                  )}
                </div>

                {/* Tax Inclusive Notice */}
                <div className="text-center">
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Features Preview */}
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-lg">
                        {feature}
                      </span>
                    ))}
                    {product.features.length > 2 && (
                      <span className="text-xs text-purple-400 font-medium">
                        +{product.features.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 md:space-x-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-8 md:mt-16">
        <Link
          to="/shop"
          className="group inline-flex items-center space-x-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md text-white px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default UserWishlist;
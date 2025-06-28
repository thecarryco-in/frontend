import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate tax-inclusive prices
  const priceIncludingTax = product.price * 1.18;
  const originalPriceIncludingTax = product.originalPrice ? product.originalPrice * 1.18 : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: product.id || product._id });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product.id || product._id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({ ...product, id: productId });
    }
  };

  const getTagColor = (color: string) => {
    const colors = {
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-pink-500',
      yellow: 'from-yellow-500 to-orange-500',
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-violet-500',
      pink: 'from-pink-500 to-rose-500'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const productId = product.id || product._id;

  return (
    <div 
      className="relative bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Colored Tags */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.coloredTags?.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className={`bg-gradient-to-r ${getTagColor(tag.color)} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm`}
            >
              {tag.label}
            </span>
          ))}
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
          {product.rating >= 4.5 && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm flex items-center space-x-1">
              <Star className="w-2 h-2 fill-current" />
              <span>TOP</span>
            </span>
          )}
        </div>

        {/* Action Buttons - Only show if authenticated */}
        {isAuthenticated && (
          <div className="absolute top-2 right-2">
            <button
              onClick={handleToggleWishlist}
              className={`w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                isInWishlist(productId)
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-red-500 hover:border-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(productId) ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}

        {/* Fast Charging Badge */}
        {product.category === 'chargers' && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm flex items-center space-x-1">
            <Zap className="w-2 h-2" />
            <span>FAST</span>
          </div>
        )}
      </div>

      {/* Content - Compact design */}
      <div className="p-4 space-y-3">
        {/* Brand & Category */}
        <div className="flex items-center justify-between">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide">{product.brand}</p>
          <span className="text-gray-500 text-xs capitalize">{product.category.replace('-', ' ')}</span>
        </div>
        
        {/* Name */}
        <h3 className="text-white font-bold text-sm leading-tight hover:text-purple-400 transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-xs">
              {product.rating.toFixed(1)} ({product.reviews})
            </span>
          </div>
          <div className={`text-xs font-bold ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
            {product.inStock ? '✓ Stock' : '✗ Out'}
          </div>
        </div>

        {/* Price - Now showing tax-inclusive prices */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg">
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
            {product.features.slice(0, 2).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-lg backdrop-blur-sm"
              >
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

        {/* Action Button - Always show, but different behavior */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default ProductCard;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div 
        className="relative bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {product.isNew && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm">
                NEW
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm">
                SALE
              </span>
            )}
            {product.rating >= 4.5 && (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm flex items-center space-x-1">
                <Star className="w-3 h-3 fill-current" />
                <span>TOP</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={handleLike}
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                isLiked 
                  ? 'bg-red-500 border-red-400 text-white' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-red-500 hover:border-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className={`absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-500 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
          </button>

          {/* Fast Charging Badge */}
          {product.category === 'chargers' && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>FAST</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wide">{product.brand}</p>
            <span className="text-gray-500 text-xs capitalize">{product.category.replace('-', ' ')}</span>
          </div>
          
          {/* Name */}
          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-purple-400 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-between">
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
              <span className="text-gray-400 text-sm font-medium">
                {product.rating} ({product.reviews})
              </span>
            </div>
            
            <div className={`text-sm font-bold ${
              product.inStock ? 'text-green-400' : 'text-red-400'
            }`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold text-2xl">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 text-lg line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {product.originalPrice && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </div>
            )}
          </div>

          {/* Features Preview */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
                  +{product.features.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
      </div>
    </Link>
  );
};

export default ProductCard;
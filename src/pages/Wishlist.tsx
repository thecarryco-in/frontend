import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <Heart className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Wishlist is Empty
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Save your favorite products and never lose track of what you love.
            </p>
            
            <Link
              to="/shop"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">Start Shopping</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-400 mt-2">{items.length} items saved</p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 px-4 py-2 rounded-lg"
          >
            Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((product, index) => {
            // Calculate tax-inclusive prices for wishlist display
            const priceIncludingTax = product.price * 1.18;
            const originalPriceIncludingTax = product.originalPrice ? product.originalPrice * 1.18 : 0;
            
            return (
              <div 
                key={product.id}
                className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all duration-300 border border-red-400/30"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNewProduct && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm">
                        NEW
                      </span>
                    )}
                    {typeof product.originalPrice === 'number' && product.originalPrice > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm">
                        SALE
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between">
                    <p className="text-purple-400 text-sm font-semibold uppercase tracking-wide">{product.brand}</p>
                    <span className="text-gray-500 text-xs capitalize">{product.category?.replace('-', ' ')}</span>
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {product.name}
                  </h3>

                  {/* Price - Now showing tax-inclusive prices */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-bold text-xl">
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

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

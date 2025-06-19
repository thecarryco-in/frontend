import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Your Cart is Empty
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Discover our premium collection of mobile accessories and find the perfect items for your device.
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
        <div className="flex flex-col xl:flex-row gap-12">
          {/* Cart Items */}
          <div className="xl:w-2/3">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-gray-400 mt-2">{itemCount} items in your cart</p>
              </div>
              <button
                onClick={clearCart}
                className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 px-4 py-2 rounded-lg"
              >
                Clear All Items
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => (
                <div 
                  key={item.product.id} 
                  className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="lg:w-32 lg:h-32 w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.product.name}</h3>
                        <p className="text-purple-400 font-semibold text-sm uppercase tracking-wide">{item.product.brand}</p>
                        <p className="text-gray-400 text-sm mt-1">{item.product.category.replace('-', ' ')}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-white">${item.product.price}</span>
                        {item.product.originalPrice && (
                          <span className="text-gray-500 text-lg line-through">${item.product.originalPrice}</span>
                        )}
                      </div>

                      {/* Features */}
                      {item.product.features && (
                        <div className="flex flex-wrap gap-2">
                          {item.product.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start space-y-4">
                      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors duration-200 text-white"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors duration-200 text-white"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-400/30"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Item Subtotal</span>
                    <span className="font-bold text-2xl text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:w-1/3">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 sticky top-8">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Order Summary
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subtotal ({itemCount} items)</span>
                  <span className="text-white font-semibold">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tax (estimated)</span>
                  <span className="text-white font-semibold">${(total * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-white/20 pt-6">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-white">${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">Proceed to Checkout</span>
                </button>
                
                <Link
                  to="/shop"
                  className="w-full border-2 border-white/20 text-white py-5 rounded-2xl font-semibold text-lg hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span>Free Shipping on All Orders</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>Multiple Payment Options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
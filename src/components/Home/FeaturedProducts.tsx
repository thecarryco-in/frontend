import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Loader } from 'lucide-react';
import ProductCard from '../Product/ProductCard';
import { useFeaturedProducts } from '../../hooks/useProducts';

const FeaturedProducts: React.FC = () => {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Trending Now</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Featured
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
              Collection
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Handpicked premium accessories that combine cutting-edge technology with stunning design. 
            Each product is carefully selected for quality, innovation, and style.
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No featured products available at the moment.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Discover More Amazing Products</h3>
            </div>
            
            <p className="text-gray-300 mb-8 text-lg">
              Explore our complete collection of premium mobile accessories
            </p>
            
            <Link
              to="/shop"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">View All Products</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
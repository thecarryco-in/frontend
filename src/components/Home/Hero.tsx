import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Award, Star, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 md:w-72 md:h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 md:w-64 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-ping"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-float-delayed">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-40"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 md:py-20">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              <span>Premium Collection 2025</span>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                Elevate
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
                  Your Mobile
                </span>
                Experience
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                Discover our curated collection of premium mobile accessories designed to protect, enhance, and personalize your device with unmatched style and functionality.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex justify-center lg:justify-start space-x-4 md:space-x-8">
              <div className="flex flex-col items-center space-y-2 md:space-y-3 group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 md:w-8 md:h-8 text-purple-400" />
                </div>
                <span className="text-xs md:text-sm text-gray-300 font-medium">Military Grade</span>
              </div>
              <div className="flex flex-col items-center space-y-2 md:space-y-3 group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 md:w-8 md:h-8 text-cyan-400" />
                </div>
                <span className="text-xs md:text-sm text-gray-300 font-medium">Fast Wireless</span>
              </div>
              <div className="flex flex-col items-center space-y-2 md:space-y-3 group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm border border-pink-400/30 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-5 h-5 md:w-8 md:h-8 text-pink-400" />
                </div>
                <span className="text-xs md:text-sm text-gray-300 font-medium">Award Winning</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 flex items-center justify-center space-x-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Explore Collection</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/about"
                className="group border-2 border-white/20 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-lg hover:border-white/40 hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 md:space-x-6 pt-6 md:pt-8">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1 md:-space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white/20"></div>
                  ))}
                </div>
                <span className="text-xs md:text-sm text-gray-300">50K+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-xs md:text-sm text-gray-300 ml-1 md:ml-2">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
            <div className="relative">
              {/* Main Product Display */}
              <div className="relative z-20 transform hover:scale-105 transition-transform duration-700">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Premium iPhone Case"
                    className="w-full max-w-sm md:max-w-lg mx-auto rounded-2xl md:rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl md:rounded-3xl"></div>
                </div>
              </div>

              {/* Floating Product Cards */}
              <div className="absolute top-8 md:top-16 -left-4 md:-left-8 lg:left-4 transform rotate-12 hover:rotate-6 transition-transform duration-500 z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <img
                    src="https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Wireless Earbuds"
                    className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl mb-2 md:mb-3 object-cover"
                  />
                  <p className="text-white font-semibold text-xs md:text-sm">AirPods Pro</p>
                  <p className="text-purple-300 text-xs font-medium">₹24,999</p>
                </div>
              </div>

              <div className="absolute bottom-12 md:bottom-20 -right-4 md:-right-8 lg:right-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-500 z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <img
                    src="https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Charging Station"
                    className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl mb-2 md:mb-3 object-cover"
                  />
                  <p className="text-white font-semibold text-xs md:text-sm">Charging Hub</p>
                  <p className="text-cyan-300 text-xs font-medium">₹8,999</p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 md:-right-16 lg:-right-8 transform rotate-6 hover:rotate-3 transition-transform duration-500 z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <img
                    src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Phone Stand"
                    className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl mb-2 md:mb-3 object-cover"
                  />
                  <p className="text-white font-semibold text-xs md:text-sm">Smart Stand</p>
                  <p className="text-pink-300 text-xs font-medium">₹3,999</p>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl scale-150 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-2 md:h-3 bg-white/60 rounded-full mt-1.5 md:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
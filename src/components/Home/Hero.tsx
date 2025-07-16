import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Award, Star, Sparkles } from 'lucide-react';
import videoBackground from '../../assets/video.webm';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoBackground} type="video/webm" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 bg-gradient-to-br from-slate-900/60 via-purple-900/60 to-slate-900/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 md:py-20">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Badge */}

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

          {/* Right Content - Empty for clean design */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
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

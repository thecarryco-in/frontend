import React from 'react';
import { Link } from 'react-router-dom';
import videoBackground from '../../assets/video.webm';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover min-h-screen"
        preload="auto"
      >
        <source src={videoBackground} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay Content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center font-sans px-4 w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg">Elevate Your Mobile Experience</h1>
        <p className="text-lg md:text-2xl mb-6 drop-shadow">Premium accessories for the bold generation</p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white rounded-lg font-bold text-lg shadow-lg"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
};

export default Hero;

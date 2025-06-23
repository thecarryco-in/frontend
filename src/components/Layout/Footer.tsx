import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Smartphone, Heart } from 'lucide-react';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur opacity-50"></div>
              </div>
              <div>
                <span className="text-white font-bold text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  The CarryCo
                </span>
                <div className="text-xs text-gray-400 font-medium">Premium Accessories</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevating your mobile experience with premium accessories that combine cutting-edge technology, 
              exceptional quality plus stunning design. Your device deserves the best.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-500 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home',           path: '/' },
                { label: 'Shop',           path: '/shop' },
                { label: 'About Us',       path: '/about' },
                { label: 'Contact',        path: '/contact' },
                { label: 'Privacy Policy',  path: '/privacy' },
                { label: 'Refund Policy',   path: '/refund' },
                { label: 'Shipping Info',   path: '/shipping' },
                { label: 'Terms of Service',path: '/service' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                'Premium Cases', 
                'Tempered Glass', 
                'Wireless Chargers', 
                'Cables & Adapters', 
                'Phone Stands', 
                'Car Accessories',
                'Audio Accessories',
                'Screen Protectors'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/shop?category=${item.toLowerCase().replace(' ', '-')}`}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-purple-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">+91 82871 63950</p>
                  <p className="text-gray-400 text-xs">Mon-Fri 9AM-6PM IST</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-cyan-400 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium break-all">
                    thecarryco.in@gmail.com
                  </p>
                </div>
              </div>
   
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-pink-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">A-83 Brij Vihar</p>
                  <p className="text-gray-400 text-xs">Ghaziabad, Uttar Pradesh</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                />
                <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© 2025 The CarryCo.</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link to="/privacy" onClick={scrollToTop} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" onClick={scrollToTop} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" onClick={scrollToTop} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center space-x-2 text-gray-400 text-xs">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xs">🛡️</span>
              </div>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-xs">⭐</span>
              </div>
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

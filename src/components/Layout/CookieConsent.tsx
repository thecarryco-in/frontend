import React, { useState, useEffect } from 'react';
import { Cookie, X, Shield, Eye, Settings } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }));
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary-only');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }));
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
          {/* Main Banner */}
          <div className="p-6 md:p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-purple-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">We use cookies to enhance your experience</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                  We use cookies and similar technologies to provide you with a personalized experience, 
                  analyze website traffic, and improve our services. By clicking "Accept All", you consent 
                  to our use of cookies as described in our{' '}
                  <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    Privacy Policy
                  </a>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Accept All Cookies</span>
                  </button>
                  
                  <button
                    onClick={handleAcceptNecessary}
                    className="border-2 border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    Necessary Only
                  </button>
                  
                  <button
                    onClick={handleCustomize}
                    className="text-purple-400 hover:text-purple-300 px-6 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Detailed Settings */}
          {showDetails && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h4 className="text-lg font-bold text-white mb-6">Cookie Preferences</h4>
              
              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <h5 className="font-semibold text-white">Necessary Cookies</h5>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold">
                        Always Active
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Essential for the website to function properly. These cookies enable basic features 
                      like page navigation, access to secure areas, and authentication.
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Settings className="w-5 h-5 text-blue-400" />
                      <h5 className="font-semibold text-white">Functional Cookies</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Enable enhanced functionality and personalization, such as remembering your preferences 
                      and settings for a better user experience.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Eye className="w-5 h-5 text-purple-400" />
                      <h5 className="font-semibold text-white">Analytics Cookies</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Help us understand how visitors interact with our website by collecting and 
                      reporting information anonymously to improve our services.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Cookie className="w-5 h-5 text-orange-400" />
                      <h5 className="font-semibold text-white">Marketing Cookies</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Used to track visitors across websites to display relevant advertisements 
                      and measure the effectiveness of marketing campaigns.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="border-2 border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Accept Necessary Only
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
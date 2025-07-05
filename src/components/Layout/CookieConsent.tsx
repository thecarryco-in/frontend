import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

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
    localStorage.setItem(
      'cookiePreferences',
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      })
    );
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary-only');
    localStorage.setItem(
      'cookiePreferences',
      JSON.stringify({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      })
    );
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
          <div className="p-6 md:p-8 flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-purple-400" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3">We use cookies to enhance your experience</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                We use cookies and similar technologies to provide you with a personalized experience, analyze website traffic, and improve our services. By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </a>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Accept All Cookies
                </button>

                <button
                  onClick={handleAcceptNecessary}
                  className="border-2 border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Necessary Only
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
      </div>
    </div>
  );
};

export default CookieConsent;

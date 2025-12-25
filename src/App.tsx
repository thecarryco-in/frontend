import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import CookieConsent from './components/Layout/CookieConsent';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/CancellationRefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsOfService from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyOTP from './components/Auth/VerifyOTP';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component to conditionally render Header and Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const authPages = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];
  const hideHeaderFooter = authPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-black text-white">
      {!hideHeaderFooter && <Header />}
      <main>
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <CookieConsent />}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </div>
  );
};

function App() {
  const [serverAwake, setServerAwake] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(() => setServerAwake(true))
      .catch(() => setServerAwake(true));
  }, []);

  if (!serverAwake) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white text-lg">Please Wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }} />
  );
}

export default App;

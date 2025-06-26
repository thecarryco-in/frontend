import React, { useState } from 'react';
import { Mail, Undo2, Phone, MapPin, Send, MessageCircle, User, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    queryType: 'general',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const queryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'support', label: 'Customer Support', icon: User },
    { value: 'product', label: 'Product Question', icon: Phone },
    { value: 'order', label: 'Order Issue', icon: CheckCircle },
    { value: 'refund', label: 'Refund', icon: Undo2 },
    { value: 'other', label: 'Other', icon: MessageCircle }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/contact/submit', formData);
      setSuccess('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        queryType: 'general',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have a question about our products or need support? We're here to help! 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-purple-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-gray-400">+91 82871 63950</p>
                    <p className="text-gray-500 text-sm">Mon-Fri 9AM-6PM IST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-cyan-400 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400 break-all">
                      thecarryco.in@gmail.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center group-hover:bg-pink-500 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-pink-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Address</p>
                    <p className="text-gray-400">Anand Vihar</p>
                    <p className="text-gray-400">Ghaziabad, Uttar Pradesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <Clock className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-bold text-white">Response Time</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">General Inquiries</span>
                  <span className="text-white font-semibold">24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Support Issues</span>
                  <span className="text-white font-semibold">12 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Order Problems</span>
                  <span className="text-green-400 font-semibold">4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Urgent Issues</span>
                  <span className="text-red-400 font-semibold">1 hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Send us a Message
              </h2>

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <p className="text-green-400 font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Query Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-4 text-gray-300">What can we help you with?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {queryTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${
                            formData.queryType === type.value
                              ? 'border-purple-400 bg-purple-500/20'
                              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="radio"
                            name="queryType"
                            value={type.value}
                            checked={formData.queryType === type.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${
                              formData.queryType === type.value ? 'text-purple-400' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              formData.queryType === type.value ? 'text-white' : 'text-gray-400'
                            }`}>
                              {type.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      minLength={2}
                      maxLength={50}
                      required
                      className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={50}
                      required
                      className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      minLength={10}
                      maxLength={10}
                      className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      maxLength={50}
                      required
                      className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={1000}
                    required
                    rows={6}
                    className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

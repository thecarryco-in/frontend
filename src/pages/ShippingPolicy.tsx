import React from 'react';
import { Truck, MapPin, Clock, Package, Shield, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const ShippingPolicy: React.FC = () => {
const deliveryZones = [
  {
    zone: 'Delhi NCR',
    cities: 'Delhi, Gurugram, Noida, Ghaziabad, Faridabad',
    timeframe: '1–3 business days',
    icon: '🏙️' // Fastest due to proximity
  },
  {
    zone: 'Nearby Major Cities',
    cities: 'Jaipur, Chandigarh, Lucknow, Dehradun, Agra',
    timeframe: '3–6 business days',
    icon: '🚗' // Short-range cities
  },
  {
    zone: 'Other Metro Cities',
    cities: 'Mumbai, Pune, Bangalore, Hyderabad, Ahmedabad, Kolkata',
    timeframe: '5–9 business days',
    icon: '✈️' // Long-range, faster logistics
  },
  {
    zone: 'Rest of India',
    cities: 'Indore, Patna, Bhopal, Nagpur, Coimbatore, and others',
    timeframe: '7–14 business days',
    icon: '📦' // Longer-distance, standard logistics
  }
];

  const shippingSteps = [
    {
      step: 1,
      title: 'Order Confirmation',
      description: 'Order is confirmed and payment is verified',
      timeframe: 'Within 2 hours',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: 2,
      title: 'Processing',
      description: 'Items are picked, packed, and prepared for shipment',
      timeframe: '1-2 business days',
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 3,
      title: 'Dispatch',
      description: 'Package is handed over to logistics partner',
      timeframe: '2-3 business days',
      icon: Truck,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 4,
      title: 'In Transit',
      description: 'Package is on its way to your delivery address',
      timeframe: 'Varies by location',
      icon: MapPin,
      color: 'from-orange-500 to-red-500'
    },
    {
      step: 5,
      title: 'Delivered',
      description: 'Package is delivered to your doorstep',
      timeframe: '0-14 business days',
      icon: Shield,
      color: 'from-teal-500 to-green-500'
    }
  ];

  const shippingCharges = [
    {
      orderValue: 'Below ₹399',
      charge: '₹70',
      description: 'Standard shipping charges apply'
    },
    {
      orderValue: '₹399 & Above',
      charge: 'FREE',
      description: 'Complimentary shipping on all orders'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Shipping Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We deliver your electronics safely and efficiently across India. Here's everything you need to know 
              about our shipping process, timelines, and policies.
            </p>
            <div className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold">India-wide Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pan-India</h3>
              <p className="text-gray-300 text-sm">Delivery across all states and union territories</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">0-14 Days</h3>
              <p className="text-gray-300 text-sm">Maximum delivery timeframe</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
              <p className="text-gray-300 text-sm">Safe and insured packaging</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tracking</h3>
              <p className="text-gray-300 text-sm">Live order status</p>
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Delivery Zones & Timeframes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deliveryZones.map((zone, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{zone.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{zone.zone}</h3>
                      <p className="text-blue-400 font-semibold">{zone.timeframe}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{zone.cities}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Important Note</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Delivery timeframes are estimates and may vary due to factors such as product availability, weather conditions, 
                local holidays, or unforeseen circumstances. We strive to deliver within the specified timeframe but cannot guarantee exact delivery dates.
              </p>
            </div>
          </div>

          {/* Shipping Process */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Shipping Process</h2>
            <div className="space-y-6">
              {shippingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">Step {step.step}: {step.title}</h3>
                      <span className="text-sm font-semibold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                        {step.timeframe}
                      </span>
                    </div>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Shipping Charges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {shippingCharges.map((charge, index) => (
                <div key={index} className={`rounded-2xl p-8 border text-center ${index === 1 ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <h3 className="text-xl font-bold text-white mb-4">{charge.orderValue}</h3>
                  <div className={`text-4xl font-bold mb-4 ${index === 1 ? 'text-green-400' : 'text-blue-400'}`}>
                    {charge.charge}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{charge.description}</p>
                  {index === 1 && (
                    <div className="mt-4 inline-flex items-center space-x-1 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>BEST VALUE</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          {/* Important Terms */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Shipping Terms & Conditions</h2>
                <p className="text-gray-400">Important information about our shipping policies</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">Delivery Address</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Ensure your delivery address is complete and accurate. We are not responsible for delays or non-delivery 
                    due to incorrect or incomplete addresses.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">Packaging</h3>
                  <p className="text-gray-300 leading-relaxed">
                    All electronics are carefully packaged with appropriate protective materials to prevent damage during transit. 
                    Fragile items receive extra cushioning and handling.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">Tracking Information</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Stay updated with real-time order progress on your dashboard. We'll notify you by email about delivery.
                    </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">Delivery Attempts</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our delivery partners will make up to 2 delivery attempts. If unsuccessful, the package will be returned 
                    to our warehouse and you will be contacted for re-delivery arrangements.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">Inspection on Delivery</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Please inspect your package upon delivery. Report any visible damage or missing items immediately 
                    to our customer service team.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">Force Majeure</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We are not liable for delays caused by natural disasters, strikes, government actions, 
                    or other circumstances beyond our control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-blue-900/30 to-teal-900/30 backdrop-blur-md rounded-3xl p-8 border border-blue-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Shipping Questions?</h2>
              <p className="text-gray-300 mb-6">
                Need help with your shipment or have questions about our shipping policy? 
                Our customer service team is here to assist you.
              </p>
              <Link to="/contact" onClick={scrollToTop}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <Truck className="w-5 h-5" />
                  <span>Contact Customer Support</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Shipping Compliance</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Our shipping practices comply with Indian postal and courier regulations, consumer protection laws, 
              and e-commerce guidelines. We work only with licensed and authorized logistics partners to ensure 
              safe and legal transportation of your electronics purchases across India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

import React from 'react';
import { RotateCcw, Clock, CreditCard, AlertTriangle, CheckCircle, XCircle, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const CancellationRefundPolicy: React.FC = () => {
  const timelineSteps = [
    {
      time: 'Same Day',
      title: 'Cancellation Window',
      description: 'Orders can only be cancelled on the same day of purchase',
      icon: Clock,
      color: 'from-green-500 to-emerald-500'
    },
    {
      time: '24 Hours',
      title: 'Processing Review',
      description: 'Cancellation requests are reviewed within 24 hours',
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      time: '2-3 Days',
      title: 'Refund Initiation',
      description: 'Approved refunds are initiated to original payment method',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500'
    },
    {
      time: '7-14 Days',
      title: 'Refund Completion',
      description: 'Refund reflects in your account within 2 weeks',
      icon: RotateCcw,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const eligibilityCriteria = [
    {
      title: 'Same Day Cancellation',
      description: 'Orders must be cancelled on the same day of purchase before 11:59 PM IST',
      icon: Calendar,
      allowed: true
    },
    {
      title: 'Order Not Shipped',
      description: 'Cancellation is only possible if the order has not been dispatched',
      icon: CheckCircle,
      allowed: true
    },
    {
      title: 'Payment Completed',
      description: 'Only orders with completed payment transactions are eligible for refund',
      icon: CreditCard,
      allowed: true
    },
    {
      title: 'Next Day Cancellation',
      description: 'Orders cannot be cancelled after the purchase date',
      icon: XCircle,
      allowed: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We understand that sometimes you may need to cancel your order. Here's our clear and transparent 
              policy for cancellations and refunds on our electronics e-commerce platform.
            </p>
            <div className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-semibold">Same Day Cancellation Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Key Policy Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Same Day Only</h3>
              <p className="text-gray-300">Cancellations are only accepted on the same day of purchase before midnight IST.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Contact Required</h3>
              <p className="text-gray-300">All cancellation requests must be submitted through our contact page.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2 Week Refund</h3>
              <p className="text-gray-300">Approved refunds are processed within 2 weeks to your original payment method.</p>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Refund Process Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="text-sm font-semibold text-gray-400 mb-2">{step.time}</div>
                      <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 transform translate-x-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Cancellation Eligibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eligibilityCriteria.map((criteria, index) => (
                <div key={index} className={`p-6 rounded-2xl border ${criteria.allowed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${criteria.allowed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      <criteria.icon className={`w-6 h-6 ${criteria.allowed ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{criteria.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${criteria.allowed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {criteria.allowed ? 'ALLOWED' : 'NOT ALLOWED'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{criteria.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Terms */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Important Terms & Conditions</h2>
                <p className="text-gray-400">Please read these carefully before requesting a cancellation</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">Cancellation Window</h3>
                <p className="text-gray-300 leading-relaxed">
                  Orders can only be cancelled on the same day of purchase. The cancellation window closes at 11:59 PM IST on the purchase date. 
                  After this time, orders cannot be cancelled and will proceed to fulfillment.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">Contact Requirement</h3>
                <p className="text-gray-300 leading-relaxed">
                  All cancellation requests must be submitted through our official contact page. Phone calls, emails to personal addresses, 
                  or social media messages will not be considered valid cancellation requests.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">Refund Processing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Approved refunds will be processed to the original payment method within 2 weeks. The exact time may vary depending on your bank 
                  or payment provider. We do not provide refunds to different payment methods or accounts.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">Shipped Orders</h3>
                <p className="text-gray-300 leading-relaxed">
                  Once an order has been dispatched from our warehouse, it cannot be cancelled. Please check your order status before requesting cancellation. 
                  Shipped orders may be eligible for return as per our return policy.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">Partial Cancellations</h3>
                <p className="text-gray-300 leading-relaxed">
                  For orders containing multiple items, partial cancellations may be possible if the remaining items meet the minimum order value. 
                  Contact us through the contact page to discuss partial cancellation options.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md rounded-3xl p-8 border border-orange-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Need to Cancel Your Order?</h2>
              <p className="text-gray-300 mb-6">
                Remember, you can only cancel orders on the same day of purchase. Use our contact page to submit your cancellation request 
                with your order number and reason for cancellation.
              </p>
              <Link to="/contact" onClick={scrollToTop}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <Phone className="w-5 h-5" />
                  <span>Submit Cancellation Request</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Consumer Rights</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              This Cancellation and Refund Policy complies with the Consumer Protection Act, 2019, and other applicable Indian consumer protection laws. 
              Your rights as a consumer are protected, and this policy is designed to provide fair and transparent cancellation and refund procedures 
              while maintaining operational efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;
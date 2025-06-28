import React from 'react';
import { Shield, Eye, Database, Lock, Users, Globe, Cookie, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal Information: Name, email address, phone number, shipping address, and billing information.',
        'Account Information: Username, password, and account preferences.',
        'Transaction Information: Purchase history, payment details, and order information.',
        'Communication Data: Customer service interactions, feedback, and correspondence.'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'Process and fulfill your orders and transactions.',
        'Provide customer support and respond to your inquiries.',
        'Send order confirmations, shipping updates, and important account notifications.',
        'Improve our products, services, and website functionality.',
        'Prevent fraud and ensure platform security.',
        'Comply with legal obligations and regulatory requirements.',
        'Send promotional communications (with your consent).'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Users,
      content: [
        'Service Providers: We share information with trusted third-party service providers who assist in our operations.',
        'Payment Processors: Payment information is shared with secure payment gateways for transaction processing.',
        'Shipping Partners: Delivery information is shared with logistics partners for order fulfillment.',
        'Legal Requirements: We may disclose information when required by law or to protect our rights.',
        'Business Transfers: Information may be transferred in case of merger, acquisition, or sale of business assets.',
        <strong>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</strong>
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security Measures',
      icon: Lock,
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All sensitive data is encrypted during transmission using SSL/TLS protocols.',
        'All payment transactions are securely processed via Razorpay, a PCI DSS Level 1 compliant gateway.',
        'Access to personal information is restricted to authorized personnel only.',
        'Regular security audits and vulnerability assessments are conducted.',
        'We maintain backup systems and disaster recovery procedures.'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: Cookie,
      content: [
        'We use cookies to enhance your browsing experience and website functionality.',
        'Essential cookies are necessary for basic website operations and cannot be disabled.',
        'Preference cookies remember your settings and personalize your experience.',
        'You can manage cookie preferences through your browser settings.',
        'Disabling certain cookies may affect website functionality.'
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      icon: Shield,
      content: [
        'Access: You can request access to your personal information we hold.',
        'Correction: You can update or correct your personal information through your account.',
        'Deletion: You can request deletion of your personal information, subject to legal requirements.',
        'Portability: You can request a copy of your data in a structured, machine-readable format.',
        'Opt-out: You can unsubscribe from marketing communications at any time.',
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Database,
      content: [
        'We retain personal information only as long as necessary for the purposes outlined in this policy.',
        'Account information is retained while your account is active and for a reasonable period after deactivation.',
        'Transaction records are retained for accounting and legal compliance purposes.',
        'Marketing communications data is retained until you opt-out or as required by law.',
        'Technical logs and analytics data are typically retained for 12-24 months.',
        'We securely delete or anonymize data when it is no longer needed.'
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Globe,
      content: [
        'Your personal information is primarily processed and stored within India.',
        'Some service providers may be located outside India, in which case appropriate safeguards are implemented.',
        'We ensure adequate protection for international data transfers through contractual agreements.',
        'Data transfers comply with applicable Indian data protection laws and regulations.',
        <strong>We do not transfer personal information to countries without adequate data protection laws.</strong>
      ]

    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your privacy is our priority. This policy explains how we collect, use, and protect your personal information 
              in compliance with Indian data protection laws including the IT Act 2000.
            </p>
            <div className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Lock className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold">IT Act 2000 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Last Updated */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Policy Information</h2>
                <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy is effective immediately and applies to all users of our electronics e-commerce platform. 
              We may update this policy periodically, and we will notify you of any significant changes.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-semibold text-sm">Section {index + 1}</span>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-500/30">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-3xl p-8 border border-blue-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy Concerns?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about this Privacy Policy or how we handle your personal information, 
                please don't hesitate to contact us.
              </p>
              <Link to="/contact" onClick={scrollToTop}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <Shield className="w-5 h-5" />
                  <span>Contact Privacy Team</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Legal Compliance</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy complies with the Information Technology Act, 2000, Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and other applicable Indian privacy laws. We are committed to protecting your privacy rights and maintaining the highest standards of data security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
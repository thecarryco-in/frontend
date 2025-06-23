import React from 'react';
import { Shield, Users, ShoppingCart, CreditCard, Truck, AlertTriangle, Scale, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const TermsAndConditions: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: [
        'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
        'These Terms and Conditions constitute a legally binding agreement between you and our company.',
        'If you do not agree to abide by the above, please do not use this service.'
      ]
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: Scale,
      content: [
        '"Company" refers to our electronics e-commerce platform operating under Indian jurisdiction.',
        '"User" refers to any individual who accesses or uses our website and services.',
        '"Products" refers to electronic items, accessories, and related merchandise sold on our platform.',
        '"Services" refers to all services provided through our website including but not limited to product sales, customer support, and delivery.'
      ]
    },
    {
      id: 'eligibility',
      title: 'User Eligibility',
      icon: Users,
      content: [
        'You must be at least 18 years of age to use our services or have parental/guardian consent.',
        'You must be a resident of India to place orders on our platform.',
        'You must provide accurate, current, and complete information during registration.',
        'You are responsible for maintaining the confidentiality of your account credentials.'
      ]
    },
    {
      id: 'products',
      title: 'Product Information',
      icon: ShoppingCart,
      content: [
        'All product descriptions, specifications, and images are provided for informational purposes.',
        'We strive to ensure accuracy but do not warrant that product descriptions are error-free.',
        'Colors of products may vary slightly due to monitor settings and photography conditions.',
        'Product availability is subject to change without notice.',
        'Prices are subject to change without prior notification.'
      ]
    },
    {
      id: 'orders',
      title: 'Order Processing',
      icon: CreditCard,
      content: [
        'All orders are subject to acceptance and availability.',
        'We reserve the right to refuse or cancel any order at our discretion.',
        'Payment must be completed before order processing begins.',
        'Order confirmation will be sent via email upon successful payment.',
        'Bulk orders may require additional verification and processing time.'
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      icon: Truck,
      content: [
        'We deliver only within India through our authorized logistics partners.',
        'Delivery timeframe is 0-14 business days from order confirmation.',
        'Shipping charges are calculated based on product weight, dimensions, and delivery location.',
        'Risk of loss and title for products pass to you upon delivery to the carrier.',
        'We are not responsible for delays caused by natural disasters, strikes, or other force majeure events.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: Shield,
      content: [
        'Your privacy is important to us. Please review our Privacy Policy for detailed information.',
        'We collect and process personal data in accordance with the Information Technology Act, 2000.',
        'We use cookies and similar technologies to enhance user experience.',
        'Your personal information will not be shared with third parties without consent, except as required by law.',
        'You have the right to access, modify, or delete your personal information.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: [
        'Our liability is limited to the maximum extent permitted by Indian law.',
        'We are not liable for any indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount paid by you for the specific product or service.',
        'We do not warrant uninterrupted or error-free service.',
        'Users are responsible for ensuring compatibility of purchased products with their systems.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our electronics e-commerce platform. 
              These terms govern your use of our services and constitute a binding legal agreement.
            </p>
            <div className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Scale className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">Governed by Indian Law</span>
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
                <AlertTriangle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Important Notice</h2>
                <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              These Terms and Conditions are effective immediately upon posting. We reserve the right to modify these terms at any time. 
              Continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold text-sm">Section {index + 1}</span>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-300 leading-relaxed pl-4 border-l-2 border-purple-500/30">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-md rounded-3xl p-8 border border-purple-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms and Conditions, please contact us through our contact page.
              </p>
              <Link to="/contact" onClick={scrollToTop}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <FileText className="w-5 h-5" />
                  <span>Contact Support</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Legal Compliance</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              These Terms and Conditions are governed by and construed in accordance with the laws of India, 
              including the Information Technology Act, 2000, Consumer Protection Act, 2019, and other applicable Indian laws. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Indian courts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
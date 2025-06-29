import React from 'react';
import { AlertTriangle, Shield, ExternalLink, Scale, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Disclaimer: React.FC = () => {
  const sections = [
    {
      id: 'general',
      title: 'General Disclaimer',
      icon: Info,
      content: [
        'The information provided on this website is for general informational purposes only. We strive to keep content accurate and up to date, but we make no representations or warranties about completeness, accuracy, reliability, or availability. Your use of this website is at your own risk.'
      ]
    },
    {
      id: 'products',
      title: 'Product & Service Limitations',
      icon: Shield,
      content: [
        'Product descriptions, specifications, and visuals are for reference. Slight variations may occur. We are not liable for any loss or damage due to misinterpretation of product details or misuse of purchased items.'
      ]
    },
    {
      id: 'external-links',
      title: 'External Links',
      icon: ExternalLink,
      content: [
        'This website may contain links to external sites. We have no control over the nature, content, and availability of those sites. Inclusion of links does not imply endorsement.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: [
        'In no event shall we be liable for any direct, indirect, incidental, or consequential damages arising out of your use of the website or products purchased. Maximum liability is limited to the amount paid by you for the specific product.'
      ]
    },
    {
      id: 'legal',
      title: 'Legal Notice',
      icon: Scale,
      content: [
        'This Disclaimer is governed by Indian law including the Information Technology Act, 2000 and the Consumer Protection Act, 2019. We reserve the right to update this Disclaimer without notice.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-4">
              Website Disclaimer
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Important information about the use of our website and services. Please read this disclaimer 
              carefully before using our electronics e-commerce platform.
            </p>
            <div className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Scale className="w-5 h-5 text-green-400" />
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Disclaimer Information</h2>
                <p className="text-gray-400">Last Updated: June 29, 2025</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              This disclaimer is effective immediately and applies to all users of our electronics e-commerce platform. 
              We may update this disclaimer periodically to reflect changes in our practices or applicable laws.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <span className="text-green-400 font-semibold text-sm">Section {index + 1}</span>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-300 leading-relaxed pl-4 border-l-2 border-green-500/30">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 backdrop-blur-md rounded-3xl p-8 border border-green-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Questions About This Disclaimer?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about this disclaimer or need clarification on any points, 
                please don't hesitate to contact us.
              </p>
              <Link to="/contact" onClick={scrollToTop}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Contact Support</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Legal Framework</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              This Website Disclaimer complies with the Information Technology Act, 2000, Consumer Protection Act, 2019, 
              and other applicable Indian laws. This disclaimer is designed to limit our liability while ensuring 
              transparency about the nature and limitations of our services and website content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;

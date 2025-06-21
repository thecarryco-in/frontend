import React from 'react';
import { Shield, Zap, Award, Users, Globe, Heart, Star, CheckCircle, Truck, CreditCard } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '50,000+', color: 'from-blue-500 to-cyan-500' },
    { icon: Globe, label: 'Countries Served', value: '25+', color: 'from-green-500 to-emerald-500' },
    { icon: Award, label: 'Awards Won', value: '15+', color: 'from-yellow-500 to-orange-500' },
    { icon: Star, label: 'Average Rating', value: '4.9/5', color: 'from-purple-500 to-pink-500' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Protection',
      description: 'Our cases undergo rigorous testing to meet military drop-test standards, ensuring your device stays safe.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Fast Wireless Charging',
      description: 'Experience lightning-fast 15W wireless charging with our MagSafe-compatible accessories.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Award,
      title: 'Premium Materials',
      description: 'We use only the finest materials including genuine leather, titanium, and diamond-infused glass.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'Every product is designed with our customers in mind, focusing on both functionality and aesthetics.',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const values = [
    {
      icon: CheckCircle,
      title: 'Quality First',
      description: 'We never compromise on quality. Every product goes through extensive testing before reaching you.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free worldwide shipping with tracking. Most orders arrive within 2-5 business days.'
    },
    {
      icon: CreditCard,
      title: 'Secure Shopping',
      description: 'Your data is protected with bank-level encryption and secure payment processing.'
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: '24/7 customer support and lifetime warranty on all premium products.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Our Story</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              Elevating
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
                Mobile Experiences
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              At The CarryCo, we believe your mobile device deserves the finest accessories. 
              Since 2020, we've been crafting premium cases, chargers, and accessories that 
              combine cutting-edge technology with stunning design.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="text-center group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color}/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                      <Icon className={`w-8 h-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  We're on a mission to transform how you interact with your mobile device. 
                  Every product we create is designed to enhance your daily experience while 
                  providing uncompromising protection and style.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  From our headquarters in Silicon Valley, we work with the world's best 
                  designers and engineers to bring you accessories that don't just protect 
                  your device—they elevate it.
                </p>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-2"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.color}/20 rounded-2xl flex items-center justify-center mb-6`}>
                          <Icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Why Choose The CarryCo?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're not just another accessory brand. We're your partner in creating 
              the perfect mobile experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-500 hover:-translate-y-2 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Passionate innovators dedicated to creating the perfect mobile accessories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                name: 'Sarah Chen',
                role: 'Chief Design Officer',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
                bio: 'Former Apple designer with 10+ years creating beautiful, functional products.'
              },
              {
                name: 'Marcus Rodriguez',
                role: 'Head of Engineering',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
                bio: 'MIT graduate specializing in materials science and wireless technology.'
              },
              {
                name: 'Emily Watson',
                role: 'Customer Experience Lead',
                image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
                bio: 'Ensuring every customer interaction exceeds expectations and builds loyalty.'
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mb-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-purple-400/30 group-hover:border-purple-400 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-purple-400 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Elevate Your Mobile Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of satisfied customers who trust The CarryCo for their mobile accessory needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/shop"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Shop Now</span>
                <Star className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </a>
              
              <a
                href="/contact"
                className="group border-2 border-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
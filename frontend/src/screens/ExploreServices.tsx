import React from 'react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  CloudIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  TruckIcon,
  ChartBarIcon,
  SparklesIcon,
  PhoneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar.tsx';

const services = [
  {
    title: 'Smart Crop Advisory',
    icon: SparklesIcon,
    description: 'AI-powered recommendations for optimal crop selection, planting schedules, and yield optimization based on your specific conditions.',
    gradient: 'from-green-400 to-emerald-600',
    color: 'text-green-600'
  },
  {
    title: 'Soil Health Monitoring',
    icon: BeakerIcon,
    description: 'Comprehensive soil analysis with real-time monitoring, nutrient recommendations, and precision agriculture insights.',
    gradient: 'from-amber-400 to-orange-600',
    color: 'text-amber-600'
  },
  {
    title: 'Weather & Irrigation Insights',
    icon: CloudIcon,
    description: 'Advanced weather forecasting, smart irrigation scheduling, and climate-adaptive farming strategies.',
    gradient: 'from-blue-400 to-indigo-600',
    color: 'text-blue-600'
  },
  {
    title: 'Market Intelligence',
    icon: ChartBarIcon,
    description: 'Real-time market prices, demand forecasting, and direct connections to premium buyers for maximum profits.',
    gradient: 'from-purple-400 to-pink-600',
    color: 'text-purple-600'
  },
  {
    title: 'Government Schemes',
    icon: BuildingLibraryIcon,
    description: 'Personalized alerts about subsidies, loan schemes, and government programs tailored to your farming profile.',
    gradient: 'from-teal-400 to-cyan-600',
    color: 'text-teal-600'
  },
  {
    title: 'Equipment Solutions',
    icon: TruckIcon,
    description: 'Access to modern machinery through flexible rental plans, purchase assistance, and maintenance support.',
    gradient: 'from-rose-400 to-red-600',
    color: 'text-rose-600'
  },
];

const stats = [
  { label: 'Active Farmers', value: '10,000+' },
  { label: 'Crop Varieties Supported', value: '150+' },
  { label: 'Average Yield Increase', value: '35%' },
  { label: 'Customer Satisfaction', value: '98%' }
];

const ExploreServices = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-off-white to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-accent transform rotate-12 scale-150"></div>
        </div>
        
        <motion.div 
          className="container mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary font-medium mb-6">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Empowering Agriculture with Technology
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-text-dark mb-6">
            Explore Our
            <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> Services</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive solutions designed to transform your farming journey with cutting-edge technology and expert guidance
          </p>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                variants={itemVariants}
              >
                <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-heading font-bold text-text-dark mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* CTA Button */}
                  <button className="inline-flex items-center text-brand-primary font-semibold hover:text-brand-accent transition-colors duration-300 group/btn">
                    Learn More
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:${service.gradient} rounded-2xl transition-all duration-300 pointer-events-none`}></div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-4">
              Why Choose KisanMel?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine traditional farming wisdom with modern technology to deliver unprecedented results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Insights",
                description: "Machine learning algorithms analyze your farm data to provide personalized recommendations",
                icon: "🤖"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance from our team of agricultural experts and technicians",
                icon: "🌟"
              },
              {
                title: "Proven Results",
                description: "Join thousands of farmers who have increased their yields and profits with our solutions",
                icon: "📈"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-bold text-text-dark mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-primary to-brand-accent">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Get personalized recommendations and start your journey towards sustainable, profitable farming today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              className="inline-flex items-center px-8 py-4 bg-white text-brand-primary rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Book Free Consultation
            </motion.button>
            
            <motion.button 
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-brand-primary transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
          
          <p className="text-white/80 mt-6 text-sm">
            🌱 Join 10,000+ farmers already growing with KisanMel
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default ExploreServices; 
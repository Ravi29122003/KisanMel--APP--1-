import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar.tsx';
import { motion, useInView } from 'framer-motion';
import slide1 from '../../Images/Slideshow/step 1.png';
import slide2 from '../../Images/Slideshow/step 2.png';
import slide3 from '../../Images/Slideshow/step 3.png';
import slide4 from '../../Images/Slideshow/step 4.png';
import slide5 from '../../Images/Slideshow/step 5.png';
import slide6 from '../../Images/Slideshow/step 6.png';
import FarmerImage from '../../Images/FarmerImage.png';

const AnimatedCard = ({ image, index, isMobile }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : (index % 2 === 0 ? -50 : 50),
      y: isMobile ? 50 : 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={`h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-500 group ${
        index % 2 === 1 ? 'self-end ml-auto' : 'self-start mr-auto'
      }`}
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '90%'
      }}
    >
      <div className="relative h-full overflow-hidden">
        <img
          src={image}
          alt={`Step ${index + 1}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

const FloatingIcon = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`absolute text-green-400/30 ${className}`}
    style={{
      fontSize: '2rem',
      animation: `float 6s ease-in-out infinite ${delay}s`,
    }}
  >
    {children}
  </motion.div>
);

const FarmSetupPage = () => {
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  const carouselImages = [
    slide1,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6
  ];

  // Create a duplicated array for seamless looping
  const duplicatedImages = [...carouselImages, ...carouselImages];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add custom styles for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(2deg); }
        50% { transform: translateY(-5px) rotate(0deg); }
        75% { transform: translateY(-15px) rotate(-2deg); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
        50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
      }
      .infinite-scroll {
        animation: scroll 15s linear infinite;
      }
      .infinite-scroll:hover {
        animation-play-state: paused;
      }
      .glow-pulse {
        animation: pulse-glow 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 font-['Inter'] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-lime-200/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Global Navigation Bar */}
      <Navbar isAuthenticated={true} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Section - Enhanced Farm Setup Card */}
          <div className="lg:col-span-4 space-y-8">
            {/* Enhanced Setup Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              {/* Background Gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 group-hover:shadow-3xl transition-all duration-500">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 text-green-200 opacity-50">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <div className="flex flex-col items-center text-center">
                  {/* Avatar with Enhanced Styling */}
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 p-1 glow-pulse">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img 
                          src={FarmerImage} 
                          alt="Farm Setup" 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    {/* Floating Indicator */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce">
                      ✓
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Setup Your Farm
                  </h2>
                  
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl px-4 py-2 mb-6">
                    <p className="text-green-700 font-semibold text-lg">
                      Start smart, grow smarter
                    </p>
                  </div>

                  <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-sm">
                    Add your farm details to unlock personalized AI recommendations and boost your yield by up to 
                    <span className="font-bold text-green-600"> 35%</span>
                  </p>

                  {/* Enhanced Button */}
                  <Link
                    to="/farm-setup"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <span className="relative flex items-center gap-3">
                      <span>Setup Now</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>

                {/* Feature Highlights */}
                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/50">
                  {[
                    { icon: 'AI', label: 'AI Powered' },
                    { icon: 'Analytics', label: 'Analytics' },
                    { icon: 'Yield', label: 'Higher Yield' }
                  ].map((feature, idx) => (
                    <div key={idx} className="text-center group/feature hover:scale-105 transition-transform duration-300">
                      <div className="text-lg mb-1 font-bold text-green-600 group-hover/feature:text-green-700">{feature.icon}</div>
                      <div className="text-xs text-gray-600 font-medium">{feature.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: '50K+', label: 'Happy Farmers', color: 'from-green-400 to-emerald-500' },
                { number: '95%', label: 'Success Rate', color: 'from-blue-400 to-cyan-500' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 hover:bg-white/80 transition-all duration-300">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Section - Expanded Carousel */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-full"
            >
              {/* Enhanced Carousel Container */}
              <div 
                ref={carouselRef}
                className="relative h-[700px] overflow-hidden rounded-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 shadow-2xl"
              >
                {/* Enhanced Gradient Overlays */}
                <div className="pointer-events-none absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/50 via-white/20 to-transparent z-20" />
                <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/50 via-white/20 to-transparent z-20" />

                {/* Decorative Side Gradients */}
                <div className="pointer-events-none absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-white/30 to-transparent z-20" />
                <div className="pointer-events-none absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/30 to-transparent z-20" />

                <div className="infinite-scroll absolute inset-0">
                  {duplicatedImages.map((image, index) => (
                    <div
                      key={index}
                      className="w-full mb-4"
                      style={{ height: '220px' }}
                    >
                      <div className="h-full p-4">
                        <AnimatedCard 
                          image={image} 
                          index={index % carouselImages.length} 
                          isMobile={isMobile}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Step-by-step guide</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmSetupPage; 
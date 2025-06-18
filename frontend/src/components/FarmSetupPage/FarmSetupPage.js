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
import WeatherCard from '../WeatherCard';

const AnimatedCard = ({ image, index, isMobile }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : (index % 2 === 0 ? -50 : 50),
      y: isMobile ? 50 : 0
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={`h-full bg-white rounded-xl shadow-lg overflow-hidden ${
        index % 2 === 1 ? 'self-end ml-auto' : 'self-start mr-auto'
      }`}
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '90%'
      }}
    >
      <div className="relative h-full">
        <img
          src={image}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
};

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

  // Add custom styles for the infinite scroll animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-50%);
        }
      }
      .infinite-scroll {
        animation: scroll 12s linear infinite;
      }
      .infinite-scroll:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Global Navigation Bar */}
      <Navbar isAuthenticated={true} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Section - Farm Setup Card */}
          <div className="lg:col-span-2 space-y-8">
            {/* Setup Card */}
            <div className="bg-[#f0fff4] rounded-2xl shadow-lg p-8 flex flex-col justify-center transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-white shadow-md">
                  <img 
                    src={FarmerImage} 
                    alt="Farm Setup" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
                  Setup Your Farm
                </h2>
                <p className="text-green-600 font-medium text-lg mb-4">
                  Start smart, grow smarter 🌱
                </p>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed text-center">
                Add your farm details to get personalized recommendations.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/farm-setup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-md text-lg"
                >
                  Setup Now
                </Link>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="max-w-sm mx-auto lg:mx-0">
              <WeatherCard />
            </div>
          </div>

          {/* Right Section - Infinite Scroll Carousel */}
          <div className="lg:col-span-3">
            <div 
              ref={carouselRef}
              className="relative h-[600px] overflow-hidden rounded-2xl shadow-md"
            >
              {/* Gradient Overlays */}
              <div className="pointer-events-none absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 via-gray-50/80 to-transparent z-20" />
              <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent z-20" />

              <div className="infinite-scroll absolute inset-0">
                {duplicatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-full mb-2"
                    style={{
                      height: '180px'
                    }}
                  >
                    <div className="h-full p-2">
                      <AnimatedCard 
                        image={image} 
                        index={index % carouselImages.length} 
                        isMobile={isMobile}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmSetupPage; 
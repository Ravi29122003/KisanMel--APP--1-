import React from 'react';
import Navbar from '../components/Navbar.tsx';

const services = [
  {
    title: 'Smart Crop Advisory',
    icon: 'https://www.svgrepo.com/show/440536/crop.svg',
    description: 'Get precise recommendations for crop selection and management.',
  },
  {
    title: 'Soil Health Monitoring',
    icon: 'https://www.svgrepo.com/show/454941/soil.svg',
    description: 'Detailed analysis and recommendations for optimal soil health.',
  },
  {
    title: 'Weather & Irrigation Insights',
    icon: 'https://www.svgrepo.com/show/438367/weather-partly-cloudy-day.svg',
    description: 'Real-time weather data and smart irrigation schedules.',
  },
  {
    title: 'Market Linkage & Pricing',
    icon: 'https://www.svgrepo.com/show/486242/market.svg',
    description: 'Connect to buyers and get the best prices for your produce.',
  },
  {
    title: 'Government Schemes Awareness',
    icon: 'https://www.svgrepo.com/show/512967/government.svg',
    description: 'Stay informed about beneficial government schemes and subsidies.',
  },
  {
    title: 'Farming Equipment Access',
    icon: 'https://www.svgrepo.com/show/472600/tractor-svgrepo-com.svg',
    description: 'Access modern farming machinery on rent or purchase plans.',
  },
];

const ExploreServices = () => {
  return (
    <div className="min-h-screen bg-[#FFFEF8] font-sans antialiased text-text-dark">
      <Navbar />
      {/* Header Section */}
      <header className="py-16 px-4 text-center bg-[#FFFEF8]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-kisan-header-green mb-4">
          Explore Our Services
        </h1>
        <p className="text-lg md:text-xl text-gray-600">What KisanMel offers to empower farmers</p>
      </header>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-box-bg rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={service.icon} alt={service.title} className="h-16 w-16 mb-4 text-kisan-green" />
              <h3 className="text-xl font-bold text-text-dark mb-2">{service.title}</h3>
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{service.description}</p>
              <button className="bg-kisan-green text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition duration-300">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#FFFEF8] py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-6">
          Need tailored advice?
        </h2>
        <button className="bg-kisan-orange text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-[#FFA000] transition duration-300">
          Book a Free Consultation
        </button>
      </section>
    </div>
  );
};

export default ExploreServices; 
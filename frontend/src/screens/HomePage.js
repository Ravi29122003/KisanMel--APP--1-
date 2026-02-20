import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import KisanMelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import EmpowerFarmerIcon from '../Images/EmpowerFarmer.png';
import MaximizeYieldIcon from '../Images/MaximizeYield.png';
import TransformAgricultureIcon from '../Images/FarmerImage.png';
import Navbar from '../components/Navbar.tsx';
import HeroFarmland from '../Images/hero-farmland.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  LightBulbIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon, 
  BookOpenIcon, 
  UsersIcon, 
  BanknotesIcon,
  CpuChipIcon,
  CloudIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PhoneIcon,                                  
  MapPinIcon,
  CheckCircleIcon,
  PlayIcon,
  StarIcon,
  EnvelopeIcon,
  BeakerIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 600, easing: 'ease-out', once: true });
  }, []);

  const stats = [
    { number: "50K+", label: "Active Farmers", icon: UsersIcon, color: "from-green-400 to-green-600" },
    { number: "25+", label: "States Covered", icon: GlobeAltIcon, color: "from-blue-400 to-blue-600" },
    { number: "30%", label: "Yield Increase", icon: ChartBarIcon, color: "from-yellow-400 to-yellow-600" },
    { number: "₹2.5Cr+", label: "Income Generated", icon: BanknotesIcon, color: "from-purple-400 to-purple-600" }
  ];

  const features = [
    {
      title: 'Smart Crop Recommendations',
      desc: 'AI-powered suggestions tailored to your soil, climate & resources for maximum productivity',
      icon: LightBulbIcon,
      link: '/services',
      gradient: 'from-green-400 to-emerald-600',
      delay: 0
    },
    {
      title: 'Real-time Market Insights',
      desc: 'Up-to-date mandi rates and price predictions to help you sell at the right time',
      icon: ChartBarIcon,
      link: '/services',
      gradient: 'from-blue-400 to-cyan-600',
      delay: 100
    },
    {
      title: 'IoT Farm Monitoring',
      desc: 'Connect sensors for real-time alerts on soil moisture, weather conditions & crop health',
      icon: DevicePhoneMobileIcon,
      link: '/services',
      gradient: 'from-purple-400 to-violet-600',
      delay: 200
    },
    {
      title: 'Expert Training & Guides',
      desc: 'Access comprehensive tutorials, videos and expert advice in your local language',
      icon: BookOpenIcon,
      link: '/services',
      gradient: 'from-orange-400 to-red-600',
      delay: 300
    },
    {
      title: 'Farmer Community',
      desc: 'Connect with fellow farmers, share experiences and get support from agricultural experts',
      icon: UsersIcon,
      link: '/services',
      gradient: 'from-teal-400 to-cyan-600',
      delay: 400
    },
    {
      title: 'Government Schemes',
      desc: 'Stay updated on latest subsidies, policies and government programs for farmers',
      icon: BanknotesIcon,
      link: '/services',
      gradient: 'from-indigo-400 to-purple-600',
      delay: 500
    }
  ];

  const testimonials = [
    {
      name: "Ramesh Kumar",
      location: "Maharashtra",
      text: "KisanMel helped me increase my cotton yield by 40% with their smart recommendations. My income has doubled!",
      rating: 5,
      icon: UsersIcon
    },
    {
      name: "Priya Devi",
      location: "Punjab",
      text: "The market price alerts saved me from selling at low rates. I got ₹5000 more per quintal!",
      rating: 5,
      icon: ChartBarIcon
    },
    {
      name: "Suresh Patel",
      location: "Gujarat",
      text: "Learning from other farmers in the community has been invaluable. Best agricultural app!",
      rating: 5,
      icon: BookOpenIcon
    }
  ];

  const technologies = [
    { name: "AI & Machine Learning", icon: CpuChipIcon, desc: "Smart crop recommendations" },
    { name: "IoT Sensors", icon: DevicePhoneMobileIcon, desc: "Real-time farm monitoring" },
    { name: "Weather Analytics", icon: CloudIcon, desc: "Precise weather forecasting" },
    { name: "Market Intelligence", icon: ChartBarIcon, desc: "Price prediction algorithms" }
  ];

  return (
    <div className="min-h-screen bg-soft-off-white font-sans antialiased text-text-dark">
      <Navbar />

      {/* CLEAN HERO SECTION */}
      <header className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-soft-off-white">
        {/* Background Image */}
        <img
          src={HeroFarmland}
          alt="Modern Agriculture"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-16 fill-soft-off-white">
            <path d="M0,0 C150,80 350,0 500,80 L500,00 L0,0 Z"></path>
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 text-white">
          {/* Large Centered Logo */}
          <div className="flex justify-center mb-12" data-aos="fade-up">
            <img
              src={KisanMelLogo}
              alt="Kisan Mel Logo"
              className="w-72 md:w-80 lg:w-[24rem] xl:w-[28rem] mx-auto drop-shadow-2xl"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="300">
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-bold text-base hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
            >
              Start Free Today
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold text-base border-2 border-white/30 hover:bg-white/20 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3">
              <PlayIcon className="h-5 w-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </header>

      {/* CLEAN STATISTICS SECTION */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-kisan-header-green mb-6">
              Transforming Indian Agriculture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of farmers already growing smarter with KisanMel's technology platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const { icon: Icon } = stat;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-dashboard-accent-green mb-2 group-hover:text-brand-primary transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLEAN FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-kisan-header-green mb-6">
              Smart Solutions for Modern Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our cutting-edge technology platform helps farmers make data-driven decisions, 
              increase productivity, and boost profits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const { icon: Icon } = feature;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={feature.delay}
                >
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.gradient} rounded-t-3xl`}></div>
                  
                  {/* Icon container */}
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-dashboard-accent-green mb-4 group-hover:text-brand-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.desc}
                  </p>

                  <Link
                    to={feature.link}
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold group-hover:gap-3 transition-all"
                  >
                    Learn More
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLEAN TECHNOLOGY SHOWCASE */}
      <section className="py-20 bg-[#f7fff9]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-kisan-header-green mb-6">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge technologies to bring you the most accurate and actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => {
              const { icon: Icon } = tech;
              return (
                <div
                  key={index}
                  className="text-center group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-dashboard-accent-green mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {tech.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLEAN TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-kisan-header-green mb-6">
              What Farmers Say About Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from farmers who have transformed their agriculture with KisanMel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const { icon: Icon } = testimonial;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dashboard-accent-green text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLEAN WHY CHOOSE US SECTION */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8" data-aos="fade-right">
              <h2 className="text-4xl md:text-5xl font-extrabold text-kisan-header-green">
                Why 50,000+ Farmers Trust KisanMel
              </h2>
              
              <div className="space-y-6">
                {[
                  "Built specifically for Indian farming conditions and crops",
                  "Available in 12+ regional languages with offline support",
                  "Partnerships with agricultural universities and research centers",
                  "Complete data privacy and security for all farmer information",
                  "24/7 expert support from agricultural specialists",
                  "Proven track record of 30% average yield improvement"
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-lg">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-dashboard-accent-green transition-colors shadow-lg hover:shadow-xl"
              >
                Learn More About Us
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative" data-aos="fade-left">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <img 
                  src={EmpowerFarmerIcon} 
                  alt="Happy Farmer" 
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-dashboard-accent-green mb-2">4.8★</div>
                  <p className="text-gray-600">Average App Rating</p>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brand-primary">99%</div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-brand-primary">24/7</div>
                      <div className="text-xs text-gray-600">Support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-brand-primary">12+</div>
                      <div className="text-xs text-gray-600">Languages</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Clean floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrophyIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-r from-kisan-green via-green-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-6 text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6" data-aos="fade-up">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="150">
            Join the agricultural revolution today. Get personalized crop recommendations, real-time market insights, 
            and connect with a community of progressive farmers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="300">
            <Link
              to="/signup"
              className="bg-white text-kisan-green font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all text-base hover:scale-105 transform"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/services"
              className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-kisan-green transition-all text-base"
            >
              Explore All Features
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="450">
            <div className="text-center">
              <DevicePhoneMobileIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-sm">Mobile App Available</div>
            </div>
            <div className="text-center">
              <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-sm">Free to Get Started</div>
            </div>
            <div className="text-center">
              <CogIcon className="h-8 w-8 mx-auto mb-2 text-yellow-200" />
              <div className="text-sm">Setup in Minutes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN FOOTER */}
      <footer className="bg-[#1a1a1a] text-gray-300 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-2xl font-bold mb-4">KisanMel</h3>
              <p className="text-gray-400 mb-4">
                Empowering farmers with technology for a sustainable and profitable future.
              </p>
              <p className="text-sm text-brand-primary font-semibold">
                "Sahi Ugayen, Sahi Kamayen"
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Features</h4>
              <ul className="space-y-3 text-sm">
                <li><span className="hover:text-white transition-colors">Crop Recommendations</span></li>
                <li><span className="hover:text-white transition-colors">Market Insights</span></li>
                <li><span className="hover:text-white transition-colors">Weather Alerts</span></li>
                <li><span className="hover:text-white transition-colors">Expert Support</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>help@kisanmel.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} KisanMel. All rights reserved. | 
              <span className="text-brand-primary"> Transforming Indian Agriculture</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 
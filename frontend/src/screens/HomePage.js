import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import KisanMelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import EmpowerFarmerIcon from '../Images/EmpowerFarmer.png'; // Re-adding the import for EmpowerFarmer.png
import MaximizeYieldIcon from '../Images/MaximizeYield.png'; // Import MaximizeYield.png
import TransformAgricultureIcon from '../Images/FarmerImage.png'; // Import FarmerImage.png
import Navbar from '../components/Navbar.tsx'; // Added .tsx extension
import HeroFarmland from '../Images/hero-farmland.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { LightBulbIcon, ChartBarIcon, DevicePhoneMobileIcon, BookOpenIcon, UsersIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const HomePage = () => {

  // Initialise AOS on mount
  useEffect(() => {
    AOS.init({ duration: 600, easing: 'ease-out', once: true });
  }, []);

  return (
    <div className="min-h-screen bg-soft-off-white font-sans antialiased text-text-dark">
      {/* Navigation Bar */}
      <Navbar /> {/* Use the new Navbar component */}

      {/* HERO SECTION */}
      <header className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-soft-off-white">
        {/* Background image */}
        <img
          src={HeroFarmland}
          alt="Farmland background"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-85"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-soft-off-white/60 via-white/40 to-transparent"></div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            className="w-full h-16 fill-soft-off-white"
          >
            <path d="M0,0 C150,80 350,0 500,80 L500,00 L0,0 Z"></path>
          </svg>
        </div>

        <div className="relative z-10 text-center px-4">
          {/* Logo */}
          <img
            src={KisanMelLogo}
            alt="Kisan Mel Logo"
            className="w-56 md:w-72 lg:w-80 mx-auto mb-8 drop-shadow-md"
            data-aos="fade-up"
          />

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10" data-aos="fade-up" data-aos-delay="150">
            <Link
              to="/services"
              className="group bg-brand-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-dashboard-accent-green transition-shadow shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              Explore Services
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </Link>
            <button className="group bg-dark-brown text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2c1a13] transition-shadow shadow-md hover:shadow-lg inline-flex items-center gap-2">
              See Our Work
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </header>

      {/* FEATURE CARDS */}
      <section className="relative mt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Box 1 */}
          <div className="bg-box-bg rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-center text-center">
            <img src={EmpowerFarmerIcon} alt="Empower" className="h-32 w-32 object-cover rounded-xl shadow-md mb-6" />
            <h3 className="text-xl font-bold text-text-dark mb-2">Empower Farmers</h3>
            <p className="text-gray-700">Practical support for Indian farmers</p>
          </div>
          {/* Box 2 */}
          <div className="bg-box-bg rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-center text-center">
            <img src={MaximizeYieldIcon} alt="Yield" className="h-32 w-32 object-cover rounded-xl shadow-md mb-6" />
            <h3 className="text-xl font-bold text-text-dark mb-2">Maximize Yields</h3>
            <p className="text-gray-700">Boost productivity with data-driven tools</p>
          </div>
          {/* Box 3 */}
          <div className="bg-box-bg rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-center text-center">
            <img src={TransformAgricultureIcon} alt="Transform" className="h-32 w-32 object-cover rounded-xl shadow-md mb-6" />
            <h3 className="text-xl font-bold text-text-dark mb-2">Transform Agriculture</h3>
            <p className="text-gray-700">Unlock better markets and profits</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green mb-6">About Kisan Mel</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Kisan Mel is on a mission to empower Indian farmers with technology-driven insights, market access and
            sustainable agricultural practices. From personalized crop advice to real-time market rates, we bring the
            power of data science to every field—large or small.
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-[#f7fff9]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-kisan-header-green mb-12">Our Core Solutions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Crop Recommendations',
                desc: 'AI-powered suggestions tailored to your soil, climate & resources',
                icon: LightBulbIcon,
                link: '/services',
                accent: 'bg-brand-primary',
                text: 'text-brand-primary',
              },
              {
                title: 'Market Price Insights',
                desc: 'Up-to-date mandi rates to help you sell at the right time & place',
                icon: ChartBarIcon,
                link: '/services',
                accent: 'bg-brand-accent',
                text: 'text-brand-accent',
              },
              {
                title: 'IoT Farm Monitoring',
                desc: 'Connect sensors & get real-time alerts on moisture, weather & more',
                icon: DevicePhoneMobileIcon,
                link: '/services',
                accent: 'bg-brand-primary',
                text: 'text-brand-primary',
              },
              {
                title: 'Training & Guides',
                desc: 'Easy-to-follow tutorials & videos in local languages',
                icon: BookOpenIcon,
                link: '/services',
                accent: 'bg-brand-accent',
                text: 'text-brand-accent',
              },
              {
                title: 'Agri-Support Community',
                desc: 'Ask questions & share experiences with fellow farmers & experts',
                icon: UsersIcon,
                link: '/services',
                accent: 'bg-brand-primary',
                text: 'text-brand-primary',
              },
              {
                title: 'Government Scheme Updates',
                desc: 'Stay informed about the latest subsidies & policies',
                icon: BanknotesIcon,
                link: '/services',
                accent: 'bg-brand-accent',
                text: 'text-brand-accent',
              },
            ].map((card, idx) => {
              const { icon: Icon, accent, text } = card;
              return (
                <Link
                  to={card.link}
                  key={idx}
                  className={
                    'relative group bg-white rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-200 p-6 flex flex-col hover:scale-105'
                  }
                >
                  {/* accent bar */}
                  <span className={`absolute top-0 left-0 h-1 w-full rounded-t-2xl ${accent}`}></span>

                  <div className="h-12 w-12 mb-4 flex items-center justify-center bg-soft-off-white rounded-xl shadow-inner">
                    <Icon className={`h-7 w-7 ${text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-dashboard-accent-green mb-2 font-heading">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 flex-grow text-sm">{card.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green">Why Farmers Trust Us</h2>
            <ul className="space-y-4 text-gray-700 list-disc list-inside">
              <li>Built <span className="font-medium">for</span> &amp; <span className="font-medium">with</span> Indian farmers</li>
              <li>Local language support &amp; offline-first mobile app</li>
              <li>Partnerships with agri universities &amp; KVKs</li>
              <li>Data security &amp; farmer privacy at the core</li>
            </ul>
          </div>
          <div className="h-72 bg-box-bg rounded-2xl shadow-inner flex items-center justify-center text-4xl text-dashboard-accent-green font-bold">
            50K+<span className="text-gray-600 text-lg font-normal ml-2">farmers onboard</span>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-16 bg-kisan-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60')] bg-cover bg-center"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to grow smarter?</h2>
          <p className="text-white mb-8 max-w-2xl mx-auto">Join Kisan Mel today and unlock tools that elevate your farm's productivity &amp; profit.</p>
          <Link
            to="/signup"
            className="inline-block bg-white text-kisan-green font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-box-bg transition"
          >
            Sign Up For Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Kisan Mel</h3>
            <p className="text-gray-400 text-sm">Sahi Ugayen, Sahi Kamayen</p>
          </div>
          <div>
            <h4 className="text-gray-200 font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/ideas" className="hover:text-white">Ideas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-200 font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-400">help@kisanmel.com</p>
            <p className="text-sm text-gray-400 mt-1">+91 98765 43210</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8">© {new Date().getFullYear()} Kisan Mel. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default HomePage; 
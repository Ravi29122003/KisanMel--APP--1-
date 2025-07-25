import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import KisanMelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import HeroFarmland from '../Images/hero-farmland.jpg';
import FarmerImage from '../Images/FarmerImage.png';
import EmpowerFarmerIcon from '../Images/EmpowerFarmer.png';
import MaximizeYieldIcon from '../Images/MaximizeYield.png';
import TransformAgricultureIcon from '../Images/FarmerImage.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  HeartIcon, 
  LightBulbIcon, 
  UsersIcon, 
  GlobeAltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  TrophyIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserGroupIcon,
  HandRaisedIcon,
  ChartBarIcon,
  SunIcon,
  BeakerIcon,
  CpuChipIcon,
  CloudIcon,
  SparklesIcon,
  StarIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  CogIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 600, easing: 'ease-out', once: true });
  }, []);

  const teamMembers = [
    {
      name: "Sourav",
      image: FarmerImage,
      description: "MBA from IIM-Lucknow, driving business strategy and growth."
    },
    {
      name: "Ravinder Singh",
      image: FarmerImage,
      description: "B-Tech from NIT-Jaipur, leading operations and business development."
    }
  ];

  const achievements = [
    { number: "50K+", label: "Farmers Onboarded", icon: UserGroupIcon },
    { number: "25+", label: "States Covered", icon: GlobeAltIcon },
    { number: "30%", label: "Average Yield Increase", icon: ChartBarIcon },
    { number: "100+", label: "Government Partnerships", icon: HandRaisedIcon }
  ];

  const values = [
    {
      title: "Farmer-First Approach",
      description: "Every decision we make puts farmers' needs and wellbeing at the center.",
      icon: HeartIcon,
      color: "text-brand-primary"
    },
    {
      title: "Innovation & Technology",
      description: "Leveraging cutting-edge technology to solve age-old agricultural challenges.",
      icon: LightBulbIcon,
      color: "text-brand-accent"
    },
    {
      title: "Community Building",
      description: "Creating networks that connect farmers, experts, and agricultural stakeholders.",
      icon: UsersIcon,
      color: "text-brand-primary"
    },
    {
      title: "Sustainability",
      description: "Promoting practices that protect the environment for future generations.",
      icon: GlobeAltIcon,
      color: "text-brand-accent"
    },
    {
      title: "Knowledge Sharing",
      description: "Democratizing access to agricultural knowledge and best practices.",
      icon: AcademicCapIcon,
      color: "text-brand-primary"
    },
    {
      title: "Trust & Transparency",
      description: "Building relationships based on honesty, reliability, and data privacy.",
      icon: ShieldCheckIcon,
      color: "text-brand-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-soft-off-white font-sans antialiased text-text-dark">
      <Navbar />

             {/* Hero Section */}
       <header className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-soft-off-white">
         <img
           src={HeroFarmland}
           alt="About KisanMel"
           className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
         
         <div className="relative z-10 text-center px-4 text-white">
                       <div className="flex justify-center mb-6" data-aos="fade-up">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <SunIcon className="h-16 w-16 text-green-300" />
              </div>
            </div>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6" data-aos="fade-up">
             About KisanMel
           </h1>
           <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="150">
             Empowering Indian farmers with technology, knowledge, and community support to transform agriculture for a sustainable future.
           </p>
           
           {/* Agricultural Stats Banner */}
           <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="300">
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
               <SunIcon className="h-8 w-8 text-green-300 mx-auto mb-2" />
               <div className="text-sm">Smart Farming</div>
             </div>
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
               <DevicePhoneMobileIcon className="h-8 w-8 text-blue-300 mx-auto mb-2" />
               <div className="text-sm">Mobile First</div>
             </div>
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
               <UsersIcon className="h-8 w-8 text-purple-300 mx-auto mb-2" />
               <div className="text-sm">Community</div>
             </div>
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
               <GlobeAltIcon className="h-8 w-8 text-green-300 mx-auto mb-2" />
               <div className="text-sm">Sustainable</div>
             </div>
           </div>
         </div>
       </header>

             {/* Mission & Vision Section */}
       <section className="py-20 bg-white relative overflow-hidden">
         
         <div className="max-w-6xl mx-auto px-6 relative">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div data-aos="fade-right" className="relative">
               <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                 <SunIcon className="h-10 w-10 text-brand-primary" />
               </div>
               <img 
                 src={EmpowerFarmerIcon} 
                 alt="Our Mission" 
                 className="w-full h-80 object-cover rounded-2xl shadow-lg relative z-10"
               />
               <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                 <LightBulbIcon className="h-8 w-8 text-brand-accent" />
               </div>
             </div>
             <div className="space-y-8" data-aos="fade-left">
               <div className="relative">
                                   <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <StarIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green">Our Mission</h2>
                  </div>
                 <p className="text-gray-700 text-lg leading-relaxed">
                   To bridge the gap between traditional farming wisdom and modern technology, empowering every farmer 
                   in India with data-driven insights, market access, and sustainable agricultural practices that increase 
                   productivity while preserving our environment.
                 </p>
                 
                 {/* Mission Features */}
                 <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="flex items-center gap-2">
                     <SunIcon className="h-5 w-5 text-green-600" />
                     <span className="text-sm text-gray-600">Smart Recommendations</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <ChartBarIcon className="h-5 w-5 text-green-600" />
                     <span className="text-sm text-gray-600">Market Access</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <GlobeAltIcon className="h-5 w-5 text-green-600" />
                     <span className="text-sm text-gray-600">Sustainable Practices</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <DevicePhoneMobileIcon className="h-5 w-5 text-green-600" />
                     <span className="text-sm text-gray-600">Digital Tools</span>
                   </div>
                 </div>
               </div>
               
               <div className="relative">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                     <EyeIcon className="h-6 w-6 text-white" />
                   </div>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green">Our Vision</h2>
                 </div>
                 <p className="text-gray-700 text-lg leading-relaxed">
                   A thriving agricultural ecosystem where every farmer has access to cutting-edge technology, fair markets, 
                   and the knowledge needed to build profitable, sustainable farms that feed the nation and support rural communities.
                 </p>
                 
                 {/* Vision Goals */}
                 <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                   <div className="grid grid-cols-3 gap-4 text-center">
                     <div>
                       <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-1" />
                       <div className="text-xs text-gray-600">Excellence</div>
                     </div>
                     <div>
                       <GlobeAltIcon className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                       <div className="text-xs text-gray-600">Global Impact</div>
                     </div>
                     <div>
                       <HandRaisedIcon className="h-8 w-8 text-green-600 mx-auto mb-1" />
                       <div className="text-xs text-gray-600">Partnership</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>

             {/* Our Story Section */}
       <section className="py-20 bg-[#f7fff9] relative overflow-hidden">
         
         <div className="max-w-6xl mx-auto px-6 text-center relative">
           <div className="flex justify-center mb-8" data-aos="fade-up">
             <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-4">
               <BookOpenIcon className="h-12 w-12 text-white" />
             </div>
           </div>
           <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green mb-12" data-aos="fade-up">
             Our Story
           </h2>
           
           {/* Timeline Style Story */}
           <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="150">
             <div className="relative">
               {/* Timeline Line */}
               <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-300 to-blue-300 hidden md:block"></div>
               
               <div className="space-y-12">
                 {/* Story Point 1 */}
                 <div className="relative md:flex md:items-center">
                   <div className="md:w-1/2 md:pr-8 text-right">
                     <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-400">
                                                <div className="flex items-center justify-end gap-3 mb-3">
                           <h3 className="text-xl font-bold text-gray-800">The Beginning</h3>
                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                             <SunIcon className="h-5 w-5 text-green-600" />
                           </div>
                         </div>
                       <p className="text-gray-700 leading-relaxed">
                         KisanMel was born from a simple observation: while technology was transforming every aspect of life, 
                         farming - the backbone of our economy - remained largely unchanged. In 2020, our founders, 
                         who grew up in farming families, set out to change this.
                       </p>
                     </div>
                   </div>
                   <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full border-4 border-white hidden md:block"></div>
                   <div className="md:w-1/2 md:pl-8"></div>
                 </div>
                 
                 {/* Story Point 2 */}
                 <div className="relative md:flex md:items-center">
                   <div className="md:w-1/2 md:pr-8"></div>
                   <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-4 border-white hidden md:block"></div>
                   <div className="md:w-1/2 md:pl-8">
                     <div className="bg-white rounded-2xl p-6 shadow-lg border-r-4 border-blue-400">
                       <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                           <HandRaisedIcon className="h-5 w-5 text-blue-600" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-800">First Steps</h3>
                       </div>
                       <p className="text-gray-700 leading-relaxed">
                         Starting with a small pilot project in rural Maharashtra, we worked directly with 50 farmers to understand 
                         their daily challenges. What we learned was that farmers didn't need complex solutions - they needed 
                         practical, accessible tools that could help them make better decisions.
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Story Point 3 */}
                 <div className="relative md:flex md:items-center">
                   <div className="md:w-1/2 md:pr-8 text-right">
                     <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
                       <div className="flex items-center justify-end gap-3 mb-3">
                         <h3 className="text-xl font-bold text-gray-800">Today & Beyond</h3>
                         <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                           <RocketLaunchIcon className="h-5 w-5 text-yellow-600" />
                         </div>
                       </div>
                       <p className="text-gray-700 leading-relaxed">
                         Today, KisanMel serves over 50,000 farmers across 25+ states, providing AI-powered crop recommendations, 
                         real-time market data, and a supportive community platform. But our mission remains the same: 
                         to put powerful technology in the hands of those who feed our nation.
                       </p>
                     </div>
                   </div>
                   <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-white hidden md:block"></div>
                   <div className="md:w-1/2 md:pl-8"></div>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Agricultural Journey Visualization */}
           <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="300">
                            <div className="text-center">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <SunIcon className="h-8 w-8 text-green-600" />
                 </div>
                 <div className="text-lg font-semibold text-gray-800">Seed</div>
                 <div className="text-sm text-gray-600">2020: Idea Born</div>
               </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
               </div>
               <div className="text-lg font-semibold text-gray-800">Growth</div>
               <div className="text-sm text-gray-600">2021: First Farmers</div>
             </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <TrophyIcon className="h-8 w-8 text-yellow-600" />
               </div>
               <div className="text-lg font-semibold text-gray-800">Harvest</div>
               <div className="text-sm text-gray-600">2022: Scale Up</div>
             </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <GlobeAltIcon className="h-8 w-8 text-purple-600" />
               </div>
               <div className="text-lg font-semibold text-gray-800">Impact</div>
               <div className="text-sm text-gray-600">2023: 50K+ Farmers</div>
             </div>
           </div>
         </div>
       </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-kisan-header-green mb-12" data-aos="fade-up">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const { icon: Icon } = value;
              return (
                <div
                  key={index}
                  className="bg-box-bg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-inner mb-4">
                    <Icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-dashboard-accent-green mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

             {/* Achievements Section */}
       <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 relative overflow-hidden">
         
         <div className="max-w-6xl mx-auto px-6 relative">
           <div className="text-center mb-16" data-aos="fade-up">
             <div className="flex justify-center mb-6">
               <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-4">
                 <TrophyIcon className="h-12 w-12 text-white" />
               </div>
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green mb-4">
               Our Impact
             </h2>
             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
               Transforming lives across India through innovative agricultural technology
             </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {achievements.map((achievement, index) => {
               const { icon: Icon } = achievement;
               const colors = [
                 'from-green-400 to-green-600',
                 'from-blue-400 to-blue-600', 
                 'from-yellow-400 to-yellow-600',
                 'from-purple-400 to-purple-600'
               ];
               const iconComponents = [UserGroupIcon, GlobeAltIcon, ChartBarIcon, HandRaisedIcon];
               const IconComponent = iconComponents[index];
               
               return (
                 <div
                   key={index}
                   className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                   data-aos="fade-up"
                   data-aos-delay={index * 100}
                 >
                   {/* Decorative Background */}
                   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-3xl rounded-tr-3xl"></div>
                   
                   {/* Icon Container */}
                   <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br ${colors[index]} rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                     <IconComponent className="h-10 w-10 text-white" />
                   </div>
                   
                   {/* Achievement Number */}
                   <div className="text-5xl font-bold text-dashboard-accent-green mb-2 group-hover:text-brand-primary transition-colors">
                     {achievement.number}
                   </div>
                   
                   {/* Achievement Label */}
                   <div className="text-gray-600 font-semibold text-lg mb-4">
                     {achievement.label}
                   </div>
                   
                   {/* Decorative Line */}
                   <div className={`w-12 h-1 bg-gradient-to-r ${colors[index]} mx-auto rounded-full`}></div>
                   
                   {/* Hover Effect Icon */}
                   <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <Icon className="h-6 w-6 text-brand-primary" />
                   </div>
                 </div>
               );
             })}
           </div>
           
           {/* Additional Impact Metrics */}
           <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg" data-aos="fade-up" data-aos-delay="400">
             <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">More Impact Highlights</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
               <div>
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                   <BanknotesIcon className="h-6 w-6 text-green-600" />
                 </div>
                 <div className="text-xl font-bold text-gray-800">₹2.5Cr+</div>
                 <div className="text-sm text-gray-600">Income Increased</div>
               </div>
               <div>
                 <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                   <TrophyIcon className="h-6 w-6 text-yellow-600" />
                 </div>
                 <div className="text-xl font-bold text-gray-800">15+</div>
                 <div className="text-sm text-gray-600">Awards Won</div>
               </div>
                                <div>
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                   </div>
                   <div className="text-xl font-bold text-gray-800">1M+</div>
                   <div className="text-sm text-gray-600">Acres Optimized</div>
                 </div>
               <div>
                 <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                   <DevicePhoneMobileIcon className="h-6 w-6 text-purple-600" />
                 </div>
                 <div className="text-xl font-bold text-gray-800">4.8★</div>
                 <div className="text-sm text-gray-600">App Rating</div>
               </div>
             </div>
           </div>
         </div>
       </section>

             {/* Team Section */}
       <section className="py-20 bg-white relative overflow-hidden">
         
         <div className="max-w-6xl mx-auto px-6 relative">
           <div className="text-center mb-16" data-aos="fade-up">
             <div className="flex justify-center mb-6">
               <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-4">
                 <UsersIcon className="h-12 w-12 text-white" />
               </div>
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green mb-4">
               Meet Our Team
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Our diverse team brings together expertise in agriculture, technology, and rural development to serve farmers across India.
             </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl mx-auto">
             {teamMembers.map((member, index) => (
               <div
                 key={index}
                 className="group relative"
                 data-aos="fade-up"
                 data-aos-delay={index * 100}
               >
                 {/* Card Background with Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                 
                 {/* Main Card */}
                 <div className="relative bg-white rounded-3xl p-8 shadow-xl transform group-hover:-translate-y-2 transition-all duration-300">
                   {/* Decorative Corner */}
                   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-bl-3xl rounded-tr-3xl opacity-50"></div>
                   
                   {/* Profile Section */}
                   <div className="text-center mb-6">
                     <div className="relative inline-block mb-4">
                       <img
                         src={member.image}
                         alt={member.name}
                         className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300"
                       />
                       {/* Role Icon Overlay */}
                       <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                         {index === 0 ? (
                           <BuildingOfficeIcon className="h-6 w-6 text-white" />
                         ) : (
                           <CogIcon className="h-6 w-6 text-white" />
                         )}
                       </div>
                     </div>
                     
                     <h3 className="text-2xl font-bold text-dashboard-accent-green mb-2">
                       {member.name}
                     </h3>
                   </div>
                   
                   {/* Description */}
                   <p className="text-gray-600 leading-relaxed text-center">
                     {member.description}
                   </p>
                   
                   {/* Skills/Expertise Tags */}
                   <div className="mt-6 flex flex-wrap justify-center gap-2">
                     {index === 0 ? (
                       <>
                         <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Strategy</span>
                         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Leadership</span>
                         <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Growth</span>
                       </>
                     ) : (
                       <>
                         <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">Operations</span>
                         <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Technology</span>
                         <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">Innovation</span>
                       </>
                     )}
                   </div>
                   
                   {/* Decorative Quote */}
                   <div className="mt-6 text-center">
                     <div className="text-4xl text-gray-200 mb-2">"</div>
                     <p className="text-sm text-gray-500 italic">
                       {index === 0 ? "Empowering farmers through innovation" : "Building the future of agriculture"}
                     </p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           {/* Team Culture Section */}
           <div className="mt-20 text-center" data-aos="fade-up" data-aos-delay="300">
             <h3 className="text-2xl font-bold text-gray-800 mb-8">Our Team Culture</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
                 </div>
                 <div className="text-sm font-semibold text-gray-700">Innovation First</div>
               </div>
               <div className="text-center">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <HandRaisedIcon className="h-8 w-8 text-green-600" />
                 </div>
                 <div className="text-sm font-semibold text-gray-700">Collaboration</div>
               </div>
               <div className="text-center">
                 <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-600" />
                 </div>
                 <div className="text-sm font-semibold text-gray-700">Growth Mindset</div>
               </div>
               <div className="text-center">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <HeartIcon className="h-8 w-8 text-red-600" />
                 </div>
                 <div className="text-sm font-semibold text-gray-700">Farmer Love</div>
               </div>
             </div>
           </div>
         </div>
       </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-[#f7fff9]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-kisan-header-green mb-12" data-aos="fade-up">
            Awards & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300" data-aos="fade-up">
              <TrophyIcon className="h-16 w-16 text-brand-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dashboard-accent-green mb-2">
                Best AgTech Startup 2023
              </h3>
              <p className="text-gray-600">
                Recognized by the India AgTech Awards for innovation in agricultural technology
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
              <TrophyIcon className="h-16 w-16 text-brand-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dashboard-accent-green mb-2">
                Digital India Award
              </h3>
              <p className="text-gray-600">
                Honored for contributions to digital transformation in rural agriculture
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <TrophyIcon className="h-16 w-16 text-brand-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dashboard-accent-green mb-2">
                Farmer's Choice Award
              </h3>
              <p className="text-gray-600">
                Voted as the most trusted agricultural platform by our farming community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-kisan-header-green mb-12" data-aos="fade-up">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8" data-aos="fade-right">
              <div>
                <h3 className="text-2xl font-semibold text-dashboard-accent-green mb-6">
                  We'd love to hear from you
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Whether you're a farmer looking for support, a partner interested in collaboration, 
                  or simply want to learn more about our mission, we're here to help.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-box-bg rounded-xl flex items-center justify-center">
                    <PhoneIcon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dashboard-accent-green">Phone</p>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-box-bg rounded-xl flex items-center justify-center">
                    <EnvelopeIcon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dashboard-accent-green">Email</p>
                    <p className="text-gray-600">help@kisanmel.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-box-bg rounded-xl flex items-center justify-center">
                    <MapPinIcon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dashboard-accent-green">Office</p>
                    <p className="text-gray-600">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-box-bg rounded-2xl p-8" data-aos="fade-left">
              <h3 className="text-2xl font-semibold text-dashboard-accent-green mb-6">
                Ready to start your journey?
              </h3>
              <p className="text-gray-700 mb-8">
                Join thousands of farmers who are already using KisanMel to grow smarter and earn more.
              </p>
              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="block w-full bg-brand-primary text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-dashboard-accent-green transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up For Free
                </Link>
                <Link
                  to="/services"
                  className="block w-full bg-white text-brand-primary py-3 px-6 rounded-xl font-semibold text-center border-2 border-brand-primary hover:bg-brand-primary hover:text-white transition-colors duration-200"
                >
                  Explore Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kisan-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60')] bg-cover bg-center"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" data-aos="fade-up">
            Join the KisanMel Community
          </h2>
          <p className="text-white mb-8 max-w-2xl mx-auto text-lg" data-aos="fade-up" data-aos-delay="150">
            Be part of a growing community of farmers, experts, and innovators working together to transform Indian agriculture.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-kisan-green font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-box-bg transition text-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Get Started Today
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
              <li><Link to="/" className="hover:text-white">Home</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-200 font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-400">help@kisanmel.com</p>
            <p className="text-sm text-gray-400 mt-1">+91 98765 43210</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8">
          © {new Date().getFullYear()} Kisan Mel. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AboutUs; 
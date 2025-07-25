import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  ChartBarIcon,
  BeakerIcon,
  CloudIcon,
  CpuChipIcon,
  GlobeAltIcon,
  SparklesIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar.tsx';

const projects = [
  {
    id: 1,
    title: 'Smart Irrigation Network',
    category: 'IoT & Automation',
    description: 'AI-powered irrigation system reducing water usage by 40% while increasing crop yields through precision water management.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Active',
    progress: 85,
    duration: '18 months',
    farmers: 2500,
    location: 'Punjab, Maharashtra',
    icon: CloudIcon,
    gradient: 'from-blue-500 to-cyan-600',
    technologies: ['IoT Sensors', 'Machine Learning', 'Weather APIs', 'Mobile App'],
    impact: {
      waterSaved: '2.5M liters',
      yieldIncrease: '42%',
      costReduction: '30%'
    }
  },
  {
    id: 2,
    title: 'Crop Disease Detection AI',
    category: 'Artificial Intelligence',
    description: 'Computer vision model for early disease detection in crops with 95% accuracy, enabling preventive treatment.',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'In Development',
    progress: 70,
    duration: '12 months',
    farmers: 5000,
    location: 'Karnataka, Tamil Nadu',
    icon: CpuChipIcon,
    gradient: 'from-purple-500 to-pink-600',
    technologies: ['Computer Vision', 'TensorFlow', 'Mobile SDK', 'Cloud Processing'],
    impact: {
      diseasesDetected: '50+ types',
      accuracy: '95%',
      responseTime: '< 5 seconds'
    }
  },
  {
    id: 3,
    title: 'Soil Health Monitoring',
    category: 'Environmental Tech',
    description: 'Comprehensive soil analysis platform providing real-time nutrient data and personalized fertilization recommendations.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Active',
    progress: 92,
    duration: '24 months',
    farmers: 8000,
    location: 'Uttar Pradesh, Bihar',
    icon: BeakerIcon,
    gradient: 'from-amber-500 to-orange-600',
    technologies: ['Soil Sensors', 'Lab Integration', 'Data Analytics', 'Recommendation Engine'],
    impact: {
      soilTested: '50,000 samples',
      fertiliterSaved: '25%',
      yieldBoost: '35%'
    }
  },
  {
    id: 4,
    title: 'Market Intelligence Platform',
    category: 'Data Analytics',
    description: 'Real-time market price tracking and demand forecasting helping farmers make informed selling decisions.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Active',
    progress: 78,
    duration: '15 months',
    farmers: 12000,
    location: 'Pan India',
    icon: ChartBarIcon,
    gradient: 'from-green-500 to-emerald-600',
    technologies: ['Big Data', 'Predictive Analytics', 'API Integration', 'Real-time Processing'],
    impact: {
      priceAccuracy: '92%',
      profitIncrease: '28%',
      marketReach: '500+ mandis'
    }
  },
  {
    id: 5,
    title: 'Climate Resilient Farming',
    category: 'Sustainability',
    description: 'Developing climate-adaptive farming techniques and drought-resistant crop varieties for sustainable agriculture.',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Planning',
    progress: 25,
    duration: '36 months',
    farmers: 15000,
    location: 'Rajasthan, Gujarat',
    icon: GlobeAltIcon,
    gradient: 'from-teal-500 to-blue-600',
    technologies: ['Climate Modeling', 'Genetic Research', 'Satellite Imagery', 'Adaptive Systems'],
    impact: {
      droughtTolerance: '+60%',
      waterEfficiency: '+45%',
      carbonReduction: '1000 tons'
    }
  },
  {
    id: 6,
    title: 'Digital Farm Management',
    category: 'Platform Development',
    description: 'Comprehensive digital platform for end-to-end farm management including planning, monitoring, and reporting.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Beta Testing',
    progress: 88,
    duration: '20 months',
    farmers: 3500,
    location: 'Haryana, Madhya Pradesh',
    icon: RocketLaunchIcon,
    gradient: 'from-indigo-500 to-purple-600',
    technologies: ['React Native', 'IoT Integration', 'Blockchain', 'Cloud Infrastructure'],
    impact: {
      efficiency: '+50%',
      dataAccuracy: '98%',
      timesSaved: '20 hrs/week'
    }
  }
];

const categories = ['All', 'IoT & Automation', 'Artificial Intelligence', 'Environmental Tech', 'Data Analytics', 'Sustainability', 'Platform Development'];

const stats = [
  { label: 'Active Projects', value: '12+' },
  { label: 'Farmers Impacted', value: '46,000+' },
  { label: 'Technology Partners', value: '25+' },
  { label: 'Success Rate', value: '94%' }
];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Development': return 'bg-blue-100 text-blue-800';
      case 'Beta Testing': return 'bg-purple-100 text-purple-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-off-white to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-accent transform -rotate-12 scale-150"></div>
        </div>
        
        <motion.div 
          className="container mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary font-medium mb-6">
            <RocketLaunchIcon className="w-5 h-5 mr-2" />
            Innovation in Agriculture
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-text-dark mb-6">
            Our
            <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> Projects</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Pioneering agricultural technology solutions that are transforming farming practices and empowering farmers across India
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

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-brand-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-brand-primary/10 hover:text-brand-primary shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={selectedCategory}
        >
          {filteredProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                  
                  {/* Icon */}
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="text-sm text-brand-primary font-semibold mb-2">{project.category}</div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-text-dark mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 bg-gradient-to-r ${project.gradient} rounded-full transition-all duration-500`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserGroupIcon className="w-3 h-3 mr-1" />
                      <span>{project.farmers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="w-3 h-3 mr-1" />
                      <span className="truncate">{project.location.split(',')[0]}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors duration-300"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:border-brand-primary hover:text-brand-primary transition-colors duration-300">
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Project Impact Section */}
      <section className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 py-16 px-4 mt-16">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-4">
              Project Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Measuring success through real-world impact and farmer empowerment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Technology Innovation",
                description: "Cutting-edge solutions leveraging AI, IoT, and data analytics to solve real farming challenges",
                icon: "🚀",
                metrics: ["12+ Active Projects", "6 Technology Areas", "25+ Partner Institutions"]
              },
              {
                title: "Farmer Empowerment",
                description: "Direct impact on farmer livelihoods through increased yields, reduced costs, and better market access",
                icon: "👨‍🌾",
                metrics: ["46,000+ Farmers", "35% Avg. Yield Increase", "₹15,000 Extra Income/Year"]
              },
              {
                title: "Sustainable Agriculture",
                description: "Promoting environmentally responsible farming practices for long-term sustainability",
                icon: "🌱",
                metrics: ["30% Water Savings", "25% Fertilizer Reduction", "1000 Tons CO₂ Saved"]
              }
            ].map((impact, index) => (
              <motion.div
                key={impact.title}
                className="text-center p-6 bg-white rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{impact.icon}</div>
                <h3 className="text-xl font-heading font-bold text-text-dark mb-3">{impact.title}</h3>
                <p className="text-gray-600 mb-4">{impact.description}</p>
                <div className="space-y-2">
                  {impact.metrics.map((metric, idx) => (
                    <div key={idx} className="text-sm font-semibold text-brand-primary bg-brand-primary/10 rounded-full px-3 py-1">
                      {metric}
                    </div>
                  ))}
                </div>
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
            Partner With Us
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our mission to revolutionize agriculture through technology. Whether you're a farmer, researcher, or investor, let's build the future together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              className="inline-flex items-center px-8 py-4 bg-white text-brand-primary rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Start a Project
            </motion.button>
            
            <motion.button 
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-brand-primary transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
          
          <p className="text-white/80 mt-6 text-sm">
            🤝 Building partnerships that grow the future of agriculture
          </p>
        </motion.div>
      </section>

      {/* Project Detail Modal would go here if selectedProject is not null */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Modal content would go here - detailed project view */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              {/* Add more detailed project information here */}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects; 
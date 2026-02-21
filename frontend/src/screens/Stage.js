import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import kisanmelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import WeatherCard from '../components/WeatherCard';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { API_URL } from '../config';
import {
  Squares2X2Icon,
  SunIcon,
  CurrencyRupeeIcon,
  CpuChipIcon,
  BookOpenIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import CropRecommendationScreen from './CropRecommendationScreen';
import { PlanContext } from '../context/PlanContext';

// Fix for default marker icon (if needed, though not directly used for polygon)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to fit map view to given polygon positions
const FitBounds = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds.pad(0.2)); // add small padding
    }
  }, [map, positions]);
  return null;
};

// Farm Overview Component
const FarmOverview = ({ farmData }) => {
  const navigate = useNavigate();

  if (!farmData) {
    return null;
  }

  const centerCoordinates = farmData.location?.coordinates ? [farmData.location.coordinates[1], farmData.location.coordinates[0]] : [20.5937, 78.9629]; // Default to India center

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e0e0e0] p-6 mb-6">
      <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">Farm Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Farm Map Preview */}
        <div className="relative h-48 rounded-xl overflow-hidden border border-[#e0e0e0]">
          {farmData.plotCoordinates && farmData.plotCoordinates.length > 0 ? (
            <MapContainer
              center={centerCoordinates}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              attributionControl={false}
            >
              {/* Auto-fit map to farm polygon */}
              <FitBounds positions={farmData.plotCoordinates} />
              {/* Satellite imagery */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
              {/* Overlay boundaries & labels */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                attribution="Boundaries & Places © Esri"
                opacity={0.9}
                zIndex={2}
              />
              <Polygon
                positions={farmData.plotCoordinates}
                pathOptions={{ color: '#219653' }}
              />
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-3 p-4">
              <span className="text-gray-400">No farm plot drawn yet</span>
              <button
                type="button"
                onClick={() => navigate('/farm-setup')}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Set Up Your Farm
              </button>
            </div>
          )}
        </div>

        {/* Farm Details */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative bg-white rounded-xl shadow-md border border-[#e0e0e0] p-4 group hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Pincode</div>
                <div className="text-lg font-semibold text-[#1a1a1a]">
                  {farmData.pincode || 'Not set'}
                </div>
              </div>
            </div>
            <div className="relative bg-white rounded-xl shadow-md border border-[#e0e0e0] p-4 group hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Farm Area</div>
                <div className="text-lg font-semibold text-[#1a1a1a]">
                  {farmData.area ? `${farmData.area} acres` : 'Not set'}
                </div>
              </div>
            </div>
            <div className="relative bg-white rounded-xl shadow-md border border-[#e0e0e0] p-4 group hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Labour Capacity</div>
                <div className="text-lg font-semibold text-[#1a1a1a]">
                  {farmData.labourCapacity ? `${farmData.labourCapacity} people` : 'Not set'}
                </div>
              </div>
            </div>
            <div className="relative bg-white rounded-xl shadow-md border border-[#e0e0e0] p-4 group hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Irrigation Facility</div>
                <div className="text-lg font-semibold text-[#1a1a1a]">
                  {farmData.irrigationFacility || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [farmData, setFarmData] = useState(null);
  const [pincode, setPincode] = useState('');
  const { savedCrops, removeCrop, setActiveCrop } = React.useContext(PlanContext);

  // Sidebar navigation definition with icons
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/stage', Icon: Squares2X2Icon },
    { id: 'crops', name: 'Crop Suggestions', path: '/recommendations', Icon: SunIcon },
    { id: 'market', name: 'Market Rates', path: '/market', Icon: CurrencyRupeeIcon },
    { id: 'iot', name: 'IoT Monitoring', path: '/stage/iot', Icon: CpuChipIcon },
    { id: 'training', name: 'Training & Guides', path: '/stage/training', Icon: BookOpenIcon },
    { id: 'support', name: 'Support', path: '/stage/support', Icon: LifebuoyIcon },
  ];

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/me`);
        if (response.data.data.user.farmDetails) {
          const details = response.data.data.user.farmDetails;
          setFarmData(details);
          if (details.pincode) setPincode(details.pincode);
        }
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };

    fetchFarmData();
  }, []);

  // Keep sidebar selection in sync with current URL
  useEffect(() => {
    const current = navItems.find((n) => location.pathname.startsWith(n.path));
    if (current) setActiveItem(current.id);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigation = ({ id, path }) => {
    setActiveItem(id);
    if (id === 'crops') {
      if (pincode) {
        navigate(`/recommendations/${pincode}`);
      } else {
        alert('Please set your farm pincode first.');
      }
    } else {
      navigate(path);
    }
  };

  const cropEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes('tomato')) return '🍅';
    if (n.includes('chilli') || n.includes('chili') || n.includes('mirch')) return '🌶️';
    if (n.includes('onion')) return '🧅';
    if (n.includes('potato')) return '🥔';
    if (n.includes('wheat')) return '🌾';
    if (n.includes('rice')) return '🍚';
    if (n.includes('corn') || n.includes('maize')) return '🌽';
    if (n.includes('sugarcane')) return '🎋';
    if (n.includes('banana')) return '🍌';
    if (n.includes('blackgram') || n.includes('black gram') || n.includes('urad') || n.includes('udad')) return '🫘';
    return '🌱';
  };

  return (
    <div className="flex h-screen bg-[#f1f5f4] font-[Inter]">
      {/* Left Sidebar */}
      <aside className="w-[250px] bg-[#e6f4ea] flex flex-col shadow-lg">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-[#e0e0e0]">
          <img 
            src={kisanmelLogo} 
            alt="KisanMel Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ id, name, path, Icon }) => {
            const active = activeItem === id;
            return (
              <button
                key={id}
                onClick={() => handleNavigation({ id, path })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-[#2f722f] to-[#46a05e] text-white shadow-lg'
                    : 'text-[#1a1a1a] hover:bg-[#d4e9d7]'
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-[#2f722f]'}`}
                />
                <span className="font-medium tracking-wide">{name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="p-4 border-t border-[#e0e0e0] mt-auto flex flex-col gap-4">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="h-10 w-10 text-[#2f722f]" />
            <div>
              <p className="font-medium text-[#1a1a1a]">Farmer Name</p>
              <p className="text-sm text-[#2f722f]">View Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all duration-200 font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with Weather Widget */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gradient-to-br from-[#e9f8ee] via-white to-white px-8 py-6 rounded-3xl shadow-md border border-[#d5eddc]">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1a1a] tracking-wide">Farm Dashboard</h2>
              <p className="text-gray-600 mt-2">Welcome back! Here's your farm overview.</p>
            </div>
            <div className="flex items-center">
              {/* Weather Widget */}
              <WeatherCard
                lat={farmData?.location?.coordinates ? farmData.location.coordinates[1] : 26.9124}
                lon={farmData?.location?.coordinates ? farmData.location.coordinates[0] : 75.7873}
                locationName={farmData?.pincode ? `Pincode ${farmData.pincode}` : 'Jaipur'}
              />
            </div>
          </div>

          {/* Farm Overview Component */}
          <FarmOverview farmData={farmData} />

          {/* Saved Crops Plan */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">My Crop Plan</h3>
            {savedCrops.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-gray-500 mb-4">No crops added to plan yet.</p>
                <button
                  onClick={() => navigate(`/recommendations/${pincode}`)}
                  className="px-6 py-3 bg-gradient-to-r from-[#2f722f] to-[#46a05e] text-white rounded-2xl font-semibold hover:opacity-90 transition"
                >
                  Get Crop Recommendations
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                 {/* Render every saved crop as a full-size flash card */}
                 {savedCrops.map((crop, idx) => (
                   <div
                     key={crop.name}
                     className="bg-gradient-to-br from-[#e9f8ee] via-white to-white p-6 rounded-2xl border border-[#d5eddc] relative"
                   >
                     {/* Remove button */}
                     <button
                       onClick={() => removeCrop(crop.name)}
                       className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm"
                       aria-label="Remove crop"
                     >
                       ✕
                     </button>

                     <div className="flex flex-col lg:flex-row gap-6">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-4">
                           <div className="text-4xl">{cropEmoji(crop.name)}</div>
                           <div>
                             <h4 className="text-xl font-bold text-[#1a1a1a]">
                               {crop.name} {idx === 0 && '(Active Cultivation)'}
                             </h4>
                             <p className="text-sm text-gray-600">Recommended Score: {crop.score}/12</p>
                           </div>
                         </div>

                         {/* Crop Snapshot */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                           <div className="bg-white/60 p-3 rounded-xl">
                             <p className="text-xs text-gray-500 mb-1">Status</p>
                             <p className="font-semibold text-blue-600">
                               {idx === 0 ? 'Ready to Start' : 'Planned'}
                             </p>
                           </div>
                           <div className="bg-white/60 p-3 rounded-xl">
                             <p className="text-xs text-gray-500 mb-1">Expected Duration</p>
                             <p className="font-semibold text-[#1a1a1a]">90-120 days</p>
                           </div>
                           <div className="bg-white/60 p-3 rounded-xl">
                             <p className="text-xs text-gray-500 mb-1">Climate Match</p>
                             <p className="font-semibold text-green-600">Excellent</p>
                           </div>
                         </div>

                         {/* Alert about cultivation */}
                         <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-blue-500">ℹ️</span>
                             <p className="text-sm font-semibold text-blue-800">
                               {idx === 0 ? 'Ready to Begin Cultivation' : 'Upcoming Cultivation'}
                             </p>
                           </div>
                           <p className="text-sm text-blue-700">
                             Start your cultivation journey with step-by-step guidance and daily task tracking.
                           </p>
                         </div>
                       </div>

                       {/* Call to Action */}
                       <div className="lg:w-64 flex flex-col gap-3">
                         <button
                           onClick={() => {
                             if (idx !== 0) setActiveCrop(crop.name);
                             navigate(`/cultivation-guide/${crop.name}`);
                           }}
                           className="w-full px-6 py-4 bg-gradient-to-r from-[#2f722f] to-[#46a05e] text-white rounded-2xl font-semibold hover:opacity-90 transition shadow-lg text-center"
                         >
                           <span className="block text-lg mb-1">📋</span>
                           {idx === 0 ? 'View Cultivation Guide' : 'Start Cultivation'}
                         </button>
                         <p className="text-xs text-gray-500 text-center">
                           Daily tasks, stage tracking & expert guidance
                         </p>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>

          {/* Placeholder when no sub-section selected */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-[#e0e0e0] p-6 min-h-[300px] flex items-center justify-center text-gray-400">
            Coming Soon — Select an option from the sidebar.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stage; 
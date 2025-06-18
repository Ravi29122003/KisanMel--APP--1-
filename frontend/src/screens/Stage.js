import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import kisanmelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import WeatherCard from '../components/WeatherCard';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
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
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-400">No farm plot drawn yet</span>
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
  const { savedCrops, removeCrop } = React.useContext(PlanContext);

  // Sidebar navigation definition with icons
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/stage', Icon: Squares2X2Icon },
    { id: 'crops', name: 'Crop Suggestions', path: '/recommendations', Icon: SunIcon },
    { id: 'market', name: 'Market Rates', path: '/stage/market', Icon: CurrencyRupeeIcon },
    { id: 'iot', name: 'IoT Monitoring', path: '/stage/iot', Icon: CpuChipIcon },
    { id: 'training', name: 'Training & Guides', path: '/stage/training', Icon: BookOpenIcon },
    { id: 'support', name: 'Support', path: '/stage/support', Icon: LifebuoyIcon },
  ];

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/users/me');
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

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    if (item.id === 'crops') {
      if (pincode) {
        navigate(`/recommendations/${pincode}`);
      } else {
        alert('Please set your farm pincode first.');
      }
    } else {
      navigate(item.path);
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
    return '��';
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-700 rounded-2xl hover:bg-red-600/20 transition-all duration-200 shadow-sm"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Logout</span>
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
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">My Crop Plan</h3>
            {savedCrops.length === 0 ? (
              <p className="text-gray-500">No crops added to plan yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCrops.map((crop) => (
                  <div key={crop.name} className="relative bg-[#f5fff5] rounded-xl shadow-md p-4 flex flex-col gap-2 transition-transform duration-150 hover:scale-[1.02]">
                    {/* Remove button */}
                    <button
                      onClick={() => removeCrop(crop.name)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      aria-label="Remove crop"
                    >
                      ✕
                    </button>
                    {/* Icon */}
                    <div className="text-4xl">{cropEmoji(crop.name)}</div>
                    {/* Name */}
                    <h4 className="font-semibold text-[#1a1a1a] truncate">{crop.name}</h4>
                    {/* Score */}
                    <span className="text-sm font-semibold text-green-700">{crop.score}/12</span>
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
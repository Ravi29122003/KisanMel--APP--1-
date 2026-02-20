import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  Squares2X2Icon,
  SunIcon,
  CurrencyRupeeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CpuChipIcon,
  BookOpenIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import HeroFarmland from "../Images/hero-farmland.jpg";
import kisanmelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import { PlanContext } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';

const CropRecommendationScreen = () => {
  const [recommendationData, setRecommendationData] = useState(null);
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pincode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addCrop, savedCrops } = React.useContext(PlanContext);
  const { logout, user } = useAuth();

  // Sidebar nav
  const [activeItem, setActiveItem] = useState('crops');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/stage', Icon: Squares2X2Icon },
    { id: 'crops', name: 'Crop Suggestions', path: '/recommendations', Icon: SunIcon },
    { id: 'market', name: 'Market Rates', path: '/market', Icon: CurrencyRupeeIcon },
    { id: 'iot', name: 'IoT Monitoring', path: '/stage/iot', Icon: CpuChipIcon },
    { id: 'training', name: 'Training & Guides', path: '/stage/training', Icon: BookOpenIcon },
    { id: 'support', name: 'Support', path: '/stage/support', Icon: LifebuoyIcon },
  ];

  useEffect(() => {
    const current = navItems.find((n) => location.pathname.startsWith(n.path));
    if (current) setActiveItem(current.id);
  }, [location.pathname]);

  const handleNavigation = ({ id, path }) => {
    setActiveItem(id);
    if (id === 'crops') {
      navigate(`/recommendations/${pincode}`);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (pincode) {
      fetchRecommendations();
    }
  }, [pincode]);

  const fetchRecommendations = useCallback(async () => {
    if (!pincode) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/crops/recommendations/${pincode}`);
      setRecommendationData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
      setRecommendationData(null);
    } finally {
      setLoading(false);
    }
  }, [pincode]);

  const handleSave = (rec) => {
    addCrop({ name: rec.crop.crop_name, score: rec.score });
  };

  // Always call hooks before any early returns to maintain hook order
  const { validRecommendations, farmerCropCycle } = useMemo(() => {
    const allRecommendations = recommendationData?.recommendations || [];
    const cycle = recommendationData?.farmerCropCycle;
    
    // Filter out any recommendations with missing crop data
    const validRecs = allRecommendations.filter(rec => rec && rec.crop && rec.crop.crop_name);
    
    return {
      validRecommendations: validRecs,
      farmerCropCycle: cycle
    };
  }, [recommendationData]);
  
  // Apply display count to valid recommendations
  const recommendations = useMemo(() => {
    return validRecommendations.slice(0, displayCount === 'all' ? validRecommendations.length : displayCount);
  }, [validRecommendations, displayCount]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f1f5f4] font-[Inter]">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#e6f4ea] flex flex-col shadow-lg">
        <div className="p-6 border-b border-[#e0e0e0]">
          <img src={kisanmelLogo} alt="KisanMel Logo" className="h-12 w-auto object-contain" />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(({ id, name, path, Icon }) => {
            const active = activeItem === id;
            return (
              <button
                key={id}
                onClick={() => handleNavigation({ id, path })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  active ? 'bg-gradient-to-r from-[#2f722f] to-[#46a05e] text-white shadow-lg' : 'text-[#1a1a1a] hover:bg-[#d4e9d7]'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-[#2f722f]'}`} />
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
              <p className="font-medium text-[#1a1a1a]">{user?.name || 'Farmer'}</p>
              <p className="text-sm text-[#2f722f] cursor-pointer hover:text-[#46a05e] transition-colors">View Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-700 rounded-2xl hover:bg-red-600/20 transition-all duration-200 shadow-sm font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#1a1a1a] tracking-wide">Crop Recommendations</h1>
            <p className="mt-2 text-gray-600">Personalized suggestions based on your farm's location &amp; soil</p>
            {farmerCropCycle && (
              <p className="mt-1 text-gray-600 font-medium">Your Preferred Crop Cycle: {farmerCropCycle}</p>
            )}
            <div className="mt-6 inline-flex rounded-2xl shadow-sm border border-[#d4e9d7] overflow-hidden">
              {[3, 5, 'all'].map((num) => (
                <button
                  key={num}
                  onClick={() => setDisplayCount(num)}
                  className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-150 ${
                    displayCount === num
                      ? 'bg-[#2f722f] text-white'
                      : 'bg-white hover:bg-[#e6f4ea] text-[#1a1a1a]'
                  }`}
                >
                  {num === 'all' ? 'All' : `Top ${num}`}
                </button>
              ))}
            </div>
            <button
              onClick={fetchRecommendations}
              className="ml-4 inline-flex items-center gap-1 px-3 py-2 text-sm bg-white border border-[#e0e0e0] rounded-2xl hover:bg-[#e6f4ea] transition">
              <ArrowPathIcon className="h-4 w-4 text-[#2f722f]" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={fetchRecommendations}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.crop._id}
                  className="bg-white rounded-2xl shadow-md border border-[#e0e0e0] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col md:flex-row w-full md:max-w-5xl"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-[#1a1a1a]">{rec.crop.crop_name}</h2>
                      <span className="text-sm text-gray-500">{rec.crop.crop_variety || 'Standard'}</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Compatibility Score</span>
                        <span className="text-lg font-semibold text-green-600">{rec.score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${(rec.score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="text-gray-900">{rec.crop.crop_category || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="text-gray-900">
                          {rec.crop.crop_duration_days_min && rec.crop.crop_duration_days_max 
                            ? `${rec.crop.crop_duration_days_min}-${rec.crop.crop_duration_days_max} days` 
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sowing Months:</span>
                        <span className="text-gray-900">{rec.crop.sowing_months || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Part Used</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.Part_Used || rec.crop.part_used || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Industry Demand</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.Industry_Demand || rec.crop.industry_demand || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Sowing Months</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.sowing_months || rec.crop.Sowing_Months || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Expected Yield</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.expected_yield_per_acre || rec.crop.Expected_Yield_per_Acre || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Crop Cycle</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.cropCycle}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Compatibility Factors</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          {rec.compatibility.soilType ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">Soil Type</span>
                        </div>
                        <div className="flex items-center">
                          {rec.compatibility.ph ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">pH Level</span>
                        </div>
                        <div className="flex items-center">
                          {rec.compatibility.npk ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">NPK</span>
                        </div>
                        <div className="flex items-center">
                          {rec.compatibility.cropCycle ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">Crop Cycle</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Action Panel */}
                  <div className="bg-[#f7fdf9] md:w-64 px-4 py-6 flex flex-col h-full border-t md:border-t-0 md:border-l border-[#e0e0e0]">
                    {/* Buttons area */}
                    <div className="flex-1 flex flex-col space-y-4">
                      <button
                        onClick={() => navigate('/market')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#2f722f] text-sm font-medium border border-[#2f722f] rounded-2xl hover:bg-[#e6f4ea] transition"
                      >
                        <GlobeAltIcon className="h-4 w-4" />
                        Market Connect
                      </button>
                      <button
                        onClick={() => navigate('/market')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#2f722f] text-sm font-medium border border-[#2f722f] rounded-2xl hover:bg-[#e6f4ea] transition"
                      >
                        <CurrencyRupeeIcon className="h-4 w-4" />
                        Prices
                      </button>
                      <button
                        onClick={() => navigate('/market')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#2f722f] text-sm font-medium border border-[#2f722f] rounded-2xl hover:bg-[#e6f4ea] transition"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        Contracts
                      </button>
                    </div>

                    {/* Save button at bottom */}
                    <button
                      onClick={() => handleSave(rec)}
                      className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-[#2f722f] to-[#46a05e] text-white text-sm font-semibold rounded-2xl hover:opacity-90 transition disabled:opacity-60"
                      disabled={!!savedCrops.find(c => c.name === rec.crop.crop_name)}
                    >
                      {savedCrops.find(c => c.name === rec.crop.crop_name) ? 'Saved' : 'Save to Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CropRecommendationScreen; 
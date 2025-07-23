import React, { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';
import HeroFarmland from "../Images/hero-farmland.jpg";
import kisanmelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import { PlanContext } from '../context/PlanContext';

const CropRecommendationScreen = () => {
  const [allRecs, setAllRecs] = useState([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pincode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addCrop, savedCrops } = React.useContext(PlanContext);

  // Sidebar nav
  const [activeItem, setActiveItem] = useState('crops');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/stage', Icon: Squares2X2Icon },
    { id: 'crops', name: 'Crop Suggestions', path: '/recommendations', Icon: SunIcon },
    { id: 'market', name: 'Market Rates', path: '/stage/market', Icon: CurrencyRupeeIcon },
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

  useEffect(() => {
    fetchRecommendations();
  }, [pincode]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/crops/recommendations/${pincode}`);
      setAllRecs(response.data.data.recommendations);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (rec) => {
    addCrop({ name: rec.crop.name, score: rec.score });
  };

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

  const recommendations = allRecs.slice(0, displayCount === 'all' ? allRecs.length : displayCount);
  const farmerCropCycle = allRecs?.farmerCropCycle;

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
                      <h2 className="text-xl font-semibold text-[#1a1a1a]">{rec.crop.name}</h2>
                      <span className="text-sm text-gray-500">{rec.crop.name_hi}</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Compatibility Score</span>
                        <span className="text-lg font-semibold text-green-600">{rec.score}/12</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${(rec.score / 12) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Family</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.family}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Water Requirement</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.waterRequirement}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Sowing Season</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.sowingSeason.join(', ')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Expected Yield</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.expectedYieldPerHectare}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Crop Cycle</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.crop.cropCycle}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Compatibility Factors</h3>
                      <div className="grid grid-cols-3 gap-2">
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
                          {rec.compatibility.temperature ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">Temperature</span>
                        </div>
                        <div className="flex items-center">
                          {rec.compatibility.rainfall ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">Rainfall</span>
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
                        onClick={() => navigate('/stage/market')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#2f722f] text-sm font-medium border border-[#2f722f] rounded-2xl hover:bg-[#e6f4ea] transition"
                      >
                        <GlobeAltIcon className="h-4 w-4" />
                        Market Connect
                      </button>
                      <button
                        onClick={() => navigate('/stage/prices')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#2f722f] text-sm font-medium border border-[#2f722f] rounded-2xl hover:bg-[#e6f4ea] transition"
                      >
                        <CurrencyRupeeIcon className="h-4 w-4" />
                        Prices
                      </button>
                      <button
                        onClick={() => navigate('/stage/contracts')}
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
                      disabled={!!savedCrops.find(c => c.name === rec.crop.name)}
                    >
                      {savedCrops.find(c => c.name === rec.crop.name) ? 'Saved' : 'Save to Plan'}
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
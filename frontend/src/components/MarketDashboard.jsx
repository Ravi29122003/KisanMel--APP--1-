import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon, ClockIcon, PhoneIcon, BuildingOfficeIcon, ChartBarIcon, CurrencyRupeeIcon, TruckIcon, StarIcon, DocumentTextIcon, ChartPieIcon, Squares2X2Icon, SunIcon, CpuChipIcon, BookOpenIcon, LifebuoyIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { PlanContext } from '../context/PlanContext';
import KisanMelLogo from '../components/auth/KISANMEL LOGO WHITE.png';
import axios from 'axios';

const MarketDashboard = () => {
  const { logout, user } = useAuth();
  const { savedCrops } = useContext(PlanContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('market');
  
  const [marketOffers, setMarketOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [cropContracts, setCropContracts] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const [searchContracts, setSearchContracts] = useState([]); // New state for search contracts
  const [searchPagination, setSearchPagination] = useState(null); // New state for pagination
  const [searchStats, setSearchStats] = useState(null); // New state for search stats
  const [contractsLoading, setContractsLoading] = useState(true);
  const [contractsError, setContractsError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offersSearchLoading, setOffersSearchLoading] = useState(false); // New state for market offers search
  const [error, setError] = useState(null);
  const [farmData, setFarmData] = useState(null);
  const [activeTab, setActiveTab] = useState('offers');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [contractSearchTerm, setContractSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedMarketType, setSelectedMarketType] = useState('');
  const [maxDistance, setMaxDistance] = useState('100');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Available options for filters
  const cropOptions = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Tomato'];
  const marketTypeOptions = ['Spot', 'Contract', 'Export', 'Processing'];

  // Sidebar navigation definition with icons
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/stage', Icon: Squares2X2Icon },
    { id: 'crops', name: 'Crop Suggestions', path: '/recommendations', Icon: SunIcon },
    { id: 'market', name: 'Market Rates', path: '/market', Icon: CurrencyRupeeIcon },
    { id: 'iot', name: 'IoT Monitoring', path: '/stage/iot', Icon: CpuChipIcon },
    { id: 'training', name: 'Training & Guides', path: '/stage/training', Icon: BookOpenIcon },
    { id: 'support', name: 'Support', path: '/stage/support', Icon: LifebuoyIcon },
  ];

  // Handle navigation
  const handleNavigation = ({ id, path }) => {
    setActiveItem(id);
    if (id === 'crops') {
      if (farmData?.pincode) {
        navigate(`/recommendations/${farmData.pincode}`);
      } else {
        alert('Please set your farm pincode first.');
      }
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  useEffect(() => {
    if (farmData) {
      fetchMarketOffers();
    }
  }, [farmData, selectedCrop, selectedMarketType, maxDistance]);

  // Debounced search effect for market contracts
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (farmData && searchTerm) {
        searchContractsForCrop(searchTerm, 1); // Search for contracts instead of offers
      } else if (farmData && !searchTerm) {
        // If search is cleared, fetch normal filtered offers and clear search results
        setSearchContracts([]);
        setSearchPagination(null);
        setSearchStats(null);
        fetchMarketOffers();
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, farmData]);

  useEffect(() => {
    filterOffers();
  }, [marketOffers, searchTerm, minPrice, maxPrice]);

  // Fetch crop contracts when saved crops change
  useEffect(() => {
    if (savedCrops.length > 0) {
      fetchLatestCropContracts();
    } else {
      setCropContracts({});
      setContractsLoading(false);
    }
  }, [savedCrops]);

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (contractSearchTerm) {
        searchForContract(contractSearchTerm);
      } else {
        setSearchResult(null);
        setSearchError(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [contractSearchTerm]);

  const fetchFarmData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.data.user.farmDetails) {
          setFarmData(response.data.data.user.farmDetails);
          // Set default crop based on farmer's preferred crops
          if (response.data.data.user.farmDetails.crops && response.data.data.user.farmDetails.crops.length > 0) {
            setSelectedCrop(response.data.data.user.farmDetails.crops[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching farm data:', error);
    }
  };

  const fetchMarketOffers = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = 'http://localhost:5000';
      
      const params = new URLSearchParams();
      params.append('crop', selectedCrop || (farmData?.crops?.[0]) || 'Rice');
      params.append('type', selectedMarketType || '');
      params.append('maxDistance', maxDistance || '100');
      
      const url = `${API_BASE_URL}/api/market/dashboard?${params}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Market data received:', data);
      setMarketOffers(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Market offers fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const searchContractsForCrop = async (cropName, page = 1) => {
    if (!cropName || !cropName.trim()) {
      setSearchContracts([]);
      setSearchPagination(null);
      setSearchStats(null);
      return;
    }

    try {
      setOffersSearchLoading(true);
      const API_BASE_URL = 'http://localhost:5000';
      
      const url = `${API_BASE_URL}/api/market/contracts/all?page=${page}&limit=3`;
      console.log('Searching contracts for:', cropName, 'page:', page);
      
      const response = await axios.post(url, {
        cropName: cropName.trim()
      });

      console.log('Contract search results:', response.data);
      
      if (response.data.found) {
        setSearchContracts(response.data.data.contracts || []);
        setSearchPagination(response.data.data.pagination || null);
        setSearchStats(response.data.data.stats || null);
      } else {
        setSearchContracts([]);
        setSearchPagination(null);
        setSearchStats(null);
      }
      
      setOffersSearchLoading(false);
    } catch (err) {
      console.error('Contract search error:', err);
      setSearchContracts([]);
      setSearchPagination(null);
      setSearchStats(null);
      setOffersSearchLoading(false);
    }
  };

  const fetchMarketOffersWithSearch = async () => {
    try {
      setOffersSearchLoading(true); // Use separate loading state for search
      const API_BASE_URL = 'http://localhost:5000';
      
      // When searching, fetch all offers without crop restriction
      const params = new URLSearchParams();
      params.append('type', selectedMarketType || '');
      params.append('maxDistance', maxDistance || '100');
      // Don't set crop parameter to get all crops for search
      
      const url = `${API_BASE_URL}/api/market/dashboard?${params}`;
      console.log('Fetching search results from:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search market data received:', data);
      setMarketOffers(data.data || []);
      setOffersSearchLoading(false);
    } catch (err) {
      console.error('Market offers search error:', err);
      setError(err.message);
      setOffersSearchLoading(false);
    }
  };

  const fetchLatestCropContracts = async () => {
    try {
      setContractsLoading(true);
      setContractsError(null);
      
      const API_BASE_URL = 'http://localhost:5000';
      
      const response = await axios.post(`${API_BASE_URL}/api/market/contracts`, {
        crops: savedCrops.map(crop => crop.name)
      });

      console.log('Latest crop contracts received:', response.data);
      setCropContracts(response.data.data || {});
      setContractsLoading(false);
    } catch (err) {
      console.error('Error fetching latest crop contracts:', err);
      setContractsError(err.response?.data?.message || 'Failed to fetch latest crop contracts');
      setContractsLoading(false);
    }
  };

  const searchForContract = async (cropName) => {
    if (!cropName || !cropName.trim()) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      
      const API_BASE_URL = 'http://localhost:5000';
      
      const response = await axios.post(`${API_BASE_URL}/api/market/search`, {
        cropName: cropName.trim()
      });

      console.log('Search result:', response.data);
      setSearchResult(response.data);
      setSearchLoading(false);
    } catch (err) {
      console.error('Error searching for contract:', err);
      setSearchError(err.response?.data?.message || 'Failed to search for contract');
      setSearchResult(null);
      setSearchLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = [...marketOffers];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.buyer_details?.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.location?.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter(offer => offer.price_per_kg >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(offer => offer.price_per_kg <= parseFloat(maxPrice));
    }

    setFilteredOffers(filtered);
  };

  const handleRefresh = () => {
    if (searchTerm) {
      searchContractsForCrop(searchTerm, 1); // Search for contracts when there's a search term
    } else {
      fetchMarketOffers();
    }
    if (savedCrops.length > 0) {
      fetchLatestCropContracts();
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'A': 'bg-green-50 text-green-700 border-green-200',
      'B+': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'B': 'bg-amber-50 text-amber-700 border-amber-200',
      'C': 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[grade] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getDemandColor = (demand) => {
    const colors = {
      'Very High': 'bg-red-500 text-white',
      'High': 'bg-orange-500 text-white',
      'Medium': 'bg-yellow-500 text-white',
      'Low': 'bg-green-500 text-white'
    };
    return colors[demand] || 'bg-gray-500 text-white';
  };

  const getMarketTypeIcon = (type) => {
    switch(type) {
      case 'Spot': return '⚡';
      case 'Contract': return '📋';
      case 'Export': return '🌍';
      case 'Processing': return '🏭';
      default: return '💼';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const ContractCard = ({ contract, isFromSearch = false }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl truncate">
                {contract.buyer_details?.company_name || 'N/A'}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg">{getMarketTypeIcon(contract.market_type)}</span>
                <span className="text-green-100 text-sm font-medium">{contract.market_type}</span>
                {isFromSearch && (
                  <span className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Search Result
                  </span>
                )}
              </div>
            </div>
            <div className={`px-3 py-2 rounded-xl text-sm font-bold ${getDemandColor(contract.industry_demand)}`}>
              {contract.industry_demand}
            </div>
          </div>
          
          <div className="flex items-center text-green-100 text-sm">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">{contract.location?.district}, {contract.location?.state}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Crop Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Crop & Variety</p>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="font-bold text-green-800 text-lg">{contract.crop}</p>
                <p className="text-green-600 text-sm">{contract.variety}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Quality Grade</p>
              <div className={`inline-block px-4 py-3 rounded-xl text-sm font-bold border ${getGradeColor(contract.quality_grade)}`}>
                {contract.quality_grade}
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price per KG</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-green-600">₹{contract.price_per_kg}</span>
                  <span className="text-gray-500 text-sm">/kg</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                <CurrencyRupeeIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Demand Quantity</p>
              <p className="font-bold text-gray-800 text-lg">{contract.demand_quantity}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Valid Till</p>
              <p className="font-bold text-gray-800 text-lg">{formatDate(contract.valid_till || contract.updatedAt)}</p>
            </div>
          </div>

          {/* Contact & Date Info */}
          <div className="border-t border-gray-200 pt-5 mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span className="font-semibold">{contract.buyer_details?.contact_person || 'Contact Available'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>Updated: {formatDate(contract.updatedAt || contract.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg">
            Contact Buyer
          </button>
        </div>
      </div>
    );
  };

  const ContractFlashcard = ({ contract, cropName, totalAvailable, lastUpdated, isSearchResult = false }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl truncate">
                {contract.buyer_details?.company_name || 'N/A'}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg">{getMarketTypeIcon(contract.market_type)}</span>
                <span className="text-green-100 text-sm font-medium">{contract.market_type}</span>
                {isSearchResult && (
                  <span className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Latest
                  </span>
                )}
              </div>
            </div>
            <div className={`px-3 py-2 rounded-xl text-sm font-bold ${getDemandColor(contract.industry_demand)}`}>
              {contract.industry_demand}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-green-100 text-sm">
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span className="font-medium">{contract.location?.district}, {contract.location?.state}</span>
            </div>
            {totalAvailable > 1 && (
              <span className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                +{totalAvailable - 1} more
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Crop Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Crop & Variety</p>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="font-bold text-green-800 text-lg">{contract.crop}</p>
                <p className="text-green-600 text-sm">{contract.variety}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Quality Grade</p>
              <div className={`inline-block px-4 py-3 rounded-xl text-sm font-bold border ${getGradeColor(contract.quality_grade)}`}>
                {contract.quality_grade}
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price per KG</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-green-600">₹{contract.price_per_kg}</span>
                  <span className="text-gray-500 text-sm">/kg</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                <CurrencyRupeeIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Demand Quantity</p>
              <p className="font-bold text-gray-800 text-lg">{contract.demand_quantity}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Distance</p>
              <p className="font-bold text-gray-800 text-lg">{contract.distance_km} km</p>
            </div>
          </div>

          {/* Contact & Date Info */}
          <div className="border-t border-gray-200 pt-5 mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span className="font-semibold">{contract.buyer_details?.contact_person || 'Contact Available'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>Updated: {formatDate(lastUpdated)}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg">
            Contact Buyer
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f1f5f4] font-[Inter]">
        {/* Left Sidebar */}
        <aside className="w-[280px] bg-[#e6f4ea] flex flex-col shadow-lg">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-[#e0e0e0]">
            <img 
              src={KisanMelLogo} 
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
                <p className="font-medium text-[#1a1a1a]">{user?.name || 'Farmer'}</p>
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

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Loading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Market Dashboard</h1>
              <p className="text-lg text-gray-600">Connect with verified buyers for competitive prices</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                <div className="text-center">
                  <p className="text-gray-700 font-semibold text-lg">Loading market offers...</p>
                  <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#f1f5f4] font-[Inter]">
        {/* Left Sidebar */}
        <aside className="w-[280px] bg-[#e6f4ea] flex flex-col shadow-lg">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-[#e0e0e0]">
            <img 
              src={KisanMelLogo} 
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
                <p className="font-medium text-[#1a1a1a]">{user?.name || 'Farmer'}</p>
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

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-green-50 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Error Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4 shadow-lg">
                <BuildingOfficeIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Market Dashboard</h1>
              <p className="text-lg text-gray-600">Connect with verified buyers for competitive prices</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-red-600 text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Unable to load market data</h3>
                <p className="text-red-600 mb-8 text-lg">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f1f5f4] font-[Inter]">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-[#e6f4ea] flex flex-col shadow-lg">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-[#e0e0e0]">
          <img 
            src={KisanMelLogo} 
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
              <p className="font-medium text-[#1a1a1a]">{user?.name || 'Farmer'}</p>
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
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-green-50 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                    <ChartBarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">Market Dashboard</h1>
                    <p className="text-lg text-gray-600">Connect with verified buyers for competitive prices</p>
                  </div>
                </div>
                
                {farmData && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                        <MapPinIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-semibold">{farmData.district}, {farmData.state}</span>
                      </div>
                      {farmData.crops && farmData.crops.length > 0 && (
                        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                          <span className="text-sm">🌾</span>
                          <span className="text-emerald-700 font-semibold">Growing: {farmData.crops.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                        <StarIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 font-semibold">Personalized</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 font-semibold">Filters</span>
                </button>
                <button 
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'offers'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Market Offers</span>
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'contracts'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>My Crop Contracts</span>
                  {savedCrops.length > 0 && (
                    <span className="bg-white bg-opacity-20 text-current text-xs rounded-full px-3 py-1 font-bold">
                      {savedCrops.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'offers' && (
            <>
              {/* Enhanced Search and Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    {offersSearchLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
                    ) : (
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Search by crop, variety, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-sm font-medium"
                    disabled={loading}
                  />
                  {offersSearchLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs text-green-600 font-semibold">Searching...</span>
                    </div>
                  )}
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        { label: 'Crop', value: selectedCrop, setValue: setSelectedCrop, options: cropOptions },
                        { label: 'Market Type', value: selectedMarketType, setValue: setSelectedMarketType, options: marketTypeOptions },
                        { label: 'Max Distance (km)', value: maxDistance, setValue: setMaxDistance, type: 'number', placeholder: '100' },
                        { label: 'Min Price (₹/kg)', value: minPrice, setValue: setMinPrice, type: 'number', placeholder: '0' },
                        { label: 'Max Price (₹/kg)', value: maxPrice, setValue: setMaxPrice, type: 'number', placeholder: '1000' }
                      ].map((filter, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {filter.label}
                          </label>
                          {filter.options ? (
                            <select 
                              value={filter.value} 
                              onChange={(e) => filter.setValue(e.target.value)}
                              className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                            >
                              <option value="">{filter.label === 'Crop' ? 'All Crops' : 'All Types'}</option>
                              {filter.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={filter.type || 'text'}
                              value={filter.value}
                              onChange={(e) => filter.setValue(e.target.value)}
                              className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                              placeholder={filter.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Results Summary */}
              <div className="mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        {offersSearchLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {searchTerm ? searchContracts.length : filteredOffers.length}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {offersSearchLoading ? (
                            <span>{searchTerm ? 'Searching contracts...' : 'Searching offers...'}</span>
                          ) : (
                            <>
                              {searchTerm ? (
                                <>
                                  {searchContracts.length} Contract{searchContracts.length !== 1 ? 's' : ''} Found
                                  <span className="text-green-600"> for "{searchTerm}"</span>
                                </>
                              ) : (
                                <>
                                  {filteredOffers.length} Active Offers
                                </>
                              )}
                            </>
                          )}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {offersSearchLoading ? 
                            `Please wait while we find matching ${searchTerm ? 'contracts' : 'offers'}` : 
                            (searchTerm ? 
                              (searchStats ? 
                                `Avg Price: ₹${searchStats.avgPrice}/kg • ${searchStats.uniqueBuyers} Unique Buyers` : 
                                'Market contracts from verified buyers'
                              ) : 
                              'Verified buyers ready to connect'
                            )
                          }
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500">
                      {searchTerm && searchStats ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">₹{searchStats.priceRange.min}</span>
                            <span>Min</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">₹{searchStats.priceRange.max}</span>
                            <span>Max</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <TruckIcon className="w-5 h-5 text-green-500" />
                            <span className="font-medium">Fast Delivery</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CurrencyRupeeIcon className="w-5 h-5 text-green-500" />
                            <span className="font-medium">Best Prices</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              {searchTerm ? (
                // Contract Search Results
                searchContracts.length === 0 && !offersSearchLoading ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No market contracts found for "{searchTerm}" currently.</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                      We couldn't find any active contracts for this crop. Try searching for a different crop name.
                    </p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Contract Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {searchContracts.map((contract, index) => (
                        <ContractCard 
                          key={contract._id || index}
                          contract={contract}
                          isFromSearch={true}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {searchPagination && searchPagination.totalPages > 1 && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600 font-medium">
                            Showing {searchContracts.length} of {searchPagination.totalContracts} contracts
                            (Page {searchPagination.currentPage} of {searchPagination.totalPages})
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => searchContractsForCrop(searchTerm, searchPagination.currentPage - 1)}
                              disabled={!searchPagination.hasPreviousPage}
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                searchPagination.hasPreviousPage
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Previous
                            </button>
                            <span className="px-4 py-3 text-sm font-bold text-gray-600">
                              {searchPagination.currentPage}
                            </span>
                            <button
                              onClick={() => searchContractsForCrop(searchTerm, searchPagination.currentPage + 1)}
                              disabled={!searchPagination.hasNextPage}
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                searchPagination.hasNextPage
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                // Market Offers (when not searching)
                filteredOffers.length === 0 && !offersSearchLoading ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No market offers found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                      No offers match your current criteria. Try adjusting your filters.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedCrop('');
                        setSelectedMarketType('');
                        setMinPrice('');
                        setMaxPrice('');
                        setMaxDistance('100');
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map((offer, index) => (
                      <div
                        key={offer._id || index}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]"
                      >
                        {/* Compact Card Header */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg truncate">
                                {offer.buyer_details?.company_name || 'N/A'}
                              </h3>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm">{getMarketTypeIcon(offer.market_type)}</span>
                                <span className="text-green-100 text-sm font-medium">{offer.market_type}</span>
                              </div>
                            </div>
                            <div className={`px-3 py-2 rounded-xl text-xs font-bold ${getDemandColor(offer.industry_demand)}`}>
                              {offer.industry_demand}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-green-100 text-sm">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            <span className="font-medium">{offer.location?.district}, {offer.location?.state}</span>
                          </div>
                        </div>

                        {/* Compact Card Body */}
                        <div className="p-5">
                          {/* Crop Info Section */}
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Crop</p>
                              <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                <p className="font-bold text-green-800 text-sm">{offer.crop}</p>
                                <p className="text-green-600 text-xs">{offer.variety}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Grade</p>
                              <div className={`inline-block px-3 py-2 rounded-xl text-xs font-bold border ${getGradeColor(offer.quality_grade)}`}>
                                {offer.quality_grade}
                              </div>
                            </div>
                          </div>

                          {/* Price Section */}
                          <div className="bg-green-50 rounded-xl p-4 mb-5 border border-green-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price</p>
                                <div className="flex items-baseline space-x-1">
                                  <span className="text-2xl font-bold text-green-600">₹{offer.price_per_kg}</span>
                                  <span className="text-gray-500 text-xs">/kg</span>
                                </div>
                              </div>
                              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                <CurrencyRupeeIcon className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Quantity</p>
                              <p className="font-bold text-gray-800 text-sm">{offer.demand_quantity}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Distance</p>
                              <p className="font-bold text-gray-800 text-sm">{offer.distance_km} km</p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="border-t border-gray-200 pt-4 mb-5">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>{new Date(offer.listed_on).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short'
                                })}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <PhoneIcon className="h-3 w-3" />
                                <span className="font-semibold">{offer.buyer_details?.contact_person}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg">
                            Contact Buyer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-8">
              {/* Contract Search Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <MagnifyingGlassIcon className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Search Latest Contracts</h3>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for latest contract by crop name (e.g., Rice, Wheat, Maize)..."
                    value={contractSearchTerm}
                    onChange={(e) => setContractSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 font-medium"
                  />
                </div>
                
                {/* Search Result */}
                {searchLoading && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      <span className="text-blue-700 text-sm font-medium">Searching for latest contract...</span>
                    </div>
                  </div>
                )}
                
                {searchError && (
                  <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-700 text-sm font-medium">{searchError}</p>
                  </div>
                )}
                
                {searchResult && searchResult.found === false && contractSearchTerm && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-orange-700 text-sm font-bold">{searchResult.message}</p>
                  </div>
                )}
              </div>

              {/* Search Result Contract */}
              {searchResult && searchResult.found && searchResult.data && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Search Result</h3>
                    <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-bold">
                      Latest Contract for "{searchResult.searchedCrop}"
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ContractFlashcard 
                      contract={searchResult.data}
                      cropName={searchResult.searchedCrop}
                      totalAvailable={searchResult.totalAvailable}
                      lastUpdated={searchResult.lastUpdated}
                      isSearchResult={true}
                    />
                  </div>
                </div>
              )}

              {/* Crop Plan Integration Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Latest Contracts for My Crop Plan</h2>
                    <p className="text-gray-600 text-lg">
                      {savedCrops.length > 0 
                        ? `Latest contracts for ${savedCrops.length} saved crop${savedCrops.length > 1 ? 's' : ''}`
                        : 'No crops saved in your plan yet'
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ChartPieIcon className="w-6 h-6 text-green-600" />
                    <span className="text-lg font-bold text-gray-700">
                      {Object.keys(cropContracts).length} Active Contract{Object.keys(cropContracts).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contracts Loading/Error States */}
              {contractsLoading && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                    <div className="text-center">
                      <p className="text-gray-700 font-semibold text-lg">Loading latest contracts...</p>
                      <p className="text-gray-500 text-sm mt-2">Fetching latest contracts for your saved crops</p>
                    </div>
                  </div>
                </div>
              )}

              {contractsError && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-red-600 text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Unable to load contracts</h3>
                    <p className="text-red-600 mb-8 text-lg">{contractsError}</p>
                    <button 
                      onClick={() => fetchLatestCropContracts()}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* No Crops Saved State */}
              {!contractsLoading && !contractsError && savedCrops.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <DocumentTextIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No crops in your plan</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                    Add crops to your plan to see latest contract opportunities automatically.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/recommendations'}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg"
                  >
                    Add Crops to Plan
                  </button>
                </div>
              )}

              {/* Latest Crop Contracts Display */}
              {!contractsLoading && !contractsError && savedCrops.length > 0 && (
                <div className="space-y-8">
                  {Object.keys(cropContracts).length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <DocumentTextIcon className="h-10 w-10 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No contracts found</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto text-lg">
                        No active contracts available for your saved crops.
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        Saved crops: {savedCrops.map(crop => crop.name).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Crop Plan Contracts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(cropContracts).map(([cropKey, cropData]) => (
                          <ContractFlashcard 
                            key={cropKey}
                            contract={cropData.contract}
                            cropName={cropData.crop}
                            totalAvailable={cropData.totalAvailable}
                            lastUpdated={cropData.lastUpdated}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard; 
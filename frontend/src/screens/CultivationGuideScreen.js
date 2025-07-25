import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import FarmLog from '../components/FarmLog';
import SmartAlerts from '../components/SmartAlerts';

// Add custom styles for animations
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(46, 114, 47, 0.3); }
    50% { box-shadow: 0 0 30px rgba(46, 114, 47, 0.6); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

import {
  Squares2X2Icon,
  SunIcon,
  CurrencyRupeeIcon,
  CpuChipIcon,
  BookOpenIcon,
  LifebuoyIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentListIcon,
  DevicePhoneMobileIcon,
  ArrowPathIcon,
  BanknotesIcon,
  GlobeAltIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  BugAntIcon,
  WrenchScrewdriverIcon,
  CloudIcon,
  TruckIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  ChartBarSquareIcon,
  MapIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import kisanmelLogo from '../components/auth/KISANMEL LOGO WHITE.png';

const CultivationGuideScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cropName } = useParams();
  const [activeItem, setActiveItem] = useState('cultivation');
  const [selectedStage, setSelectedStage] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [farmData, setFarmData] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [showTasksSection, setShowTasksSection] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState('text'); // 'text' or 'video'
  const [showFarmLog, setShowFarmLog] = useState(false);

     // Sample crop stages data
   const cropStages = [
     {
       id: 1,
       name: 'Land Preparation',
       duration: '7-10 days',
       description: 'Prepare the soil for optimal planting conditions',
       status: 'completed',
       color: 'bg-green-500',
       icon: WrenchScrewdriverIcon
     },
     {
       id: 2,
       name: 'Sowing',
       duration: '1-2 days',
       description: 'Plant the seeds at optimal depth and spacing',
       status: 'completed',
       color: 'bg-green-500',
       icon: SunIcon
     },
     {
       id: 3,
       name: 'Germination',
       duration: '7-14 days',
       description: 'Monitor seed sprouting and early growth',
       status: 'current',
       color: 'bg-blue-500',
       icon: BeakerIcon
     },
     {
       id: 4,
       name: 'Vegetative Growth',
       duration: '30-45 days',
       description: 'Focus on leaf development and plant establishment',
       status: 'upcoming',
       color: 'bg-gray-400',
       icon: ChartBarSquareIcon
     },
     {
       id: 5,
       name: 'Flowering',
       duration: '15-25 days',
       description: 'Monitor flower development and pollination',
       status: 'upcoming',
       color: 'bg-gray-400',
       icon: SunIcon
     },
     {
       id: 6,
       name: 'Pod Formation',
       duration: '20-30 days',
       description: 'Watch for pod development and fruit formation',
       status: 'upcoming',
       color: 'bg-gray-400',
       icon: BuildingStorefrontIcon
     },
     {
       id: 7,
       name: 'Maturation',
       duration: '15-20 days',
       description: 'Monitor crop maturity and prepare for harvest',
       status: 'upcoming',
       color: 'bg-gray-400',
       icon: ChartBarSquareIcon
     },
     {
       id: 8,
       name: 'Harvesting',
       duration: '3-5 days',
       description: 'Harvest the mature crop at optimal time',
       status: 'upcoming',
       color: 'bg-gray-400',
       icon: TruckIcon
     }
   ];

  // Daily tasks for each stage
  const dailyTasksByStage = {
    'Land Preparation': [
      {
        id: 'land-1',
                 task: 'Check soil moisture levels',
         description: 'Test soil by grabbing a handful - it should crumble easily, not be too wet or too dry.',
         icon: CloudIcon,
        priority: 'high',
        estimatedTime: '15 mins',
                 detailedInstructions: {
           whatIsIt: 'Soil moisture testing helps determine if the soil has the right amount of water for optimal seed germination and plant growth.',
           stepByStep: [
             'Walk to different areas of your field (at least 4-5 spots)',
             'Dig a small hole about 6 inches deep using your hand or a small tool',
             'Take a handful of soil from the bottom of the hole',
             'Squeeze the soil firmly in your fist for 10 seconds',
             'Open your hand and observe: Good soil should hold together but crumble when poked',
             'If water drips out = too wet, if it falls apart immediately = too dry',
             'Record your findings for each spot tested'
           ],
           safetyPrecautions: [
             'Wash hands thoroughly after testing',
             'Avoid testing during heavy rain or extreme heat',
             'Watch out for sharp objects or insects in soil'
           ],
           tips: [
             'Best time to test: early morning or late afternoon',
             'Test at the same time each day for consistency',
             'Ideal moisture feels like a wrung-out sponge'
           ]
         },
         videoGuide: {
           title: 'How to Check Soil Moisture - Video Tutorial',
           description: 'Watch our expert demonstrate the proper technique for testing soil moisture levels',
           videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample YouTube embed URL
           duration: '3:45',
           language: 'Hindi with English subtitles',
           chapters: [
             { time: '0:00', title: 'Introduction to soil moisture testing' },
             { time: '0:30', title: 'Tools needed and preparation' },
             { time: '1:15', title: 'Step-by-step demonstration' },
             { time: '2:30', title: 'Interpreting results' },
             { time: '3:20', title: 'Safety tips and best practices' }
           ]
         }
      }
    ],
    'Germination': [
      {
        id: 'germ-1',
                 task: 'Monitor soil temperature',
         description: 'Check that soil temperature stays between 25-30°C for optimal germination.',
         icon: BeakerIcon,
        priority: 'high',
        estimatedTime: '10 mins',
                 detailedInstructions: {
           whatIsIt: 'Soil temperature monitoring ensures seeds have the optimal conditions for quick and uniform germination.',
           stepByStep: [
             'Use a soil thermometer or regular thermometer',
             'Insert thermometer 2-3 inches deep into the soil',
             'Wait 2-3 minutes for accurate reading',
             'Take readings at 3-4 different locations in your field',
             'Record temperature and time of measurement',
             'Check temperature twice daily: morning (8 AM) and afternoon (4 PM)',
             'Compare with optimal range: 25-30°C (77-86°F)'
           ],
           safetyPrecautions: [
             'Clean thermometer before and after use',
             'Handle glass thermometers carefully to avoid breakage',
             'Avoid taking readings during extreme weather'
           ],
           tips: [
             'Soil temperature is usually most stable 2-3 inches below surface',
             'If too cold, wait for warmer weather or use row covers',
             'If too hot, provide shade or increase irrigation',
             'Keep a daily log to track temperature patterns'
           ]
         },
         videoGuide: {
           title: 'Soil Temperature Monitoring - Complete Guide',
           description: 'Learn the correct method to monitor soil temperature for optimal germination',
           videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample YouTube embed URL
           duration: '4:20',
           language: 'Hindi with English subtitles',
           chapters: [
             { time: '0:00', title: 'Why soil temperature matters' },
             { time: '0:45', title: 'Types of thermometers to use' },
             { time: '1:30', title: 'Proper insertion technique' },
             { time: '2:45', title: 'Reading and recording data' },
             { time: '3:50', title: 'Troubleshooting temperature issues' }
           ]
         }
      },
      {
        id: 'germ-2',
                 task: 'Maintain moisture levels',
         description: 'Keep soil consistently moist but not waterlogged. Water lightly if needed.',
         icon: CloudIcon,
        priority: 'high',
        estimatedTime: '20 mins'
      }
    ]
  };

  // Sidebar navigation
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
          setFarmData(response.data.data.user.farmDetails);
        }
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };

    const loadCompletedTasks = () => {
      const saved = localStorage.getItem(`completedTasks_${cropName || 'Rice'}`);
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    };

    fetchFarmData();
    loadCompletedTasks();
  }, [cropName]);

  const handleNavigation = ({ id, path }) => {
    setActiveItem(id);
    if (id === 'crops') {
      navigate(`/recommendations/${farmData?.pincode || ''}`);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
  };

  const getProgressPercentage = () => {
    const completedStages = cropStages.filter(stage => stage.status === 'completed').length;
    const currentStageProgress = cropStages.findIndex(stage => stage.status === 'current') >= 0 ? 0.5 : 0;
    return ((completedStages + currentStageProgress) / cropStages.length) * 100;
  };

  const getCurrentStage = () => {
    const currentStage = cropStages.find(stage => stage.status === 'current');
    return currentStage ? currentStage.name : 'Germination';
  };

  const getTodaysTasks = () => {
    const currentStageName = getCurrentStage();
    return dailyTasksByStage[currentStageName] || [];
  };

  const handleTaskComplete = async (taskId) => {
    const newCompletedTasks = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId]
    };
    setCompletedTasks(newCompletedTasks);
    localStorage.setItem(`completedTasks_${cropName || 'Rice'}`, JSON.stringify(newCompletedTasks));

    // Auto-log task completion to farm log
    if (newCompletedTasks[taskId]) {
      try {
        const currentStageName = getCurrentStage();
        const todaysTasks = getTodaysTasks();
        const task = todaysTasks.find(t => t.id === taskId);
        
        if (task) {
          await axios.post('http://localhost:5000/api/v1/farm-logs/task-completion', {
            taskId: task.id,
            taskName: task.task,
            stageName: currentStageName,
            cropName: cropName || 'Rice',
            priority: task.priority || 'medium',
            estimatedTime: task.estimatedTime || 'N/A'
          });
          console.log('✅ Task automatically logged to farm log');
        }
      } catch (error) {
        console.error('Failed to log task completion:', error);
        // Don't block the UI if logging fails
      }
    }
  };

  const getTaskStats = () => {
    const todaysTasks = getTodaysTasks();
    const completed = todaysTasks.filter(task => completedTasks[task.id]).length;
    const total = todaysTasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const closeTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
    setActiveGuideTab('text'); // Reset to text tab when closing
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f8fffe] via-[#f1f5f4] to-[#e8f5e8] font-[Inter]">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-gradient-to-b from-[#e6f4ea] to-[#d1e8d6] flex flex-col shadow-2xl backdrop-blur-sm border-r border-white/20">
        <div className="p-6 border-b border-white/30">
          <img 
            src={kisanmelLogo} 
            alt="KisanMel Logo" 
            className="h-14 w-auto object-contain drop-shadow-md"
          />
        </div>

        <nav className="flex-1 p-4 space-y-3">
          {navItems.map(({ id, name, path, Icon }) => {
            const active = activeItem === id;
            return (
              <button
                key={id}
                onClick={() => handleNavigation({ id, path })}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group transform hover:scale-[1.02] ${
                  active
                    ? 'bg-gradient-to-r from-[#2f722f] via-[#3d8b3d] to-[#46a05e] text-white shadow-xl shadow-green-500/25'
                    : 'text-[#1a1a1a] hover:bg-white/60 hover:shadow-lg backdrop-blur-sm'
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-[#2f722f]'}`}
                />
                <span className="font-semibold tracking-wide">{name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="p-4 border-t border-white/30 mt-auto flex flex-col gap-4">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="h-10 w-10 text-[#2f722f]" />
            <div>
              <p className="font-medium text-[#1a1a1a]">Farmer Name</p>
              <p className="text-sm text-[#2f722f] cursor-pointer hover:text-[#46a05e] transition-colors">View Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-700 rounded-2xl hover:bg-red-600/20 transition-all duration-300 shadow-sm font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8 animate-fade-in">
            <button
              onClick={() => navigate('/stage')}
              className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl hover:bg-white/90 hover:shadow-xl transition-all duration-300 mr-6 transform hover:scale-105"
            >
              <ArrowLeftIcon className="h-5 w-5 text-[#2f722f]" />
              <span className="text-[#2f722f] font-semibold">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-4">
                             <div className="w-16 h-16 bg-gradient-to-br from-[#2f722f] to-[#46a05e] rounded-2xl flex items-center justify-center shadow-lg">
                 <SunIcon className="h-8 w-8 text-white" />
               </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1a1a1a] to-[#2f722f] bg-clip-text text-transparent tracking-wide">
                  Cultivation Guide - {cropName || 'Rice'}
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Your intelligent farming companion 🚀
                </p>
              </div>
            </div>
          </div>

                     {/* Crop Progress Overview */}
           <div className="relative bg-gradient-to-br from-[#e9f8ee] via-white to-[#f0fdf4] px-8 py-8 rounded-3xl shadow-2xl border border-white/40 mb-8 backdrop-blur-sm overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#46a05e]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#2f722f]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
             
             <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
               <div className="flex items-start gap-6">
                                  <div className="w-16 h-16 bg-gradient-to-br from-[#2f722f] to-[#46a05e] rounded-2xl flex items-center justify-center shadow-lg">
                    <BeakerIcon className="h-8 w-8 text-white" />
                  </div>
                 <div>
                   <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1a1a1a] to-[#2f722f] bg-clip-text text-transparent mb-3">
                     {cropName || 'Rice'} (Variety: PKM-1)
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/40">
                                              <CalendarDaysIcon className="h-5 w-5 text-[#2f722f]" />
                       <div>
                         <p className="text-xs text-gray-500 font-medium">Sowing Date</p>
                         <p className="font-bold text-[#1a1a1a]">25 June 2025</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/40">
                                              <SunIcon className="h-5 w-5 text-[#2f722f]" />
                       <div>
                         <p className="text-xs text-gray-500 font-medium">Expected Harvest</p>
                         <p className="font-bold text-[#1a1a1a]">22 September 2025</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/40">
                                              <MapIcon className="h-5 w-5 text-[#2f722f]" />
                       <div>
                         <p className="text-xs text-gray-500 font-medium">Farm Area</p>
                         <p className="font-bold text-[#1a1a1a]">18.59 acres</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Progress Stats */}
               <div className="flex flex-col lg:flex-row gap-4">
                 <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg min-w-[200px]">
                   <div className="text-center">
                     <div className="relative w-24 h-24 mx-auto mb-4">
                       <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                         <path
                           className="stroke-gray-200"
                           strokeWidth="3"
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                         <path
                           className="stroke-[#2f722f]"
                           strokeWidth="3"
                           strokeLinecap="round"
                           fill="none"
                           strokeDasharray={`${getProgressPercentage()}, 100`}
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-2xl font-bold text-[#2f722f]">{Math.round(getProgressPercentage())}%</span>
                       </div>
                     </div>
                     <h3 className="font-bold text-gray-800 mb-1">Overall Progress</h3>
                     <p className="text-sm text-gray-600">Crop Development</p>
                   </div>
                 </div>

                 <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg min-w-[200px]">
                   <div className="text-center">
                     <div className="mb-4">
                       <div className="text-3xl font-bold text-blue-600 mb-1">{getCurrentStage()}</div>
                       <div className="text-sm text-gray-600">Current Stage</div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">Days Remaining:</span>
                         <span className="font-semibold text-blue-600">89 days</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">Stage Progress:</span>
                         <span className="font-semibold text-green-600">60%</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

                         {/* Progress Timeline */}
             <div className="mt-8">
               <div className="mb-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Cultivation Timeline</h3>
                 <p className="text-gray-600">Track your crop's journey from sowing to harvest</p>
               </div>
               
               <div className="relative">
                 {/* Timeline Line */}
                 <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full"></div>
                 <div 
                   className="absolute top-8 left-8 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${(getProgressPercentage() / 100) * (100 - 16 / 8)}%` }}
                 ></div>
                 
                 <div className="flex justify-between items-start overflow-x-auto pb-6 px-2">
                   {cropStages.map((stage, index) => (
                     <div
                       key={stage.id}
                       className="flex flex-col items-center min-w-[140px] cursor-pointer group transform transition-all duration-300 hover:scale-105 relative"
                       onClick={() => handleStageClick(stage)}
                     >
                       {/* Connection line between stages */}
                       {index < cropStages.length - 1 && (
                         <div className="absolute top-8 left-16 w-full h-1 flex items-center">
                           <div className={`h-1 w-full transition-all duration-500 ${
                             stage.status === 'completed' 
                               ? 'bg-green-500' 
                               : stage.status === 'current' 
                                 ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                                 : 'bg-gray-200'
                           }`}></div>
                         </div>
                       )}
                       
                       <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-xl mb-3 border-4 border-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 z-10 ${
                         stage.status === 'completed' 
                           ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/30' :
                         stage.status === 'current' 
                           ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30 animate-pulse' : 
                           'bg-gradient-to-br from-gray-300 to-gray-500 shadow-gray-400/20'
                       }`}>
                                                <stage.icon className="h-8 w-8 text-white filter drop-shadow-sm" />
                         {stage.status === 'current' && (
                           <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                             <span className="text-xs text-white font-bold animate-pulse">●</span>
                           </div>
                         )}
                         {stage.status === 'completed' && (
                           <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                             <CheckCircleIcon className="h-4 w-4 text-white" />
                           </div>
                         )}
                       </div>
                       
                       <h4 className={`font-bold text-sm text-center mb-1 transition-colors duration-300 ${
                         stage.status === 'completed' ? 'text-green-700' :
                         stage.status === 'current' ? 'text-blue-700' : 'text-gray-500'
                       }`}>
                         {stage.name}
                       </h4>
                       <p className="text-xs text-gray-500 text-center mb-2">{stage.duration}</p>
                       
                       {/* Stage Status Badge */}
                       <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                         stage.status === 'completed' 
                           ? 'bg-green-100 text-green-800' :
                         stage.status === 'current' 
                           ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-600'
                       }`}>
                         {stage.status === 'completed' ? 'Completed' : 
                          stage.status === 'current' ? 'In Progress' : 'Upcoming'}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>

            {/* Stage Details */}
            {selectedStage && (
              <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    selectedStage.status === 'completed' ? 'bg-green-500' :
                    selectedStage.status === 'current' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                                         <selectedStage.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedStage.name}</h3>
                    <p className="text-gray-600">{selectedStage.description}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedStage && selectedStage.name === 'Germination' && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/60 shadow-lg mt-4">
                <div className="flex items-start gap-3">
                                     <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                     <BeakerIcon className="h-6 w-6 text-white" />
                   </div>
                  <div>
                    <h5 className="font-bold text-blue-800 mb-2 text-lg">Key Activities</h5>
                    <p className="text-blue-700 leading-relaxed">
                      Maintain optimal soil moisture and temperature. Monitor seedling emergence and protect from birds and pests. 
                      Ensure proper drainage to prevent waterlogging during this critical establishment phase.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!selectedStage && (
              <div className="mt-8 p-8 bg-gradient-to-br from-[#f7fdf9] via-white to-[#e9f8ee] rounded-3xl border border-white/60 text-center shadow-lg backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#46a05e]/5 to-transparent animate-pulse"></div>
                <div className="relative">
                                     <div className="w-16 h-16 bg-gradient-to-br from-[#2f722f] to-[#46a05e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                     <ArrowLeftIcon className="h-8 w-8 text-white rotate-90" />
                   </div>
                  <p className="text-gray-600 text-lg font-medium">
                    Tap on any stage above to see detailed information and guidance for that period
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Get personalized insights for each phase of your crop journey
                  </p>
                </div>
              </div>
            )}
          </div>

                     {/* Weather & Schedule Overview */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             {/* Weather Widget */}
             <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-6 border border-sky-200/60 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                 <CloudIcon className="h-8 w-8 text-sky-600" />
                 <h3 className="text-xl font-bold text-sky-800">Today's Weather</h3>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="text-sky-700">Temperature</span>
                   <span className="font-bold text-sky-800">28°C</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sky-700">Humidity</span>
                   <span className="font-bold text-sky-800">75%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sky-700">Rainfall</span>
                   <span className="font-bold text-sky-800">5mm</span>
                 </div>
                 <div className="mt-4 p-3 bg-sky-100 rounded-lg">
                   <p className="text-sm text-sky-700 font-medium">Perfect conditions for germination!</p>
                 </div>
               </div>
             </div>

             {/* Quick Stats */}
             <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6 border border-purple-200/60 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                 <ChartBarSquareIcon className="h-8 w-8 text-purple-600" />
                 <h3 className="text-xl font-bold text-purple-800">Quick Stats</h3>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="text-purple-700">Days Since Sowing</span>
                   <span className="font-bold text-purple-800">12</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-purple-700">Tasks Completed</span>
                   <span className="font-bold text-purple-800">{getTaskStats().completed}/{getTaskStats().total}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-purple-700">Next Milestone</span>
                   <span className="font-bold text-purple-800">Flowering</span>
                 </div>
                 <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                   <p className="text-sm text-purple-700 font-medium">On track for harvest!</p>
                 </div>
               </div>
             </div>

             {/* Upcoming Schedule */}
             <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 border border-amber-200/60 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                 <CalendarDaysIcon className="h-8 w-8 text-amber-600" />
                 <h3 className="text-xl font-bold text-amber-800">Upcoming</h3>
               </div>
               <div className="space-y-3">
                 <div className="flex items-start gap-3">
                   <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                   <div>
                     <p className="font-semibold text-amber-800">Fertilizer Application</p>
                     <p className="text-sm text-amber-600">In 3 days</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                   <div>
                     <p className="font-semibold text-amber-800">Pest Inspection</p>
                     <p className="text-sm text-amber-600">In 5 days</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                   <div>
                     <p className="font-semibold text-amber-800">Watering Schedule</p>
                     <p className="text-sm text-amber-600">Daily</p>
                   </div>
                 </div>
                 <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                   <p className="text-sm text-amber-700 font-medium">Stay on schedule!</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Today's Tasks Section */}
           {showTasksSection && (
             <div className="relative bg-gradient-to-br from-white via-[#fff8f0] to-[#fef3c7] rounded-3xl shadow-2xl p-8 mb-8 backdrop-blur-sm border border-orange-200/40 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f59e0b] via-[#d97706] to-[#f59e0b]"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                                         <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-2xl flex items-center justify-center shadow-xl">
                       <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                     </div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-[#92400e] to-[#f59e0b] bg-clip-text text-transparent">
                        Today's Tasks
                      </h3>
                      <p className="text-orange-700 text-lg mt-1">
                        {getCurrentStage()} Stage • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                                     <div className="text-right bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-orange-200/40">
                     <div className="text-2xl font-bold text-orange-600 mb-1">
                       {getTaskStats().completed}/{getTaskStats().total}
                     </div>
                     <div className="text-sm text-orange-600 mb-3">Tasks Done</div>
                     
                     {/* Task Progress Bar */}
                     <div className="w-24 mx-auto">
                       <div className="flex justify-between text-xs text-orange-600 mb-1">
                         <span>0%</span>
                         <span>100%</span>
                       </div>
                       <div className="w-full bg-orange-200 rounded-full h-2">
                         <div 
                           className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                           style={{ width: `${getTaskStats().percentage}%` }}
                         ></div>
                       </div>
                       <div className="text-center text-xs text-orange-600 mt-1 font-semibold">
                         {Math.round(getTaskStats().percentage)}% Complete
                       </div>
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                  {getTodaysTasks().map((task, index) => (
                    <div
                      key={task.id}
                      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        completedTasks[task.id] ? 'opacity-75' : ''
                      }`}
                    >
                      {completedTasks[task.id] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 pointer-events-none"></div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                                                 <task.icon className="h-8 w-8 text-[#f59e0b]" />
                                <div>
                                  <h4 className={`text-lg font-bold transition-all duration-300 hover:text-blue-600 ${
                                    completedTasks[task.id] 
                                      ? 'line-through text-gray-500' 
                                      : 'text-orange-900'
                                  }`}>
                                    {task.task}
                                  </h4>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      task.priority === 'high' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                                                             {task.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                                    </span>
                                                                         <span className="text-sm text-orange-600 flex items-center gap-1">
                                                                               <ClockIcon className="h-4 w-4" />
                                       {task.estimatedTime}
                                     </span>
                                     {task.videoGuide && (
                                                                               <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium flex items-center gap-1">
                                          <VideoCameraIcon className="h-3 w-3" />
                                          Video Available
                                        </span>
                                     )}
                                  </div>
                                </div>
                              </div>
                              
                                                             <div className="flex items-center gap-2 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                   {task.videoGuide ? (
                                    <>
                                      <VideoCameraIcon className="h-4 w-4" />
                                      <span>Video Guide</span>
                                    </>
                                  ) : (
                                    <>
                                      <DocumentTextIcon className="h-4 w-4" />
                                      <span>Text Guide</span>
                                    </>
                                  )}
                               </div>
                            </div>
                            
                            <p className={`text-orange-700 leading-relaxed transition-all duration-300 ${
                              completedTasks[task.id] ? 'opacity-60' : ''
                            }`}>
                              {task.description}
                            </p>
                            
                            <div className="mt-3 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              💡 Click for detailed step-by-step instructions
                            </div>
                          </div>

                          <div className="ml-4">
                            <button
                              onClick={() => handleTaskComplete(task.id)}
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                                completedTasks[task.id]
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-orange-300 hover:border-orange-500'
                              }`}
                            >
                              {completedTasks[task.id] && (
                                <CheckCircleIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Smart Alerts Section */}
          <div className="mt-8">
            <SmartAlerts cropName={cropName || 'Rice'} />
          </div>

          {/* Farm Log Section - Always visible within cultivation guide */}
          <div className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/60 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Digital Farm Log</h3>
                    <p className="text-green-600 text-sm">Track your farming activities</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFarmLog(!showFarmLog)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    showFarmLog 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {showFarmLog ? 'Hide Farm Log' : 'View Farm Log'}
                </button>
              </div>
              
              {showFarmLog && (
                <FarmLog cropName={cropName || 'Rice'} isVisible={showFarmLog} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* How-To Guide Modal - FIXED OVERLAP ISSUE */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white via-[#fafffe] to-[#f8fffe] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/40">
            {/* FIXED Modal Header - Removed sticky positioning to prevent overlap */}
            <div className="bg-gradient-to-r from-[#f0f9ff] via-[#dbeafe] to-[#bfdbfe] p-4 sm:p-6 border-b border-blue-200/60 rounded-t-3xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                     <selectedTask.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                   </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent break-words">
                      How-To Guide: {selectedTask.task}
                    </h2>
                    <p className="text-blue-700 mt-1 text-sm sm:text-base">Step-by-step instructions for success</p>
                  </div>
                </div>
                <button
                  onClick={closeTaskDetail}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white transition-all duration-300 text-gray-600 hover:text-gray-800 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

                         {/* Tab Navigation */}
             <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-8">
               <div className="flex space-x-1">
                 <button
                   onClick={() => setActiveGuideTab('text')}
                   className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                     activeGuideTab === 'text'
                       ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                       : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300'
                   }`}
                 >
                                       <DocumentTextIcon className="h-5 w-5" />
                   <span className="text-sm sm:text-base">Text Guide</span>
                 </button>
                 <button
                   onClick={() => setActiveGuideTab('video')}
                   className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                     activeGuideTab === 'video'
                       ? 'text-red-600 border-red-600 bg-red-50/50'
                       : 'text-gray-600 border-transparent hover:text-red-600 hover:border-red-300'
                   }`}
                 >
                                       <VideoCameraIcon className="h-5 w-5" />
                   <span className="text-sm sm:text-base">Video Guide</span>
                   {selectedTask.videoGuide && (
                     <span className="ml-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                       {selectedTask.videoGuide.duration}
                     </span>
                   )}
                 </button>
               </div>
             </div>

             {/* Modal Content - Now with tabs */}
             <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(90vh-200px)]">
               {activeGuideTab === 'text' ? (
                 <>
                   {/* What is it? Section */}
                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200/60 shadow-lg">
                     <div className="flex items-start gap-3 mb-4">
                                               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <QuestionMarkCircleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                       <h3 className="text-lg sm:text-xl font-bold text-blue-800 mt-1 sm:mt-2">What is it?</h3>
                     </div>
                     <p className="text-blue-700 leading-relaxed text-sm sm:text-lg">
                       {selectedTask.detailedInstructions?.whatIsIt || 'Detailed explanation not available for this task.'}
                     </p>
                   </div>

                   {/* Step-by-Step Instructions */}
                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-200/60 shadow-lg">
                     <div className="flex items-start gap-3 mb-4 sm:mb-6">
                                               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <ClipboardDocumentListIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                       <h3 className="text-lg sm:text-xl font-bold text-green-800 mt-1 sm:mt-2">How to do it (Step-by-Step)</h3>
                     </div>
                     {selectedTask.detailedInstructions?.stepByStep ? (
                       <div className="space-y-3 sm:space-y-4">
                         {selectedTask.detailedInstructions.stepByStep.map((step, index) => (
                           <div key={index} className="flex items-start gap-3 sm:gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-green-200/40">
                             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg flex-shrink-0">
                               {index + 1}
                             </div>
                             <p className="text-green-700 leading-relaxed font-medium text-sm sm:text-base">{step}</p>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="text-green-700 text-sm sm:text-base">Step-by-step instructions not available for this task.</p>
                     )}
                   </div>

                   {/* Safety Precautions */}
                   {selectedTask.detailedInstructions?.safetyPrecautions && (
                     <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 sm:p-6 border border-red-200/60 shadow-lg">
                       <div className="flex items-start gap-3 mb-4 sm:mb-6">
                                                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                            <ExclamationTriangleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                          </div>
                         <h3 className="text-lg sm:text-xl font-bold text-red-800 mt-1 sm:mt-2">Safety Precautions</h3>
                       </div>
                       <div className="space-y-2 sm:space-y-3">
                         {selectedTask.detailedInstructions.safetyPrecautions.map((precaution, index) => (
                           <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-200/40">
                             <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
                             <p className="text-red-700 leading-relaxed font-medium text-sm sm:text-base">{precaution}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Pro Tips */}
                   {selectedTask.detailedInstructions?.tips && (
                     <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 sm:p-6 border border-amber-200/60 shadow-lg">
                       <div className="flex items-start gap-3 mb-4 sm:mb-6">
                                                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                            <LightBulbIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                          </div>
                         <h3 className="text-lg sm:text-xl font-bold text-amber-800 mt-1 sm:mt-2">Pro Tips for Success</h3>
                       </div>
                       <div className="space-y-2 sm:space-y-3">
                         {selectedTask.detailedInstructions.tips.map((tip, index) => (
                           <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-200/40">
                             <LightBulbIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 flex-shrink-0" />
                             <p className="text-amber-700 leading-relaxed font-medium text-sm sm:text-base">{tip}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </>
               ) : (
                 /* Video Guide Tab */
                 <>
                   {selectedTask.videoGuide ? (
                     <>
                       {/* Video Player Section */}
                       <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 sm:p-6 border border-red-200/60 shadow-lg">
                         <div className="flex items-start gap-3 mb-4 sm:mb-6">
                                                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                              <VideoCameraIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                            </div>
                           <div className="flex-1">
                             <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2">{selectedTask.videoGuide.title}</h3>
                             <p className="text-red-700 text-sm sm:text-base mb-3">{selectedTask.videoGuide.description}</p>
                             <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                               <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                                                                   <ClockIcon className="h-3 w-3 mr-1" />{selectedTask.videoGuide.duration}
                               </span>
                               <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                                                                   <GlobeAltIcon className="h-3 w-3 mr-1" />{selectedTask.videoGuide.language}
                               </span>
                             </div>
                           </div>
                         </div>
                         
                         {/* Video Player */}
                         <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                           <iframe
                             src={selectedTask.videoGuide.videoUrl}
                             title={selectedTask.videoGuide.title}
                             className="w-full h-full"
                             frameBorder="0"
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                           ></iframe>
                         </div>
                       </div>

                       {/* Video Chapters */}
                       <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-purple-200/60 shadow-lg">
                         <div className="flex items-start gap-3 mb-4 sm:mb-6">
                                                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                              <BookOpenIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                            </div>
                           <h3 className="text-lg sm:text-xl font-bold text-purple-800 mt-1 sm:mt-2">Video Chapters</h3>
                         </div>
                         <div className="space-y-2 sm:space-y-3">
                           {selectedTask.videoGuide.chapters.map((chapter, index) => (
                             <div key={index} className="flex items-start gap-3 sm:gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-purple-200/40 hover:bg-white/80 transition-all duration-300 cursor-pointer">
                               <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg flex-shrink-0">
                                 {index + 1}
                               </div>
                               <div className="flex-1">
                                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                   <span className="font-bold text-purple-700 text-sm sm:text-base">{chapter.time}</span>
                                   <span className="text-purple-600 text-sm sm:text-base">{chapter.title}</span>
                                 </div>
                               </div>
                                                                <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <PlayIcon className="h-4 w-4" />
                                 </div>
                             </div>
                           ))}
                         </div>
                       </div>

                       {/* Additional Video Resources */}
                       <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 sm:p-6 border border-teal-200/60 shadow-lg">
                         <div className="flex items-start gap-3 mb-4">
                                                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                              <BookOpenIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                            </div>
                           <h3 className="text-lg sm:text-xl font-bold text-teal-800 mt-1 sm:mt-2">Additional Resources</h3>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                           <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-teal-200/40">
                             <div className="flex items-center gap-2 mb-2">
                                                               <DevicePhoneMobileIcon className="h-5 w-5 text-teal-600" />
                               <span className="font-semibold text-teal-800 text-sm sm:text-base">Mobile App</span>
                             </div>
                             <p className="text-teal-700 text-xs sm:text-sm">Download our app for offline video access</p>
                           </div>
                           <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-teal-200/40">
                             <div className="flex items-center gap-2 mb-2">
                                                               <ArrowPathIcon className="h-5 w-5 text-teal-600" />
                               <span className="font-semibold text-teal-800 text-sm sm:text-base">Replay</span>
                             </div>
                             <p className="text-teal-700 text-xs sm:text-sm">Watch again to perfect your technique</p>
                           </div>
                         </div>
                       </div>
                     </>
                   ) : (
                     /* No Video Available */
                     <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 sm:p-12 border border-gray-200/60 shadow-lg text-center">
                                               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <VideoCameraIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                        </div>
                       <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">Video Coming Soon</h3>
                       <p className="text-gray-600 text-sm sm:text-base mb-6">
                         We're working on creating a video guide for this task. Meanwhile, you can follow the detailed text instructions.
                       </p>
                       <button
                         onClick={() => setActiveGuideTab('text')}
                         className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg transform hover:scale-105"
                       >
                         View Text Guide
                       </button>
                     </div>
                   )}
                 </>
               )}

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                 <button
                   onClick={() => handleTaskComplete(selectedTask.id)}
                   className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 text-sm sm:text-base ${
                     completedTasks[selectedTask.id]
                       ? 'bg-green-500 text-white hover:bg-green-600'
                       : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                   }`}
                 >
                   {completedTasks[selectedTask.id] ? '✅ Task Completed' : '✓ Mark as Complete'}
                 </button>
                 <button
                   onClick={closeTaskDetail}
                   className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 shadow-lg transform hover:scale-105 text-sm sm:text-base"
                 >
                   Close Guide
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultivationGuideScreen; 
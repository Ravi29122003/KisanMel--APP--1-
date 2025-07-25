import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlanProvider } from './context/PlanContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import OTPVerification from './components/auth/OTPVerification';
import FarmSetupPage from './components/FarmSetupPage/FarmSetupPage';
import FarmSetup from './components/farm-setup/FarmSetup';
import CropRecommendationScreen from './screens/CropRecommendationScreen';
import HomePage from './screens/HomePage';
import ExploreServices from './screens/ExploreServices.tsx';
import Projects from './screens/Projects';
import AboutUs from './screens/AboutUs';
import Stage from './screens/Stage';
import CultivationGuideScreen from './screens/CultivationGuideScreen';

function App() {
  return (
    <PlanProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/services" element={<ExploreServices />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<AboutUs />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <FarmSetupPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/farm-setup"
                element={
                  <PrivateRoute>
                    <FarmSetup />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stage"
                element={
                  <PrivateRoute>
                    <Stage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/recommendations/:pincode"
                element={
                  <PrivateRoute>
                    <CropRecommendationScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cultivation-guide/:cropName"
                element={
                  <PrivateRoute>
                    <CultivationGuideScreen />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </PlanProvider>
  );
}

export default App;

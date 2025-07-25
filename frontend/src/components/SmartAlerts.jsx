import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ExclamationTriangleIcon,
  CloudIcon,
  BugAntIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  BeakerIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

const SmartAlerts = ({ cropName }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [alertStats, setAlertStats] = useState(null);

  useEffect(() => {
    fetchAlerts();
    fetchAlertStats();
    // Auto-refresh alerts every 5 minutes
    const interval = setInterval(() => {
      fetchAlerts();
      fetchAlertStats();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success') {
        setAlerts(response.data.data.alerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/alerts/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success') {
        setAlertStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching alert stats:', error);
    }
  };

  const generateNewAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/alerts/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh alerts after generation
      fetchAlerts();
      fetchAlertStats();
    } catch (error) {
      console.error('Error generating alerts:', error);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/v1/alerts/${alertId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/v1/alerts/${alertId}/dismiss`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setAlerts(alerts.filter(alert => alert._id !== alertId));
      fetchAlertStats(); // Refresh stats
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <ShieldExclamationIcon className="h-5 w-5 text-red-600" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
      case 'low':
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'weather':
        return <CloudIcon className="h-5 w-5 text-blue-600" />;
      case 'pest_disease':
        return <BugAntIcon className="h-5 w-5 text-red-600" />;
      case 'soil':
        return <BeakerIcon className="h-5 w-5 text-green-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'from-red-50 to-red-100 border-red-200';
      case 'high':
        return 'from-orange-50 to-orange-100 border-orange-200';
      case 'medium':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'low':
        return 'from-gray-50 to-gray-100 border-gray-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const formatTimeRemaining = (validUntil) => {
    const now = new Date();
    const timeDiff = new Date(validUntil) - now;
    
    if (timeDiff <= 0) return 'Expired';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Less than 1 hour remaining';
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/60 shadow-lg">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600 font-medium">Loading smart alerts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200 shadow-lg">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="text-lg font-bold text-red-800">Error Loading Alerts</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Header with Stats */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-6 border border-blue-200/60 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldExclamationIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                Smart Alerts
              </h3>
              <p className="text-blue-600 text-sm">AI-powered farming insights</p>
            </div>
          </div>
          
          <button
            onClick={generateNewAlerts}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            🔄 Refresh Alerts
          </button>
        </div>

        {alertStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-blue-200/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{alertStats.totalActive}</div>
                <div className="text-sm text-blue-600">Active Alerts</div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-orange-200/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{alertStats.unread}</div>
                <div className="text-sm text-orange-600">Unread</div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-red-200/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{alertStats.urgent}</div>
                <div className="text-sm text-red-600">Urgent</div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-200/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {alertStats.byType.weather + alertStats.byType.pest_disease}
                </div>
                <div className="text-sm text-green-600">All Types</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">All Clear!</h3>
          <p className="text-green-600">No active alerts at the moment. Your farm operations are on track.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`bg-gradient-to-br ${getPriorityColor(alert.priority)} rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl ${
                !alert.isRead ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              {/* Alert Header */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(alert.priority)}
                      {getTypeIcon(alert.alertType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          {alert.title}
                          {!alert.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          )}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            alert.priority === 'urgent' ? 'bg-red-200 text-red-800' :
                            alert.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                            alert.priority === 'medium' ? 'bg-blue-200 text-blue-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatTimeRemaining(alert.validUntil)}</span>
                        </div>
                        
                        {alert.location.pincode && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            <span>Area: {alert.location.pincode}</span>
                          </div>
                        )}
                      </div>
                      
                      {alert.actionRequired && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/40 mb-4">
                          <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span>⚡</span> Action Required
                          </h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {alert.actionRequired}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-start gap-2 ml-4">
                    <button
                      onClick={() => setExpandedAlert(expandedAlert === alert._id ? null : alert._id)}
                      className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/40 flex items-center justify-center hover:bg-white transition-all duration-300 text-gray-600 hover:text-gray-800"
                      title="View Details"
                    >
                      {expandedAlert === alert._id ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsRead(alert._id)}
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/40 flex items-center justify-center hover:bg-white transition-all duration-300 text-gray-600 hover:text-gray-800"
                        title="Mark as Read"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => dismissAlert(alert._id)}
                      className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/40 flex items-center justify-center hover:bg-white transition-all duration-300 text-gray-600 hover:text-red-600"
                      title="Dismiss Alert"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedAlert === alert._id && (
                <div className="border-t border-gray-200/40 bg-white/40 backdrop-blur-sm p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weather Data */}
                    {alert.weatherData && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/40">
                        <h6 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <CloudIcon className="h-5 w-5" />
                          Weather Conditions
                        </h6>
                        <div className="space-y-2 text-sm">
                          {alert.weatherData.temperature && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Temperature:</span>
                              <span className="font-medium">{alert.weatherData.temperature}°C</span>
                            </div>
                          )}
                          {alert.weatherData.humidity && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Humidity:</span>
                              <span className="font-medium">{alert.weatherData.humidity}%</span>
                            </div>
                          )}
                          {alert.weatherData.rainfall && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rainfall:</span>
                              <span className="font-medium">{alert.weatherData.rainfall}mm</span>
                            </div>
                          )}
                          {alert.weatherData.windSpeed && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Wind Speed:</span>
                              <span className="font-medium">{alert.weatherData.windSpeed}km/h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Pest/Disease Data */}
                    {alert.pestDiseaseData && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-red-200/40">
                        <h6 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                          <BugAntIcon className="h-5 w-5" />
                          Pest/Disease Info
                        </h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{alert.pestDiseaseData.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium capitalize">{alert.pestDiseaseData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Severity:</span>
                            <span className={`font-medium capitalize ${
                              alert.pestDiseaseData.severity === 'high' ? 'text-red-600' :
                              alert.pestDiseaseData.severity === 'medium' ? 'text-orange-600' :
                              'text-green-600'
                            }`}>
                              {alert.pestDiseaseData.severity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nearby Reports:</span>
                            <span className="font-medium">{alert.pestDiseaseData.nearbyFarmCount} farms</span>
                          </div>
                          {alert.pestDiseaseData.identificationGuideUrl && (
                            <div className="mt-3">
                              <button className="w-full px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-300">
                                View Identification Guide
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-200/40">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Generated: {new Date(alert.createdAt).toLocaleString()}</span>
                      {alert.metadata?.confidence && (
                        <span>Confidence: {Math.round(alert.metadata.confidence * 100)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartAlerts; 
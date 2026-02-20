import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Drawing Control Component
const DrawingControl = ({ onDrawComplete, onDrawEdit, onDrawDelete }) => {
  const map = useMap();
  const drawControlRef = useRef(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    if (!map) return;

    // Add the FeatureGroup to the map first
    drawnItemsRef.current.addTo(map);

    // Initialize draw control with the FeatureGroup
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e4e8',
            message: '<strong>Error:</strong> polygon edges cannot intersect!'
          },
          shapeOptions: {
            color: '#219653'
          }
        },
        circle: false,
        rectangle: false,
        polyline: false,
        circlemarker: false,
        marker: false
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: true
      }
    });

    // Add draw control to map
    drawControl.addTo(map);
    drawControlRef.current = drawControl;

    // Handle draw creation
    map.on('draw:created', async (e) => {
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      
      // Convert layer to GeoJSON for area calculation
      const geojson = layer.toGeoJSON();
      
      // Calculate area in square meters using Turf.js
      const areaSqM = turf.area(geojson);
      
      // Convert square meters to acres (1 acre = 4046.86 square meters)
      const areaInAcres = areaSqM / 4046.86;
      
      const center = layer.getBounds().getCenter();
      
      try {
        // Fetch pincode using Nominatim API
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&zoom=18&addressdetails=1`
        );
        
        const pincode = response.data.address.postcode;
        
        onDrawComplete({
          plotCoordinates: layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]),
          area: areaInAcres.toFixed(2),
          pincode: pincode || '',
          location: {
            type: 'Point',
            coordinates: [center.lng, center.lat]
          }
        });
      } catch (err) {
        console.error('Error calculating area or fetching location details:', err);
      }
    });

    // Handle draw edit
    map.on('draw:edited', async (e) => {
      const layers = e.layers;
      layers.eachLayer(async (layer) => {
        // Convert layer to GeoJSON for area calculation
        const geojson = layer.toGeoJSON();
        
        // Calculate area in square meters using Turf.js
        const areaSqM = turf.area(geojson);
        
        // Convert square meters to acres
        const areaInAcres = areaSqM / 4046.86;
        
        const center = layer.getBounds().getCenter();
        
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&zoom=18&addressdetails=1`
          );
          
          const pincode = response.data.address.postcode;
          
          onDrawEdit({
            plotCoordinates: layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]),
            area: areaInAcres.toFixed(2),
            pincode: pincode || '',
            location: {
              type: 'Point',
              coordinates: [center.lng, center.lat]
            }
          });
        } catch (err) {
          console.error('Error updating area or location details:', err);
        }
      });
    });

    // Handle draw delete
    map.on('draw:deleted', () => {
      onDrawDelete();
    });

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
      }
    };
  }, [map, onDrawComplete, onDrawEdit, onDrawDelete]);

  return null;
};

const FarmSetup = () => {
  const [formData, setFormData] = useState({
    pincode: '',
    area: '',
    capitalInvestment: 10000,
    labourCapacity: 1,
    irrigationFacility: 'Drip',
    cropCycle: '',
    location: null,
    plotCoordinates: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();
  const [mapKey, setMapKey] = useState(0); // key to force re-rendering MapContainer

  // Fetch existing farm details
  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/me`);
        if (response.data.data.user.farmDetails) {
          setFormData(prevData => ({
            ...prevData,
            ...response.data.data.user.farmDetails
          }));
        }
      } catch (err) {
        console.error('Error fetching farm details:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchFarmDetails();
  }, []);

  useEffect(() => {
    // Hide default Leaflet draw and zoom toolbars (we provide custom buttons)
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-draw.leaflet-control {
        display: none !important;
      }
      .leaflet-control-zoom {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.patch(`${API_URL}/users/update-profile`, formData);
      navigate('/stage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update farm details');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawComplete = (data) => {
    setIsCalculating(true);
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    setIsCalculating(false);
  };

  const handleDrawEdit = (data) => {
    setIsCalculating(true);
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    setIsCalculating(false);
  };

  const handleDrawDelete = () => {
    setFormData(prev => ({
      ...prev,
      plotCoordinates: [],
      area: '',
      pincode: '',
      location: null
    }));
    // Force remount MapContainer to remove drawn layers visually
    setMapKey(prevKey => prevKey + 1);
  };

  const cropCycleOptions = [
    {
      value: 'short-term',
      label: 'Short Term',
      description: '3-4 months'
    },
    {
      value: 'medium-term',
      label: 'Medium Term',
      description: '6-12 months'
    },
    {
      value: 'long-term',
      label: 'Long Term',
      description: 'More than 12 months'
    }
  ];

  const handleCropCycleSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      cropCycle: value
    }));
  };

  const irrigationOptions = [
    {
      value: 'Drip',
      label: 'Drip',
      description: 'Water delivered directly to plant roots'
    },
    {
      value: 'Sprinkler',
      label: 'Sprinkler',
      description: 'Water sprayed over the crop area'
    },
    {
      value: 'Canal',
      label: 'Canal',
      description: 'Water supplied through channels'
    },
    {
      value: 'Rain-fed',
      label: 'Rain-fed',
      description: 'Dependent on natural rainfall'
    }
  ];

  const handleIrrigationSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      irrigationFacility: value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // New helper functions to trigger Leaflet-draw actions from custom buttons
  const handleDrawPolygon = () => {
    const drawBtn = document.querySelector('.leaflet-draw-draw-polygon');
    if (drawBtn) {
      drawBtn.dispatchEvent(new Event('click', { bubbles: true }));
    }
  };

  const handleEditPolygon = () => {
    const editBtn = document.querySelector('.leaflet-draw-edit-edit');
    if (editBtn) {
      editBtn.dispatchEvent(new Event('click', { bubbles: true }));
    }
  };

  const handleDeleteFarm = () => {
    // Clear formData relevant fields
    setFormData(prev => ({
      ...prev,
      plotCoordinates: [],
      area: '',
      pincode: '',
      location: null
    }));
    // Force remount MapContainer to remove drawn layers visually
    setMapKey(prevKey => prevKey + 1);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700 font-medium">Loading farm details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-lime-200/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Farm Setup
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Configure your farm details and mark your plot on the map to get personalized recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Card - Enhanced Form Fields */}
            <div className="relative group">
              {/* Background Gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
                <h4 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Farm Details
                </h4>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    {/* Enhanced Auto-calculated fields */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      {/* Pincode Card */}
                      <div className="relative group/card">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover/card:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-green-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">
                              {isCalculating ? (
                                <div className="animate-pulse text-green-600">Detecting...</div>
                              ) : (
                                formData.pincode || '---'
                              )}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">Pincode</div>
                          </div>
                        </div>
                      </div>

                      {/* Area Card */}
                      <div className="relative group/card">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur opacity-20 group-hover/card:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-emerald-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">
                              {isCalculating ? (
                                <div className="animate-pulse text-emerald-600">Calculating...</div>
                              ) : (
                                formData.area ? `${formData.area} acres` : '---'
                              )}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">Area</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Capital Investment */}
                    <div className="space-y-4">
                      <label htmlFor="capitalInvestment" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Capital Investment
                      </label>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <div className="space-y-4">
                          <input
                            type="range"
                            name="capitalInvestment"
                            id="capitalInvestment"
                            min="10000"
                            max="100000"
                            step="5000"
                            value={formData.capitalInvestment}
                            onChange={handleChange}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-modern"
                            style={{
                              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((formData.capitalInvestment - 10000) / 90000) * 100}%, #e5e7eb ${((formData.capitalInvestment - 10000) / 90000) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 font-medium">{formatCurrency(10000)}</span>
                            <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-green-200">
                              <span className="text-lg font-bold text-green-700">
                                {formatCurrency(formData.capitalInvestment)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">{formatCurrency(100000)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Labour Capacity */}
                    <div className="space-y-4">
                      <label htmlFor="labourCapacity" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Labour Capacity
                      </label>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                        <div className="space-y-4">
                          <input
                            type="range"
                            name="labourCapacity"
                            id="labourCapacity"
                            min="1"
                            max="20"
                            step="1"
                            value={formData.labourCapacity}
                            onChange={handleChange}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-modern"
                            style={{
                              background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(formData.labourCapacity - 1) * (100/19)}%, #e5e7eb ${(formData.labourCapacity - 1) * (100/19)}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 font-medium">1 person</span>
                            <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-cyan-200">
                              <span className="text-lg font-bold text-cyan-700">
                                {formData.labourCapacity} {formData.labourCapacity === 1 ? 'person' : 'people'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">20 people</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Irrigation Facility */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Irrigation Facility
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {irrigationOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleIrrigationSelect(option.value)}
                            className={`relative group/option cursor-pointer transition-all duration-300 hover:scale-105 ${
                              formData.irrigationFacility === option.value ? 'scale-105' : ''
                            }`}
                          >
                            <div className={`absolute inset-0 rounded-2xl blur ${
                              formData.irrigationFacility === option.value 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 opacity-30' 
                                : 'bg-gradient-to-r from-gray-200 to-gray-300 opacity-20 group-hover/option:opacity-30'
                            } transition-all duration-300`}></div>
                            
                            <div className={`relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                              formData.irrigationFacility === option.value
                                ? 'border-green-400 bg-green-50/80'
                                : 'border-gray-200 hover:border-green-300'
                            }`}>
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className="font-semibold text-gray-800">{option.label}</div>
                                <div className="text-xs text-gray-600 leading-relaxed">{option.description}</div>
                              </div>
                              {formData.irrigationFacility === option.value && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm animate-bounce">
                                  ✓
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Crop Cycle */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Crop Cycle
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cropCycleOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleCropCycleSelect(option.value)}
                            className={`relative group/cycle cursor-pointer transition-all duration-300 hover:scale-105 ${
                              formData.cropCycle === option.value ? 'scale-105' : ''
                            }`}
                          >
                            <div className={`absolute inset-0 rounded-2xl blur ${
                              formData.cropCycle === option.value 
                                ? 'bg-gradient-to-r from-orange-400 to-yellow-500 opacity-30' 
                                : 'bg-gradient-to-r from-gray-200 to-gray-300 opacity-20 group-hover/cycle:opacity-30'
                            } transition-all duration-300`}></div>
                            
                            <div className={`relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                              formData.cropCycle === option.value
                                ? 'border-orange-400 bg-orange-50/80'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}>
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className="font-semibold text-gray-800">{option.label}</div>
                                <div className="text-xs text-gray-600">{option.description}</div>
                              </div>
                              {formData.cropCycle === option.value && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm animate-bounce">
                                  ✓
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  )}

                  {/* Enhanced Submit Button */}
                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={loading || isCalculating}
                      className="group relative inline-flex items-center justify-center py-4 px-8 border border-transparent shadow-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300/50 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 overflow-hidden"
                    >
                      {/* Button Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <span className="relative flex items-center gap-3">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span>Save Farm Details</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Card - Enhanced Map */}
            <div className="relative group">
              {/* Background Gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
                <h4 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  Farm Plot
                </h4>
                
                <div className="relative h-[500px] rounded-2xl overflow-hidden border-2 border-cyan-200 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  {/* Enhanced Action buttons overlay */}
                  <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleDrawPolygon}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      Draw Farm
                    </button>
                    <button
                      type="button"
                      onClick={handleEditPolygon}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Farm
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteFarm}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Farm
                    </button>
                  </div>
                  
                  <MapContainer
                    key={mapKey}
                    zoomControl={false}
                    attributionControl={false}
                    center={formData.location?.coordinates ? 
                      [formData.location.coordinates[1], formData.location.coordinates[0]] : 
                      [27.0238, 74.2179] /* Default to Rajasthan */}
                    zoom={formData.location?.coordinates ? 15 : 6}
                    style={{ height: '100%', width: '100%' }}
                  >
                    {/* Satellite imagery using Esri World Imagery */}
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    />
                    {/* Overlay reference layer for boundaries and labels */}
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                      attribution="Boundaries & Places © Esri"
                      opacity={0.9}
                      zIndex={2}
                    />
                    <DrawingControl 
                      onDrawComplete={handleDrawComplete}
                      onDrawEdit={handleDrawEdit}
                      onDrawDelete={handleDrawDelete}
                    />
                    {formData.plotCoordinates.length > 0 && (
                      <Polygon
                        positions={formData.plotCoordinates}
                        pathOptions={{ color: '#10b981', weight: 3, opacity: 0.8, fillOpacity: 0.3 }}
                      />
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .slider-modern::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
          border: 2px solid white;
          transition: all 0.3s ease;
        }
        .slider-modern::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
        }
        .slider-modern::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
          border: 2px solid white;
          transition: all 0.3s ease;
        }
        .slider-modern::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
};

export default FarmSetup; 
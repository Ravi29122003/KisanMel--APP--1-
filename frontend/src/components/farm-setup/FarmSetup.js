import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    capitalInvestment: '',
    labourCapacity: '',
    irrigationFacility: 'Rain-fed',
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
        const response = await axios.get('http://localhost:5000/api/v1/users/me');
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
      await axios.patch('http://localhost:5000/api/v1/users/update-profile', formData);
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
      <div className="min-h-screen bg-[#F2FFF7] flex items-center justify-center">
        <div className="text-lg text-[#1B4332]">Loading farm details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FFF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-extrabold text-[#1B4332] font-['Inter'] mb-8 tracking-wide">
          Farm Setup
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Form Fields */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-xl font-semibold text-[#1B4332] mb-4 font-['Inter']">
              Farm Details
            </h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Auto-calculated fields in cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Pincode Card */}
                  <div className="relative bg-white rounded-lg border-2 border-[#219653] shadow-md p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1B4332] mt-2">
                        {isCalculating ? 'Detecting...' : (formData.pincode || '---')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Pincode</div>
                    </div>
                  </div>

                  {/* Area Card */}
                  <div className="relative bg-white rounded-lg border-2 border-[#219653] shadow-md p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1B4332] mt-2">
                        {isCalculating ? 'Calculating...' : (formData.area ? `${formData.area} acres` : '---')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Area</div>
                    </div>
                  </div>
                </div>

                {/* Manual input fields */}
                <div>
                  <label htmlFor="capitalInvestment" className="block text-sm font-medium text-[#1B4332] mb-2">
                    Capital Investment
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="range"
                        name="capitalInvestment"
                        id="capitalInvestment"
                        min="10000"
                        max="100000"
                        step="5000"
                        value={formData.capitalInvestment}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#219653]"
                        style={{
                          background: `linear-gradient(to right, #219653 0%, #219653 ${((formData.capitalInvestment - 10000) / 90000) * 100}%, #E5E7EB ${((formData.capitalInvestment - 10000) / 90000) * 100}%, #E5E7EB 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{formatCurrency(10000)}</span>
                      <span className="text-lg font-semibold text-[#1B4332]">
                        {formatCurrency(formData.capitalInvestment)}
                      </span>
                      <span className="text-xs text-gray-500">{formatCurrency(100000)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="labourCapacity" className="block text-sm font-medium text-[#1B4332] mb-2">
                    Labour Capacity
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="range"
                        name="labourCapacity"
                        id="labourCapacity"
                        min="1"
                        max="20"
                        step="1"
                        value={formData.labourCapacity}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#219653]"
                        style={{
                          background: `linear-gradient(to right, #219653 0%, #219653 ${(formData.labourCapacity - 1) * (100/19)}%, #E5E7EB ${(formData.labourCapacity - 1) * (100/19)}%, #E5E7EB 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">1 person</span>
                      <span className="text-lg font-semibold text-[#1B4332]">
                        {formData.labourCapacity} {formData.labourCapacity === 1 ? 'person' : 'people'}
                      </span>
                      <span className="text-xs text-gray-500">20 people</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B4332] mb-3">
                    Irrigation Facility
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {irrigationOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleIrrigationSelect(option.value)}
                        className={`relative bg-white rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          formData.irrigationFacility === option.value
                            ? 'border-[#219653] bg-green-50'
                            : 'border-gray-200 hover:border-[#219653]'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="font-semibold text-sm text-[#1B4332]">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                        {formData.irrigationFacility === option.value && (
                          <div className="absolute top-1 right-1 text-[#219653] text-sm">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B4332] mb-3">
                    Crop Cycle
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {cropCycleOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleCropCycleSelect(option.value)}
                        className={`relative bg-white rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          formData.cropCycle === option.value
                            ? 'border-[#219653] bg-green-50'
                            : 'border-gray-200 hover:border-[#219653]'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="font-semibold text-sm text-[#1B4332]">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                        {formData.cropCycle === option.value && (
                          <div className="absolute top-1 right-1 text-[#219653] text-sm">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || isCalculating}
                  className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-full text-white bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-['Inter'] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? 'Saving...' : 'Save Farm Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Card - Map */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-xl font-semibold text-[#1B4332] mb-4 font-['Inter']">
              Farm Plot
            </h4>
            <div className="relative h-[500px] rounded-md border-2 border-[#6FCF97] shadow-sm">
              {/* Action buttons overlay */}
              <div className="absolute top-4 left-4 z-[1000] flex space-x-2">
                <button
                  type="button"
                  onClick={handleDrawPolygon}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md"
                >
                  Draw Farm
                </button>
                <button
                  type="button"
                  onClick={handleEditPolygon}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md"
                >
                  Edit Farm
                </button>
                <button
                  type="button"
                  onClick={handleDeleteFarm}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md"
                >
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
                    pathOptions={{ color: '#219653' }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmSetup; 
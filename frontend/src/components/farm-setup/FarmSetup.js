import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
const DrawingControl = ({ onDrawComplete }) => {
  const map = useMap();
  const drawControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e4e8',
            message: '<strong>Error:</strong> polygon edges cannot intersect!'
          },
          shapeOptions: {
            color: '#2ecc71'
          }
        },
        circle: false,
        rectangle: false,
        polyline: false,
        circlemarker: false,
        marker: false
      }
    });

    // Add draw control to map
    drawControl.addTo(map);
    drawControlRef.current = drawControl;

    // Handle draw creation
    map.on('draw:created', async (e) => {
      const layer = e.layer;
      const coordinates = layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]);
      
      // Calculate area in acres (1 square meter = 0.000247105 acres)
      const area = L.GeometryUtil.geodesicArea(coordinates) * 0.000247105;
      
      // Get center point for pincode lookup
      const center = layer.getBounds().getCenter();
      
      try {
        // Fetch pincode using Nominatim API
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&zoom=18&addressdetails=1`
        );
        
        const pincode = response.data.address.postcode;
        
        onDrawComplete({
          plotCoordinates: coordinates,
          area: area.toFixed(2),
          pincode: pincode || '',
          location: {
            type: 'Point',
            coordinates: [center.lng, center.lat]
          }
        });
      } catch (err) {
        console.error('Error fetching location details:', err);
      }
    });

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
    };
  }, [map, onDrawComplete]);

  return null;
};

const FarmSetup = () => {
  const [formData, setFormData] = useState({
    pincode: '',
    area: '',
    capitalInvestment: '',
    labourCapacity: '',
    irrigationFacility: 'Rain-fed',
    location: null,
    plotCoordinates: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update farm details');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawComplete = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading farm details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Farm Setup
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Draw your farm plot on the map to automatically calculate area and get location details.</p>
              </div>
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      id="pincode"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                      Area (acres)
                    </label>
                    <input
                      type="number"
                      name="area"
                      id="area"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.area}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="capitalInvestment" className="block text-sm font-medium text-gray-700">
                      Capital Investment (₹)
                    </label>
                    <input
                      type="number"
                      name="capitalInvestment"
                      id="capitalInvestment"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.capitalInvestment}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="labourCapacity" className="block text-sm font-medium text-gray-700">
                      Labour Capacity
                    </label>
                    <input
                      type="number"
                      name="labourCapacity"
                      id="labourCapacity"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.labourCapacity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="irrigationFacility" className="block text-sm font-medium text-gray-700">
                      Irrigation Facility
                    </label>
                    <select
                      id="irrigationFacility"
                      name="irrigationFacility"
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.irrigationFacility}
                      onChange={handleChange}
                    >
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Canal">Canal</option>
                      <option value="Rain-fed">Rain-fed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Farm Plot
                    </label>
                    <div className="mt-1 h-96 rounded-md border border-gray-300">
                      <MapContainer
                        center={formData.location?.coordinates ? 
                          [formData.location.coordinates[1], formData.location.coordinates[0]] : 
                          [20.5937, 78.9629]} // Center of India
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <DrawingControl onDrawComplete={handleDrawComplete} />
                        {formData.plotCoordinates.length > 0 && (
                          <Polygon
                            positions={formData.plotCoordinates}
                            pathOptions={{ color: '#2ecc71' }}
                          />
                        )}
                      </MapContainer>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Use the drawing tools in the top-left corner to draw your farm boundaries. The area and pincode will be automatically calculated.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? 'Saving...' : 'Save Farm Details'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmSetup; 
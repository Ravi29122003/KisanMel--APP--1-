import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const CropRecommendationScreen = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pincode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [pincode]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/crops/recommendations/${pincode}`);
      setRecommendations(response.data.data.recommendations.slice(0, 3));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
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

  const farmerCropCycle = recommendations?.farmerCropCycle;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Top 3 Recommended Crops</h1>
          <p className="mt-2 text-gray-600">Based on your location and soil conditions</p>
          {farmerCropCycle && (
            <p className="mt-1 text-gray-600 font-medium">Your Preferred Crop Cycle: {farmerCropCycle}</p>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={rec.crop._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{rec.crop.name}</h2>
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

                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rec.compatibility.soilType ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">Soil Type</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rec.compatibility.ph ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">pH Level</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rec.compatibility.temperature ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">Temperature</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rec.compatibility.rainfall ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">Rainfall</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rec.compatibility.npk ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">NPK</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rec.compatibility.cropCycle ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">Crop Cycle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendationScreen; 
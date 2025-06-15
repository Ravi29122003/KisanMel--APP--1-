import React, { useState } from 'react';
import axios from 'axios';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    irrigation: 'Rain-fed',
    cycleTime: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setRecommendations(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/crops/recommend',
        formData
      );
      setRecommendations(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Get Crop Recommendations
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Enter your preferences to get personalized crop recommendations
                  based on your farm's soil conditions.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="irrigation" className="block text-sm font-medium text-gray-700">
                      Irrigation Preference
                    </label>
                    <select
                      id="irrigation"
                      name="irrigation"
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.irrigation}
                      onChange={handleChange}
                    >
                      <option value="High">High</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                      <option value="Rain-fed">Rain-fed</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cycleTime" className="block text-sm font-medium text-gray-700">
                      Maximum Crop Cycle Time (days)
                    </label>
                    <input
                      type="number"
                      name="cycleTime"
                      id="cycleTime"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.cycleTime}
                      onChange={handleChange}
                    />
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
                    {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                  </button>
                </div>
              </form>

              {recommendations && (
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Recommended Crops
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendations.recommendations.map((crop, index) => (
                      <div
                        key={index}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h5 className="text-lg font-medium text-gray-900">
                            {crop.cropName}
                          </h5>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>Irrigation Required: {crop.irrigationRequired}</p>
                            <p>Cycle Time: {crop.cycleTime} days</p>
                            <p>Crop Type: {crop.cropType}</p>
                            <p>Suitability Score: {crop.suitabilityScore}/4</p>
                          </div>
                          <div className="mt-4">
                            <h6 className="text-sm font-medium text-gray-900">
                              Ideal Conditions:
                            </h6>
                            <ul className="mt-2 text-sm text-gray-500">
                              <li>Nitrogen: {crop.idealConditions.nitrogen.min} - {crop.idealConditions.nitrogen.max}</li>
                              <li>Phosphorus: {crop.idealConditions.phosphorus.min} - {crop.idealConditions.phosphorus.max}</li>
                              <li>Potassium: {crop.idealConditions.potassium.min} - {crop.idealConditions.potassium.max}</li>
                              <li>pH: {crop.idealConditions.ph.min} - {crop.idealConditions.ph.max}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation; 
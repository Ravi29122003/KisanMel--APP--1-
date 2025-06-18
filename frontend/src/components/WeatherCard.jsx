import { useState, useEffect } from 'react';

const WeatherCard = ({ lat = 28.6139, lon = 77.2090, locationName = 'Delhi' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = 'cf2a8afcae878f13fc59284668553548';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData({ ...data, resolvedName: locationName || data.name });
        setLoading(false);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-sm">
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-sm text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-sm text-red-500">
        No weather data available
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#d1e7d9] text-sm min-w-[160px]">
      <div className="flex flex-col">
        <h3 className="font-semibold text-base text-[#1B4332]">{weatherData.resolvedName || weatherData.name}</h3>
        <div className="mt-1">
          <p className="text-3xl font-bold text-[#1B4332] leading-none">
            {Math.round(weatherData.main.temp)}°C
          </p>
          <p className="text-xs text-gray-600 mt-px">
            Feels like: {Math.round(weatherData.main.feels_like)}°C
          </p>
        </div>
        <div className="mt-2">
          <p className="text-gray-500 capitalize text-xs">
            {weatherData.weather[0].description}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Humidity: {weatherData.main.humidity}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 
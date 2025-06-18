import { useState, useEffect } from 'react';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // TODO: Replace with your actual API key
        const API_KEY = 'YOUR_API_KEY';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-sm">
      <h3 className="font-medium">{weatherData?.name}</h3>
      <p className="text-gray-600">
        {Math.round(weatherData?.main?.temp)}°C
      </p>
      <p className="text-gray-500 capitalize">
        {weatherData?.weather?.[0]?.description}
      </p>
    </div>
  );
};

export default WeatherCard; 
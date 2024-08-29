import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaMoon, FaSearch, FaStar } from 'react-icons/fa';
import './App.css';

const API_KEY = 'dc106b2801df005fad9a802e149f8b91';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherDataByCoords(latitude, longitude);
    });
  }, []);
  
  const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching the weather data', error);
    }
  };

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching the weather data', error);
      setWeatherData(null);
    }
  };

  const handleSearch = () => {
    if (city) fetchWeatherData(city);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addToFavorites = () => {
    if (weatherData && !favorites.includes(weatherData.name)) {
      setFavorites([...favorites, weatherData.name]);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-18">
        <div className="max-w-xl w-full p-16 rounded-lg shadow-lg bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center mb-12">
            <input
              type="text"
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="ml-4 p-3 bg-blue-500 text-white rounded-md" onClick={handleSearch}>
              <FaSearch />
            </button>
            <button className="ml-4 p-3 bg-yellow-500 text-white rounded-md" onClick={addToFavorites}>
              <FaStar />
            </button>
          </div>

          {weatherData ? (
            <div className="text-center">
              <h2 className="text-4xl font-bold dark:text-blue-700">{weatherData.name}</h2>
              <p className="text-2xl dark:text-yellow-200">{weatherData.main.temp}°C</p>
              <p className="text-4lg dark:text-gray-300">{weatherData.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mx-auto"
              />
            </div>
          ) : (
            <p className="text-center text-red-500">City not found or error fetching data.</p>
          )}

          <div className="mt-4">
            <button
              className="p-4 bg-gray-500 text-white rounded-xl"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold dark:text-indigo-600">Favorite Cities</h3>
            <ul className="list-disc list-inside dark:text-yellow-300">
              {favorites.map((favCity, index) => (
                <li key={index} onClick={() => fetchWeatherData(favCity)} className="cursor-pointer hover:underline">
                  {favCity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

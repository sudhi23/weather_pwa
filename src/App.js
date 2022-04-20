import React, { useState, useEffect } from "react";
import "./App.css";

import { fetchWeather, fetchWeatherByCoordinates } from "./api/fetchWeather";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [current, setCurrent] = useState(true);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(currentWeather, showError);
      } else {
        setCurrent(false);
      }
    }

    const currentWeather = async (position) => {
      const { latitude, longitude } = position.coords;
      const data = await fetchWeatherByCoordinates({
        lat: latitude,
        lon: longitude,
      });
      setWeather(data);
    };

    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        default:
          console.log("An unknown error occurred.");
          break;
      }
    }

    getLocation();
  }, []);

  const search = async (e) => {
    if (e.key === "Enter") {
      const data = await fetchWeather(query);
      setWeather(data);
      setQuery("");
      setCurrent(false);
    }
  };

  return (
    <div
      className={`main-container c${
        weather.weather ? weather.weather[0].icon : ""
      }`}
    >
      {current && weather.main && (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="city-icon"
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}

      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />
      {!current && weather.main && (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="city-icon"
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

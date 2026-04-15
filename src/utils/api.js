/**
 * Production-level Weather API Service
 * Primary Source: Open-Meteo (Real-time, Global, 7-Day Forecast)
 * Geocoding: Nominatim (Global City Search)
 */

// Mapping WMO Weather codes to OpenWeatherMap Icons for UI consistency
const mapWmoToIcon = (code) => {
  if (code === 0) return '01d'; // Clear
  if (code <= 3) return '03d';  // Mostly Clear / Cloudy
  if (code === 45 || code === 48) return '50d'; // Fog
  if (code <= 55) return '09d'; // Drizzle
  if (code <= 65) return '10d'; // Rain
  if (code <= 77) return '13d'; // Snow
  if (code <= 82) return '09d'; // Rain showers
  if (code <= 86) return '13d'; // Snow showers
  if (code >= 95) return '11d'; // Thunderstorm
  return '03d';
}

const mapWmoToMain = (code) => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Clouds';
  if (code <= 48) return 'Fog';
  if (code <= 55) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain';
  if (code <= 86) return 'Snow';
  return 'Thunderstorm';
}

/**
 * Geocodes a city name into coordinates using Nominatim API
 */
async function geocode(city) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  
  if (!response.ok) throw new Error('Geocoding service unavailable');
  
  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error('City not found. Please check the spelling.');
  }
  
  return {
    name: data[0].display_name.split(',')[0],
    lat: data[0].lat,
    lon: data[0].lon
  };
}

/**
 * Fetches real-time weather and 7-day forecast from Open-Meteo
 */
async function fetchWeatherData(lat, lon, name) {
  // Fetching current weather, hourly (for humidity/pressure/visibility), and 7 days of daily forecast
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,surface_pressure,visibility&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.reason || 'Weather data service unavailable');
  }
  
  const data = await response.json();
  const current = data.current_weather;
  const hourly = data.hourly;
  const daily = data.daily;

  // Find the current hour index to get current humidity/pressure/visibility
  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13) + ':00';
  const hourIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr)) || 0;

  return {
    weather: {
      name: name,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      main: {
        temp: current.temperature,
        feels_like: current.temperature, // Approximation
        temp_min: daily.temperature_2m_min[0],
        temp_max: daily.temperature_2m_max[0],
        humidity: hourly.relative_humidity_2m[hourIndex] || 50,
        pressure: Math.round(hourly.surface_pressure[hourIndex]) || 1013
      },
      visibility: hourly.visibility[hourIndex] || 10000,
      wind: { speed: current.windspeed },
      weather: [{
        main: mapWmoToMain(current.weathercode),
        description: mapWmoToMain(current.weathercode).toLowerCase(),
        icon: mapWmoToIcon(current.weathercode)
      }]
    },
    forecast: daily.weathercode.map((code, i) => ({
      dt: Math.floor(Date.now() / 1000) + (i * 86400),
      main: {
        temp: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
        temp_min: daily.temperature_2m_min[i],
        temp_max: daily.temperature_2m_max[i],
        humidity: hourly.relative_humidity_2m[i * 24] || 50 // Approx daily humidity from hourly
      },
      weather: [{
        main: mapWmoToMain(code),
        description: mapWmoToMain(code).toLowerCase(),
        icon: mapWmoToIcon(code)
      }]
    }))
  };
}

export async function getCurrentWeather(city) {
  const geo = await geocode(city);
  const data = await fetchWeatherData(geo.lat, geo.lon, geo.name);
  return data.weather;
}

export async function getForecast(city) {
  const geo = await geocode(city);
  const data = await fetchWeatherData(geo.lat, geo.lon, geo.name);
  return data.forecast;
}

export async function getForecastByCoords(lat, lon) {
  const data = await fetchWeatherData(lat, lon, 'Your Location');
  return data.forecast;
}

export async function getWeatherByCoords(lat, lon) {
  const data = await fetchWeatherData(lat, lon, 'Your Location');
  return data.weather;
}

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getCurrentWeather, getForecast, getForecastByCoords, getWeatherByCoords } from '../utils/api'

const WeatherContext = createContext(null)

const LOCAL_STORAGE_KEY = 'recent-weather-searches'

export function WeatherProvider({ children }) {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('default')
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('weather-dark-mode') === 'true'
  })
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    localStorage.setItem('weather-dark-mode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (!weather?.weather?.[0]?.main) {
      setTheme('default')
      return
    }

    const condition = weather.weather[0].main.toLowerCase()
    if (condition.includes('cloud')) {
      setTheme('cloud')
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
      setTheme('rain')
    } else if (condition.includes('clear') || condition.includes('sun')) {
      setTheme('sunny')
    } else {
      setTheme('default')
    }
  }, [weather])

  const fetchWeatherByCity = useCallback(async (cityName) => {
    if (!cityName?.trim()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const currentData = await getCurrentWeather(cityName)
      const forecastData = await getForecast(cityName)

      setCity(currentData.name)
      setWeather(currentData)
      setForecast(forecastData) // Full 7 days
      addRecentSearch(currentData.name)
    } catch (err) {
      setError(err.message || 'Unable to fetch weather.')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true)
    setError('')

    try {
      const currentData = await getWeatherByCoords(lat, lon)
      const forecastData = await getForecastByCoords(lat, lon)

      setCity(currentData.name)
      setWeather(currentData)
      setForecast(forecastData) // Full 7 days
      addRecentSearch(currentData.name)
    } catch (err) {
      setError(err.message || 'Unable to fetch weather.')
    } finally {
      setLoading(false)
    }
  }, [])

  function addRecentSearch(cityName) {
    setRecentSearches((current) => {
      const cleaned = [cityName, ...current.filter((item) => item.toLowerCase() !== cityName.toLowerCase())]
      return cleaned.slice(0, 5) // Keep last 5
    })
  }

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <WeatherContext.Provider
      value={{
        city,
        weather,
        forecast,
        loading,
        error,
        theme,
        darkMode,
        recentSearches,
        fetchWeatherByCity,
        fetchWeatherByCoords,
        toggleDarkMode
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}

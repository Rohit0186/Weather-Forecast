import ForecastCard from '../components/ForecastCard'
import Loader from '../components/Loader'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import { useWeather } from '../context/WeatherContext'

export default function Home() {
  const {
    weather,
    forecast,
    loading,
    error,
    darkMode,
    toggleDarkMode,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    recentSearches
  } = useWeather()

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported in this browser.')
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude)
      },
      () => {
        alert('Unable to access location. Please check your browser settings.')
      }
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-main))] flex flex-col font-sans selection:bg-blue-100">
      <header className="py-6 border-b border-[hsl(var(--border))] bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="section-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Weather Dashboard</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-[hsl(var(--border))] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 section-container py-10 space-y-12">
        <SearchBar 
          onSearch={fetchWeatherByCity} 
          onUseLocation={handleUseLocation} 
          recentSearches={recentSearches} 
        />

        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader />
               <span className="text-sm font-bold text-slate-400 animate-pulse">Fetching global data...</span>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-3xl text-center">
              <p className="text-red-500 font-bold text-lg mb-2">Location Not Found</p>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform"
              >
                Try Again
              </button>
            </div>
          ) : weather ? (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section>
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Weather</span>
                  <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                    Last updated: {weather.lastUpdated || 'just now'}
                  </span>
                </div>
                <WeatherCard weather={weather} />
              </section>

              <section className="pb-20">
                <div className="flex items-center justify-between mb-8 px-2 border-b border-[hsl(var(--border))] pb-4">
                  <h3 className="text-xl font-bold tracking-tight">7-Day Forecast</h3>
                  <span className="text-xs font-bold text-blue-500">Live View</span>
                </div>
                <div className="space-y-2">
                  {forecast.map((day) => (
                    <ForecastCard key={day.dt} day={day} />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-300 dark:text-slate-800">
                Ready to Explore
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Enter a city name above to get real-time weather data.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-[hsl(var(--border))] mt-auto">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Production Version 1.0
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Data via Open-Meteo & Nominatim
          </p>
        </div>
      </footer>
    </div>
  )
}

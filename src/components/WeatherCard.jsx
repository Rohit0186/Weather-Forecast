export default function WeatherCard({ weather }) {
  if (!weather) return null

  const details = [
    { label: 'Humidity', value: `${weather.main.humidity}%` },
    { label: 'Wind Speed', value: `${Math.round(weather.wind.speed)} km/h` },
    { label: 'Pressure', value: `${weather.main.pressure} hPa` },
    { label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
  ]

  return (
    <div className="py-12 flex flex-col items-center">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-bold tracking-tight">{weather.name}</h2>
        <p className="text-slate-500 font-medium capitalize">{weather.weather?.[0]?.description}</p>
      </div>

      <div className="flex flex-col items-center gap-2 mb-12">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`} 
          alt="weather icon" 
          className="w-48 h-48 drop-shadow-xl"
        />
        <div className="flex flex-col items-center">
          <span className="text-[10rem] font-black tracking-tighter leading-none flex items-start">
            {Math.round(weather.main.temp)}
            <span className="text-5xl mt-8 ml-2 font-medium opacity-20">°C</span>
          </span>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-4">
            Feels like {Math.round(weather.main.feels_like)}°
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {details.map((item) => (
          <div key={item.label} className="product-card flex flex-col items-center gap-1 hover-scale">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
            <span className="text-xl font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

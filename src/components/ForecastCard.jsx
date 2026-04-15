export default function ForecastCard({ day }) {
  const date = new Date(day.dt * 1000)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  
  const iconCode = day.weather?.[0]?.icon
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : ''

  return (
    <div className="flex items-center justify-between py-6 group hover:px-4 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all duration-300">
      <div className="flex flex-col gap-0.5 w-24">
        <p className="text-base font-bold text-slate-900 dark:text-white leading-none">
          {dayName}
        </p>
        <p className="text-xs font-semibold text-slate-400">
          {monthDay}
        </p>
      </div>
      
      <div className="flex items-center gap-4 flex-1 justify-center">
        {iconUrl && (
          <img src={iconUrl} alt="weather" className="w-12 h-12 drop-shadow-sm transition-transform group-hover:scale-110" />
        )}
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 capitalize">
          {day.weather?.[0]?.main}
        </span>
      </div>
      
      <div className="w-24 text-right flex items-center justify-end gap-3 font-bold">
        <span className="text-base text-slate-900 dark:text-white">
          {Math.round(day.main.temp_max)}°
        </span>
        <span className="text-base text-slate-300 dark:text-slate-700">
          {Math.round(day.main.temp_min)}°
        </span>
      </div>
    </div>
  )
}

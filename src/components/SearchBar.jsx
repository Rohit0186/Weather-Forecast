import { useEffect, useMemo, useState, useRef } from 'react'

const cityOptions = [
  'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 
  'Toronto', 'Dubai', 'Berlin', 'Rome', 'Mumbai', 
  'Sao Paulo', 'Moscow', 'Bangkok', 'Istanbul', 
  'Seoul', 'Cairo', 'Madrid', 'Jakarta', 'Dublin', 'Chicago'
]

export default function SearchBar({ onSearch, onUseLocation, recentSearches }) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const isSelected = useRef(false)

  useEffect(() => {
    if (isSelected.current) {
      isSelected.current = false
      return
    }

    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        onSearch(query.trim())
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return cityOptions
      .filter((city) => city.toLowerCase().includes(q))
      .slice(0, 5)
  }, [query])

  const handleSelect = (city) => {
    isSelected.current = true
    setQuery(city)
    setShowSuggestions(false)
    onSearch(city)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-[hsl(var(--border))] px-4 py-1 shadow-sm focus-within:border-[hsl(var(--accent))] transition-all">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(query)}
            placeholder="Search for a city..."
            className="w-full py-3 bg-transparent text-base font-medium outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onUseLocation}
            className="text-xs font-bold text-[hsl(var(--accent))] whitespace-nowrap px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:scale-105 transition-transform"
          >
            My Location
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-slate-900 border border-[hsl(var(--border))] rounded-2xl shadow-xl overflow-hidden">
            {suggestions.map((city) => (
              <button
                key={city}
                onMouseDown={() => handleSelect(city)}
                className="w-full text-left px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium border-b border-[hsl(var(--border))] last:border-0 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">Recently:</span>
          {recentSearches.map((city) => (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className="px-3 py-1 bg-white dark:bg-slate-800 border border-[hsl(var(--border))] rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-all"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

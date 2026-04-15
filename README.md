# Weather Forecast App

A simple React + Vite weather forecast application built with Tailwind CSS.

## Features

- City search with debounced requests and suggestions
- Current weather display with condition icon
- 5-day forecast cards
- Use browser Geolocation to fetch weather for current location
- Dynamic background theme based on weather condition
- Dark mode toggle with Tailwind class support
- Error handling and recent search history saved in `localStorage`

## Setup

1. Copy `.env.example` to `.env`
2. Add your OpenWeatherMap API key to `.env`
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

## Notes

- Replace `YOUR_OPENWEATHERMAP_API_KEY` with a valid API key.
- The app uses the OpenWeatherMap Current Weather and 5-Day Forecast APIs.

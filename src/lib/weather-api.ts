import type { WeatherData, CitySuggestion } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export async function fetchWeatherData(cityOrLat: string | number, lon?: number): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.');
  }

  let url: string;
  if (typeof cityOrLat === 'number' && typeof lon === 'number') {
    url = `${WEATHER_API_URL}?lat=${cityOrLat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else if (typeof cityOrLat === 'string') {
    url = `${WEATHER_API_URL}?q=${encodeURIComponent(cityOrLat)}&appid=${API_KEY}&units=metric`;
  } else {
    throw new Error('Invalid parameters for fetching weather data.');
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData: WeatherData = await response.json();
    if (errorData && errorData.message) {
      throw new Error(`Failed to fetch weather data: ${errorData.message}`);
    }
    throw new Error(`Failed to fetch weather data. Status: ${response.status}`);
  }
  return response.json() as Promise<WeatherData>;
}

export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured.');
  }
  if (!query.trim()) {
    return [];
  }
  const response = await fetch(`${GEO_API_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`);
  if (!response.ok) {
    // Do not throw error for suggestions, just return empty or log
    console.error(`Failed to fetch city suggestions. Status: ${response.status}`);
    return [];
  }
  return response.json() as Promise<CitySuggestion[]>;
}

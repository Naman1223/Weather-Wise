import type { WeatherData, CitySuggestion } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_COM_API_KEY;
const API_BASE_URL = 'https://api.weatherapi.com/v1';

export async function fetchWeatherData(cityOrLat: string | number, lon?: number): Promise<WeatherData> {
  if (!API_KEY) {
    // This error should ideally be caught earlier, e.g., on app load.
    // For now, let the specific component handle it.
    // However, returning an error structure is better for the caller.
    return {
      error: { code: -1, message: 'WeatherAPI.com API key is not configured.' }
    } as unknown as WeatherData; // Cast to WeatherData to satisfy return type, error will be checked
  }

  let queryParam: string;
  if (typeof cityOrLat === 'number' && typeof lon === 'number') {
    queryParam = `${cityOrLat},${lon}`;
  } else if (typeof cityOrLat === 'string') {
    queryParam = encodeURIComponent(cityOrLat);
  } else {
    return {
      error: { code: -2, message: 'Invalid parameters for fetching weather data.' }
    } as unknown as WeatherData;
  }
  
  // Using forecast.json to get current weather, and daily forecast (for min/max temp and astro)
  const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${queryParam}&days=1&aqi=no&alerts=no`;
  
  try {
    const response = await fetch(url);
    const data: WeatherData = await response.json();

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || `Failed to fetch weather data. Status: ${response.status}`;
      // Return the error structure within WeatherData
      return { error: { code: data.error?.code || response.status, message: errorMessage } } as unknown as WeatherData;
    }
    return data;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return {
       error: { code: -3, message: `Network or parsing error: ${err.message}` }
    } as unknown as WeatherData;
  }
}

export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (!API_KEY) {
    // Silently fail or log, as per original behavior for suggestions
    console.error('WeatherAPI.com API key is not configured for city suggestions.');
    return [];
  }
  if (!query.trim() || query.length < 3) {
    return [];
  }
  const url = `${API_BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Do not throw error for suggestions, just return empty or log
      const errorData = await response.json();
      console.error(`Failed to fetch city suggestions: ${errorData?.error?.message || response.status}`);
      return [];
    }
    return response.json() as Promise<CitySuggestion[]>;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error(`Network or parsing error fetching city suggestions: ${err.message}`);
    return [];
  }
}

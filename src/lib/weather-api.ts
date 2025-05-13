/**
 * @fileOverview Utility functions for interacting with the WeatherAPI.com service.
 * Provides methods to fetch weather data and city suggestions.
 */

import type { WeatherData, CitySuggestion } from '@/types/weather';

// Retrieve the API key from environment variables.
// NEXT_PUBLIC_ prefix makes it available on the client-side.
const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_COM_API_KEY;
// Base URL for the WeatherAPI.com service.
const API_BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Fetches weather data for a given city name or latitude/longitude coordinates.
 * Includes current weather and a 1-day forecast (for min/max temperatures and astronomical data).
 * @param {string | number} cityOrLat - The city name (string) or latitude (number).
 * @param {number} [lon] - The longitude (number), required if cityOrLat is latitude.
 * @returns {Promise<WeatherData>} A promise that resolves to the weather data,
 * or an object with an error property if the fetch fails or API returns an error.
 */
export async function fetchWeatherData(cityOrLat: string | number, lon?: number): Promise<WeatherData> {
  // Check if the API key is configured.
  if (!API_KEY) {
    // Return an error structure if API key is missing.
    // This should ideally be caught and handled by the calling component.
    return {
      error: { code: -1, message: 'WeatherAPI.com API key is not configured.' }
    } as unknown as WeatherData; // Cast to satisfy return type; error structure will be checked by caller.
  }

  let queryParam: string;
  // Construct the query parameter based on input type.
  if (typeof cityOrLat === 'number' && typeof lon === 'number') {
    // If latitude and longitude are provided.
    queryParam = `${cityOrLat},${lon}`;
  } else if (typeof cityOrLat === 'string') {
    // If a city name is provided.
    queryParam = encodeURIComponent(cityOrLat);
  } else {
    // Invalid parameters.
    return {
      error: { code: -2, message: 'Invalid parameters for fetching weather data.' }
    } as unknown as WeatherData;
  }
  
  // Construct the API URL for forecast data (includes current weather).
  // Fetches 1 day of forecast, no air quality index (aqi), no alerts.
  const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${queryParam}&days=1&aqi=no&alerts=no`;
  
  try {
    // Make the fetch request.
    const response = await fetch(url);
    // Parse the JSON response.
    const data: WeatherData = await response.json();

    // Check if the response was not OK or if the API returned an error in its payload.
    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || `Failed to fetch weather data. Status: ${response.status}`;
      // Return the error structure as part of the WeatherData type.
      return { error: { code: data.error?.code || response.status, message: errorMessage } } as unknown as WeatherData;
    }
    // Return the successfully fetched and parsed weather data.
    return data;
  } catch (e) {
    // Handle network errors or errors during JSON parsing.
    const err = e instanceof Error ? e : new Error(String(e));
    return {
       error: { code: -3, message: `Network or parsing error: ${err.message}` }
    } as unknown as WeatherData;
  }
}

/**
 * Fetches city suggestions based on a search query.
 * Used for autocomplete functionality in city search.
 * @param {string} query - The search query string (e.g., part of a city name).
 * @returns {Promise<CitySuggestion[]>} A promise that resolves to an array of city suggestions.
 * Returns an empty array if the API key is missing, query is too short, or an error occurs.
 */
export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  // Check if API key is configured. If not, log an error and return empty array.
  if (!API_KEY) {
    console.error('WeatherAPI.com API key is not configured for city suggestions.');
    return [];
  }
  // Validate query length; API typically requires a minimum length for meaningful search.
  if (!query.trim() || query.length < 3) {
    return [];
  }
  // Construct the API URL for city search.
  const url = `${API_BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
  
  try {
    // Make the fetch request.
    const response = await fetch(url);
    if (!response.ok) {
      // If response is not OK, log the error and return an empty array.
      // This prevents breaking the UI for suggestion failures.
      const errorData = await response.json().catch(() => ({})); // Attempt to parse error, default to empty if fails
      console.error(`Failed to fetch city suggestions: ${errorData?.error?.message || response.status}`);
      return [];
    }
    // Parse and return the JSON response (array of city suggestions).
    return response.json() as Promise<CitySuggestion[]>;
  } catch (e) {
    // Handle network errors or errors during JSON parsing.
    const err = e instanceof Error ? e : new Error(String(e));
    console.error(`Network or parsing error fetching city suggestions: ${err.message}`);
    return [];
  }
}
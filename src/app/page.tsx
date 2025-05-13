"use client";

/**
 * @fileOverview Main page component for the WeatherWise application.
 * This component handles city search, displays weather information,
 * and manages loading and error states.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CitySearchForm } from '@/components/weather/city-search-form';
import { WeatherDisplay } from '@/components/weather/weather-display';
import { fetchWeatherData } from '@/lib/weather-api';
import type { WeatherData, CitySuggestion } from '@/types/weather';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from "@/hooks/use-toast";
import { WifiOff, CloudSun } from 'lucide-react';

/**
 * HomePage component.
 * Renders the main user interface for searching and displaying weather.
 * @returns {JSX.Element} The rendered home page.
 */
export default function HomePage(): JSX.Element {
  // State for storing the fetched weather data.
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // State to indicate if weather data is currently being fetched.
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages related to fetching weather data.
  const [error, setError] = useState<string | null>(null);
  // State to store the name of the city for which weather is being fetched, used in loading message.
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  // Custom hook for displaying toast notifications.
  const { toast } = useToast();

  // useEffect hook to check for the WeatherAPI.com API key on component mount.
  // Displays an error toast if the API key is not configured.
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WEATHERAPI_COM_API_KEY) {
      const apiKeyErrorMsg = "WeatherAPI.com API key is not configured. Please set NEXT_PUBLIC_WEATHERAPI_COM_API_KEY in your environment variables.";
      toast({
        variant: "destructive",
        title: "API Key Missing",
        description: apiKeyErrorMsg,
        duration: 10000, // Show for 10 seconds
      });
      setError(apiKeyErrorMsg); // Also set an error state to potentially display in UI
    }
  }, [toast]); // Dependency array ensures this runs once on mount and if toast changes

  /**
   * Handles the selection of a city from the search suggestions.
   * Fetches weather data for the selected city.
   * @param {CitySuggestion} city - The city object selected by the user.
   */
  const handleCitySelect = async (city: CitySuggestion): Promise<void> => {
    setIsLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors
    setWeatherData(null); // Clear previous weather data
    setSelectedCityName(city.name); // Store the city name for the loading message
    
    try {
      // Use latitude and longitude for a more precise weather lookup.
      const query = `${city.lat},${city.lon}`;
      const data = await fetchWeatherData(query);

      // Check if the API returned an error within the data structure.
      if (data.error) {
        throw new Error(data.error.message);
      }
      setWeatherData(data); // Set the fetched weather data to state
    } catch (err) {
      // Handle any errors during the fetch operation.
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage); // Set the error message to state
      toast({ // Display an error toast
        variant: "destructive",
        title: "Error fetching weather",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  // Render the main page structure.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-8 sm:pt-12 bg-gradient-to-br from-primary/30 via-background to-accent/30 dark:from-primary/20 dark:via-background dark:to-accent/20 transition-colors duration-500">
      {/* Header section containing the theme toggle button. */}
      <header className="absolute top-4 right-4">
        <ThemeToggle />
      </header>
      
      {/* Main content area. */}
      <main className="w-full max-w-3xl space-y-8 text-center">
        {/* Application title and logo. */}
        <div className="flex items-center justify-center space-x-3 mb-6">
           <CloudSun size={48} className="text-primary" data-ai-hint="weather logo" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            WeatherWise
          </h1>
        </div>

        {/* City search form component. */}
        <CitySearchForm onCitySelect={handleCitySelect} isFetchingWeather={isLoading} />

        {/* Loading indicator displayed while fetching weather data. */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 bg-card/80 dark:bg-card/70 backdrop-blur-sm rounded-xl shadow-lg">
            {/* Animated spinner icon. */}
            <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-foreground/80">Fetching weather for {selectedCityName || "selected city"}...</p>
          </div>
        )}

        {/* Error message display when fetching fails and not currently loading. */}
        {error && !isLoading && (
           <div className="flex flex-col items-center justify-center p-10 bg-destructive/20 dark:bg-destructive/30 backdrop-blur-sm rounded-xl shadow-lg text-destructive dark:text-destructive-foreground">
            <WifiOff size={48} className="mb-4" /> {/* Icon indicating an offline/error state. */}
            <p className="text-xl font-semibold">Oops! Something went wrong.</p>
            <p className="text-md">{error}</p> {/* Display the error message. */}
          </div>
        )}

        {/* Weather display component, shown when data is fetched successfully and not loading or errored. */}
        {!isLoading && !error && weatherData && (
          <WeatherDisplay data={weatherData} />
        )}

        {/* Initial placeholder message when no city is searched yet, and no loading/error. */}
        {!isLoading && !error && !weatherData && (
           <div className="flex flex-col items-center justify-center p-10 bg-card/80 dark:bg-card/70 backdrop-blur-sm rounded-xl shadow-lg">
            <CloudSun size={64} className="text-primary/70 mb-4" />
            <p className="text-xl text-foreground/70">Enter a city to get the latest weather forecast.</p>
          </div>
        )}
      </main>
      {/* Footer section with copyright and attribution. */}
      <footer className="mt-12 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} WeatherWise. Powered by WeatherAPI.com</p>
      </footer>
    </div>
  );
}
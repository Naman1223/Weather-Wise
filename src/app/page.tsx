"use client";

import React, { useState, useEffect } from 'react';
import { CitySearchForm } from '@/components/weather/city-search-form';
import { WeatherDisplay } from '@/components/weather/weather-display';
import { fetchWeatherData } from '@/lib/weather-api';
import type { WeatherData, CitySuggestion } from '@/types/weather';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from "@/hooks/use-toast";
import { WifiOff, CloudSun } from 'lucide-react';

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WEATHERAPI_COM_API_KEY) {
      const apiKeyErrorMsg = "WeatherAPI.com API key is not configured. Please set NEXT_PUBLIC_WEATHERAPI_COM_API_KEY in your environment variables.";
      toast({
        variant: "destructive",
        title: "API Key Missing",
        description: apiKeyErrorMsg,
        duration: 10000,
      });
      setError(apiKeyErrorMsg);
    }
  }, [toast]);

  const handleCitySelect = async (city: CitySuggestion) => {
    setIsLoading(true);
    setError(null);
    setWeatherData(null); 
    setSelectedCityName(city.name); 
    
    try {
      // Use lat and lon for more precise lookup with WeatherAPI.com
      const query = `${city.lat},${city.lon}`;
      const data = await fetchWeatherData(query);

      if (data.error) {
        throw new Error(data.error.message);
      }
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error fetching weather",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-8 sm:pt-12 bg-gradient-to-br from-primary/30 via-background to-accent/30 dark:from-primary/20 dark:via-background dark:to-accent/20 transition-colors duration-500">
      <header className="absolute top-4 right-4">
        <ThemeToggle />
      </header>
      
      <main className="w-full max-w-3xl space-y-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
           <CloudSun size={48} className="text-primary" data-ai-hint="weather logo" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            WeatherWise
          </h1>
        </div>

        <CitySearchForm onCitySelect={handleCitySelect} isFetchingWeather={isLoading} />

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 bg-card/80 dark:bg-card/70 backdrop-blur-sm rounded-xl shadow-lg">
            <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-foreground/80">Fetching weather for {selectedCityName || "selected city"}...</p>
          </div>
        )}

        {error && !isLoading && (
           <div className="flex flex-col items-center justify-center p-10 bg-destructive/20 dark:bg-destructive/30 backdrop-blur-sm rounded-xl shadow-lg text-destructive dark:text-destructive-foreground">
            <WifiOff size={48} className="mb-4" />
            <p className="text-xl font-semibold">Oops! Something went wrong.</p>
            <p className="text-md">{error}</p>
          </div>
        )}

        {!isLoading && !error && weatherData && (
          <WeatherDisplay data={weatherData} />
        )}

        {!isLoading && !error && !weatherData && (
           <div className="flex flex-col items-center justify-center p-10 bg-card/80 dark:bg-card/70 backdrop-blur-sm rounded-xl shadow-lg">
            <CloudSun size={64} className="text-primary/70 mb-4" />
            <p className="text-xl text-foreground/70">Enter a city to get the latest weather forecast.</p>
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} WeatherWise. Powered by WeatherAPI.com</p>
      </footer>
    </div>
  );
}

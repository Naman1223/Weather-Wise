"use client";

import type { CitySuggestion } from '@/types/weather';
import { fetchCitySuggestions } from '@/lib/weather-api';
import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

interface CitySearchFormProps {
  onCitySelect: (city: CitySuggestion) => void;
  isFetchingWeather: boolean;
}

export function CitySearchForm({ onCitySelect, isFetchingWeather }: CitySearchFormProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const debouncedFetchSuggestions = useCallback(
    async (currentQuery: string) => {
      if (currentQuery.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const results = await fetchCitySuggestions(currentQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Failed to fetch city suggestions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch city suggestions. Please try again later.",
        });
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedFetchSuggestions(query);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [query, debouncedFetchSuggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (newQuery.length >=3) {
        setShowSuggestions(true); // Show suggestions as user types if query is long enough
    } else {
        setShowSuggestions(false);
        setSuggestions([]); // Clear suggestions if query is too short
    }
  };

  const handleSuggestionClick = (city: CitySuggestion) => {
    setQuery(`${city.name}, ${city.country}`); // Update input field
    setSuggestions([]);
    setShowSuggestions(false);
    onCitySelect(city); // Pass the full city object
  };
  
  // Handle hiding suggestions when input loses focus, with a small delay for click
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150); // Delay to allow click on suggestion item
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => query.length >=3 && suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder="Enter city name..."
        className="w-full text-lg p-4 rounded-lg shadow-md"
        disabled={isFetchingWeather}
        aria-label="Search for a city"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg bg-background border border-border rounded-lg max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            <ul className="py-1">
              {suggestions.map((city) => (
                <li
                  key={city.id} // WeatherAPI provides an id for suggestions
                  onClick={() => handleSuggestionClick(city)}
                  className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-150 ease-in-out"
                  role="option"
                  aria-selected="false"
                >
                  {city.name}, {city.region ? `${city.region}, ` : ''}{city.country}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {isLoadingSuggestions && query.length >= 3 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
}

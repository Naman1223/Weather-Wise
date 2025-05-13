"use client";

/**
 * @fileOverview CitySearchForm component for inputting city names and displaying suggestions.
 * Handles user input, debounces API calls for suggestions, and calls back
 * with the selected city.
 */

import type { CitySuggestion } from '@/types/weather';
import { fetchCitySuggestions } from '@/lib/weather-api';
import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

/**
 * Props for the CitySearchForm component.
 */
interface CitySearchFormProps {
  /** Callback function invoked when a city is selected from suggestions. */
  onCitySelect: (city: CitySuggestion) => void;
  /** Boolean indicating if the parent component is currently fetching weather data. Used to disable input. */
  isFetchingWeather: boolean;
}

/**
 * CitySearchForm component.
 * Allows users to search for cities and select from a list of suggestions.
 * @param {CitySearchFormProps} props - The component's props.
 * @returns {JSX.Element} The rendered city search form.
 */
export function CitySearchForm({ onCitySelect, isFetchingWeather }: CitySearchFormProps): JSX.Element {
  // State for the current search query input by the user.
  const [query, setQuery] = useState('');
  // State for storing the array of city suggestions fetched from the API.
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  // State to indicate if city suggestions are currently being loaded.
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  // State to control the visibility of the suggestions dropdown.
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Custom hook for displaying toast notifications.
  const { toast } = useToast();

  /**
   * Debounced function to fetch city suggestions from the API.
   * This function is memoized using useCallback to prevent re-creation on every render.
   * @param {string} currentQuery - The current search query.
   */
  const debouncedFetchSuggestions = useCallback(
    async (currentQuery: string) => {
      // If query length is less than 3 characters, clear suggestions and hide the dropdown.
      if (currentQuery.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setIsLoadingSuggestions(true); // Set loading state for suggestions
      try {
        // Fetch city suggestions using the API utility.
        const results = await fetchCitySuggestions(currentQuery);
        setSuggestions(results); // Update suggestions state
        setShowSuggestions(results.length > 0); // Show suggestions if results are found
      } catch (error) {
        console.error("Failed to fetch city suggestions:", error);
        toast({ // Display an error toast on failure
          variant: "destructive",
          title: "Error",
          description: "Could not fetch city suggestions. Please try again later.",
        });
        setSuggestions([]); // Clear suggestions on error
        setShowSuggestions(false); // Hide suggestions dropdown on error
      } finally {
        setIsLoadingSuggestions(false); // Reset loading state for suggestions
      }
    },
    [toast] // Dependency: toast function from useToast hook.
  );

  // useEffect hook to trigger debounced fetching of suggestions when the query changes.
  useEffect(() => {
    // Set a timeout to delay the API call, implementing debounce.
    const handler = setTimeout(() => {
      debouncedFetchSuggestions(query);
    }, 500); // 500ms debounce delay

    // Cleanup function: clear the timeout if the query changes before 500ms or component unmounts.
    return () => {
      clearTimeout(handler);
    };
  }, [query, debouncedFetchSuggestions]); // Dependencies: query and the debouncedFetchSuggestions function.

  /**
   * Handles changes to the input field.
   * Updates the query state and controls suggestion visibility.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery); // Update the query state
    // Show suggestions if query is long enough, otherwise hide and clear.
    if (newQuery.length >=3) {
        setShowSuggestions(true);
    } else {
        setShowSuggestions(false);
        setSuggestions([]);
    }
  };

  /**
   * Handles the click event on a suggestion item.
   * Updates the input field, hides suggestions, and calls the onCitySelect callback.
   * @param {CitySuggestion} city - The city object that was clicked.
   */
  const handleSuggestionClick = (city: CitySuggestion) => {
    setQuery(`${city.name}, ${city.country}`); // Update input field to show selected city
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide suggestions dropdown
    onCitySelect(city); // Notify parent component of the selected city
  };
  
  /**
   * Handles the blur event on the input field.
   * Hides the suggestions dropdown after a short delay to allow click events on suggestions to fire.
   */
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150); // Delay allows suggestion item click to register before hiding.
  };

  // Render the search form UI.
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Input field for city search. */}
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        // Show suggestions on focus if query is valid and suggestions exist.
        onFocus={() => query.length >=3 && suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder="Enter city name..."
        className="w-full text-lg p-4 rounded-lg shadow-md"
        disabled={isFetchingWeather} // Disable input while parent is fetching weather.
        aria-label="Search for a city"
        autoComplete="off" // Disable browser autocomplete to favor custom suggestions.
      />
      {/* Suggestions dropdown, shown if showSuggestions is true and suggestions exist. */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg bg-background border border-border rounded-lg max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            <ul className="py-1">
              {/* Map through suggestions and render list items. */}
              {suggestions.map((city) => (
                <li
                  key={city.id} // WeatherAPI provides a unique id for suggestions.
                  onClick={() => handleSuggestionClick(city)}
                  className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-150 ease-in-out"
                  role="option"
                  aria-selected="false" // Indicates item is not selected by default.
                >
                  {/* Display city name, region (if available), and country. */}
                  {city.name}, {city.region ? `${city.region}, ` : ''}{city.country}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {/* Loading spinner for suggestions, shown if loading and query is long enough. */}
      {isLoadingSuggestions && query.length >= 3 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {/* Animated spinner icon. */}
          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
}
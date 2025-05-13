"use client";

/**
 * @fileOverview WeatherDisplay component for rendering fetched weather information.
 * Shows current weather conditions, temperature, and other details like humidity, wind, etc.
 */

import type { WeatherData } from '@/types/weather';
import { WeatherIcon } from './weather-icon';
import { Thermometer, Droplets, Wind, Sunrise, Sunset, Eye, Gauge, Cloudy } from 'lucide-react';

/**
 * Props for the WeatherDisplay component.
 */
interface WeatherDisplayProps {
  /** The weather data object fetched from the API. */
  data: WeatherData;
}

/**
 * GlassCard component.
 * A reusable styled container card with a semi-transparent background and blur effect.
 * @param {{ children: React.ReactNode, className?: string }} props - Component props.
 * @returns {JSX.Element} The rendered card.
 */
const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card/80 dark:bg-card/70 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

/**
 * DataPoint component.
 * A reusable component for displaying a single piece of weather data with an icon, label, value, and unit.
 * @param {{ icon: React.ElementType, label: string, value: string | number, unit?: string }} props - Component props.
 * @returns {JSX.Element} The rendered data point.
 */
const DataPoint: React.FC<{ icon: React.ElementType, label: string, value: string | number, unit?: string }> = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center space-x-2 text-sm sm:text-base">
    <Icon size={20} className="text-primary" /> {/* Icon for the data point. */}
    <div>
      <span className="font-medium">{label}:</span> {value}{unit && <span className="text-xs">{unit}</span>} {/* Label, value, and optional unit. */}
    </div>
  </div>
);

/**
 * WeatherDisplay component.
 * Renders the weather information for a selected city.
 * @param {WeatherDisplayProps} props - The component's props.
 * @returns {JSX.Element} The rendered weather display, or an error message if data is invalid.
 */
export function WeatherDisplay({ data }: WeatherDisplayProps): JSX.Element {
  // Basic validation for the provided weather data.
  // Checks for data presence, API errors, and essential nested objects.
  if (!data || data.error || !data.location || !data.current || !data.forecast?.forecastday?.[0]) {
    return <GlassCard className="text-center">No weather data available or error fetching data.</GlassCard>;
  }

  // Destructure necessary information from the weather data.
  const { location, current, forecast } = data;
  // Get today's forecast details (min/max temp, astro). WeatherAPI forecast.json returns an array.
  const todayForecast = forecast.forecastday[0];

  // Convert wind speed from kph (provided by API) to m/s for display.
  // 1 kph = 0.277778 m/s. Rounded to one decimal place.
  const windSpeedMs = (current.wind_kph / 3.6).toFixed(1);
  
  // Render the weather display UI.
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main weather card: City name, condition text, icon, temperature. */}
      <GlassCard className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-1">{location.name}, {location.country}</h2>
        <p className="text-lg sm:text-xl capitalize text-foreground/80">{current.condition.text}</p>
        <div className="my-4 sm:my-6">
          {/* WeatherIcon component to display the appropriate icon based on condition code and time of day. */}
          <WeatherIcon 
            weatherApiConditionCode={current.condition.code} 
            isDay={current.is_day === 1} // API returns 1 for day, 0 for night.
            size={80} // Icon size.
            className="mx-auto text-primary" // Styling.
            data-ai-hint={current.condition.text.toLowerCase()} // Hint for AI image generation (if used).
          />
        </div>
        <p className="text-5xl sm:text-6xl font-bold my-2">{Math.round(current.temp_c)}°C</p>
        <p className="text-sm text-foreground/80">Feels like {Math.round(current.feelslike_c)}°C</p>
      </GlassCard>

      {/* Grid for additional weather details and sunrise/sunset information. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card for detailed weather parameters. */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="space-y-2">
            {/* Using DataPoint component for each detail. */}
            <DataPoint icon={Thermometer} label="Min/Max Temp" value={`${Math.round(todayForecast.day.mintemp_c)}°/${Math.round(todayForecast.day.maxtemp_c)}°`} unit="C" />
            <DataPoint icon={Droplets} label="Humidity" value={current.humidity} unit="%" />
            <DataPoint icon={Wind} label="Wind" value={windSpeedMs} unit=" m/s" />
            <DataPoint icon={Gauge} label="Pressure" value={current.pressure_mb} unit=" hPa" />
            <DataPoint icon={Eye} label="Visibility" value={current.vis_km.toFixed(1)} unit=" km" />
            <DataPoint icon={Cloudy} label="Cloudiness" value={current.cloud} unit="%" />
          </div>
        </GlassCard>

        {/* Card for sunrise and sunset times. */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Sunrise & Sunset</h3>
          <div className="space-y-2">
             <DataPoint icon={Sunrise} label="Sunrise" value={todayForecast.astro.sunrise} />
             <DataPoint icon={Sunset} label="Sunset" value={todayForecast.astro.sunset} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
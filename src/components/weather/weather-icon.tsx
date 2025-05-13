"use client";

/**
 * @fileOverview WeatherIcon component that displays an appropriate icon
 * based on WeatherAPI.com condition codes and whether it's day or night.
 */

import type { LucideProps } from 'lucide-react';
// Importing various weather-related icons from lucide-react.
import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy,
  CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog, Wind, ThermometerSnowflake, ThermometerSun
} from 'lucide-react';

/**
 * Props for the WeatherIcon component.
 * Extends LucideProps but omits 'name' as the icon is determined internally.
 */
interface WeatherIconProps extends Omit<LucideProps, 'name'> {
  /** The condition code provided by WeatherAPI.com. */
  weatherApiConditionCode: number;
  /** Boolean indicating if it's daytime (true) or nighttime (false). WeatherAPI provides is_day (1 or 0). */
  isDay: boolean;
}

/**
 * Mapping of WeatherAPI.com condition codes to Lucide icon components.
 * Some codes have different icons for day and night.
 * Source for codes: https://www.weatherapi.com/docs/weather_conditions.json
 * @type {Record<number, { day: React.ElementType; night: React.ElementType } | React.ElementType>}
 */
const weatherApiIconMap: Record<number, { day: React.ElementType; night: React.ElementType } | React.ElementType> = {
  1000: { day: Sun, night: Moon }, // Sunny / Clear
  1003: { day: CloudSun, night: CloudMoon }, // Partly cloudy
  1006: Cloud, // Cloudy
  1009: Cloudy, // Overcast
  
  1030: CloudFog, // Mist
  1135: CloudFog, // Fog
  1147: CloudFog, // Freezing fog
  
  // Rain categories
  1063: { day: CloudDrizzle, night: CloudDrizzle }, // Patchy rain possible
  1150: { day: CloudDrizzle, night: CloudDrizzle }, // Patchy light drizzle
  1153: CloudDrizzle, // Light drizzle
  1180: { day: CloudDrizzle, night: CloudDrizzle }, // Patchy light rain
  1183: CloudDrizzle, // Light rain
  1186: { day: CloudRain, night: CloudRain },    // Patchy moderate rain
  1189: CloudRain, // Moderate rain
  1168: CloudSnow, // Light freezing rain (using CloudSnow as a close representation)
  1171: CloudSnow, // Moderate or heavy freezing rain
  1192: { day: CloudRain, night: CloudRain },    // Heavy rain at times
  1195: CloudRain, // Heavy rain
  
  // Sleet (mix of rain and snow)
  1069: { day: CloudDrizzle, night: CloudDrizzle }, // Patchy sleet possible (using Drizzle for light mixed precipitation)
  1204: CloudDrizzle, // Light sleet
  1207: CloudDrizzle, // Moderate or heavy sleet
  1240: { day: CloudRain, night: CloudRain }, // Light rain shower
  1243: { day: CloudRain, night: CloudRain }, // Moderate or heavy rain shower
  1246: CloudRain, // Torrential rain shower

  // Snow categories
  1066: { day: CloudSnow, night: CloudSnow }, // Patchy snow possible
  1114: CloudSnow, // Blowing snow
  1117: CloudSnow, // Blizzard
  1210: { day: CloudSnow, night: CloudSnow }, // Patchy light snow
  1213: CloudSnow, // Light snow
  1216: { day: CloudSnow, night: CloudSnow }, // Patchy moderate snow
  1219: CloudSnow, // Moderate snow
  1222: { day: CloudSnow, night: CloudSnow }, // Patchy heavy snow
  1225: CloudSnow, // Heavy snow
  1237: CloudSnow, // Ice pellets (similar to snow/hail)
  1249: CloudSnow, // Light sleet showers (snow as primary element)
  1252: CloudSnow, // Moderate or heavy sleet showers
  1255: { day: CloudSnow, night: CloudSnow }, // Light snow showers
  1258: CloudSnow, // Moderate or heavy snow showers
  1261: CloudSnow, // Light showers of ice pellets
  1264: CloudSnow, // Moderate or heavy showers of ice pellets

  // Thunderstorm categories
  1087: CloudLightning, // Thundery outbreaks possible
  1273: CloudLightning, // Patchy light rain with thunder
  1276: CloudLightning, // Moderate or heavy rain with thunder
  1279: CloudLightning, // Patchy light snow with thunder
  1282: CloudLightning, // Moderate or heavy snow with thunder
};

/**
 * WeatherIcon component.
 * Dynamically selects and renders a Lucide icon based on weather conditions.
 * @param {WeatherIconProps} props - The component's props.
 * @returns {JSX.Element} The rendered Lucide icon.
 */
export function WeatherIcon({ weatherApiConditionCode, isDay, className, size = 48, ...props }: WeatherIconProps): JSX.Element {
  // Default icon selection: Sun for day, Moon for night.
  let SelectedIcon: React.ElementType = isDay ? Sun : Moon;

  // Retrieve the icon mapping based on the condition code.
  const iconMappingEntry = weatherApiIconMap[weatherApiConditionCode];

  // Determine the specific icon based on whether it's day/night or a universal icon.
  if (typeof iconMappingEntry === 'object' && iconMappingEntry !== null && 'day' in iconMappingEntry && 'night' in iconMappingEntry) {
    // If the mapping has separate day and night icons.
    SelectedIcon = isDay ? iconMappingEntry.day : iconMappingEntry.night;
  } else if (typeof iconMappingEntry === 'function') {
    // If the mapping is a single icon component (React.ElementType).
    SelectedIcon = iconMappingEntry;
  }

  // Handle special, non-WeatherAPI codes for custom icons (e.g., extreme temperatures, wind).
  // These codes are arbitrary and used for specific custom representations.
  if (weatherApiConditionCode === -100) return <ThermometerSun className={className} size={size} {...props} data-ai-hint="hot temperature" />;
  if (weatherApiConditionCode === -101) return <ThermometerSnowflake className={className} size={size} {...props} data-ai-hint="cold temperature" />;
  if (weatherApiConditionCode === -102) return <Wind className={className} size={size} {...props} data-ai-hint="strong wind" />;

  // Render the selected icon component with provided props (className, size, etc.).
  return <SelectedIcon className={className} size={size} {...props} />;
}
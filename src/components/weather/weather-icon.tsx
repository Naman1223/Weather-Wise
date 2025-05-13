"use client";

import type { LucideProps } from 'lucide-react';
import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy,
  CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog, Wind, ThermometerSnowflake, ThermometerSun
} from 'lucide-react';

interface WeatherIconProps extends Omit<LucideProps, 'name'> {
  iconCode: string;
}

const iconMap: Record<string, React.ElementType<LucideProps>> = {
  '01d': Sun, // clear sky day
  '01n': Moon, // clear sky night
  '02d': CloudSun, // few clouds day
  '02n': CloudMoon, // few clouds night
  '03d': Cloud, // scattered clouds day
  '03n': Cloud, // scattered clouds night
  '04d': Cloudy, // broken clouds day
  '04n': Cloudy, // broken clouds night
  '09d': CloudRain, // shower rain day
  '09n': CloudRain, // shower rain night
  '10d': CloudDrizzle, // rain day (using Drizzle for lighter rain, could be CloudRain for heavier)
  '10n': CloudDrizzle, // rain night
  '11d': CloudLightning, // thunderstorm day
  '11n': CloudLightning, // thunderstorm night
  '13d': CloudSnow, // snow day
  '13n': CloudSnow, // snow night
  '50d': CloudFog, // mist day
  '50n': CloudFog, // mist night
};

export function WeatherIcon({ iconCode, className, size = 48, ...props }: WeatherIconProps) {
  const IconComponent = iconMap[iconCode] || Sun; // Default to Sun if no match

  // Special icons for extreme temperatures
  if (iconCode === 'temp_hot') return <ThermometerSun className={className} size={size} {...props} />;
  if (iconCode === 'temp_cold') return <ThermometerSnowflake className={className} size={size} {...props} />;
  if (iconCode === 'wind') return <Wind className={className} size={size} {...props} />;


  return <IconComponent className={className} size={size} {...props} />;
}

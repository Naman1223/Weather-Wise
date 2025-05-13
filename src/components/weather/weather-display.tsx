"use client";

import type { WeatherData } from '@/types/weather';
import { WeatherIcon } from './weather-icon';
import { Thermometer, Droplets, Wind, Sunrise, Sunset, Eye, Gauge } from 'lucide-react';

interface WeatherDisplayProps {
  data: WeatherData;
}

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const DataPoint: React.FC<{ icon: React.ElementType, label: string, value: string | number, unit?: string }> = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center space-x-2 text-sm sm:text-base">
    <Icon size={20} className="text-primary" />
    <div>
      <span className="font-medium">{label}:</span> {value}{unit && <span className="text-xs">{unit}</span>}
    </div>
  </div>
);


export function WeatherDisplay({ data }: WeatherDisplayProps) {
  if (!data || !data.weather || data.weather.length === 0) {
    return <GlassCard className="text-center">No weather data available.</GlassCard>;
  }

  const { name, main, weather, wind, sys, visibility, clouds } = data;
  const weatherInfo = weather[0];

  const formatTime = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000); // Apply timezone offset
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <GlassCard className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-1">{name}, {sys.country}</h2>
        <p className="text-lg sm:text-xl capitalize text-foreground/80">{weatherInfo.description}</p>
        <div className="my-4 sm:my-6">
          <WeatherIcon iconCode={weatherInfo.icon} size={80} className="mx-auto text-primary" />
        </div>
        <p className="text-5xl sm:text-6xl font-bold my-2">{Math.round(main.temp)}°C</p>
        <p className="text-sm text-foreground/80">Feels like {Math.round(main.feels_like)}°C</p>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="space-y-2">
            <DataPoint icon={Thermometer} label="Min/Max Temp" value={`${Math.round(main.temp_min)}°/${Math.round(main.temp_max)}°`} unit="C" />
            <DataPoint icon={Droplets} label="Humidity" value={main.humidity} unit="%" />
            <DataPoint icon={Wind} label="Wind" value={wind.speed.toFixed(1)} unit=" m/s" />
            <DataPoint icon={Gauge} label="Pressure" value={main.pressure} unit=" hPa" />
            <DataPoint icon={Eye} label="Visibility" value={(visibility / 1000).toFixed(1)} unit=" km" />
            <DataPoint icon={Cloudy} label="Cloudiness" value={clouds.all} unit="%" />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Sunrise & Sunset</h3>
          <div className="space-y-2">
             <DataPoint icon={Sunrise} label="Sunrise" value={formatTime(sys.sunrise, data.timezone)} />
             <DataPoint icon={Sunset} label="Sunset" value={formatTime(sys.sunset, data.timezone)} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

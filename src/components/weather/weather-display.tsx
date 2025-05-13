"use client";

import type { WeatherData } from '@/types/weather';
import { WeatherIcon } from './weather-icon';
import { Thermometer, Droplets, Wind, Sunrise, Sunset, Eye, Gauge, Cloudy } from 'lucide-react';

interface WeatherDisplayProps {
  data: WeatherData;
}

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card/80 dark:bg-card/70 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
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
  if (!data || data.error || !data.location || !data.current || !data.forecast?.forecastday?.[0]) {
    return <GlassCard className="text-center">No weather data available or error fetching data.</GlassCard>;
  }

  const { location, current, forecast } = data;
  const todayForecast = forecast.forecastday[0];

  // WeatherAPI wind speed is in kph, convert to m/s for consistency if desired (1 kph = 0.277778 m/s)
  const windSpeedMs = (current.wind_kph / 3.6).toFixed(1);
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <GlassCard className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-1">{location.name}, {location.country}</h2>
        <p className="text-lg sm:text-xl capitalize text-foreground/80">{current.condition.text}</p>
        <div className="my-4 sm:my-6">
          <WeatherIcon 
            weatherApiConditionCode={current.condition.code} 
            isDay={current.is_day === 1} 
            size={80} 
            className="mx-auto text-primary"
            data-ai-hint={current.condition.text.toLowerCase()} 
          />
        </div>
        <p className="text-5xl sm:text-6xl font-bold my-2">{Math.round(current.temp_c)}°C</p>
        <p className="text-sm text-foreground/80">Feels like {Math.round(current.feelslike_c)}°C</p>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="space-y-2">
            <DataPoint icon={Thermometer} label="Min/Max Temp" value={`${Math.round(todayForecast.day.mintemp_c)}°/${Math.round(todayForecast.day.maxtemp_c)}°`} unit="C" />
            <DataPoint icon={Droplets} label="Humidity" value={current.humidity} unit="%" />
            <DataPoint icon={Wind} label="Wind" value={windSpeedMs} unit=" m/s" />
            <DataPoint icon={Gauge} label="Pressure" value={current.pressure_mb} unit=" hPa" />
            <DataPoint icon={Eye} label="Visibility" value={current.vis_km.toFixed(1)} unit=" km" />
            <DataPoint icon={Cloudy} label="Cloudiness" value={current.cloud} unit="%" />
          </div>
        </GlassCard>

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

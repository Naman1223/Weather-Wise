export interface WeatherApiLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherApiCondition {
  text: string;
  icon: string; // URL path
  code: number; // Condition code
}

export interface WeatherApiCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number; // 1 for day, 0 for night
  condition: WeatherApiCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number; // Cloud cover as percentage
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface WeatherApiAstro {
  sunrise: string; // e.g., "06:00 AM"
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
}

export interface WeatherApiDayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: string;
  daily_will_it_snow: number;
  daily_chance_of_snow: string;
  condition: WeatherApiCondition;
  uv: number;
}

export interface WeatherApiForecastDayItem {
  date: string;
  date_epoch: number;
  day: WeatherApiDayForecast;
  astro: WeatherApiAstro;
  hour: any[]; // Can be detailed if needed
}

export interface WeatherApiForecast {
  forecastday: WeatherApiForecastDayItem[];
}

export interface WeatherData {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
  forecast: WeatherApiForecast; // To get Astro and daily min/max
  error?: { // For API error responses
    code: number;
    message: string;
  };
}

export interface CitySuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string; // Often a unique identifier for the city in WeatherAPI system
}

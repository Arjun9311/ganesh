import { WeatherCondition } from '@/types/game';

// Preset festival cities with coordinates for fast lookup
export const FESTIVAL_CITIES: Record<string, { lat: number; lon: number; state: string }> = {
  'Mumbai': { lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  'Pune': { lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  'Hyderabad': { lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  'Bengaluru': { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  'Delhi': { lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  'Varanasi': { lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
  'Jaipur': { lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  'Kolkata': { lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
  'Chennai': { lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' }
};

const WEATHER_CACHE_KEY = 'vighnaharta_weather_cache';
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

function mapWeatherCode(code: number): WeatherCondition['condition'] {
  // WMO Weather interpretation codes (http://open-meteo.com)
  if (code === 0 || code === 1) return 'Sunny';
  if (code === 2 || code === 3) return 'Cloudy';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Rain';
  if ([95, 96, 99].includes(code)) return 'Storm';
  return 'Sunset';
}

export async function fetchCityWeather(cityName: string): Promise<WeatherCondition> {
  const fallbackCondition: WeatherCondition = {
    city: cityName || 'Mumbai',
    temp: 29,
    condition: 'Sunny',
    code: 0,
    isFallback: true
  };

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${WEATHER_CACHE_KEY}_${cityName}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
          return parsed.data;
        }
      }
    } catch {
      // ignore storage read issues
    }
  }

  try {
    let lat = 19.0760;
    let lon = 72.8777;

    if (FESTIVAL_CITIES[cityName]) {
      lat = FESTIVAL_CITIES[cityName].lat;
      lon = FESTIVAL_CITIES[cityName].lon;
    } else {
      // Use Open-Meteo Geocoding
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
        }
      }
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!weatherRes.ok) {
      return fallbackCondition;
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    const result: WeatherCondition = {
      city: cityName,
      temp: Math.round(current.temperature),
      condition: mapWeatherCode(current.weathercode),
      code: current.weathercode,
      isFallback: false
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${WEATHER_CACHE_KEY}_${cityName}`, JSON.stringify({
          timestamp: Date.now(),
          data: result
        }));
      } catch {
        // ignore cache write error
      }
    }

    return result;
  } catch {
    return fallbackCondition;
  }
}

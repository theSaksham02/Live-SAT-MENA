"""Weather service using Open-Meteo API."""
import time
import httpx
from app.config import OPEN_METEO_URL, MENA_CITIES, CACHE_TTL

# Simple in-memory cache
_cache: dict = {}

# WMO weather code descriptions
WMO_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight showers",
    81: "Moderate showers",
    82: "Violent showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
}


def _is_cache_valid(key: str) -> bool:
    """Check if cache entry is still valid."""
    if key not in _cache:
        return False
    return (time.time() - _cache[key]["timestamp"]) < CACHE_TTL


def _weather_code_description(code: int) -> str:
    """Get human-readable description for WMO weather code."""
    return WMO_CODES.get(code, "Unknown")


async def fetch_weather_for_point(lat: float, lon: float) -> dict:
    """Fetch current weather for a specific lat/lon point."""
    cache_key = f"weather_{lat}_{lon}"
    if _is_cache_valid(cache_key):
        return _cache[cache_key]["data"]

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                OPEN_METEO_URL,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current_weather": "true",
                },
            )
            response.raise_for_status()
            data = response.json()
            cw = data.get("current_weather", {})
            result = {
                "lat": lat,
                "lon": lon,
                "temperature": cw.get("temperature"),
                "windspeed": cw.get("windspeed"),
                "winddirection": cw.get("winddirection"),
                "weathercode": cw.get("weathercode"),
                "description": _weather_code_description(cw.get("weathercode", -1)),
                "is_day": cw.get("is_day"),
            }
    except Exception:
        result = {
            "lat": lat,
            "lon": lon,
            "temperature": None,
            "windspeed": None,
            "winddirection": None,
            "weathercode": None,
            "description": "Unavailable",
            "is_day": None,
        }

    _cache[cache_key] = {"data": result, "timestamp": time.time()}
    return result


async def fetch_region_weather() -> list:
    """Fetch weather for all key MENA cities."""
    cache_key = "region_weather"
    if _is_cache_valid(cache_key):
        return _cache[cache_key]["data"]

    results = []
    for city in MENA_CITIES:
        weather = await fetch_weather_for_point(city["lat"], city["lon"])
        results.append({
            "city": city["name"],
            "country": city["country"],
            **weather,
        })

    _cache[cache_key] = {"data": results, "timestamp": time.time()}
    return results

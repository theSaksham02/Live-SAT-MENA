"""Configuration for Live-SAT-MENA backend."""
import os

# MENA region bounding box
MENA_LAT_MIN = float(os.environ.get("MENA_LAT_MIN", 12))
MENA_LAT_MAX = float(os.environ.get("MENA_LAT_MAX", 42))
MENA_LON_MIN = float(os.environ.get("MENA_LON_MIN", 24))
MENA_LON_MAX = float(os.environ.get("MENA_LON_MAX", 63))

# Key MENA cities with coordinates for weather
MENA_CITIES = [
    {"name": "Baghdad", "lat": 33.3, "lon": 44.4, "country": "Iraq"},
    {"name": "Damascus", "lat": 33.5, "lon": 36.3, "country": "Syria"},
    {"name": "Tehran", "lat": 35.7, "lon": 51.4, "country": "Iran"},
    {"name": "Beirut", "lat": 33.9, "lon": 35.5, "country": "Lebanon"},
    {"name": "Sanaa", "lat": 15.4, "lon": 44.2, "country": "Yemen"},
    {"name": "Riyadh", "lat": 24.7, "lon": 46.7, "country": "Saudi Arabia"},
    {"name": "Jerusalem", "lat": 31.8, "lon": 35.2, "country": "Israel/Palestine"},
    {"name": "Cairo", "lat": 30.0, "lon": 31.2, "country": "Egypt"},
    {"name": "Tripoli", "lat": 32.9, "lon": 13.2, "country": "Libya"},
    {"name": "Amman", "lat": 31.9, "lon": 35.9, "country": "Jordan"},
    {"name": "Dubai", "lat": 25.2, "lon": 55.3, "country": "UAE"},
    {"name": "Ankara", "lat": 39.9, "lon": 32.9, "country": "Turkey"},
    {"name": "Tel Aviv", "lat": 32.1, "lon": 34.8, "country": "Israel"},
    {"name": "Kabul", "lat": 34.5, "lon": 69.2, "country": "Afghanistan"},
    {"name": "Islamabad", "lat": 33.7, "lon": 73.0, "country": "Pakistan"},
]

# Optional API keys
OPENWEATHERMAP_API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY", "")

# NASA GIBS base URL
GIBS_BASE_URL = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best"

# GDELT API base URL
GDELT_API_URL = "https://api.gdeltproject.org/api/v2/doc/doc"

# Open-Meteo API base URL
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# Cache TTL in seconds
CACHE_TTL = 300  # 5 minutes

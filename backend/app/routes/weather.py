"""Weather data routes using Open-Meteo."""
from fastapi import APIRouter, Query
from app.services.weather import fetch_weather_for_point, fetch_region_weather

router = APIRouter()


@router.get("/current")
async def current_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
):
    """Fetch current weather for a specific lat/lon point."""
    return await fetch_weather_for_point(lat, lon)


@router.get("/region")
async def region_weather():
    """Fetch weather overview for all key MENA cities."""
    cities = await fetch_region_weather()
    return {"cities": cities, "count": len(cities)}

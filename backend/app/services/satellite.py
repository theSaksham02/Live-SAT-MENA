"""Satellite imagery service for NASA GIBS integration."""
from datetime import datetime, timedelta
from app.config import GIBS_BASE_URL

# Available satellite imagery layers
SATELLITE_LAYERS = [
    {
        "id": "MODIS_Terra_CorrectedReflectance_TrueColor",
        "name": "MODIS Terra True Color",
        "description": "Terra MODIS corrected reflectance true color imagery",
        "tilematrixset": "2km",
        "wmts_url": f"{GIBS_BASE_URL}/MODIS_Terra_CorrectedReflectance_TrueColor/default/{{date}}/2km/{{z}}/{{y}}/{{x}}.jpg",
    },
    {
        "id": "VIIRS_SNPP_CorrectedReflectance_TrueColor",
        "name": "VIIRS SNPP True Color",
        "description": "Suomi NPP VIIRS corrected reflectance true color imagery",
        "tilematrixset": "250m",
        "wmts_url": f"{GIBS_BASE_URL}/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/{{date}}/250m/{{z}}/{{y}}/{{x}}.jpg",
    },
    {
        "id": "MODIS_Terra_CorrectedReflectance_Bands367",
        "name": "MODIS Terra Bands 3-6-7",
        "description": "Terra MODIS corrected reflectance bands 3-6-7 (vegetation/burn detection)",
        "tilematrixset": "2km",
        "wmts_url": f"{GIBS_BASE_URL}/MODIS_Terra_CorrectedReflectance_Bands367/default/{{date}}/2km/{{z}}/{{y}}/{{x}}.jpg",
    },
    {
        "id": "VIIRS_NOAA20_CorrectedReflectance_TrueColor",
        "name": "VIIRS NOAA-20 True Color",
        "description": "NOAA-20 VIIRS corrected reflectance true color imagery",
        "tilematrixset": "250m",
        "wmts_url": f"{GIBS_BASE_URL}/VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/{{date}}/250m/{{z}}/{{y}}/{{x}}.jpg",
    },
    {
        "id": "MODIS_Aqua_CorrectedReflectance_TrueColor",
        "name": "MODIS Aqua True Color",
        "description": "Aqua MODIS corrected reflectance true color imagery",
        "tilematrixset": "2km",
        "wmts_url": f"{GIBS_BASE_URL}/MODIS_Aqua_CorrectedReflectance_TrueColor/default/{{date}}/2km/{{z}}/{{y}}/{{x}}.jpg",
    },
]


def get_layers() -> list:
    """Return all available satellite imagery layers."""
    return SATELLITE_LAYERS


def get_latest_metadata() -> dict:
    """Return metadata about the latest available satellite imagery."""
    # GIBS imagery is typically 1 day delayed
    yesterday = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
    return {
        "latest_date": yesterday,
        "note": "NASA GIBS imagery is approximately 1 day delayed",
        "layers_available": len(SATELLITE_LAYERS),
        "base_url": GIBS_BASE_URL,
    }

"""Satellite imagery routes."""
from fastapi import APIRouter
from app.services.satellite import get_layers, get_latest_metadata

router = APIRouter()


@router.get("/layers")
async def list_layers():
    """Return available satellite imagery layers from NASA GIBS."""
    return {"layers": get_layers()}


@router.get("/latest")
async def latest_imagery():
    """Return metadata about the latest available satellite imagery."""
    return get_latest_metadata()

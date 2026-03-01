"""Conflict and news event routes using GDELT."""
from fastapi import APIRouter
from app.services.news import fetch_conflict_events, fetch_news_events

router = APIRouter()


@router.get("/conflicts")
async def get_conflicts():
    """Fetch recent conflict events in the MENA region."""
    events = await fetch_conflict_events()
    return {"events": events, "count": len(events)}


@router.get("/news")
async def get_news():
    """Fetch latest GDELT news events geolocated to MENA."""
    events = await fetch_news_events()
    return {"events": events, "count": len(events)}

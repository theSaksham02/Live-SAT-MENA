"""News and conflict event service using GDELT API."""
import time
import httpx
from app.config import GDELT_API_URL, MENA_LAT_MIN, MENA_LAT_MAX, MENA_LON_MIN, MENA_LON_MAX, CACHE_TTL

# Simple in-memory cache
_cache: dict = {}


def _is_cache_valid(key: str) -> bool:
    """Check if cache entry is still valid."""
    if key not in _cache:
        return False
    return (time.time() - _cache[key]["timestamp"]) < CACHE_TTL


def _get_mock_events() -> list:
    """Return mock conflict events for fallback when GDELT is unavailable."""
    return [
        {
            "id": "mock_1",
            "title": "Military activity reported in northern Syria",
            "lat": 36.2,
            "lon": 37.1,
            "date": "2025-01-01T00:00:00Z",
            "source_url": "https://example.com/news/1",
            "source_domain": "example.com",
            "event_type": "conflict",
            "country": "Syria",
            "image_url": None,
        },
        {
            "id": "mock_2",
            "title": "Security forces deploy in Baghdad",
            "lat": 33.3,
            "lon": 44.4,
            "date": "2025-01-01T00:00:00Z",
            "source_url": "https://example.com/news/2",
            "source_domain": "example.com",
            "event_type": "military",
            "country": "Iraq",
            "image_url": None,
        },
        {
            "id": "mock_3",
            "title": "Protests reported in Tehran",
            "lat": 35.7,
            "lon": 51.4,
            "date": "2025-01-01T00:00:00Z",
            "source_url": "https://example.com/news/3",
            "source_domain": "example.com",
            "event_type": "protest",
            "country": "Iran",
            "image_url": None,
        },
        {
            "id": "mock_4",
            "title": "Humanitarian situation worsens in Yemen",
            "lat": 15.4,
            "lon": 44.2,
            "date": "2025-01-01T00:00:00Z",
            "source_url": "https://example.com/news/4",
            "source_domain": "example.com",
            "event_type": "conflict",
            "country": "Yemen",
            "image_url": None,
        },
        {
            "id": "mock_5",
            "title": "Security incidents near Gaza border",
            "lat": 31.5,
            "lon": 34.5,
            "date": "2025-01-01T00:00:00Z",
            "source_url": "https://example.com/news/5",
            "source_domain": "example.com",
            "event_type": "conflict",
            "country": "Israel/Palestine",
            "image_url": None,
        },
    ]


def _classify_event(title: str) -> str:
    """Classify event type based on title keywords."""
    title_lower = title.lower()
    conflict_keywords = ["airstrike", "attack", "bombing", "explosion", "killed", "war", "military", "conflict", "strike", "missile", "rocket", "shelling"]
    protest_keywords = ["protest", "demonstration", "riot", "unrest", "march", "rally"]
    for kw in conflict_keywords:
        if kw in title_lower:
            return "conflict"
    for kw in protest_keywords:
        if kw in title_lower:
            return "protest"
    return "news"


def _parse_gdelt_articles(articles: list) -> list:
    """Parse GDELT article list into structured events."""
    events = []
    for i, article in enumerate(articles):
        # GDELT articles may or may not have geolocation
        lat = article.get("geolocation", {}).get("lat") if article.get("geolocation") else None
        lon = article.get("geolocation", {}).get("lon") if article.get("geolocation") else None

        # Skip articles without coordinates or outside MENA bounds
        if lat is None or lon is None:
            continue
        try:
            lat = float(lat)
            lon = float(lon)
        except (ValueError, TypeError):
            continue

        if not (MENA_LAT_MIN <= lat <= MENA_LAT_MAX and MENA_LON_MIN <= lon <= MENA_LON_MAX):
            continue

        title = article.get("title", "")
        url = article.get("url", "")
        source_domain = url.split("/")[2] if url.startswith("http") and len(url.split("/")) > 2 else "unknown"

        events.append({
            "id": f"gdelt_{i}",
            "title": title,
            "lat": lat,
            "lon": lon,
            "date": article.get("seendate", ""),
            "source_url": url,
            "source_domain": source_domain,
            "event_type": _classify_event(title),
            "country": article.get("sourcecountry", ""),
            "image_url": article.get("socialimage"),
        })
    return events


async def fetch_conflict_events() -> list:
    """Fetch recent conflict events in the MENA region from GDELT."""
    cache_key = "conflicts"
    if _is_cache_valid(cache_key):
        return _cache[cache_key]["data"]

    query = (
        "conflict OR military OR airstrike OR attack OR war "
        "(Syria OR Iraq OR Iran OR Israel OR Palestine OR Lebanon OR Yemen "
        "OR Saudi Arabia OR Jordan OR Egypt OR Libya OR Turkey OR Gaza)"
    )
    params = {
        "query": query,
        "mode": "ArtList",
        "maxrecords": "75",
        "format": "json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GDELT_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            articles = data.get("articles", [])
            events = _parse_gdelt_articles(articles)
            if not events:
                events = _get_mock_events()
    except Exception:
        events = _get_mock_events()

    _cache[cache_key] = {"data": events, "timestamp": time.time()}
    return events


async def fetch_news_events() -> list:
    """Fetch latest GDELT news events geolocated to MENA."""
    cache_key = "news"
    if _is_cache_valid(cache_key):
        return _cache[cache_key]["data"]

    query = (
        "Middle East OR MENA OR Syria OR Iraq OR Iran OR Israel OR Lebanon "
        "OR Yemen OR Saudi Arabia OR Jordan OR Egypt OR Libya OR Gaza OR Palestine"
    )
    params = {
        "query": query,
        "mode": "ArtList",
        "maxrecords": "75",
        "format": "json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GDELT_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            articles = data.get("articles", [])
            events = _parse_gdelt_articles(articles)
            if not events:
                events = _get_mock_events()
    except Exception:
        events = _get_mock_events()

    _cache[cache_key] = {"data": events, "timestamp": time.time()}
    return events

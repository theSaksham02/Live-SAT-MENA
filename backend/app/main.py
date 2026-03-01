"""FastAPI entry point for Live-SAT-MENA backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import imagery, events, weather

app = FastAPI(
    title="Live-SAT-MENA API",
    description="Live Satellite & OSINT Intelligence Dashboard — Middle East / MENA Region",
    version="1.0.0",
)

# Allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount route modules
app.include_router(imagery.router, prefix="/api/imagery", tags=["imagery"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "live-sat-mena"}

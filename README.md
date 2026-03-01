# 🛰️ LIVE-SAT MENA — Middle East Satellite Intelligence Dashboard

![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

A self-hostable **Live Satellite & OSINT Intelligence Dashboard** focused on the **Middle East / MENA region**. Monitor satellite imagery, conflict events, news feeds, and weather overlays in real-time — all from a single dashboard you can run locally with `docker-compose up`.

## ✨ Features

- 🛰️ **Live Satellite Imagery** — NASA GIBS MODIS/VIIRS true-color overlays (free, no API key)
- ⚡ **Conflict Event Markers** — GDELT-powered geolocated conflict & news events on the map
- 🌤️ **Weather Overlay** — Open-Meteo weather data for 15 key MENA cities (free, no API key)
- 🗺️ **Multi-layer Map** — CartoDB Dark Matter, OpenStreetMap, Esri World Imagery base maps
- 📡 **Event Feed Sidebar** — Scrollable, auto-refreshing list of latest events
- 🎛️ **Layer Controls** — Toggle overlays, pick satellite layer/date/opacity
- 🌑 **Dark Military Theme** — Green-accented terminal aesthetic
- 🐳 **Docker-first** — One command to launch the full stack
- ⚙️ **Zero configuration** — Works out of the box with no paid APIs

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/theSaksham02/Live-SAT-MENA.git
cd Live-SAT-MENA

# 2. Copy environment variables
cp .env.example .env

# 3. Launch the full stack
docker-compose up --build
```

Open your browser at **http://localhost:3000**

## 🔧 Manual Setup (without Docker)

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

> Frontend dev server proxies `/api` calls to `http://localhost:8000`.

## ⚙️ Configuration

All settings are optional — the app works with defaults. Copy `.env.example` to `.env`:

| Variable | Default | Description |
|---|---|---|
| `OPENWEATHERMAP_API_KEY` | *(empty)* | Optional OWM key (falls back to Open-Meteo) |
| `BACKEND_PORT` | `8000` | Port for the FastAPI backend |
| `FRONTEND_PORT` | `3000` | Port for the frontend |
| `MENA_LAT_MIN` | `12` | MENA bounding box south |
| `MENA_LAT_MAX` | `42` | MENA bounding box north |
| `MENA_LON_MIN` | `24` | MENA bounding box west |
| `MENA_LON_MAX` | `63` | MENA bounding box east |

## 🏗️ Architecture

```
Browser
  │
  ▼
Frontend (React + Leaflet)  :3000
  │   /api/* → proxy
  ▼
Backend (FastAPI)            :8000
  ├── /api/imagery/*   → NASA GIBS (satellite tiles)
  ├── /api/events/*    → GDELT Project (conflict/news)
  └── /api/weather/*   → Open-Meteo (weather)
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/imagery/layers` | List available satellite layers |
| GET | `/api/imagery/latest` | Latest imagery metadata |
| GET | `/api/events/conflicts` | Conflict events in MENA (GDELT) |
| GET | `/api/events/news` | News events in MENA (GDELT) |
| GET | `/api/weather/current?lat=&lon=` | Weather for a point |
| GET | `/api/weather/region` | Weather for all MENA cities |

## 🌍 Data Sources

| Source | Data | Cost |
|---|---|---|
| [NASA GIBS](https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs) | Satellite imagery (MODIS, VIIRS) | Free, no key |
| [GDELT Project](https://www.gdeltproject.org) | Conflict & news events | Free, no key |
| [Open-Meteo](https://open-meteo.com) | Weather data | Free, no key |
| [OpenStreetMap](https://www.openstreetmap.org) / [CartoDB](https://carto.com) | Base maps | Free |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Leaflet.js / react-leaflet, CSS (dark military theme)
- **Backend**: Python 3.11, FastAPI, httpx (async HTTP)
- **Infrastructure**: Docker, docker-compose, nginx (reverse proxy)

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss your idea.

## ⚠️ Disclaimer

This project uses publicly available data for educational and research purposes only. Data may be delayed, incomplete, or inaccurate. Not intended for operational use. The authors are not responsible for decisions made based on information displayed.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
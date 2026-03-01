import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SatelliteLayer from './SatelliteLayer';
import EventMarkers from './EventMarkers';
import WeatherOverlay from './WeatherOverlay';

const { BaseLayer } = LayersControl;

/**
 * Handles map click to show lat/lon in a popup.
 */
function ClickHandler() {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      map.openPopup(
        `<span style="font-family:'Courier New',monospace;font-size:12px">
          📍 ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E
        </span>`,
        e.latlng
      );
    },
  });
  return null;
}

/**
 * Listens for mapFocus prop changes and flies to the target coordinates.
 * @param {{ focusPoint: [number, number] }} props
 */
function MapFocusController({ focusPoint }) {
  const map = useMap();
  useEffect(() => {
    if (focusPoint && focusPoint.length === 2) {
      map.flyTo(focusPoint, 8, { animate: true, duration: 1.2 });
    }
  }, [focusPoint, map]);
  return null;
}

/**
 * Main Leaflet map component centered on MENA.
 * @param {{ satelliteSettings: object, showEvents: boolean, showWeather: boolean, mapFocus: [number, number] }} props
 */
function Map({ satelliteSettings, showEvents, showWeather, mapFocus }) {
  return (
    <MapContainer
      center={[29, 42]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      attributionControl={true}
      zoomControl={true}
    >
      <LayersControl position="topright">
        <BaseLayer checked name="Dark Matter">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={20}
          />
        </BaseLayer>
        <BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </BaseLayer>
        <BaseLayer name="Esri World Imagery">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        </BaseLayer>
      </LayersControl>

      <SatelliteLayer
        layer={satelliteSettings.layer}
        date={satelliteSettings.date}
        opacity={satelliteSettings.opacity}
        visible={satelliteSettings.visible}
      />

      <EventMarkers visible={showEvents} />
      <WeatherOverlay visible={showWeather} />

      <MapFocusController focusPoint={mapFocus} />
      <ClickHandler />
    </MapContainer>
  );
}

export default Map;

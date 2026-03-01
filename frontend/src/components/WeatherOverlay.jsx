import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import useApi from '../hooks/useApi';

/**
 * WeatherOverlay — shows weather badges for key MENA cities on the map.
 * @param {{ visible: boolean }} props
 */
function WeatherOverlay({ visible }) {
  const map = useMap();
  const { data } = useApi('/api/weather/region', 600000);

  useEffect(() => {
    if (!data || !data.cities) return;

    const markers = [];

    data.cities.forEach(city => {
      if (!city.lat || !city.lon) return;

      const temp = city.temperature != null ? `${Math.round(city.temperature)}°C` : '--';
      const icon = L.divIcon({
        className: '',
        html: `<div class="weather-badge" title="${city.city}: ${city.description || ''} | Wind: ${city.windspeed ?? '--'} km/h">${city.city.split(' ')[0]} ${temp}</div>`,
        iconAnchor: [0, 0],
      });

      const marker = L.marker([city.lat, city.lon], { icon });

      marker.bindTooltip(
        `<strong>${city.city}</strong>, ${city.country}<br/>
        🌡️ ${temp}<br/>
        💨 ${city.windspeed ?? '--'} km/h<br/>
        ☁️ ${city.description || 'Unknown'}`,
        { direction: 'top', offset: [0, -4] }
      );

      if (visible) {
        marker.addTo(map);
      }
      markers.push(marker);
    });

    return () => {
      markers.forEach(m => m.remove());
    };
  }, [data, map, visible]);

  return null;
}

export default WeatherOverlay;

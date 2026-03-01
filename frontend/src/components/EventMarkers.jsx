import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import useApi from '../hooks/useApi';

/**
 * Get event type color.
 * @param {string} eventType
 * @returns {string}
 */
function getEventColor(eventType) {
  switch (eventType) {
    case 'conflict': return '#ff4444';
    case 'protest': return '#ffaa00';
    default: return '#ffdd00';
  }
}

/**
 * EventMarkers component — renders conflict event markers on the map.
 * @param {{ visible: boolean }} props
 */
function EventMarkersInner({ visible }) {
  const map = useMap();
  const { data } = useApi('/api/events/conflicts', 300000);

  useEffect(() => {
    if (!data || !data.events) return;

    const markers = [];
    const now = Date.now();

    data.events.forEach((event, i) => {
      if (!event.lat || !event.lon) return;

      const color = getEventColor(event.event_type);
      const eventTime = event.date ? new Date(event.date).getTime() : 0;
      const isRecent = now - eventTime < 3600000; // within 1 hour

      const marker = L.circleMarker([event.lat, event.lon], {
        radius: 7,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.7,
        className: isRecent ? 'pulse-marker' : '',
      });

      marker.bindPopup(`
        <div style="min-width:200px">
          <strong style="color:${color}">${event.event_type?.toUpperCase() || 'EVENT'}</strong><br/>
          <span>${event.title || 'No title'}</span><br/><br/>
          <span style="color:#6a8a7a">📅 ${event.date ? new Date(event.date).toLocaleString() : 'Unknown date'}</span><br/>
          <span style="color:#ffaa00">🌍 ${event.country || 'Unknown'}</span><br/>
          ${event.source_url ? `<a href="${event.source_url}" target="_blank" rel="noopener noreferrer">🔗 Source</a>` : ''}
        </div>
      `);

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

export default EventMarkersInner;

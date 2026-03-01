import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';

const REFRESH_INTERVAL = 300; // seconds

/**
 * Format relative time string.
 * @param {string} dateStr
 * @returns {string}
 */
function relativeTime(dateStr) {
  if (!dateStr) return 'Unknown';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * EventFeed component — sidebar list of conflict events.
 */
function EventFeed() {
  const map = useMap();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/events/conflicts');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Countdown + auto-refresh
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          loadEvents();
          return REFRESH_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loadEvents]);

  const flyToEvent = event => {
    if (event.lat && event.lon) {
      map.flyTo([event.lat, event.lon], 8, { animate: true, duration: 1.2 });
    }
  };

  const getCardClass = type => {
    if (type === 'conflict') return 'event-card conflict';
    if (type === 'protest') return 'event-card protest';
    return 'event-card news';
  };

  return (
    <div className="event-feed">
      <div className="event-feed-header">
        <div>
          <div className="event-count">
            {loading ? '...' : `${events.length} events`}
          </div>
          <div className="event-timer">Refresh in {countdown}s</div>
        </div>
        <button className="refresh-btn" onClick={loadEvents} disabled={loading}>
          {loading ? '⏳' : '↻ Refresh'}
        </button>
      </div>

      <div className="event-list">
        {loading && (
          <div className="loading-state">
            <span className="spinner" /> Loading events...
          </div>
        )}
        {error && !loading && (
          <div className="error-state">⚠️ {error}</div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="loading-state">No events available</div>
        )}
        {!loading && events.map((event, i) => (
          <div
            key={event.id || i}
            className={getCardClass(event.event_type)}
            onClick={() => flyToEvent(event)}
          >
            <div className="event-card-title">{event.title || 'Untitled event'}</div>
            <div className="event-card-meta">
              <span className="event-card-country">{event.country || '—'}</span>
              <span>{relativeTime(event.date)}</span>
            </div>
            {event.source_domain && (
              <div className="event-card-meta">
                <span style={{ color: '#6a8a7a', fontSize: '10px' }}>{event.source_domain}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventFeed;

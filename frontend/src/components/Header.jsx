import { useEffect, useState } from 'react';

/**
 * Header component with title, UTC clock, and connection status.
 * @param {{ connected: boolean, lastRefresh: string }} props
 */
function Header({ connected, lastRefresh }) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="header">
      <div className="header-title">
        <h1>🛰️ LIVE-SAT MENA</h1>
        <span>Middle East Satellite Monitor</span>
      </div>

      <div className="header-clock">{utcTime}</div>

      <div className="header-status">
        <div className="status-indicator">
          <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
          <span>{connected ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        {lastRefresh && (
          <div className="last-refresh">Updated: {lastRefresh}</div>
        )}
      </div>
    </header>
  );
}

export default Header;

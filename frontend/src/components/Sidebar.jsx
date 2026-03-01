import EventFeed from './EventFeed';
import LayerControls from './LayerControls';

/**
 * Sidebar component with tabbed interface.
 * @param {{ activeTab: string, onTabChange: Function, satelliteSettings: object, onSatelliteChange: Function, showEvents: boolean, onEventsToggle: Function, showWeather: boolean, onWeatherToggle: Function, collapsed: boolean, onCollapse: Function }} props
 */
function Sidebar({
  activeTab,
  onTabChange,
  satelliteSettings,
  onSatelliteChange,
  showEvents,
  onEventsToggle,
  showWeather,
  onWeatherToggle,
  collapsed,
  onCollapse,
}) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={onCollapse}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '◀' : '▶'}
      </button>

      <div className="sidebar-inner">
        <div className="sidebar-tabs">
          {[
            { id: 'events', label: '📡 Events' },
            { id: 'layers', label: '🗂️ Layers' },
            { id: 'info', label: 'ℹ️ Info' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'events' && <EventFeed />}
          {activeTab === 'layers' && (
            <LayerControls
              satelliteSettings={satelliteSettings}
              onSatelliteChange={onSatelliteChange}
              showEvents={showEvents}
              onEventsToggle={onEventsToggle}
              showWeather={showWeather}
              onWeatherToggle={onWeatherToggle}
            />
          )}
          {activeTab === 'info' && (
            <div className="info-tab">
              <h3>Data Sources</h3>
              <p>
                <a href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs" target="_blank" rel="noopener noreferrer">🛰️ NASA GIBS</a>
                {' '}— Satellite imagery (MODIS, VIIRS)
              </p>
              <p>
                <a href="https://www.gdeltproject.org" target="_blank" rel="noopener noreferrer">📰 GDELT Project</a>
                {' '}— Conflict &amp; news events
              </p>
              <p>
                <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">🌤️ Open-Meteo</a>
                {' '}— Weather data (free, no key)
              </p>
              <p>
                <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer">🗺️ OpenStreetMap</a>
                {' '}/ <a href="https://carto.com" target="_blank" rel="noopener noreferrer">CartoDB</a>
                {' '}— Base maps
              </p>

              <h3>About</h3>
              <p>
                Live-SAT-MENA is an open-source OSINT dashboard for monitoring
                the Middle East and North Africa region using free public data sources.
              </p>
              <p>
                <strong style={{ color: '#ffaa00' }}>⚠️ Disclaimer:</strong> Data may be
                delayed or inaccurate. For research/educational use only.
              </p>

              <h3>Links</h3>
              <p>
                <a href="https://github.com/theSaksham02/Live-SAT-MENA" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

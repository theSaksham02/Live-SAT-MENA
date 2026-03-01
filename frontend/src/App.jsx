import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Map from './components/Map';
import Sidebar from './components/Sidebar';

/** Get yesterday's date in YYYY-MM-DD format (GIBS imagery ~1 day delayed). */
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function App() {
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [satelliteSettings, setSatelliteSettings] = useState({
    layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    date: getYesterday(),
    opacity: 0.7,
    visible: false,
  });

  const [connected, setConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('');

  // Check backend health on mount
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/health');
        setConnected(res.ok);
        if (res.ok) {
          setLastRefresh(new Date().toLocaleTimeString());
        }
      } catch {
        setConnected(false);
      }
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const handleSatelliteChange = (changes) => {
    setSatelliteSettings(prev => ({ ...prev, ...changes }));
  };

  return (
    <div className="app-container">
      <Header connected={connected} lastRefresh={lastRefresh} />
      <div className="app-body">
        <div className="map-container">
          <Map
            satelliteSettings={satelliteSettings}
            showEvents={showEvents}
            showWeather={showWeather}
          />
        </div>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          satelliteSettings={satelliteSettings}
          onSatelliteChange={handleSatelliteChange}
          showEvents={showEvents}
          onEventsToggle={setShowEvents}
          showWeather={showWeather}
          onWeatherToggle={setShowWeather}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(c => !c)}
        />
      </div>
    </div>
  );
}

export default App;

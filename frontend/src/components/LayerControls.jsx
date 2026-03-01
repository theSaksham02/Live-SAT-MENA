/**
 * LayerControls component — toggle layers, select satellite layer, date, opacity.
 * @param {{ satelliteSettings: object, onSatelliteChange: Function, showEvents: boolean, onEventsToggle: Function, showWeather: boolean, onWeatherToggle: Function }} props
 */
function LayerControls({
  satelliteSettings,
  onSatelliteChange,
  showEvents,
  onEventsToggle,
  showWeather,
  onWeatherToggle,
}) {
  const layers = [
    { id: 'MODIS_Terra_CorrectedReflectance_TrueColor', name: 'MODIS Terra True Color' },
    { id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor', name: 'VIIRS SNPP True Color' },
    { id: 'MODIS_Terra_CorrectedReflectance_Bands367', name: 'MODIS Terra Bands 3-6-7' },
    { id: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor', name: 'VIIRS NOAA-20 True Color' },
    { id: 'MODIS_Aqua_CorrectedReflectance_TrueColor', name: 'MODIS Aqua True Color' },
  ];

  return (
    <div className="layer-controls">
      {/* Overlay Toggles */}
      <div className="control-card">
        <h3>Overlays</h3>

        <div className="toggle-row">
          <span className="toggle-label">🛰️ Satellite Imagery</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={satelliteSettings.visible}
              onChange={e => onSatelliteChange({ visible: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="toggle-row">
          <span className="toggle-label">⚡ Conflict Events</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={e => onEventsToggle(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="toggle-row">
          <span className="toggle-label">🌤️ Weather Overlay</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showWeather}
              onChange={e => onWeatherToggle(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Satellite Layer Settings */}
      <div className="control-card">
        <h3>Satellite Layer</h3>

        <span className="control-label">Layer</span>
        <select
          className="control-select"
          value={satelliteSettings.layer}
          onChange={e => onSatelliteChange({ layer: e.target.value })}
        >
          {layers.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <span className="control-label">Date</span>
        <input
          type="date"
          className="control-input"
          value={satelliteSettings.date}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => onSatelliteChange({ date: e.target.value })}
        />

        <span className="control-label">Opacity: {Math.round(satelliteSettings.opacity * 100)}%</span>
        <input
          type="range"
          className="opacity-slider"
          min="0"
          max="1"
          step="0.05"
          value={satelliteSettings.opacity}
          onChange={e => onSatelliteChange({ opacity: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
}

export default LayerControls;

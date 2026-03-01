import { TileLayer } from 'react-leaflet';

/**
 * SatelliteLayer — NASA GIBS WMTS tile overlay on the map.
 * @param {{ layer: string, date: string, opacity: number, visible: boolean }} props
 */
function SatelliteLayer({ layer, date, opacity, visible }) {
  if (!visible) return null;

  // NASA GIBS uses geographic projection (EPSG:4326) served as tiles
  // We adapt to Leaflet's EPSG:3857 using the closest available resolution
  const tileMatrixSet = layer.includes('VIIRS') ? '250m' : '2km';
  const url = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/${tileMatrixSet}/{z}/{y}/{x}.jpg`;

  return (
    <TileLayer
      url={url}
      attribution='Imagery provided by <a href="https://earthdata.nasa.gov" target="_blank">NASA GIBS</a>'
      opacity={opacity}
      tileSize={256}
    />
  );
}

export default SatelliteLayer;

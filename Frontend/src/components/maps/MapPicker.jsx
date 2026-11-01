import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon for Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Flies to a new center when value changes from outside (e.g. GPS auto-detect) */
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.2 });
  }, [position?.[0], position?.[1]]);
  return null;
};

/* Handles click events on the map to place a marker */
const LocationPicker = ({ value, onChange, readOnly }) => {
  useMapEvents({
    click: (e) => {
      if (!readOnly) onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return value ? <Marker position={[value.lat, value.lng]} draggable={!readOnly} /> : null;
};

const MapPicker = ({ value, onChange, readOnly = false }) => {
  const [detecting, setDetecting] = useState(false);
  const center = value?.lat && value?.lng ? [value.lat, value.lng] : [24.8607, 67.0011]; // Default: Karachi

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDetecting(false);
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label-text mb-0">📍 Pin your location on the map</label>
        {!readOnly && (
          <button
            type="button"
            onClick={detectLocation}
            disabled={detecting}
            className="rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100 disabled:opacity-50"
          >
            {detecting ? 'Detecting…' : '🎯 Use My Location'}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={!readOnly}
          dragging={!readOnly}
          doubleClickZoom={!readOnly}
          className="h-80 w-full"
          style={{ zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker value={value} onChange={onChange} readOnly={readOnly} />
          <FlyToLocation position={value?.lat ? [value.lat, value.lng] : null} />
        </MapContainer>
      </div>

      {value?.lat && (
        <p className="text-xs text-slate-500">
          Selected: <span className="font-mono font-semibold text-ink">{value.lat.toFixed(6)}, {value.lng.toFixed(6)}</span>
        </p>
      )}
    </div>
  );
};

export default MapPicker;
'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Arreglo para los iconos por defecto de Leaflet en Next.js
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  hotels: any[];
}

export default function MapDashboard({ hotels }: MapProps) {
  // Coordenadas centrales (ejemplo: Lima, Perú)
  const center: [number, number] = [-12.046374, -77.042793];

  return (
    <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-xl border border-white">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {hotels.map((hotel) => (
          // Asumiendo que tu entidad Hotel tiene lat y lng
          hotel.lat && hotel.lng && (
            <Marker key={hotel.id} position={[hotel.lat, hotel.lng]} icon={icon}>
              <Popup>
                <div className="font-sans">
                  <p className="font-bold text-slate-900">{hotel.name}</p>
                  <p className="text-blue-600 font-bold">${hotel.price_per_night}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
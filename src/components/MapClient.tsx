import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Hospital, UserLocation } from "@/lib/geolocation";

interface MapClientProps {
  hospitals: Hospital[]; // kept for future use
  userLocation: UserLocation | null; // kept for future use
  center: [number, number];
}

export default function MapClient({ center }: MapClientProps) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ background: "#F8FAFC" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

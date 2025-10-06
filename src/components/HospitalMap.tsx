// @ts-nocheck - react-leaflet v5 has type definition issues
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { type DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Hospital, UserLocation } from "@/lib/geolocation";
import { Button } from "./ui/button";
import { Map, Satellite, Layers } from "lucide-react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: UserLocation | null;
  onHospitalClick?: (hospital: Hospital) => void;
}

// Component to handle map center changes
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// Custom hospital icon
const createHospitalIcon = (nightService: boolean): DivIcon => {
  return L.divIcon({
    html: `<div style="
      background-color: ${nightService ? '#ef4444' : '#10b981'};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// User location icon
const userIcon: DivIcon = L.divIcon({
  html: `<div style="
    background-color: #3b82f6;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const HospitalMap = ({ hospitals, userLocation, onHospitalClick }: HospitalMapProps) => {
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');

  const mapStyles = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [35.6895, 139.6917];

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={userLocation ? 13 : 11}
        className="w-full h-full min-h-[400px]"
        zoomControl={true}
      >
        <>
          <TileLayer
            url={mapStyles[mapStyle]}
          />
          
          {userLocation && <MapController center={center} />}
          
          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon}
            >
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>
          )}
          
          {/* Hospital Markers */}
          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={createHospitalIcon(hospital.night_service)}
              eventHandlers={{
                click: () => onHospitalClick?.(hospital),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{hospital.name}</h3>
                  {hospital.distance && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {hospital.distance} km away
                    </p>
                  )}
                  {hospital.night_service && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                      Night Service
                    </span>
                  )}
                  <div className="mt-2 space-y-1">
                    <a
                      href={`tel:${hospital.tel}`}
                      className="text-xs text-primary hover:underline block"
                    >
                      📞 {hospital.tel}
                    </a>
                    <a
                      href={hospital.official}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline block"
                    >
                      🌐 Website
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      </MapContainer>
      
      {/* Map Style Switcher */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
        <div className="bg-card/95 backdrop-blur-sm p-2 rounded-lg shadow-md">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mapStyle === 'streets' ? 'default' : 'outline'}
              onClick={() => setMapStyle('streets')}
              className="gap-1"
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </Button>
            <Button
              size="sm"
              variant={mapStyle === 'satellite' ? 'default' : 'outline'}
              onClick={() => setMapStyle('satellite')}
              className="gap-1"
            >
              <Satellite className="h-4 w-4" />
              <span className="hidden sm:inline">Satellite</span>
            </Button>
            <Button
              size="sm"
              variant={mapStyle === 'terrain' ? 'default' : 'outline'}
              onClick={() => setMapStyle('terrain')}
              className="gap-1"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Terrain</span>
            </Button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              <span>Regular Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
              <span>Night Service</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
              <span>You</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;

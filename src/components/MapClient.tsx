import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Phone, ExternalLink, MapPin as MapPinIcon, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Hospital, UserLocation } from "@/lib/geolocation";
import { getDirectionsUrl } from "@/lib/geolocation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icons
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const grayIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapClientProps {
  hospitals: Hospital[];
  userLocation: UserLocation | null;
  center: [number, number];
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function MapClient({ hospitals, userLocation, center }: MapClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <MapPinIcon className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ background: "#F8FAFC" }}
    >
      <MapController center={center} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={blueIcon}
        >
          <Popup>
            <div className="p-2">
              <p className="font-semibold">Your Location</p>
            </div>
          </Popup>
        </Marker>
      )}

      {hospitals.map((hospital) => {
        const icon = hospital.night_service ? greenIcon : grayIcon;
        return (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lng]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm">{hospital.name}</h3>
                  {hospital.night_service && (
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success/20 text-xs shrink-0"
                    >
                      Night
                    </Badge>
                  )}
                </div>
                
                {hospital.distance && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {hospital.distance.toFixed(2)} km away
                  </p>
                )}

                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Departments
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.departments.slice(0, 3).map((dept) => (
                      <Badge key={dept} variant="secondary" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                    {hospital.departments.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hospital.departments.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8" asChild>
                    <a href={`tel:${hospital.tel}`} className="text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8" asChild>
                    <a
                      href={getDirectionsUrl(hospital.lat, hospital.lng, hospital.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Go
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" asChild>
                    <a
                      href={hospital.official}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

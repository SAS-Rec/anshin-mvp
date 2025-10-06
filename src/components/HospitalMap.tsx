// @ts-nocheck - react-leaflet v5 has type definition issues
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
// react-leaflet removed
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
  selectedHospital?: Hospital | null;
}

// Removed MapController (using direct Leaflet API)

// Custom hospital icon
const createHospitalIcon = (nightService: boolean, isSelected: boolean = false): DivIcon => {
  return L.divIcon({
    html: `<div style="
      background-color: ${isSelected ? '#8b5cf6' : nightService ? '#ef4444' : '#10b981'};
      width: ${isSelected ? '40px' : '30px'};
      height: ${isSelected ? '40px' : '30px'};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ${isSelected ? 'animation: pulse 2s infinite;' : ''}
    "></div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    </style>`,
    className: '',
    iconSize: [isSelected ? 40 : 30, isSelected ? 40 : 30],
    iconAnchor: [isSelected ? 20 : 15, isSelected ? 20 : 15],
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

const HospitalMap = ({ hospitals, userLocation, onHospitalClick, selectedHospital }: HospitalMapProps) => {
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');

  const mapStyles = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [35.6895, 139.6917];

  // Leaflet map + layers refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const hospitalMarkersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});

  // Init map once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    const map = L.map(mapContainerRef.current, { zoomControl: true, attributionControl: true });
    map.setView(center, userLocation ? 13 : 11);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      userMarkerRef.current = null;
      hospitalMarkersRef.current = {} as Record<string, L.Marker>;
      routeLineRef.current = null;
    };
  }, []);

  // Real-time visit tracking
  useEffect(() => {
    const channel = supabase
      .channel('hospital-interactions-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'hospital_interactions'
        },
        () => {
          // Refetch counts when new interaction is added
          fetchVisitCounts();
        }
      )
      .subscribe();

    // Initial fetch
    fetchVisitCounts();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVisitCounts = async () => {
    const { data } = await supabase
      .from('hospital_interactions')
      .select('hospital_id');
    
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach(({ hospital_id }) => {
        counts[hospital_id] = (counts[hospital_id] || 0) + 1;
      });
      setVisitCounts(counts);
    }
  };

  // Update base layer when style changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const attributionMap: Record<string, string> = {
      streets: '&copy; OpenStreetMap contributors',
      satellite: 'Imagery &copy; Esri',
      terrain: '&copy; OpenTopoMap contributors',
    };

    const tile = L.tileLayer(mapStyles[mapStyle], { attribution: attributionMap[mapStyle] });
    tile.addTo(map);
    tileLayerRef.current = tile;
  }, [mapStyle]);

  // Update user location marker and center
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userLocation) {
      const pos: [number, number] = [userLocation.lat, userLocation.lng];
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(pos);
      } else {
        userMarkerRef.current = L.marker(pos, { icon: userIcon }).addTo(map);
        userMarkerRef.current.bindPopup('<strong>Your Location</strong>');
      }
      map.setView(pos, 13);
    } else if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // Render hospital markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // clear old
    Object.values(hospitalMarkersRef.current).forEach((m) => map.removeLayer(m));
    hospitalMarkersRef.current = {};

    hospitals.forEach((h) => {
      const isSelected = selectedHospital?.id === h.id;
      const marker = L.marker([h.lat, h.lng], { icon: createHospitalIcon(h.night_service, isSelected) })
        .addTo(map)
        .on('click', () => onHospitalClick?.(h));

      const visitCount = visitCounts[h.id] || 0;
      const html = `
        <div style="font-size:12px;">
          <div style="font-weight:600;margin-bottom:4px;">${h.name}</div>
          ${h.distance ? `<div style="color:#6b7280;margin-bottom:4px;">📍 ${h.distance} km away</div>` : ''}
          ${h.night_service ? `<span style="background:#ef4444;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;">Night Service</span>` : ''}
          <div style="margin-top:8px;padding:6px;background:#f3f4f6;border-radius:4px;">
            <div style="font-weight:600;margin-bottom:4px;color:#1f2937;">📞 ${h.tel}</div>
            <div style="color:#6b7280;font-size:11px;margin-bottom:4px;">👥 ${visitCount} ${visitCount === 1 ? 'visit' : 'visits'}</div>
          </div>
          <div style="margin-top:6px;">
            <a href="tel:${h.tel}" style="color:#2563eb;text-decoration:underline;font-size:11px;display:block;margin-bottom:4px;">📱 Call Now</a>
            <a href="${h.official}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;font-size:11px;display:block;">🌐 Visit Website</a>
          </div>
        </div>`;
      marker.bindPopup(html);

      hospitalMarkersRef.current[h.id] = marker;
    });
  }, [hospitals, onHospitalClick, selectedHospital, visitCounts]);

  // Draw route to selected hospital
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation || !selectedHospital) {
      // Remove route if no selection
      if (routeLineRef.current) {
        map?.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
      return;
    }

    // Remove previous route
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
    }

    // Draw new route line
    const route = L.polyline(
      [
        [userLocation.lat, userLocation.lng],
        [selectedHospital.lat, selectedHospital.lng]
      ],
      {
        color: '#8b5cf6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }
    ).addTo(map);

    routeLineRef.current = route;

    // Fit map to show both points
    const bounds = L.latLngBounds([
      [userLocation.lat, userLocation.lng],
      [selectedHospital.lat, selectedHospital.lng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Open popup for selected hospital
    const selectedMarker = hospitalMarkersRef.current[selectedHospital.id];
    if (selectedMarker) {
      selectedMarker.openPopup();
    }
  }, [selectedHospital, userLocation]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" aria-label="Hospital map" />
      
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
              <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white"></div>
              <span>Selected</span>
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

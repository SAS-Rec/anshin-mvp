import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Hospital, UserLocation } from "@/lib/geolocation";
import { Button } from "./ui/button";
import { Map, Satellite, Layers } from "lucide-react";

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: UserLocation | null;
  onHospitalClick?: (hospital: Hospital) => void;
}

const HospitalMap = ({ hospitals, userLocation, onHospitalClick }: HospitalMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');

  const mapStyles = {
    streets: 'mapbox://styles/mapbox/streets-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v11',
    terrain: 'mapbox://styles/mapbox/outdoors-v11',
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Using a valid public Mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M3VuYjAxMmQycXRid3VrNWJodmwifQ.0XKKyEIJ8JnWI6KE-OWf_Q';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles.streets,
      center: userLocation ? [userLocation.lng, userLocation.lat] : [139.6917, 35.6895],
      zoom: userLocation ? 13 : 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle map style changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyles[mapStyle]);
    }
  }, [mapStyle]);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 13,
        duration: 2000,
      });

      // Add user location marker
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'))
        .addTo(map.current);
    }
  }, [userLocation]);

  // Update hospital markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Wait for style to load before adding markers
    const addMarkers = () => {
      hospitals.forEach((hospital) => {
        if (!map.current) return;

        const el = document.createElement('div');
        el.className = 'hospital-marker';
        el.style.cssText = `
          background-color: ${hospital.night_service ? '#ef4444' : '#10b981'};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        el.addEventListener('click', () => {
          onHospitalClick?.(hospital);
        });

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">${hospital.name}</h3>
            ${hospital.distance ? `<p class="text-xs text-muted-foreground mb-1">${hospital.distance} km away</p>` : ''}
            ${hospital.night_service ? '<span class="text-xs bg-red-500 text-white px-2 py-0.5 rounded">Night Service</span>' : ''}
            <div class="mt-2 space-y-1">
              <a href="tel:${hospital.tel}" class="text-xs text-primary hover:underline block">📞 ${hospital.tel}</a>
              <a href="${hospital.official}" target="_blank" class="text-xs text-primary hover:underline block">🌐 Website</a>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([hospital.lng, hospital.lat])
          .setPopup(popup)
          .addTo(map.current!);

        markers.current.push(marker);
      });
    };

    if (map.current.isStyleLoaded()) {
      addMarkers();
    } else {
      map.current.once('style.load', addMarkers);
    }
  }, [hospitals, onHospitalClick]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Style Switcher */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
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

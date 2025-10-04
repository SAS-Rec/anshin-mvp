import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Hospital, UserLocation } from "@/lib/geolocation";

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: UserLocation | null;
  onHospitalClick?: (hospital: Hospital) => void;
}

const HospitalMap = ({ hospitals, userLocation, onHospitalClick }: HospitalMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1haS1kZW1vIiwiYSI6ImNtNGJocnh4cDB0Mm4yanM4NG5pYnl6NW0ifQ.example'; // Placeholder - users can add their own
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [140.2, 36.0833],
      zoom: userLocation ? 12 : 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 12,
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

    // Add hospital markers
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
        .addTo(map.current);

      markers.current.push(marker);
    });
  }, [hospitals, onHospitalClick]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-md z-10">
        <div className="flex items-center gap-3 text-xs">
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
  );
};

export default HospitalMap;

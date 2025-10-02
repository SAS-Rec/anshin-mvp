import { useEffect, useState } from "react";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NearestCard from "@/components/NearestCard";
import HospitalList from "@/components/HospitalList";
import MapClient from "@/components/MapClient";
import type { Hospital, UserLocation } from "@/lib/geolocation";
import { getUserLocation, sortHospitalsByDistance } from "@/lib/geolocation";

// Default center (Tsuchiura, Ibaraki)
const DEFAULT_CENTER: [number, number] = [36.0833, 140.2];

const Index = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sortedHospitals, setSortedHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load hospitals data
  useEffect(() => {
    fetch("/hospitals.json")
      .then((res) => res.json())
      .then((data: Hospital[]) => {
        setHospitals(data);
        setSortedHospitals(data);
      })
      .catch((error) => {
        console.error("Error loading hospitals:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load hospital data",
        });
      });
  }, [toast]);

  // Get user location
  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setUserLocation(location);
        setMapCenter([location.lat, location.lng]);
        setLocationError(null);
        
        // Sort hospitals by distance
        if (hospitals.length > 0) {
          const sorted = sortHospitalsByDistance(hospitals, location);
          setSortedHospitals(sorted);
        }

        toast({
          title: "Location enabled",
          description: "Showing hospitals near you",
        });
      })
      .catch((error) => {
        console.error("Geolocation error:", error);
        setLocationError(error.message);
        
        // Still show hospitals, but unsorted
        setSortedHospitals(hospitals);

        toast({
          variant: "destructive",
          title: "Location unavailable",
          description: "Please enable location services to see distances",
        });
      })
      .finally(() => {
        setIsLoadingLocation(false);
      });
  }, [hospitals, toast]);

  // Re-sort when hospitals load and location is already available
  useEffect(() => {
    if (userLocation && hospitals.length > 0) {
      const sorted = sortHospitalsByDistance(hospitals, userLocation);
      setSortedHospitals(sorted);
    }
  }, [hospitals, userLocation]);

  const requestLocation = () => {
    setIsLoadingLocation(true);
    getUserLocation()
      .then((location) => {
        setUserLocation(location);
        setMapCenter([location.lat, location.lng]);
        setLocationError(null);
        
        const sorted = sortHospitalsByDistance(hospitals, location);
        setSortedHospitals(sorted);

        toast({
          title: "Location enabled",
          description: "Showing hospitals near you",
        });
      })
      .catch((error) => {
        console.error("Geolocation error:", error);
        setLocationError(error.message);
      })
      .finally(() => {
        setIsLoadingLocation(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Location prompt banner */}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b bg-primary/5"
          >
            <div className="container px-4 py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Enable Location for Best Experience
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Allow location access to see distances and find the nearest hospital quickly.
                  </p>
                  <Button
                    size="sm"
                    onClick={requestLocation}
                    disabled={isLoadingLocation}
                    className="gap-2"
                  >
                    {isLoadingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4" />
                        Enable Location
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Desktop layout: Map + List side by side */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 h-[calc(100vh-12rem)]">
          <div className="lg:col-span-3 h-full">
            <MapClient
              hospitals={sortedHospitals}
              userLocation={userLocation}
              center={mapCenter}
            />
          </div>
          <div className="lg:col-span-2 overflow-y-auto border-l">
            <HospitalList hospitals={sortedHospitals} />
          </div>
        </div>

        {/* Mobile layout: Map on top, list below */}
        <div className="md:hidden">
          <div className="h-[50vh] w-full">
            <MapClient
              hospitals={sortedHospitals}
              userLocation={userLocation}
              center={mapCenter}
            />
          </div>
          <HospitalList hospitals={sortedHospitals} />
        </div>
      </main>

      <Footer />

      {/* Nearest hospital card - only show when location is available */}
      {userLocation && sortedHospitals.length > 0 && (
        <NearestCard hospital={sortedHospitals[0]} />
      )}
    </div>
  );
};

export default Index;

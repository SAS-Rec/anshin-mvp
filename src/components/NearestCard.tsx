import { motion } from "framer-motion";
import { Phone, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Hospital } from "@/lib/geolocation";
import { getDirectionsUrl } from "@/lib/geolocation";
import { trackHospitalInteraction } from "@/lib/analytics";

interface NearestCardProps {
  hospital: Hospital;
}

export default function NearestCard({ hospital }: NearestCardProps) {
  const handleCall = () => {
    trackHospitalInteraction(hospital.id, hospital.name, 'call');
  };

  const handleDirections = () => {
    trackHospitalInteraction(hospital.id, hospital.name, 'directions');
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card card-shadow-hover"
    >
      <div className="container px-4 py-4">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <MapPin
                className={`h-5 w-5 shrink-0 mt-0.5 ${
                  hospital.night_service ? "text-success" : "text-inactive"
                }`}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground truncate">
                  {hospital.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hospital.distance?.toFixed(2)} km away
                </p>
              </div>
            </div>
            {hospital.night_service && (
              <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/20 shrink-0"
              >
                Night Service
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="emergency"
            size="lg"
            className="tap-target font-semibold gap-2"
            asChild
            onClick={handleCall}
          >
            <a href={`tel:${hospital.tel}`}>
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="tap-target font-semibold gap-2 border-2"
            asChild
            onClick={handleDirections}
          >
            <a
              href={getDirectionsUrl(hospital.lat, hospital.lng, hospital.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-5 w-5" />
              Directions
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

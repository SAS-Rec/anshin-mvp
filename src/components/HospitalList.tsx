import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Hospital } from "@/lib/geolocation";

interface HospitalListProps {
  hospitals: Hospital[];
}

export default function HospitalList({ hospitals }: HospitalListProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const displayedHospitals = showAll ? hospitals : hospitals.slice(0, 5);

  return (
    <div className="container px-4 py-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Nearby Hospitals
        </h2>
        <p className="text-sm text-muted-foreground">
          Sorted by distance from your location
        </p>
      </div>

      <div className="space-y-3 mb-20">
        <AnimatePresence mode="popLayout">
          {displayedHospitals.map((hospital, index) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 card-shadow hover:card-shadow-hover transition-shadow">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === hospital.id ? null : hospital.id)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-3">
                    <MapPin
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        hospital.night_service ? "text-success" : "text-inactive"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {hospital.name}
                        </h3>
                        {hospital.night_service && (
                          <Badge
                            variant="outline"
                            className="bg-success/10 text-success border-success/20 text-xs shrink-0"
                          >
                            Night
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {hospital.distance?.toFixed(2)} km away
                      </p>
                    </div>
                    {expandedId === hospital.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === hospital.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Departments
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {hospital.departments.map((dept) => (
                              <Badge
                                key={dept}
                                variant="secondary"
                                className="text-xs"
                              >
                                {dept}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                            asChild
                          >
                            <a href={`tel:${hospital.tel}`}>
                              <Phone className="h-4 w-4" />
                              Call
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                            asChild
                          >
                            <a
                              href={hospital.official}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Website
                            </a>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {hospitals.length > 5 && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All {hospitals.length} Hospitals
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

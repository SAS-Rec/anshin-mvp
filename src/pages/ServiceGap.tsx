import { motion } from "framer-motion";
import { AlertTriangle, MapPin, TrendingDown, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ServiceGap = () => {
  const serviceGaps = [
    {
      area: "East Zone",
      population: "45,000",
      hospitals: 1,
      gap: "High",
      travelTime: "25+ min",
      severity: "high",
    },
    {
      area: "Rural North",
      population: "12,000",
      hospitals: 0,
      gap: "Critical",
      travelTime: "35+ min",
      severity: "critical",
    },
    {
      area: "South Suburbs",
      population: "28,000",
      hospitals: 2,
      gap: "Medium",
      travelTime: "18 min",
      severity: "medium",
    },
    {
      area: "West District",
      population: "19,000",
      hospitals: 1,
      gap: "Medium",
      travelTime: "15 min",
      severity: "medium",
    },
  ];

  const recommendations = [
    {
      title: "New Facility Needed - Rural North",
      description: "Critical gap with 12,000 residents lacking nearby emergency care",
      priority: "High",
      impact: "35% coverage improvement",
    },
    {
      title: "Extend Hours - East Zone",
      description: "Existing facility should offer 24/7 emergency services",
      priority: "High",
      impact: "24% accessibility boost",
    },
    {
      title: "Mobile Units - South Suburbs",
      description: "Deploy mobile medical units for improved coverage",
      priority: "Medium",
      impact: "15% service improvement",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">Service Gap Analysis</h1>
            <p className="text-muted-foreground">
              Identify underserved areas and opportunities for healthcare expansion
            </p>
          </motion.div>

          {/* Critical Gaps Alert */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-emergency/5 border-emergency/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-emergency shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emergency">Critical Service Gaps Detected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    2 areas identified with inadequate emergency medical coverage affecting 57,000 residents
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Service Gaps Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Underserved Areas</h2>
              <div className="space-y-3">
                {serviceGaps.map((gap, index) => (
                  <motion.div
                    key={gap.area}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      gap.severity === "critical"
                        ? "bg-emergency/5 border-emergency/20"
                        : gap.severity === "high"
                        ? "bg-destructive/5 border-destructive/20"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MapPin className="h-5 w-5 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold">{gap.area}</p>
                          <p className="text-sm text-muted-foreground">
                            {gap.population} residents · {gap.hospitals} hospital(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Travel Time</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {gap.travelTime}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            gap.severity === "critical"
                              ? "bg-emergency/10 text-emergency border-emergency/20"
                              : gap.severity === "high"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {gap.gap} Gap
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          rec.priority === "High"
                            ? "bg-emergency/10 text-emergency border-emergency/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-success flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 rotate-180" />
                        {rec.impact}
                      </p>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceGap;

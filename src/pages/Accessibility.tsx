import { motion } from "framer-motion";
import { TrendingUp, MapPin, Clock, Users, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Accessibility = () => {
  const accessibilityMetrics = [
    { name: "Average Travel Time", value: "12.5 min", icon: Clock, progress: 75 },
    { name: "Population Coverage", value: "87%", icon: Users, progress: 87 },
    { name: "Service Accessibility", value: "4.2/5", icon: Activity, progress: 84 },
    { name: "Geographic Reach", value: "15 km", icon: MapPin, progress: 68 },
  ];

  const regions = [
    { name: "Central District", accessibility: "高", score: 92, color: "success" },
    { name: "North Area", accessibility: "中", score: 74, color: "primary" },
    { name: "South Region", accessibility: "中", score: 68, color: "primary" },
    { name: "East Zone", accessibility: "低", score: 45, color: "inactive" },
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
            <h1 className="text-3xl font-bold text-foreground">
              Accessibility Analysis
            </h1>
            <p className="text-muted-foreground">
              Evaluate medical service accessibility and travel time metrics across regions
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {accessibilityMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">
                          {metric.name}
                        </p>
                        <p className="text-xl font-bold">{metric.value}</p>
                      </div>
                    </div>
                    <Progress value={metric.progress} className="h-2" />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Regional Accessibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Regional Accessibility Scores</h2>
              <div className="space-y-4">
                {regions.map((region, index) => (
                  <motion.div
                    key={region.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{region.name}</span>
                          <Badge
                            variant="outline"
                            className={
                              region.color === "success"
                                ? "bg-success/10 text-success border-success/20"
                                : region.color === "primary"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-inactive/10 text-inactive border-inactive/20"
                            }
                          >
                            {region.accessibility}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold">{region.score}%</span>
                      </div>
                      <Progress value={region.score} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Analysis Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
                  <TrendingUp className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-success">High Coverage Areas</p>
                    <p className="text-sm text-muted-foreground">
                      Central and North districts show excellent accessibility with travel times under 10 minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Improvement Opportunities</p>
                    <p className="text-sm text-muted-foreground">
                      East Zone requires additional resources to improve accessibility scores
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Accessibility;

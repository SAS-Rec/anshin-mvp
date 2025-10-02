import { useEffect, useState } from "react";
import { Activity, Download, Settings, Wifi, RefreshCw, Pause, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CoverageAnalysis = () => {
  const [lastUpdate, setLastUpdate] = useState("20秒前");
  const [nextUpdate, setNextUpdate] = useState("1分0秒");

  const analysisTypes = [
    { name: "Coverage Analysis", icon: Activity, active: true },
    { name: "Accessibility", icon: Activity, active: false },
    { name: "Fairness Analysis", icon: Activity, active: false },
    { name: "Service Gap", icon: Activity, active: false },
  ];

  const stats = [
    { label: "医療施設", value: "4", color: "text-success" },
    { label: "平均カバレッジ率", value: "84%", color: "text-primary" },
    { label: "カバー人口", value: "260,000", color: "text-foreground" },
    { label: "カバー面積", value: "12,000", color: "text-muted-foreground" },
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
              Coverage Analysis
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of geographical medical accessibility and service coverage
            </p>
          </motion.div>

          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Wifi className="h-4 w-4 text-success" />
                    <span className="text-sm">オンライン</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="mr-4">⏱️ {lastUpdate}</span>
                  <span>⏳ Next time: {nextUpdate}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Analysis Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Analysis Control</h2>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  export
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Analysis Types */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Analysis Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisTypes.map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <motion.div
                        key={type.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Button
                          variant={type.active ? "default" : "outline"}
                          className="w-full justify-start gap-3 h-auto py-4"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{type.name}</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Geographic Coverage Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Geographic Coverage Map</h2>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Interactive coverage map visualization
                  </p>
                  <p className="text-sm text-muted-foreground">
                    35°40'34.3"N 139°3'...
                  </p>
                  <Button variant="link" className="text-primary">
                    View larger map
                  </Button>
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

export default CoverageAnalysis;

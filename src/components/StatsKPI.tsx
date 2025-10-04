import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, MapPin, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface StatsData {
  totalSessions: number;
  locationsShared: number;
  totalInteractions: number;
  mostViewedHospital: string;
}

const StatsKPI = () => {
  const [stats, setStats] = useState<StatsData>({
    totalSessions: 0,
    locationsShared: 0,
    totalInteractions: 0,
    mostViewedHospital: "Loading...",
  });

  useEffect(() => {
    loadStats();
    
    // Real-time updates
    const sessionChannel = supabase
      .channel('stats-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_sessions' }, () => {
        loadStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_interactions' }, () => {
        loadStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, []);

  const loadStats = async () => {
    // Get total sessions
    const { count: sessionsCount } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true });

    // Get locations shared
    const { count: locationsCount } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('location_shared', true);

    // Get total interactions
    const { count: interactionsCount } = await supabase
      .from('hospital_interactions')
      .select('*', { count: 'exact', head: true });

    // Get most viewed hospital
    const { data: interactions } = await supabase
      .from('hospital_interactions')
      .select('hospital_name')
      .eq('interaction_type', 'view');

    const hospitalCounts: Record<string, number> = {};
    interactions?.forEach(i => {
      hospitalCounts[i.hospital_name] = (hospitalCounts[i.hospital_name] || 0) + 1;
    });

    const mostViewed = Object.entries(hospitalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data yet";

    setStats({
      totalSessions: sessionsCount || 0,
      locationsShared: locationsCount || 0,
      totalInteractions: interactionsCount || 0,
      mostViewedHospital: mostViewed,
    });
  };

  const kpis = [
    {
      title: "Total Visitors",
      value: stats.totalSessions,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Locations Shared",
      value: stats.locationsShared,
      icon: MapPin,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Interactions",
      value: stats.totalInteractions,
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Most Viewed",
      value: stats.mostViewedHospital,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {kpi.title}
                  </p>
                  <p className={`text-2xl font-bold ${kpi.isText ? 'text-base truncate' : ''}`}>
                    {kpi.value}
                  </p>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsKPI;

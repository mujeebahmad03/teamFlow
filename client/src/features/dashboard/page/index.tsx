"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ActivityTrendsChart,
  DashboardHeader,
  OverviewCards,
  RecentActivity,
  TaskStatusChart,
  TeamPerformanceChart,
  TopPerformers,
} from "@/dashboard/components/analytics";

import { useAnalytics } from "@/dashboard/hooks";

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useAnalytics();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  const handleExport = () => {
    console.log("Exporting dashboard data...");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please try again.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl">
        <DashboardHeader
          lastUpdated={new Date()}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        <OverviewCards data={data?.overview} isLoading={isLoading} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <TaskStatusChart
            data={data?.taskStats.byStatus}
            isLoading={isLoading}
          />
          <ActivityTrendsChart
            data={data?.timeAnalytics}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="xl:col-span-2">
            <TeamPerformanceChart
              data={data?.teamStats}
              isLoading={isLoading}
            />
          </div>
          <TopPerformers
            data={data?.workloadStats.topPerformers}
            isLoading={isLoading}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecentActivity
            data={data?.activityStats.recentActivity}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}

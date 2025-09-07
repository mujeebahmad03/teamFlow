"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Plus, X } from "lucide-react";
import type { DashboardAnalytics } from "@/dashboard/types";

interface RecentActivityProps {
  data?: DashboardAnalytics["activityStats"]["recentActivity"];
  isLoading?: boolean;
}

export function RecentActivity({
  data,
  isLoading = false,
}: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-chart-3" />;
      case "created":
        return <Plus className="h-4 w-4 text-chart-1" />;
      case "cancelled":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "completed":
        return "bg-chart-3/10 text-chart-3";
      case "created":
        return "bg-chart-1/10 text-chart-1";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg"
              >
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across all teams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.slice(0, 6).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">{getActionIcon(activity.action)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getActionColor(activity.action)}`}
                  >
                    {activity.action}
                  </Badge>
                  {activity.teamName && (
                    <span className="text-xs text-muted-foreground">
                      {activity.teamName}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

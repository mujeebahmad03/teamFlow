"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardAnalytics } from "@/dashboard/types";

interface TopPerformersProps {
  data?: DashboardAnalytics["workloadStats"]["topPerformers"];
  isLoading?: boolean;
}

export function TopPerformers({ data, isLoading = false }: TopPerformersProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Highest completion rates this period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const topThree = data?.slice(0, 3);
  const icons = [Trophy, Medal, Award];
  const colors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>
            Highest completion rates this period
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topThree?.map((performer, index) => {
            const Icon = icons[index];
            const colorClass = colors[index];

            return (
              <motion.div
                key={performer.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${colorClass}`} />
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {performer.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{performer.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {performer.completedTasks}/{performer.totalAssigned} tasks
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {Math.round(performer.completionRate)}%
                </Badge>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

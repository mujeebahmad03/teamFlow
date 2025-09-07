"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Users, Target, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardAnalytics } from "@/dashboard/types";

interface OverviewCardsProps {
  data?: DashboardAnalytics["overview"];
  isLoading?: boolean;
}

export function OverviewCards({ data, isLoading = false }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Tasks",
      value: data?.totalTasks || 0,
      icon: Target,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Completed Tasks",
      value: data?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Overdue Tasks",
      value: data?.overdueTasks || 0,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Active Teams",
      value: data?.totalTeams || 0,
      icon: Users,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Team Members",
      value: data?.totalMembers || 0,
      icon: Users,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import type { DashboardAnalytics } from "@/dashboard/types";

interface TeamPerformanceChartProps {
  data?: DashboardAnalytics["teamStats"];
  isLoading?: boolean;
  title?: string;
  description?: string;
  showOverdue?: boolean;
}

const chartConfig = {
  completedTasks: {
    label: "Completed Tasks",
    color: "var(--chart-1)",
  },
  remainingTasks: {
    label: "Remaining Tasks",
    color: "var(--chart-2)",
  },
  overdueTasks: {
    label: "Overdue Tasks",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const transformDataForChart = (teams: DashboardAnalytics["teamStats"]) => {
  return teams.map((team) => ({
    teamName: team.teamName,
    totalTasks: team.totalTasks,
    completedTasks: team.completedTasks,
    overdueTasks: team.overdueTasks,
    pendingTasks: team.totalTasks - team.completedTasks,
    completionRate: team.completionRate,
    memberCount: team.memberCount,
    // For stacked display
    remaining: team.totalTasks - team.completedTasks - team.overdueTasks,
  }));
};

export function TeamPerformanceChart({
  data,
  isLoading = false,
  title = "Team Task Progress",
  description = "Task completion status by team",
  showOverdue = true,
}: TeamPerformanceChartProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Completion rates across all teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] space-y-3">
              <div className="flex justify-between">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-16" />
                ))}
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  const chartData = useMemo(() => {
    return data?.map((team) => {
      const remainingTasks = team.totalTasks - team.completedTasks;
      const remainingNonOverdue = Math.max(
        0,
        remainingTasks - team.overdueTasks
      );

      return {
        teamName: team.teamName,
        completedTasks: team.completedTasks,
        remainingTasks: showOverdue ? remainingNonOverdue : remainingTasks,
        overdueTasks: showOverdue ? team.overdueTasks : 0,
        totalTasks: team.totalTasks,
        completionRate: team.completionRate,
        memberCount: team.memberCount,
        // Short name for mobile displays
        shortName:
          team.teamName.length > 8
            ? team.teamName.slice(0, 6) + ".."
            : team.teamName,
      };
    });
  }, [data, showOverdue]);

  const averageCompletion = useMemo(() => {
    if (data?.length === 0) return 0;

    const totalRate =
      data?.reduce((acc, team) => acc + team.completionRate, 0) ?? 0;
    return data && data.length > 0 ? totalRate / data.length : 0;
  }, [data]);

  const totalMembers = useMemo(() => {
    return data?.reduce((acc, team) => acc + team.memberCount, 0);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="teamName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value.length > 8 ? value.slice(0, 6) + ".." : value
                }
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="completedTasks"
                stackId="a"
                fill="var(--color-completedTasks)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="remainingTasks"
                stackId="a"
                fill="var(--color-remainingTasks)"
                radius={showOverdue ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              {showOverdue && (
                <Bar
                  dataKey="overdueTasks"
                  stackId="a"
                  fill="var(--color-overdueTasks)"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Average completion: {averageCompletion.toFixed(1)}%{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none flex items-center gap-1">
            <Users className="h-3 w-3" />
            {totalMembers} total team members across {data?.length} teams
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

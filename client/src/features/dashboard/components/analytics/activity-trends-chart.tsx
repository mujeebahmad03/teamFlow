"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import type { DashboardAnalytics } from "@/dashboard/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityTrendsChartProps {
  data?: DashboardAnalytics["timeAnalytics"];
  isLoading?: boolean;
}

// Transform the data to match the chart format
const transformDataForChart = (
  analytics?: DashboardAnalytics["timeAnalytics"]
) => {
  const dateMap = new Map();

  // Add created tasks
  analytics?.tasksCreatedLast7Days.forEach((item) => {
    dateMap.set(item.date, { date: item.date, created: item.count });
  });

  // Add completed tasks
  analytics?.tasksCompletedLast7Days.forEach((item) => {
    const existing = dateMap.get(item.date) || { date: item.date };
    dateMap.set(item.date, { ...existing, completed: item.count });
  });

  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  created: {
    label: "Created",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ActivityTrendsChart({
  data: activityData,
  isLoading = false,
}: ActivityTrendsChartProps) {
  const [timeRange, setTimeRange] = useState("7d");

  const filteredData = useMemo(() => {
    const data = transformDataForChart(activityData);
    if (timeRange === "7d") {
      return data;
    }
    // For now, only showing 7 days as per the interface
    return data;
  }, [activityData, timeRange]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>7-Day Activity Trends</CardTitle>
            <CardDescription>
              Tasks created vs completed over the last week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-48 w-full" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Task Analytics - Interactive</CardTitle>
            <CardDescription>
              Showing tasks created vs completed for the last 7 days
              <br />
              <span className="text-sm text-muted-foreground">
                Avg: {activityData?.averageTasksPerDay} tasks/day | Peak:{" "}
                {activityData?.peakActivityDay}
              </span>
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-created)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-created)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        weekday: "long",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="completed"
                type="natural"
                fill="url(#fillCompleted)"
                stroke="var(--color-completed)"
                stackId="a"
              />
              <Area
                dataKey="created"
                type="natural"
                fill="url(#fillCreated)"
                stroke="var(--color-created)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

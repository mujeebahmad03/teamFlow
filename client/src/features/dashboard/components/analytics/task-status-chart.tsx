"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Label } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardAnalytics } from "@/dashboard/types";
import { TaskStatus } from "@/tasks/types";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

interface TaskStatusChartProps {
  data?: DashboardAnalytics["taskStats"]["byStatus"];
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const chartConfig = {
  count: {
    label: "Tasks",
  },
  TODO: {
    label: "To Do",
    color: "var(--chart-1)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  DONE: {
    label: "Done",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const statusColors = {
  [TaskStatus.TODO]: "var(--color-TODO)",
  [TaskStatus.IN_PROGRESS]: "var(--color-IN_PROGRESS)",
  [TaskStatus.DONE]: "var(--color-DONE)",
};

export function TaskStatusChart({
  data,
  isLoading = false,
  title = "Task Status Overview",
  description = "Current task distribution",
}: TaskStatusChartProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>
              Current breakdown of tasks by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const chartData = useMemo(() => {
    return data?.map((item) => ({
      status: item.status,
      count: item.count,
      percentage: item.percentage,
      fill: statusColors[item.status],
      // Format label for display
      displayLabel:
        item.status === TaskStatus.IN_PROGRESS
          ? "In Progress"
          : item.status === TaskStatus.TODO
          ? "To Do"
          : "Done",
    }));
  }, [data]);

  const totalTasks = useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [
                      `${value} tasks (${chartData
                        ?.find((d) => d.status === name)
                        ?.percentage.toFixed(1)}%)`,
                      chartData?.find((d) => d.status === name)?.displayLabel,
                    ]}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalTasks?.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Tasks
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            {data
              ?.find((s) => s.status === TaskStatus.DONE)
              ?.percentage.toFixed(1)}
            % tasks completed <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing current task status distribution
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

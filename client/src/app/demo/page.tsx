"use client";
import * as React from "react";
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

interface TeamStats {
  teamId: string;
  teamName: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  memberCount: number;
  overdueTasks: number;
}

interface Stats {
  data: TeamStats[];
}

// Sample data - replace with your actual stats
const sampleStats: Stats = {
  data: [
    {
      teamId: "team-1",
      teamName: "Frontend",
      totalTasks: 45,
      completedTasks: 32,
      completionRate: 71.1,
      memberCount: 5,
      overdueTasks: 3,
    },
    {
      teamId: "team-2",
      teamName: "Backend",
      totalTasks: 38,
      completedTasks: 28,
      completionRate: 73.7,
      memberCount: 4,
      overdueTasks: 2,
    },
    {
      teamId: "team-3",
      teamName: "DevOps",
      totalTasks: 22,
      completedTasks: 18,
      completionRate: 81.8,
      memberCount: 3,
      overdueTasks: 1,
    },
    {
      teamId: "team-4",
      teamName: "Design",
      totalTasks: 31,
      completedTasks: 20,
      completionRate: 64.5,
      memberCount: 4,
      overdueTasks: 4,
    },
    {
      teamId: "team-5",
      teamName: "QA",
      totalTasks: 29,
      completedTasks: 24,
      completionRate: 82.8,
      memberCount: 3,
      overdueTasks: 1,
    },
  ],
};

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

interface TeamStatsBarChartProps {
  stats?: Stats;
  title?: string;
  description?: string;
  showOverdue?: boolean;
}

export function TeamStatsBarChart({
  stats = sampleStats,
  title = "Team Task Progress",
  description = "Task completion status by team",
  showOverdue = true,
}: TeamStatsBarChartProps) {
  const chartData = React.useMemo(() => {
    return stats.data.map((team) => {
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
  }, [stats, showOverdue]);

  const averageCompletion = React.useMemo(() => {
    if (stats.data.length === 0) return 0;
    const totalRate = stats.data.reduce(
      (acc, team) => acc + team.completionRate,
      0
    );
    return totalRate / stats.data.length;
  }, [stats]);

  const totalMembers = React.useMemo(() => {
    return stats.data.reduce((acc, team) => acc + team.memberCount, 0);
  }, [stats]);

  return (
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
          {totalMembers} total team members across {stats.data.length} teams
        </div>
      </CardFooter>
    </Card>
  );
}

export default TeamStatsBarChart;
